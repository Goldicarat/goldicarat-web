import { Router } from "express";
import {
    adminLogin,
    getUsers,
    removeUser,
    updateUser,
    userLogin,
    userRegister,
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    forgotPassword,
    resetPassword,
    addToCart,
    updateCart,
    getUserCart,
    clearCart,
    createAdmin,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getUserAddresses,
    uploadUserAvatar,
    uploadAdminUserAvatar,
} from "../controllers/userController.mjs";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";
import { avatarUpload } from "../middleware/avatarUpload.mjs";
import multer from "multer";

const router = Router();

const routeValue = "/api/user/";

// Public routes
router.post(`${routeValue}register`, userRegister);
router.post(`${routeValue}login`, userLogin);
router.post(`${routeValue}admin`, adminLogin);
router.post(`${routeValue}forgot-password`, forgotPassword);
router.post(`${routeValue}reset-password/:token`, resetPassword);

// User-protected routes
router.get(`${routeValue}profile`, userAuth, getUserProfile);
router.put(`${routeValue}profile`, userAuth, updateUserProfile);
router.put(`${routeValue}change-password`, userAuth, changeUserPassword);
router.post(`${routeValue}cart/add`, userAuth, addToCart);
router.put(`${routeValue}cart/update`, userAuth, updateCart);
router.get(`${routeValue}cart`, userAuth, getUserCart);
router.delete(`${routeValue}cart/clear`, userAuth, clearCart);

// User address management routes
router.get(`${routeValue}addresses`, userAuth, getUserAddresses);
router.post(`${routeValue}addresses`, userAuth, addAddress);
router.put(`${routeValue}addresses/:addressId`, userAuth, updateAddress);
router.delete(`${routeValue}addresses/:addressId`, userAuth, deleteAddress);
router.put(
    `${routeValue}addresses/:addressId/default`,
    userAuth,
    setDefaultAddress
);

router.post(
    `${routeValue}upload-avatar`,
    userAuth,
    (req, res, next) => {
        avatarUpload.single("avatar")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({ success: false, message: "File too large. Maximum size is 5MB." });
                }
                return res.status(400).json({ success: false, message: err.message });
            }
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    uploadUserAvatar
);

// Avatar upload route (admin only)
router.post(
    `${routeValue}upload-avatar`,
    adminAuth,
    avatarUpload.single("avatar"),
    uploadAdminUserAvatar
);

// Address management routes (admin only)
router.get(`${routeValue}:userId/addresses`, adminAuth, getUserAddresses);
router.post(`${routeValue}:userId/addresses`, adminAuth, addAddress);
router.put(
    `${routeValue}:userId/addresses/:addressId`,
    adminAuth,
    updateAddress
);
router.delete(
    `${routeValue}:userId/addresses/:addressId`,
    adminAuth,
    deleteAddress
);
router.put(
    `${routeValue}:userId/addresses/:addressId/default`,
    adminAuth,
    setDefaultAddress
);

// Admin-protected routes
router.get(`${routeValue}users`, adminAuth, getUsers);
router.post(`${routeValue}remove`, adminAuth, removeUser);
router.put(`${routeValue}update/:id`, adminAuth, updateUser);
router.post(`${routeValue}create-admin`, adminAuth, createAdmin);

export default router;
