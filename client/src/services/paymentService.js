import api from './api';

const paymentService = {
  createOrder: async (amount, planId) => {
    const response = await api.post('/api/payment/create-order', { amount, planId });
    return response.data;
  },
  verifyPayment: async (paymentData) => {
    const response = await api.post('/api/payment/verify-payment', paymentData);
    return response.data;
  },
};

export default paymentService;
