import React, { useState } from 'react';
import paymentService from '../services/paymentService';

const PaymentButton = ({ amount, user, onSuccess, onFailure, label = 'Pay Now' }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Create order on backend
      const orderData = await paymentService.createOrder(amount);
      console.log('Order created:', orderData);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'UPTET/CTET Prep',
        description: 'Premium Subscription',
        order_id: orderData.order_id,
        handler: async function (response) {
          // This executes on successful payment
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const result = await paymentService.verifyPayment(verificationData);
            
            if (result.success) {
              onSuccess && onSuccess(result);
            } else {
              onFailure && onFailure(result.message);
            }
          } catch (err) {
            console.error('Verification failed', err);
            onFailure && onFailure('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed response:', response.error);
        onFailure && onFailure(response.error.description);
        setLoading(false);
      });

      rzp1.open();
    } catch (error) {
      console.error('Payment initiation failed', error);
      onFailure && onFailure(error.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`premium-button w-full py-4 rounded-2xl font-black text-sm shadow-xl shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <span className="text-lg">✨</span>
          {label}
        </>
      )}
    </button>
  );
};

export default PaymentButton;
