const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Initialize Razorpay instance safely to prevent server crashes if env vars are missing
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
  });
} catch (err) {
  console.error("Razorpay initialization warning:", err.message);
}

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

    // Minimum amount validation (100 paise = 1 INR)
    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise' });
    }

    const options = {
      amount: Math.round(amount), // amount in the smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// @route   POST /api/payment/verify-payment
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required payment details' });
    }

    // Generate signature using HMAC-SHA256
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      // Update user subscription/status in database
      const oneYear = new Date();
      oneYear.setFullYear(oneYear.getFullYear() + 1);

      await User.findOneAndUpdate(
        { user_id: req.user.id },
        {
          is_premium: true,
          subscription_end_date: oneYear
        }
      );

      const updatedUser = await User.findOne({ user_id: req.user.id }).select('-password_hash');

      return res.status(200).json({
        message: 'Payment verified successfully. Welcome to Premium!',
        success: true,
        user: {
          id: updatedUser.user_id,
          name: updatedUser.name,
          email: updatedUser.email,
          level: updatedUser.level,
          role: updatedUser.role,
          is_premium: updatedUser.is_premium,
          subscription_end_date: updatedUser.subscription_end_date
        }
      });
    } else {
      return res.status(400).json({
        message: 'Invalid signature, payment verification failed',
        success: false
      });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
