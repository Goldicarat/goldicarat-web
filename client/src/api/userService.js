import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const getUserProfile = async () => {
    const response = await api.get(`${serverUrl}/api/user/profile`);
    return response.data;
};

export const updateUserProfile = async (data) => {
    const response = await api.put(`${serverUrl}/api/user/profile`, data);
    return response.data;
};

export const changeUserPassword = async (oldPassword, newPassword) => {
    const response = await api.put(`${serverUrl}/api/user/change-password`, { oldPassword, newPassword });
    return response.data;
};

export const getUserAddresses = async () => {
    const response = await api.get(`${serverUrl}/api/user/addresses`);
    return response.data;
};

export const addUserAddress = async (address) => {
    const response = await api.post(`${serverUrl}/api/user/addresses`, address);
    return response.data;
};

export const updateUserAddress = async (addressId, address) => {
    const response = await api.put(`${serverUrl}/api/user/addresses/${addressId}`, address);
    return response.data;
};

export const deleteUserAddress = async (addressId) => {
    const response = await api.delete(`${serverUrl}/api/user/addresses/${addressId}`);
    return response.data;
};

export const setDefaultAddress = async (addressId) => {
    const response = await api.put(`${serverUrl}/api/user/addresses/${addressId}/default`);
    return response.data;
};

export const uploadAvatar = async (formData) => {
    const response = await api.post(`${serverUrl}/api/user/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
