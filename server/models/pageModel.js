import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
});

const pageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            default: "",
        },
        metaDescription: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: ["page", "faq"],
            default: "page",
        },
        faqs: [faqSchema],
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        minimize: false,
        timestamps: true,
    }
);

const pageModel =
    mongoose.models.page || mongoose.model("page", pageSchema);

export default pageModel;
