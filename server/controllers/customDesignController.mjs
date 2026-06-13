import CustomDesign from "../models/customDesignModel.js";
import userModel from "../models/userModel.js";

export const createDesign = async (req, res) => {
    try {
        const { jewelryType, metal, diamondShape, caratSize, description, referenceImage } = req.body;
        const userId = req.user.id;

        if (!jewelryType || !metal || !diamondShape || !caratSize) {
            return res.status(400).json({
                success: false,
                message: "Jewelry type, metal, diamond shape, and carat size are required",
            });
        };

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        };

        const design = new CustomDesign({
            jewelryType: jewelryType.trim(),
            metal: metal.trim(),
            diamondShape: diamondShape.trim(),
            caratSize: caratSize.trim(),
            description: description ? description.trim() : "",
            referenceImage: referenceImage || "",
            userId,
        });

        await design.save();
        await design.populate("userId");

        return res.status(200).json({
            success: true,
            message: "Your custom design request has been submitted successfully! Our team will review it within 24 hours.",
            data: design,
        });
    } catch (error) {
        console.error("Create custom design error------------->", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        };

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        };

        return res.status(500).json({
            success: false,
            message: "Failed to submit design request. Please try again.",
        });
    };
};

export const getUserDesigns = async (req, res) => {
    try {
        const userId = req.user.id;

        const designs = await CustomDesign.find({ userId })
            .populate("userId")
            .sort({ _id: -1 });

        return res.status(200).json({
            success: true,
            data: designs,
        });
    } catch (error) {
        console.error("Get user designs error---------->", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your design requests",
        });
    };
};

export const getAllDesigns = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        const filter = {};
        if (status && status !== "all") {
            filter.status = status;
        };

        if (search) {
            filter.$or = [
                { jewelryType: { $regex: search, $options: "i" } },
                { metal: { $regex: search, $options: "i" } },
                { diamondShape: { $regex: search, $options: "i" } },
                { caratSize: { $regex: search, $options: "i" } },
            ];
        };

        const designs = await CustomDesign.find(filter)
            .populate("userId")
            .sort({ _id: -1 });

        const total = await CustomDesign.countDocuments(filter);

        const statusCounts = await CustomDesign.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total,
        };

        statusCounts.forEach((item) => {
            counts[item._id] = item.count;
        });

        return res.status(200).json({
            success: true,
            data: designs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit),
            },
            counts,
        });
    } catch (error) {
        console.error("Get all designs error--------------->", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch design requests",
        });
    };
};

export const getDesignById = async (req, res) => {
    try {
        const { id } = req.params;

        const design = await CustomDesign.findById(id).populate("userId");

        if (!design) {
            return res.status(404).json({
                success: false,
                message: "Design request not found",
            });
        };

        return res.status(200).json({
            success: true,
            data: design,
        });
    } catch (error) {
        console.error("Get design by ID error-------------->", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch design request",
        });
    };
};

export const updateDesignStatus = async (req, res) => {
    try {
        const { designId, status, adminNotes } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value. Must be pending, approved, or rejected",
            });
        };

        const updatePayload = { status };

        if (adminNotes !== undefined) {
            updatePayload.adminNotes = adminNotes;
        };

        const design = await CustomDesign.findByIdAndUpdate(
            designId,
            updatePayload,
            { new: true }
        ).populate("userId");

        if (!design) {
            return res.status(404).json({
                success: false,
                message: "Design request not found",
            });
        };

        const statusMessage = status === "approved"
            ? "Design request approved successfully"
            : status === "rejected"
                ? "Design request rejected"
                : "Design request status updated";

        return res.status(200).json({
            success: true,
            message: statusMessage,
            data: design,
        });
    } catch (error) {
        console.error("Update design status error-------------->", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update design request status",
        });
    };
};
