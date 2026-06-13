import express from "express";
import {
    createDesign,
    getAllDesigns,
    getDesignById,
    updateDesignStatus,
    getUserDesigns,
} from "../controllers/customDesignController.mjs";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

const routeValue = "/api/custom-design";

// User routes (require authentication)
router.post(`${routeValue}/create`, userAuth, createDesign);
router.get(`${routeValue}/my-designs`, userAuth, getUserDesigns);

// Admin routes (require admin authentication)
router.get(`${routeValue}/admin/all`, adminAuth, getAllDesigns);
router.get(`${routeValue}/admin/:id`, adminAuth, getDesignById);
router.put(`${routeValue}/admin/update-status`, adminAuth, updateDesignStatus);

export default router;
