import pageModel from "../models/pageModel.js";

const getPages = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type, isActive: true } : {};
        const pages = await pageModel.find(filter).sort({ order: 1, createdAt: -1 });
        return res.status(200).json({ success: true, pages });
    } catch (error) {
        console.error("Get Pages Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await pageModel.findOne({ slug, isActive: true });
        if (!page) {
            return res.status(404).json({ success: false, message: "Page not found" });
        }
        return res.status(200).json({ success: true, page });
    } catch (error) {
        console.error("Get Page Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getAllPagesAdmin = async (req, res) => {
    try {
        const pages = await pageModel.find().sort({ order: 1, createdAt: -1 });
        return res.status(200).json({ success: true, pages });
    } catch (error) {
        console.error("Get All Pages Admin Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const createPage = async (req, res) => {
    try {
        const { title, slug, content, metaDescription, type, faqs, isActive, order } = req.body;

        const existing = await pageModel.findOne({ slug });
        if (existing) {
            return res.status(400).json({ success: false, message: "A page with this slug already exists" });
        }

        const page = await pageModel.create({
            title,
            slug,
            content: content || "",
            metaDescription: metaDescription || "",
            type: type || "page",
            faqs: faqs || [],
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0,
        });

        return res.status(201).json({ success: true, message: "Page created successfully", page });
    } catch (error) {
        console.error("Create Page Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, metaDescription, type, faqs, isActive, order } = req.body;

        if (slug) {
            const existing = await pageModel.findOne({ slug, _id: { $ne: id } });
            if (existing) {
                return res.status(400).json({ success: false, message: "A page with this slug already exists" });
            }
        }

        const updatePayload = {};
        if (title !== undefined) updatePayload.title = title;
        if (slug !== undefined) updatePayload.slug = slug;
        if (content !== undefined) updatePayload.content = content;
        if (metaDescription !== undefined) updatePayload.metaDescription = metaDescription;
        if (type !== undefined) updatePayload.type = type;
        if (faqs !== undefined) updatePayload.faqs = faqs;
        if (isActive !== undefined) updatePayload.isActive = isActive;
        if (order !== undefined) updatePayload.order = order;

        const page = await pageModel.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });

        if (!page) {
            return res.status(404).json({ success: false, message: "Page not found" });
        }

        return res.status(200).json({ success: true, message: "Page updated successfully", page });
    } catch (error) {
        console.error("Update Page Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await pageModel.findByIdAndDelete(id);
        if (!page) {
            return res.status(404).json({ success: false, message: "Page not found" });
        }
        return res.status(200).json({ success: true, message: "Page deleted successfully" });
    } catch (error) {
        console.error("Delete Page Error", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export { getPages, getPageBySlug, getAllPagesAdmin, createPage, updatePage, deletePage };
