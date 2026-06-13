import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        discountedPercentage: {
            type: Number,
            default: 0,
        },
        comingSoonMode: {
            type: Boolean,
            default: false,
        },
        diamondShapes: {
            type: [String],
            default: [],
        },
        priceRanges: [
            {
                label: { type: String },
                min: { type: Number },
                max: { type: Number, default: null },
            },
        ],
        spotlight: [
            {
                title: { type: String },
                image: { type: String },
                link: { type: String, default: "/shop" },
            },
        ],
        heroBanner: {
            image: { type: String, default: "" },
            link: { type: String, default: "/shop" },
            isActive: { type: Boolean, default: false },
        },
        collectionBanner: {
            title: { type: String, default: "" },
            subtitle: { type: String, default: "" },
            description: { type: String, default: "" },
            discount: { type: String, default: "" },
            from: { type: Number, default: 0 },
            sale: { type: String, default: "" },
            image: { type: String, default: "" },
            link: { type: String, default: "/shop" },
            isActive: { type: Boolean, default: false },
        },
        paymentMode: {
            type: String,
            enum: ["test", "live"],
            default: "test",
        },
        shipmentMode: {
            type: String,
            enum: ["test", "live"],
            default: "test",
        },
        // Production payment keys (test keys from .env)
        razorpayKeyId: { type: String, default: "" },
        razorpayKeySecret: { type: String, default: "" },
        razorpayWebhookSecret: { type: String, default: "" },

        // Production shipment credentials (test from .env)
        shipmentEmail: { type: String, default: "" },
        shipmentPassword: { type: String, default: "" },
        shipmentBaseUrl: { type: String, default: "" },
        freeShippingThreshold: { type: Number, default: 0 },
        defaultShippingCharge: { type: Number, default: 0 },
        goldPriceApiUrl: { type: String, default: "https://www.goldapi.io/api/XAU/INR" },
        goldPriceApiKey: { type: String, default: "" },
        goldPricePerGram24k: { type: Number, default: 0 },
        goldPriceLastFetched: { type: Date, default: null },
        footerLinks: {
            social: [
                {
                    platform: { type: String },
                    icon: { type: String },
                    url: { type: String, default: "#" },
                    isActive: { type: Boolean, default: true },
                    order: { type: Number, default: 0 },
                },
            ],
            customerService: [
                {
                    label: { type: String },
                    url: { type: String, default: "#" },
                    isActive: { type: Boolean, default: true },
                    order: { type: Number, default: 0 },
                },
            ],
            bottomLinks: [
                {
                    label: { type: String },
                    url: { type: String, default: "#" },
                    isActive: { type: Boolean, default: true },
                    order: { type: Number, default: 0 },
                },
            ],
        },
    },
    {
        minimize: false,
        timestamps: true,
    }
);

const settingModel = mongoose.models.setting || mongoose.model("setting", settingSchema);

export default settingModel;
