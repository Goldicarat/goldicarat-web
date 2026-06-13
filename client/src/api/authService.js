import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const loginUser = async (email, password) => {
    const response = await api.post(`${serverUrl}/api/user/login`, { email, password });
    return response.data;
};

export const registerUser = async (name, email, password) => {
    const response = await api.post(`${serverUrl}/api/user/register`, { name, email, password });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post(`${serverUrl}/api/user/forgot-password`, { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await api.post(`${serverUrl}/api/user/reset-password/${token}`, { password });
    return response.data;
};
