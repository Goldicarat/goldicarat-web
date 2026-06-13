import api from "./axiosInstance"
import { serverUrl } from "../../config"

export const calculateShipping = async (items, pincode = "") => {
  try {
    const response = await api.post(`${serverUrl}/api/shipment/calculate-rate`, { items, pincode })
    return response.data
  } catch (error) {
    console.error("Error calculating shipping:", error)
    return { success: false, shipping: 0, freeShipping: true, message: "Shipping calculation failed" }
  }
}
