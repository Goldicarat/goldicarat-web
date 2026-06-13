import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import settingModel from "../models/settingModel.js";
import { getTomorrowInTimezone } from "../config/general.js";

const { ObjectId } = mongoose.Types;

const TOKEN = process.env.DELHIVERY_TOKEN;

let token = null;

const getShipmentConfig = async () => {
    const setting = await settingModel.findOne({});
    const mode = setting?.shipmentMode || "test";
    const isTestMode = mode === "test";

    return {
        isTestMode,
        email: mode === "live" && setting?.shipmentEmail
            ? setting.shipmentEmail
            : process.env.SHIPMENT_EMAIL,
        password: mode === "live" && setting?.shipmentPassword
            ? setting.shipmentPassword
            : process.env.SHIPMENT_PASSWORD,
        baseUrl: mode === "live" && setting?.shipmentBaseUrl
            ? setting.shipmentBaseUrl
            : process.env.SHIPMENT_BASE_URL,
    };
};

export const getToken = async () => {
    if (token) return token;

    const config = await getShipmentConfig();

    const res = await axios.post(
        `${config.baseUrl}/auth/login`,
        {
            email: config.email,
            password: config.password,
        },
    );

    token = res.data.token;
    return token;
};

export const handleOrderTrack = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        };

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Invalid Order" });
        };

        const order = await orderModel.findOne({ _id: new ObjectId(orderId), userId: new ObjectId(userId) });
        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" });
        };

        if (!order.shipping || !order.shipping.awb) {
            return res.status(400).json({
                success: false,
                message: "Shipment not created yet. Tracking unavailable."
            });
        };

        const config = await getShipmentConfig();
        const token = await getToken();

        const shipmentRes = await axios.get(
            `${config.baseUrl}/courier/track/awb/${order.shipping.awb}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("shipmentRes------------>", shipmentRes);

        if (!shipmentRes) {
            return res.status(400).json({ success: false, message: "No tracking data" });
        };

        const trackingData = shipmentRes?.data?.tracking_data;

        if (!trackingData) {
            return res.json({ success: false, message: "No tracking data" });
        };

        return res.status(200).json({
            success: true,
            shipmentDetails: {
                awb: order.shipping.awb,
                status: trackingData.shipment_status,
                history: (trackingData.shipment_track_activities || []).map((item) => ({
                    status: item.status,
                    location: item.location,
                    time: item.date,
                })),
            },
            message: "Order shipment details fetched successfully",
        });
    } catch (error) {
        console.error("handleOrderTrack Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

export const createShipment = async (order) => {
    try {
        const config = await getShipmentConfig();

        if (config.isTestMode) {
            return {
                success: true,
                message: "",
                data: {
                    shipment_id: `TEST_SHIPMENT_${Date.now()}`,
                },
            };
        };

        const token = await getToken();
        console.log("token--------------->", token);

        const payload = {
            order_id: order.orderId,
            order_date: new Date().toISOString(),
            pickup_location: process.env.DELHIVERY_PICKUP_LOCATION,

            billing_customer_name: order.customerName,
            billing_last_name: order.lastName,
            billing_address: order.address,
            billing_city: order.city,
            billing_pincode: order.pincode,
            billing_state: order.state,
            billing_country: order.country,
            billing_phone: order.phone,
            billing_email: order.email || "test@example.com",
            shipping_is_billing: true,

            order_items: order.items.map((i) => ({
                name: i.name,
                sku: String(i.productId),
                units: Number(i.quantity),
                selling_price: Number(i.price),
            })),

            payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
            sub_total: Number(order.totalAmount),

            // weight: Number(order.weight || 0.5),
            // shipment_length: Number(order.shipmentLength || 10),
            // shipment_width: Number(order.shipmentWidth || 10),
            // shipment_height: Number(order.shipmentHeight || 10),

            length: Number(order.shipmentLength || 10),
            breadth: Number(order.shipmentWidth || 10),
            height: Number(order.shipmentHeight || 10),
            weight: Number(order.weight || 0.5),
        };
        console.log("createShipment payload----->", payload);

        const res = await axios.post(
            `${config.baseUrl}/orders/create/adhoc`, payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("createShipment res.data----->", res.data);

        return { success: true, message: "", data: res.data };
    } catch (error) {
        console.error("createShipment error------->", error.response?.data || error.message);
        return { success: false, message: error.message };
    }
};

export const generateAWB = async (shipmentId) => {
    try {
        if (!shipmentId) {
            return { success: false, message: "Shipment Id is required!" };
        };

        const config = await getShipmentConfig();

        if (config.isTestMode) {
            return {
                success: true,
                data: {
                    awb_code: "TESTAWB123456",
                    courier_name: "Mock Courier"
                },
            };
        };

        const token = await getToken();

        const res = await axios.post(`${config.baseUrl}/courier/assign/awb`,
            { shipment_id: shipmentId },
            { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log("generateAWB res.data----->", res.data);

        if (res.data.awb_assign_status !== 1) {
            return { success: false, message: res.data.message || "AWB assignment failed" };
        };

        return { success: true, message: "", data: res.data.response.data };
    } catch (error) {
        console.error("generateAWB error------->", error.response?.data || error.message);
        return { success: false, message: error.message };
    };
};

export const requestPickup = async (shipmentId) => {
    try {
        if (!shipmentId) {
            return { success: false, message: "Shipment Id is required!" };
        };

        const config = await getShipmentConfig();

        if (config.isTestMode) {
            return { success: true, message: "" };
        };

        const token = await getToken();

        const res = await axios.post(`${config.baseUrl}/courier/generate/pickup`,
            { shipment_id: shipmentId },
            { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log("requestPickup res.data----->", res.data);

        if (res.data.pickup_status !== 1) {
            return { success: false, message: res.data.message || "Pickup Request failed" };
        };

        return { success: true, message: "", data: res.data };
    } catch (error) {
        console.error("requestPickup error------->", error.response?.data || error.message);
        return { success: false, message: error.message };
    };
};

export const handlesShipmentWebhook = async (req, res) => {
    try {
        console.log("Shipment Webhook req.body----->", req.body);
        const { awb, current_status, reason } = req.body;

        const order = await orderModel.findOne({
            "shipping.awb": awb,
        });
        console.log("Shipment Webhook order----->", order);

        if (!order) {
            return res.sendStatus(200);
        };

        if (current_status === "Delivered") {
            order.status = "delivered";
            order.shipping.status = "Delivered";
        };

        if (current_status === "NDR") {
            order.shipping.status = "NDR";
            order.shipping.ndrReason = reason;
        };

        if (current_status === "RTO Delivered") {
            order.status = "returned";
            order.shipping.status = "RTO";
        };

        await order.save();

        res.sendStatus(200);
    } catch (error) {
        console.error("handleDelhiveryWebhook error------->", error);
        return res.status(500).json({ success: false, message: error.message });
    };
};

export const cancelOrder = async (req, res) => {
    const order = await orderModel.findById(req.params.id);
    console.log("cancelOrder order----->", order);

    if (!order) {
        return res.status(400).json({ success: false, message: "Order not found" });
    };

    if (order.shipping?.awb) {
        await cancelShipment(order.shipping.awb);
    };

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({ success: true, message: "Order cancel successfully" });
};

export const cancelShipment = async (awb) => {
    try {
        console.log("cancelShipment awb----->", awb);
        if (!awb) {
            return { success: false, message: "shipping awb required!" };
        };

        const config = await getShipmentConfig();

        if (config.isTestMode) {
            return { success: true, message: "Shipment cancelled successfully" };
        };

        const token = await getToken();
        console.log("cancelShipment token----->", token);

        if (!token) {
            return { success: false, message: "Your Order cancel failed, please try again later." };
        };

        const response = await axios.post(
            `${config.baseUrl}/orders/cancel/shipment/awbs`,
            { awbs: [awb] },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("cancelShipment response data----->", response.data);

        if (response.data.message && response.data.message !== "Shipment cancelled successfully") {
            return {
                success: false,
                message: response.data.message,
            };
        };

        return { success: true, message: "Shipment cancelled successfully", data: response.data };
    } catch (error) {
        console.error("cancelShipment error------->", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || error.message };
    };
};

export const calculateShippingRate = async (req, res) => {
    try {
        const { items, pincode } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart items are required" });
        };

        const setting = await settingModel.findOne({});
        const freeShippingThreshold = setting?.freeShippingThreshold || 0;
        const defaultShippingCharge = setting?.defaultShippingCharge || 0;

        const productIds = items.map(item => item._id || item.id).filter(Boolean);
        const products = await productModel.find({ _id: { $in: productIds } });
        const productMap = {};
        products.forEach(p => { productMap[p._id.toString()] = p; });

        let totalWeight = 0;
        let totalAmount = 0;
        let allFreeShipping = items.length > 0;
        let totalShippingCharge = 0;
        let hasCustomCharge = false;

        items.forEach(item => {
            const pid = item._id || item.id;
            const product = productMap[pid];
            const quantity = item.quantity || 1;
            const price = item.price || 0;

            totalAmount += price * quantity;

            if (product) {
                totalWeight += (product.weight || 0) * quantity;
                if (!product.freeShipping) {
                    allFreeShipping = false;
                };
                if (product.shippingCharge > 0) {
                    hasCustomCharge = true;
                    totalShippingCharge += product.shippingCharge * quantity;
                };
            } else {
                allFreeShipping = false;
            };
        });

        // Free shipping if all products have freeShipping flag
        if (allFreeShipping) {
            return res.status(200).json({
                success: true,
                shipping: 0,
                freeShipping: true,
                method: "Free Shipping",
                message: "All items have free shipping",
            });
        };

        // Free shipping if total exceeds threshold
        if (freeShippingThreshold > 0 && totalAmount >= freeShippingThreshold) {
            return res.status(200).json({
                success: true,
                shipping: 0,
                freeShipping: true,
                method: "Free Shipping",
                threshold: freeShippingThreshold,
                message: `Free shipping on orders above ${freeShippingThreshold}`,
            });
        };

        // Use product-level shipping charges if set
        if (hasCustomCharge) {
            return res.status(200).json({
                success: true,
                shipping: totalShippingCharge,
                freeShipping: false,
                method: "Standard Shipping",
                totalWeight,
                message: `Shipping charge calculated from product rates`,
            });
        };

        // Otherwise use default shipping charge
        return res.status(200).json({
            success: true,
            shipping: defaultShippingCharge,
            freeShipping: false,
            method: "Standard Shipping",
            totalWeight,
            defaultCharge: true,
            message: defaultShippingCharge > 0
                ? `Standard shipping charge applied`
                : "Free shipping",
        });
    } catch (error) {
        console.error("calculateShippingRate Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};