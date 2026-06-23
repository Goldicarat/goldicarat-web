import api from "./axiosInstance";
import { serverUrl } from "../../config";

export const fetchVideos = async () => {
    const response = await api.get(`${serverUrl}/api/video`);
    return response.data;
};
