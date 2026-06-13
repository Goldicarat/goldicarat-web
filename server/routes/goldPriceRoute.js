import express from "express";
import { getCurrentGoldPrices, fetchGoldPriceFromApi } from "../controllers/goldPriceController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/api/gold-price/current", getCurrentGoldPrices);
router.post("/api/gold-price/fetch", adminAuth, fetchGoldPriceFromApi);

export default router;
