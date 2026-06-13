import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const submitCustomDesign = async (designData) => {
    try {
        const response = await api.post(`${serverUrl}/api/custom-design/create`, designData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to submit design request" };
    }
};

export const getMyDesigns = async () => {
    try {
        const response = await api.get(`${serverUrl}/api/custom-design/my-designs`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: "Failed to fetch designs" };
    }
};
