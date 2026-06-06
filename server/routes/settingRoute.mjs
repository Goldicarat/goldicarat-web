import { Router } from "express";
import {
    getAdminProfile,
    getSettingDetails,
    getSingleSettingDetails,
    changePassword,
    updateDiscountedPercentage,
    updateSetting,
} from "../controllers/adminSettingController.mjs";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

const routeValue = "/api/setting/";

// Admin Setting routes
router.get(`${routeValue}details`, adminAuth, getAdminProfile);
router.get(`${routeValue}list`, adminAuth, getSettingDetails);
router.get(`${routeValue}single-details`, getSingleSettingDetails);

// Admin Setting routes
router.put(`${routeValue}change-password`, adminAuth, changePassword);
router.put(`${routeValue}update-discounted-percentage`, adminAuth, updateDiscountedPercentage);
router.put(`${routeValue}update-setting`, adminAuth, updateSetting);

export default router;
