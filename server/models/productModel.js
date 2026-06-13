import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        _type: { type: String },
        name: { type: String, required: true },
        images: { type: Array, required: true },
        mrp: { type: Number, required: true },
        price: { type: Number, default: 0 },
        price14k: { type: Number, default: 0 },
        price18k: { type: Number, default: 0 },
        price22k: { type: Number, default: 0 },
        price24k: { type: Number, default: 0 },
        discountedPercentage: { type: Number, required: true, default: 0 },
        stock: { type: Number, required: true, default: 0 },
        soldQuantity: { type: Number, default: 0 },
        category: { type: String, required: true },
        brand: { type: String, default: "" },
        shape: { type: String, default: "" },
        metal: { type: String, default: "" },
        badge: { type: String, default: "" },
        isAvailable: { type: Boolean },
        offer: { type: Boolean },
        description: { type: String, required: true },
        tags: { type: Array },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        goldKarat: { type: String, enum: ["", "14", "18", "22", "24"], default: "" },
        weight: { type: Number, default: 0 },
        freeShipping: { type: Boolean, default: false },
        shippingCharge: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
