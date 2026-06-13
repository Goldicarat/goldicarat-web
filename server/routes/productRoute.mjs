import { Router } from "express";
import {
    addProduct,
    listProducts,
    removeProduct,
    singleProducts,
    updateStock,
    updateProduct,
    toggleProductLike,
    bulkImport,
} from "../controllers/productController.mjs";
import upload from "../middleware/multer.mjs";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = Router();

const routeValue = "/api/product/";

// Admin routes for product management
router.post(
    `${routeValue}add`,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    adminAuth,
    addProduct
);
router.post(`${routeValue}remove`, adminAuth, removeProduct);
router.put(
    `${routeValue}update/:id`,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 },
    ]),
    adminAuth,
    updateProduct
);
router.post(`${routeValue}update-stock`, updateStock);
router.post(`${routeValue}like`, userAuth, toggleProductLike);
router.get(`${routeValue}single`, optionalAuth, singleProducts);
router.get(`${routeValue}single/:id`, optionalAuth, singleProducts);
router.get(`${routeValue}list`, listProducts);

// Bulk import route (admin only)
router.post(`${routeValue}bulk-import`, adminAuth, bulkImport);

// Public routes for frontend
router.get("/api/products", listProducts);
router.get("/api/products/:type", (req, res, next) => {
    req.query._type = req.params.type;
    listProducts(req, res, next);
});

export default router;
