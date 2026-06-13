import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import settingModel from "../models/settingModel.js";

const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user._id;
        const adminDetails = await userModel.findById(adminId).select("-password -__v");

        if (!adminDetails) {
            return res.status(400).json({ success: false, message: "Admin not found" });
        };

        return res.status(200).json({ success: true, admin: adminDetails });
    } catch (error) {
        console.error("Get Admin Profile Error", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const getSettingDetails = async (req, res) => {
    try {
        const adminId = req.user._id;
        if (!adminId) {
            return res.status(400).json({ success: false, message: "Admin not found" });
        };

        let settingDetails = await settingModel.findOne({ adminId: adminId });

        if (!settingDetails) {
            // Create default settings if not exist
            settingDetails = await settingModel.create({
                adminId: adminId,
            });
        };

        return res.status(200).json({ success: true, setting: settingDetails });
    } catch (error) {
        console.error("Get Setting Details Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getSingleSettingDetails = async (req, res) => {
    try {
        const settingDetails = await settingModel.findOne({});

        if (!settingDetails) {
            return res.status(200).json({
                success: true,
                setting: {
                    priceRanges: [],
                    diamondShapes: [],
                    spotlight: [],
                    heroBanner: { image: "", link: "/shop", isActive: false },
                    collectionBanner: { title: "", subtitle: "", description: "", discount: "", from: 0, sale: "", image: "", link: "/shop", isActive: false },
                    comingSoonMode: false,
                    discountedPercentage: 0,
                    paymentMode: "test",
                    shipmentMode: "test",
                    razorpayKeyId: "",
                    razorpayKeySecret: "",
                    razorpayWebhookSecret: "",

                    shipmentEmail: "",
                    shipmentPassword: "",
                    shipmentBaseUrl: "",
                    freeShippingThreshold: 0,
                    defaultShippingCharge: 0,
                    goldPriceApiUrl: "https://www.goldapi.io/api/XAU/INR",
                    goldPriceApiKey: "",
                    goldPricePerGram24k: 0,
                    goldPriceLastFetched: null,
                },
            });
        };

        return res.status(200).json({ success: true, setting: settingDetails });
    } catch (error) {
        console.error("Get Single Setting Details Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { newPassword, oldPassword } = req.body;

        if (!oldPassword) {
            return res.status(400).json({ success: false, message: "Please Enter Old password" });
        };

        if (!newPassword) {
            return res.status(400).json({ success: false, message: "Please Enter New password" });
        };

        const adminDetails = await userModel.findById(adminId);
        if (!adminDetails) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        };

        const isMatch = await bcrypt.compare(oldPassword, adminDetails.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Old password is incorrect" });
        };

        const comparePassword = await bcrypt.compare(newPassword, adminDetails.password);
        if (comparePassword) {
            return res.status(400).json({ success: false, message: "Your new password must be different from your old password" });
        };

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        const updatePayload = {
            password: hashPassword,
            loginToken: "",
        };

        const updatePassword = await userModel.findByIdAndUpdate(
            adminDetails._id,
            { $set: updatePayload },
            { new: true },
        );
        if (!updatePassword) {
            return res.status(400).json({ success: false, message: "Password Updated Failed" });
        };

        return res.status(200).json({ success: true, message: "Password Updated Successfully" });
    } catch (error) {
        console.error("Update Password Error", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const updateDiscountedPercentage = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { discountedPercentage } = req.body;

        if (!discountedPercentage || discountedPercentage === "") {
            return res.status(400).json({ success: false, message: "Please Enter Discounted Percentage" });
        };

        const adminDetails = await userModel.findById(adminId);
        if (!adminDetails) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        };

        const updatePayload = {
            discountedPercentage: discountedPercentage,
        };

        const updateDisPercentage = await settingModel.findOneAndUpdate(
            { adminId: adminDetails._id },
            { $set: updatePayload },
            { new: true },
        );
        if (!updateDisPercentage) {
            return res.status(400).json({ success: false, message: "Discount Percentage Update Failed" });
        };

        return res.status(200).json({ success: true, message: "Discount Percentage Update Successfully" });
    } catch (error) {
        console.error("Discount Percentage Error", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const updateSetting = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { comingSoonMode } = req.body;

        const adminDetails = await userModel.findById(adminId);
        if (!adminDetails) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        };

        const updatePayload = {
            comingSoonMode: comingSoonMode,
        };

        const settingUpdate = await settingModel.findOneAndUpdate(
            { adminId: adminDetails._id },
            { $set: updatePayload },
            { new: true },
        );
        if (!settingUpdate) {
            return res.status(400).json({ success: false, message: "Setting Update Failed" });
        };

        return res.status(200).json({ success: true, message: "Setting Update Successfully!" });
    } catch (error) {
        console.error("Setting Update Error", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const updateSiteSettings = async (req, res) => {
    try {
        const adminId = req.user._id;

        const adminDetails = await userModel.findById(adminId);
        if (!adminDetails) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        };

        const allowedFields = [
            "diamondShapes", "priceRanges", "spotlight",
            "heroBanner", "collectionBanner",
        ];

        const updatePayload = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatePayload[field] = req.body[field];
            };
        };

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields to update" });
        };

        const settingUpdate = await settingModel.findOneAndUpdate(
            { adminId: adminDetails._id },
            { $set: updatePayload },
            { new: true },
        );

        if (!settingUpdate) {
            return res.status(400).json({ success: false, message: "Settings update failed" });
        };

        return res.status(200).json({ success: true, message: "Settings updated successfully", setting: settingUpdate });
    } catch (error) {
        console.error("Site Settings Update Error", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const updateFooterLinks = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { social, customerService, bottomLinks } = req.body;

        const updatePayload = {};
        if (social !== undefined) updatePayload["footerLinks.social"] = social;
        if (customerService !== undefined) updatePayload["footerLinks.customerService"] = customerService;
        if (bottomLinks !== undefined) updatePayload["footerLinks.bottomLinks"] = bottomLinks;

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields to update" });
        }

        const settingUpdate = await settingModel.findOneAndUpdate(
            { adminId },
            { $set: updatePayload },
            { new: true },
        );

        if (!settingUpdate) {
            return res.status(400).json({ success: false, message: "Footer settings update failed" });
        }

        return res.status(200).json({ success: true, message: "Footer links updated successfully", setting: settingUpdate });
    } catch (error) {
        console.error("Footer Links Update Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const updatePaymentShipmentSettings = async (req, res) => {
    try {
        const adminId = req.user._id;

        const adminDetails = await userModel.findById(adminId);
        if (!adminDetails) {
            return res.status(400).json({ success: false, message: "Admin details not found" });
        };

        const allowedFields = [
            "paymentMode", "shipmentMode",
            "razorpayKeyId", "razorpayKeySecret", "razorpayWebhookSecret",

            "shipmentEmail", "shipmentPassword", "shipmentBaseUrl",
            "freeShippingThreshold", "defaultShippingCharge",
            "goldPriceApiUrl", "goldPriceApiKey", "goldPricePerGram24k",
        ];

        const updatePayload = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatePayload[field] = req.body[field];
            };
        };

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ success: false, message: "No valid fields to update" });
        };

        // Validate mode values
        if (updatePayload.paymentMode && !["test", "live"].includes(updatePayload.paymentMode)) {
            return res.status(400).json({ success: false, message: "Invalid payment mode value" });
        };
        if (updatePayload.shipmentMode && !["test", "live"].includes(updatePayload.shipmentMode)) {
            return res.status(400).json({ success: false, message: "Invalid shipment mode value" });
        };

        const settingUpdate = await settingModel.findOneAndUpdate(
            { adminId: adminDetails._id },
            { $set: updatePayload },
            { new: true },
        );

        if (!settingUpdate) {
            return res.status(400).json({ success: false, message: "Payment/Shipment settings update failed" });
        };

        // Mask secrets in response
        const responseSetting = settingUpdate.toObject();
        if (responseSetting.razorpayKeySecret) {
            responseSetting.razorpayKeySecret = responseSetting.razorpayKeySecret.slice(0, 4) + "****";
        };
        if (responseSetting.shipmentPassword) {
            responseSetting.shipmentPassword = responseSetting.shipmentPassword.slice(0, 2) + "****";
        };

        return res.status(200).json({
            success: true,
            message: "Payment/Shipment settings updated successfully",
            setting: responseSetting,
        });
    } catch (error) {
        console.error("Payment/Shipment Settings Update Error", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

export {
    getAdminProfile,
    getSettingDetails,
    getSingleSettingDetails,
    changePassword,
    updateDiscountedPercentage,
    updateSetting,
    updateSiteSettings,
    updateFooterLinks,
    updatePaymentShipmentSettings,
};