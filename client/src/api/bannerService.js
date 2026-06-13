import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const fetchBanners = async () => {
    const response = await api.get(`${serverUrl}/api/banner`);
    return response.data;
};
