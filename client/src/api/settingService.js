import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const fetchSiteSettings = async () => {
    const response = await api.get(`${serverUrl}/api/setting/single-details`);
    return response.data;
};
