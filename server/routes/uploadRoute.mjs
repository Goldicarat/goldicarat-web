import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import upload from "../middleware/multer.mjs";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();
const routeValue = "/api/upload/";

const cleanupTempFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Error cleaning up temporary file:", error);
    }
};

router.post(`${routeValue}image`, adminAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "settings",
        });

        cleanupTempFile(req.file.path);

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            url: uploadResult.secure_url,
        });
    } catch (error) {
        console.error("Image upload error:", error);
        if (req.file) cleanupTempFile(req.file.path);
        return res.status(400).json({ success: false, message: error.message });
    }
});

export default router;
