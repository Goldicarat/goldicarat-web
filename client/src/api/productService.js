import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const fetchProducts = async (params = {}) => {
    const response = await api.get(`${serverUrl}/api/product/list`, { params });
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await api.get(`${serverUrl}/api/product/single/${id}`);
    return response.data;
};

export const fetchProductsByType = async (type, params = {}) => {
    const response = await api.get(`${serverUrl}/api/products/${type}`, { params });
    return response.data;
};

export const fetchBestSellers = async (limit = 8) => {
    const response = await api.get(`${serverUrl}/api/products/best_sellers`, {
        params: { _perPage: limit }
    });
    return response.data;
};

export const toggleProductLike = async (productId) => {
    const response = await api.post(`${serverUrl}/api/product/like`, { productId });
    return response.data;
};
