import mongoose from "mongoose";

const customDesignSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        jewelryType: {
            type: String,
            required: true,
            trim: true,
        },
        metal: {
            type: String,
            required: true,
            trim: true,
        },
        diamondShape: {
            type: String,
            required: true,
            trim: true,
        },
        caratSize: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        referenceImage: {
            type: String,
            default: "",
        },
        adminNotes: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

customDesignSchema.index({ userId: 1 });
customDesignSchema.index({ status: 1 });
customDesignSchema.index({ createdAt: -1 });

const customDesignModel = mongoose.models.customDesign || mongoose.model("customDesign", customDesignSchema);

export default customDesignModel;
