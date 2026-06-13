import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const getPages = async (type) => {
    const params = type ? `?type=${type}` : "";
    const response = await api.get(`${serverUrl}/api/pages${params}`);
    return response.data;
};

export const getPageBySlug = async (slug) => {
    const response = await api.get(`${serverUrl}/api/pages/${slug}`);
    return response.data;
};

export const fetchSiteSettings = async () => {
    const response = await api.get(`${serverUrl}/api/setting/single-details`);
    return response.data;
};
