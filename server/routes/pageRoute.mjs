import { Router } from "express";
import {
    getPages,
    getPageBySlug,
    getAllPagesAdmin,
    createPage,
    updatePage,
    deletePage,
} from "../controllers/pageController.mjs";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

// Public routes
router.get("/api/pages", getPages);
router.get("/api/pages/:slug", getPageBySlug);

// Admin routes
router.get("/api/admin/pages", adminAuth, getAllPagesAdmin);
router.post("/api/admin/pages", adminAuth, createPage);
router.put("/api/admin/pages/:id", adminAuth, updatePage);
router.delete("/api/admin/pages/:id", adminAuth, deletePage);

export default router;
