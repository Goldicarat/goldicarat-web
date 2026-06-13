import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const fetchCategories = async () => {
    const response = await api.get(`${serverUrl}/api/category`);
    return response.data;
};
