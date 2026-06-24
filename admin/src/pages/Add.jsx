import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Title from "../components/ui/title";
import { IoMdAdd, IoMdCloudUpload } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import Input, { Label } from "../components/ui/input";
import toast from "react-hot-toast";
import { serverUrl } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SmallLoader from "../components/SmallLoader";
import api from "../api/axiosInstance";

const Add = ({ token }) => {
    const [isLoading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        _type: "",
        name: "",
        description: "",
        mrp: "",
        discountedPercentage: 0,
        stock: "",
        category: "",
        shape: "",
        metal: "",
        offer: false,
        isAvailable: true,
        badge: "",
        tags: [],
    weight: "",
    freeShipping: false,
    shippingCharge: "",
    goldKarat: "",
    price14k: "",
    price18k: "",
    price22k: "",
    price24k: "",
});
    const [imageFiles, setImageFiles] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
    });
    const [goldPrices, setGoldPrices] = useState({});

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoadingData(true);
            const [categoriesRes] = await Promise.all([
                api.get(`${serverUrl}/api/category`),
            ]);

            const categoriesData = categoriesRes.data;

            if (categoriesData.success) {
                setCategories(categoriesData.categories);
            }
        } catch (error) {
            console.error("Error fetching categories---->", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to load categories");
            };
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        api.get(`${serverUrl}/api/gold-price/current`).then((res) => {
            if (res.data?.success) setGoldPrices(res.data.prices || {});
        }).catch(() => {});
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (
            type === "select-one" &&
            (name === "offer" || name === "isAvailable")
        ) {
            setFormData({
                ...formData,
                [name]: value === "true",
            });
        } else if (
            name === "mrp" ||
            name === "discountedPercentage" ||
            name === "stock" ||
            name === "price14k" ||
            name === "price18k" ||
            name === "price22k" ||
            name === "price24k"
        ) {
            setFormData({
                ...formData,
                [name]: value === "" ? "" : Number(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle individual image upload
    const handleImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        if (file) {
            setImageFiles((prev) => ({
                ...prev,
                [imageKey]: file,
            }));
        }
    };

    // Remove an image
    const removeImage = (imageKey) => {
        setImageFiles((prev) => ({
            ...prev,
            [imageKey]: null,
        }));
    };

    const handleUploadProduct = async (e) => {
        e.preventDefault();

        // Validation
        if (
            !formData.name ||
            !formData.description ||
            !formData.mrp ||
            !formData.price14k ||
            !formData.price18k ||
            !formData.price22k ||
            !formData.price24k ||
            !formData.stock ||
            !formData.category
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Check if at least one image is uploaded
        const hasImage = Object.values(imageFiles).some((file) => file !== null);
        if (!hasImage) {
            toast.error("Please upload at least one image");
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();

            // Append form fields
            data.append("_type", formData._type);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("mrp", formData.mrp);
            data.append("discountedPercentage", formData.discountedPercentage);
            data.append("stock", formData.stock);
            data.append("category", formData.category);
            data.append("shape", formData.shape);
            data.append("metal", formData.metal);
            data.append("offer", formData.offer);
            data.append("isAvailable", formData.isAvailable);
            data.append("badge", formData.badge);
            data.append("tags", JSON.stringify(formData.tags));
            data.append("weight", formData.weight);
            data.append("freeShipping", formData.freeShipping);
            data.append("shippingCharge", formData.shippingCharge);
            data.append("goldKarat", formData.goldKarat);
            data.append("price14k", formData.price14k);
            data.append("price18k", formData.price18k);
            data.append("price22k", formData.price22k);
            data.append("price24k", formData.price24k);

        // Append image files
            Object.keys(imageFiles).forEach((key) => {
                if (imageFiles[key]) {
                    data.append(key, imageFiles[key]);
                }
            });

            const response = await axios.post(serverUrl + "/api/product/add", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const responseData = response?.data;
            if (responseData?.success) {
                toast.success(responseData?.message);
                navigate("/list");
            } else {
                toast.error(responseData?.message);
            }
        } catch (error) {
            console.error("Product data uploading error", error);
            toast.error(error?.response?.data?.message || "Error uploading product");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
            <div className="xl:max-w-5xl bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <IoMdAdd className="text-white text-xl" />
                        </div>
                        <div>
                            <Title className="text-xl sm:text-2xl font-bold text-gray-800">
                                Add New Product
                            </Title>
                            <p className="text-sm text-gray-500 mt-1">
                                Create a new product for your store
                            </p>
                        </div>
                    </div>

                    <form
                        className="space-y-6 sm:space-y-8"
                        onSubmit={handleUploadProduct}
                    >
                        {/* Image Upload Section */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Product Images
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {["image1", "image2", "image3", "image4"].map(
                                    (imageKey, index) => (
                                        <div key={imageKey} className="relative">
                                            <label htmlFor={imageKey} className="block">
                                                <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors duration-200 min-h-[120px] flex flex-col items-center justify-center bg-white">
                                                    {imageFiles[imageKey] ? (
                                                        <>
                                                            <img
                                                                src={URL.createObjectURL(imageFiles[imageKey])}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-md mb-2"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    removeImage(imageKey);
                                                                }}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                            >
                                                                <FaTimes className="text-xs" />
                                                            </button>
                                                            <span className="text-xs text-gray-600">
                                                                Change
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IoMdCloudUpload className="text-3xl text-gray-400 mb-2" />
                                                            <span className="text-xs text-gray-600">
                                                                Upload Image {index + 1}
                                                            </span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        id={imageKey}
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, imageKey)}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                Upload up to 4 images. First image will be the main product
                                image.
                            </p>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="flex flex-col">
                                    <Label htmlFor="product name">Product Name *</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter product name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1"
                                        maxLength={100}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.name.length} / 100 characters
                                    </p>
                                </div>
                                {/* <div className="lg:col-span-2">
                                    <Label htmlFor="product name">Product Name *</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter product name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div> */}

                                <div className="lg:col-span-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <textarea
                                        placeholder="Enter product description"
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows={4}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="_type">Product Type</Label>
                                    <select
                                        name="_type"
                                        value={formData._type}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select type</option>
                                        <option value="new_arrivals">New Arrivals</option>
                                        <option value="best_sellers">Best Sellers</option>
                                        <option value="special_offers">Special Offers</option>
                                        <option value="promotions">Promotions</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Gold Karat & Price */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                                Gold Karat & Price
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                    <Label>Gold Karat</Label>
                                    <select
                                        name="goldKarat"
                                        value={formData.goldKarat}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    >
                                        <option value="">Select karat</option>
                                        <option value="14">14k</option>
                                        <option value="18">18k</option>
                                        <option value="22">22k</option>
                                        <option value="24">24k</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="weight">Weight (grams)</Label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.1"
                                        placeholder="e.g. 2.5"
                                        className="mt-1 w-full border border-yellow-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <Label>Current Gold Price (/gram)</Label>
                                    <input
                                        type="text"
                                        value={formData.goldKarat ? `₹${Number(goldPrices[formData.goldKarat] || 0).toLocaleString('en-IN')}` : ''}
                                        disabled
                                        className="mt-1 w-full border border-yellow-300 rounded-md px-4 py-2 bg-white text-yellow-800 font-medium focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-100 disabled:cursor-default"
                                    />
                                </div>
                                {formData.goldKarat && (
                                    <div>
                                        <Label>Estimated Gold Value</Label>
                                        <input
                                            type="text"
                                            value={`₹${(Number(formData.weight || 0) * Number(goldPrices[formData.goldKarat] || 0)).toLocaleString('en-IN')}`}
                                            disabled
                                            className="mt-1 w-full border border-yellow-300 rounded-md px-4 py-2 bg-yellow-200 text-yellow-900 font-bold focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-100 disabled:cursor-default"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Pricing & Stock
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-6">
                                <div className="flex flex-col">
                                    <Label htmlFor="mrp">MRP *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label htmlFor="price14k">Price (14k Gold) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        name="price14k"
                                        value={formData.price14k}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label htmlFor="price18k">Price (18k Gold) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        name="price18k"
                                        value={formData.price18k}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label htmlFor="price22k">Price (22k Gold) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        name="price22k"
                                        value={formData.price22k}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label htmlFor="price24k">Price (24k Gold) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        name="price24k"
                                        value={formData.price24k}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                                <div className="flex-1">
                                    <Label htmlFor="stock">Stock Quantity *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category and Settings */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Category & Settings
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        disabled={loadingData}
                                    >
                                        <option value="">
                                            {loadingData
                                                ? "Loading categories..."
                                                : "Select category"}
                                        </option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="shape">Diamond Shape</Label>
                                    <input
                                        type="text"
                                        name="shape"
                                        value={formData.shape}
                                        onChange={handleChange}
                                        placeholder="e.g. Round, Emerald, Pear"
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="metal">Metal Type</Label>
                                    <input
                                        type="text"
                                        name="metal"
                                        value={formData.metal}
                                        onChange={handleChange}
                                        placeholder="e.g. Yellow Gold, Rose Gold"
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="isAvailable">Availability</Label>
                                    <select
                                        name="isAvailable"
                                        value={formData.isAvailable.toString()}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="true">Available</option>
                                        <option value="false">Out of Stock</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="offer">Special Offer</Label>
                                    <select
                                        name="offer"
                                        value={formData.offer.toString()}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="badge">Badge Text</Label>
                                    <input
                                        type="text"
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleChange}
                                        placeholder="e.g. BEST SELLER, NEW, TRENDING"
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Settings</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="shippingCharge">Shipping Charge (INR)</Label>
                                    <input
                                        type="number"
                                        id="shippingCharge"
                                        name="shippingCharge"
                                        value={formData.shippingCharge}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="e.g. 50"
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="freeShipping">Free Shipping</Label>
                                    <select
                                        name="freeShipping"
                                        value={formData.freeShipping.toString()}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                                {[
                                    "Fashion",
                                    "Electronics",
                                    "Sports",
                                    "Accessories",
                                    "Others",
                                ].map((tag) => (
                                    <div className="flex items-center space-x-2" key={tag}>
                                        <input
                                            id={tag.toLowerCase()}
                                            type="checkbox"
                                            name="tags"
                                            value={tag}
                                            checked={formData.tags.includes(tag)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        tags: [...prevData.tags, tag],
                                                    }));
                                                } else {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        tags: prevData.tags.filter((t) => t !== tag),
                                                    }));
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={tag.toLowerCase()}
                                            className="text-sm text-gray-700 cursor-pointer"
                                        >
                                            {tag}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200">
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <SmallLoader />
                                        <span>Adding Product...</span>
                                    </>
                                ) : (
                                    <>
                                        <IoMdAdd className="text-lg" />
                                        <span>Add Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

Add.propTypes = {
    token: PropTypes.string.isRequired,
};

export default Add;
