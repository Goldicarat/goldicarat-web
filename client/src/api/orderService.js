import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const createRazorpayOrder = async (items, address, shippingCost = 0) => {
    const response = await api.post(`${serverUrl}/api/payment/razorpay/create-order`, { items, address, shippingCost });
    return response.data;
};

export const verifyRazorpayPayment = async (payload) => {
    const response = await api.post(`${serverUrl}/api/payment/razorpay/verify-payment`, payload);
    return response.data;
};

export const getUserOrders = async () => {
    const response = await api.get(`${serverUrl}/api/order/my-orders`);
    return response.data;
};

export const getUserOrderById = async (orderId) => {
    const response = await api.get(`${serverUrl}/api/order/user/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.post(`${serverUrl}/api/order/cancel-order`, { orderId });
    return response.data;
};
