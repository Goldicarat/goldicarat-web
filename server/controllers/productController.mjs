import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { deleteCloudinaryImage } from "../config/cloudinary.js";
import { calculateDiscountedPercentage } from "../config/general.js";
import productModel from "../models/productModel.js";
import ratingModel from "../models/ratingModel.js";

const cleanupTempFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        };
    } catch (error) {
        console.error("Error cleaning up temporary file:", error);
    };
};

const addProduct = async (req, res) => {
    try {
        const {
            _type,
            name,
            mrp,
            discountedPercentage,
            stock,
            category,
            shape,
            metal,
            badge,
            isAvailable,
            offer,
            description,
            tags,
            weight,
            freeShipping,
            shippingCharge,
            goldKarat,
            price14k,
            price18k,
            price22k,
            price24k,
        } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        if (!name || !mrp || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, mrp, category, and description are mandatory.",
            });
        };
        if (!price14k && !price18k && !price22k && !price24k) {
            return res.status(400).json({
                success: false,
                message: "At least one gold karat price (14k, 18k, 22k, or 24k) is required.",
            });
        };

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    let result = await cloudinary.uploader.upload(item.path, {
                        folder: "orebi/products",
                        resource_type: "image",
                        transformation: [
                            { width: 800, height: 800, crop: "fill" },
                            { quality: "auto", fetch_format: "auto" },
                        ],
                    });

                    cleanupTempFile(item.path);

                    return result.secure_url;
                } catch (error) {
                    cleanupTempFile(item.path);
                    throw error;
                }
            })
        );

        let parsedTags;
        try {
            parsedTags = JSON.parse(tags);
        } catch (err) {
            parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
        };

        const defaultPrice = Number(price14k || price18k || price22k || price24k || 0);
        const discountPercentage = calculateDiscountedPercentage(Number(mrp), defaultPrice);

        const productData = {
            _type: _type ? _type : "",
            name,
            mrp: Number(mrp),
            price: defaultPrice,
            price14k: Number(price14k || 0),
            price18k: Number(price18k || 0),
            price22k: Number(price22k || 0),
            price24k: Number(price24k || 0),
            discountedPercentage: discountPercentage ? Number(discountPercentage) : 0,
            stock: stock ? Number(stock) : 0,
            soldQuantity: 0,
            category,
            // brand: brand ? brand : "",
            shape: shape || "",
            metal: metal || "",
            badge: badge || "",
            isAvailable: isAvailable === "true" ? true : false,
            offer: offer === "true" ? true : false,
            description,
            tags: tags ? parsedTags : [],
            images: imagesUrl,
            weight: weight ? Number(weight) : 0,
            freeShipping: freeShipping === "true" ? true : false,
            shippingCharge: shippingCharge ? Number(shippingCharge) : 0,
            goldKarat: goldKarat || "",
        };

        const product = new productModel(productData);
        product.save();

        return res.status(200).json({
            success: true,
            message: `${name} added successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const listProducts = async (req, res) => {
    try {
        const {
            _type,
            _id,
            _search,
            brand,
            category,
            shape,
            metal,
            offer,
            onSale,
            isAvailable,
            _page = 1,
            _perPage = 25,
        } = req.query;

        if (_id) {
            const dbProduct = await productModel.findById(_id);
            if (dbProduct) {
                const formattedProduct = {
                    ...dbProduct.toObject(),
                    image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : "",
                };

                return res.status(200).json({ success: true, product: formattedProduct });
            } else {
                return res.status(400).json({ success: false, message: "Product not found" });
            };
        };

        let filter = {};

        if (isAvailable !== "false") {
            filter.isAvailable = true;
        };

        if (_type) {
            filter._type = _type;
        };

        if (brand) {
            filter.brand = brand;
        };

        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, "i") };
        };

        if (shape) {
            filter.shape = { $regex: shape, $options: "i" };
        };

        if (metal) {
            filter.metal = { $regex: metal, $options: "i" };
        };

        if (offer === "true") {
            filter.offer = true;
        };

        if (onSale === "true") {
            filter.onSale = true;
        };

        if (_search) {
            const searchRegex = new RegExp(_search, "i");
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } },
            ];
        };

        let dbProducts = await productModel.find(filter).sort({ createdAt: -1 });

        const productRatings = await ratingModel.aggregate([
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);

        const ratingsMap = {};

        productRatings.forEach((r) => {
            ratingsMap[r._id.toString()] = {
                averageRating: Number(r.averageRating.toFixed(1)),
                totalRatings: r.totalRatings,
            };
        });

        const productsWithRating = dbProducts.map((product) => {
            const ratingData = ratingsMap[product._id.toString()] || {
                averageRating: 0,
                totalRatings: 0,
            };

            return {
                ...product.toObject(),
                image: product.images && product.images.length > 0 ? product.images[0] : "",
                averageRating: ratingData.averageRating,
                totalRatings: ratingData.totalRatings,
                likeCount: product.likes ? product.likes.length : 0,
            };
        });

        // let formattedDbProducts = dbProducts.map((product) => ({
        //     ...product.toObject(),
        //     image: product.images && product.images.length > 0 ? product.images[0] : "",
        // }));

        // Apply pagination
        const page = parseInt(_page, 10) || 1;
        const perPage = parseInt(_perPage, 10) || 25;
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;
        const paginatedProducts = productsWithRating.slice(startIndex, endIndex);

        // Return response based on whether pagination is requested
        if (_page || _perPage) {
            return res.status(200).json({
                success: true,
                products: paginatedProducts,
                currentPage: page,
                perPage,
                totalItems: productsWithRating.length,
                totalPages: Math.ceil(productsWithRating.length / perPage),
            });
        } else {
            return res.status(200).json({
                success: true,
                products: productsWithRating,
                total: productsWithRating.length,
            });
        };
    } catch (error) {
        console.error("List products error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body._id);

        if (!product) {
            return res.status(400).json({ success: false, message: "Product not found" });
        };

        if (product.images && Array.isArray(product.images)) {
            for (const imageUrl of product.images) {
                try {
                    await deleteCloudinaryImage(imageUrl);
                } catch (error) {
                    console.error("Error deleting product image from Cloudinary:", error);
                };
            };
        };

        await productModel.findByIdAndDelete(req.body._id);

        return res.status(200).json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Single product
const singleProducts = async (req, res) => {
    try {
        const productId = req.body._id || req.query._id || req.params.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        };

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            });
        };

        // Only return available products for non-admin requests
        if (!product.isAvailable && !req.user?.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Product not available",
            });
        };

        const ratingStats = await ratingModel.aggregate([
            { $match: { productId: new ObjectId(productId) } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);

        const ratingData = ratingStats[0] || {
            averageRating: 0,
            totalRatings: 0,
        };

        const productObj = product.toObject();
        productObj["averageRating"] = ratingData.averageRating;
        productObj["totalRatings"] = ratingData.totalRatings;
        productObj["likeCount"] = product.likes ? product.likes.length : 0;

        // If user is authenticated, return whether they liked this product
        if (req.user) {
            productObj["isLiked"] = product.likes ? product.likes.some((id) => id.toString() === req.user._id.toString()) : false;
        };

        return res.status(200).json({ success: true, product: productObj });
    } catch (error) {
        console.error("Single product error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

// Toggle like/dislike on a product
const toggleProductLike = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        };

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            });
        };

        const userIdStr = userId.toString();
        const likedIndex = product.likes ? product.likes.findIndex((id) => id.toString() === userIdStr) : -1;

        if (likedIndex > -1) {
            product.likes.splice(likedIndex, 1);
        } else {
            if (!product.likes) product.likes = [];
            product.likes.push(userId);
        };

        await product.save();

        return res.status(200).json({
            success: true,
            message: likedIndex > -1 ? "Product disliked" : "Product liked",
            data: {
                isLiked: likedIndex === -1,
                likeCount: product.likes.length,
            },
        });
    } catch (error) {
        console.error("Toggle like error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

// Update stock after purchase
const updateStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product ID and valid quantity are required",
            });
        };

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            });
        };

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock available",
            });
        };

        product.stock -= quantity;
        product.soldQuantity += quantity;

        if (product.stock === 0) {
            product.isAvailable = false;
        };

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product: {
                _id: product._id,
                stock: product.stock,
                soldQuantity: product.soldQuantity,
                isAvailable: product.isAvailable,
            },
        });
    } catch (error) {
        console.error("Update stock error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {
            _type,
            name,
            mrp,
            discountedPercentage,
            stock,
            category,
            shape,
            metal,
            badge,
            isAvailable,
            offer,
            description,
            tags,
            weight,
            freeShipping,
            shippingCharge,
            goldKarat,
            price14k,
            price18k,
            price22k,
            price24k,
        } = req.body;

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            });
        };

        if (!name || !mrp || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, mrp, category, and description are mandatory.",
            });
        };

        let imagesUrl = existingProduct.images;

        const newImages = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (newImages.length > 0) {
            try {
                const uploadPromises = newImages.map(async (item, index) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        folder: "orebi/products",
                        resource_type: "image",
                        transformation: [
                            { width: 800, height: 800, crop: "fill" },
                            { quality: "auto", fetch_format: "auto" },
                        ],
                    });

                    cleanupTempFile(item.path);

                    return { index, url: result.secure_url };
                });

                const uploadResults = await Promise.all(uploadPromises);

                uploadResults.forEach(({ index, url }) => {
                    if (index < imagesUrl.length) {
                        imagesUrl[index] = url;
                    } else {
                        imagesUrl.push(url);
                    };
                });
            } catch (error) {
                console.error("Error uploading images:", error);
                newImages.forEach((item) => cleanupTempFile(item.path));

                return res.status(500).json({
                    success: false,
                    message: "Error uploading images",
                });
            };
        };

        // Parse tags
        let parsedTags;
        try {
            parsedTags = JSON.parse(tags);
        } catch (err) {
            parsedTags = tags ? tags.split(",").map((tag) => tag.trim()) : [];
        };

        const defaultPrice = Number(price14k || price18k || price22k || price24k || existingProduct.price || 0);
        const discountPercentage = calculateDiscountedPercentage(Number(mrp), defaultPrice);

        const updateData = {
            _type: _type || "",
            name,
            mrp: Number(mrp),
            price: defaultPrice,
            price14k: Number(price14k || 0),
            price18k: Number(price18k || 0),
            price22k: Number(price22k || 0),
            price24k: Number(price24k || 0),
            discountedPercentage: discountPercentage ? Number(discountPercentage) : 0,
            stock: stock ? Number(stock) : 0,
            category,
            // brand: brand || "",
            shape: shape || "",
            metal: metal || "",
            badge: badge || "",
            isAvailable: isAvailable === "true" ? true : false,
            offer: offer === "true" ? true : false,
            description,
            tags: parsedTags,
            images: imagesUrl,
            weight: weight ? Number(weight) : 0,
            freeShipping: freeShipping === "true" ? true : false,
            shippingCharge: shippingCharge ? Number(shippingCharge) : 0,
            goldKarat: goldKarat || "",
        };

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: `${name} updated successfully`,
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Update product error:", error);
        return res.status(400).json({ success: false, message: error.message });
    };
};

// Bulk import products from JSON data (e.g. from products.js)
const bulkImport = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a non-empty array of products",
            });
        }

        const results = { imported: 0, skipped: 0, errors: [] };

        for (const item of products) {
            try {
                if (!item.name || !item.price || !item.category) {
                    results.skipped++;
                    results.errors.push({ name: item.name || "unnamed", reason: "Missing required fields (name, price, category)" });
                    continue;
                }

                const discountPct = item.originalPrice
                    ? calculateDiscountedPercentage(Number(item.originalPrice), Number(item.price))
                    : 0;

                const productData = {
                    _type: item._type || "best_sellers",
                    name: item.name,
                    description: item.description || "",
                    mrp: Number(item.originalPrice || item.price),
                    price: Number(item.price),
                    discountedPercentage: discountPct,
                    stock: item.stock || 100,
                    soldQuantity: 0,
                    category: item.category.toLowerCase(),
                    shape: item.shape || "",
                    metal: item.metal || "",
                    badge: item.badge || "",
                    isAvailable: true,
                    offer: !!item.badge,
                    images: item.image ? [item.image] : [],
                    tags: [item.category, item.shape, item.metal].filter(Boolean),
                };

                await productModel(productData).save();
                results.imported++;
            } catch (err) {
                results.skipped++;
                results.errors.push({ name: item.name || "unnamed", reason: err.message });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Imported ${results.imported} product(s). ${results.skipped} skipped.`,
            results,
        });
    } catch (error) {
        console.error("Bulk import error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export {
    addProduct,
    listProducts,
    removeProduct,
    singleProducts,
    updateStock,
    updateProduct,
    toggleProductLike,
    bulkImport,
};
