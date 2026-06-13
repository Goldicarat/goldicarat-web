import express from "express";
import {
    handleOrderTrack,
    handlesShipmentWebhook,
    calculateShippingRate,
} from "../controllers/shipmentController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

const routeValue = "/api/shipment/";

// Razorpay webhook (no auth required)
router.post(`${routeValue}order-track`, userAuth, handleOrderTrack);
router.post(`${routeValue}webhook`, express.raw({ type: "application/json" }), handlesShipmentWebhook);
router.post(`${routeValue}calculate-rate`, calculateShippingRate);

export default router;
