import axios from "axios";
import settingModel from "../models/settingModel.js";

const KARAT_RATIOS = { 14: 14 / 24, 18: 18 / 24, 22: 22 / 24, 24: 1 };

const getPricesFrom24k = (price24k) => {
    const prices = {};
    for (const [karat, ratio] of Object.entries(KARAT_RATIOS)) {
        prices[karat] = Math.round(price24k * ratio);
    }
    return prices;
};

export const getCurrentGoldPrices = async (req, res) => {
    try {
        const setting = await settingModel.findOne({});
        const price24k = setting?.goldPricePerGram24k || 0;

        return res.status(200).json({
            success: true,
            pricePerGram24k: price24k,
            prices: getPricesFrom24k(price24k),
            lastFetched: setting?.goldPriceLastFetched || null,
        });
    } catch (error) {
        console.error("Get gold prices error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const fetchGoldPriceFromApi = async (req, res) => {
    try {
        const setting = await settingModel.findOne({});
        const apiUrl = setting?.goldPriceApiUrl || "https://www.goldapi.io/api/XAU/INR";
        const apiKey = setting?.goldPriceApiKey;

        if (!apiKey) {
            return res.status(400).json({
                success: false,
                message: "Gold Price API key not configured. Set it in Settings first.",
            });
        }

        const response = await axios.get(apiUrl, {
            headers: { "x-access-token": apiKey },
            timeout: 15000,
        });

        const data = response.data;
        const pricePerOunce = data.price;
        const pricePerGram = Math.round(pricePerOunce / 31.1035);

        await settingModel.findOneAndUpdate(
            {},
            {
                goldPricePerGram24k: pricePerGram,
                goldPriceLastFetched: new Date(),
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: `Gold price updated: ₹${pricePerGram}/g for 24k`,
            pricePerGram24k: pricePerGram,
            prices: getPricesFrom24k(pricePerGram),
            lastFetched: new Date(),
        });
    } catch (error) {
        console.error("Fetch gold price error:", error);
        return res.status(400).json({
            success: false,
            message: error?.response?.data?.message || error.message || "Failed to fetch gold price",
        });
    }
};
