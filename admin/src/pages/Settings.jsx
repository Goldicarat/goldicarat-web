import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaCog, FaUser, FaDatabase, FaShieldVirus, FaBell } from "react-icons/fa";
import Title from "../components/ui/title";
import Input, { Label } from "../components/ui/input";
import { serverUrl } from "../../config";
import SkeletonLoader from "../components/SkeletonLoader";
import ImageUpload from "../components/ImageUpload";
import { passwordValidation } from "../utils/general.lib";
import api from "../api/axiosInstance";

const Settings = ({ token }) => {
    const [isSettingLoading, setSettingLoading] = useState(false);
    const [isPercentageLoading, setPercentageLoading] = useState(false);
    const [isComingSoonLoading, setComingSoonLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isSiteSettingsLoading, setSiteSettingsLoading] = useState(false);
    const [discountedPercentage, setDiscountedPercentage] = useState(0);
    const [comingSoonMode, setComingSoonMode] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [diamondShapesText, setDiamondShapesText] = useState("");
    const [priceRanges, setPriceRanges] = useState([{ label: "", min: "", max: "" }]);
    const [spotlight, setSpotlight] = useState([{ title: "", image: "", link: "" }]);
    const [heroBanner, setHeroBanner] = useState({ image: "", link: "/shop", isActive: false });
    const [collectionBanner, setCollectionBanner] = useState({
        title: "", subtitle: "", description: "", discount: "", from: "", sale: "",
        image: "", link: "/shop", isActive: false
    });
    const [paymentMode, setPaymentMode] = useState("test");
    const [shipmentMode, setShipmentMode] = useState("test");
    const [razorpayKeyId, setRazorpayKeyId] = useState("");
    const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
    const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState("");
    const [shipmentEmail, setShipmentEmail] = useState("");
    const [shipmentPassword, setShipmentPassword] = useState("");
    const [shipmentBaseUrl, setShipmentBaseUrl] = useState("");
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
    const [defaultShippingCharge, setDefaultShippingCharge] = useState(0);
    const [socialLinks, setSocialLinks] = useState({
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
    });
    const [isSocialSaving, setSocialSaving] = useState(false);
    const [goldPriceApiUrl, setGoldPriceApiUrl] = useState("https://www.goldapi.io/api/XAU/INR");
    const [goldPriceApiKey, setGoldPriceApiKey] = useState("");
    const [goldPricePerGram24k, setGoldPricePerGram24k] = useState(0);
    const [goldPriceFetching, setGoldPriceFetching] = useState(false);
    const [goldPriceSaving, setGoldPriceSaving] = useState(false);
    const [isPaymentShipmentLoading, setPaymentShipmentLoading] = useState(false);

    // Fetch all setting
    const fetchSetting = async () => {
        try {
            setSettingLoading(true);
            const response = await api.get(`${serverUrl}/api/setting/list`);

            const data = response.data;
            if (data.success) {
                setDiscountedPercentage(data.setting.discountedPercentage);
                setComingSoonMode(data.setting.comingSoonMode);
                if (data.setting.diamondShapes) setDiamondShapesText(data.setting.diamondShapes.join("\n"));
                if (data.setting.priceRanges) setPriceRanges(data.setting.priceRanges);
                if (data.setting.spotlight) setSpotlight(data.setting.spotlight);
                if (data.setting.heroBanner) setHeroBanner(data.setting.heroBanner);
                if (data.setting.collectionBanner) setCollectionBanner(data.setting.collectionBanner);
                if (data.setting.paymentMode) setPaymentMode(data.setting.paymentMode);
                if (data.setting.shipmentMode) setShipmentMode(data.setting.shipmentMode);
                if (data.setting.razorpayKeyId) setRazorpayKeyId(data.setting.razorpayKeyId);
                if (data.setting.razorpayKeySecret) setRazorpayKeySecret(data.setting.razorpayKeySecret);
                if (data.setting.razorpayWebhookSecret) setRazorpayWebhookSecret(data.setting.razorpayWebhookSecret);
                if (data.setting.shipmentEmail) setShipmentEmail(data.setting.shipmentEmail);
                if (data.setting.shipmentPassword) setShipmentPassword(data.setting.shipmentPassword);
                if (data.setting.shipmentBaseUrl) setShipmentBaseUrl(data.setting.shipmentBaseUrl);
                if (data.setting.freeShippingThreshold !== undefined) setFreeShippingThreshold(data.setting.freeShippingThreshold);
                if (data.setting.defaultShippingCharge !== undefined) setDefaultShippingCharge(data.setting.defaultShippingCharge);
                if (data.setting.goldPriceApiUrl) setGoldPriceApiUrl(data.setting.goldPriceApiUrl);
                if (data.setting.goldPriceApiKey) setGoldPriceApiKey(data.setting.goldPriceApiKey);
                if (data.setting.goldPricePerGram24k) setGoldPricePerGram24k(data.setting.goldPricePerGram24k);
                if (data.setting.footerLinks?.social) {
                    const social = { facebook: "", instagram: "", twitter: "", youtube: "" };
                    data.setting.footerLinks.social.forEach((link) => {
                        if (social[link.platform] !== undefined) social[link.platform] = link.url;
                    });
                    setSocialLinks(social);
                }
            } else {
                toast.error(data.message || "Failed to fetch settings");
            };
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setSettingLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        try {
            e.preventDefault();

            if (!oldPassword) {
                toast.error("Please Enter Old password");
                return;
            };

            if (!newPassword) {
                toast.error("Please Enter New password");
                return;
            };

            if (!confirmPassword) {
                toast.error("Please Enter Confirm password");
                return;
            };

            if (newPassword === oldPassword) {
                toast.error("Your new password must be different from your old password!");
                return;
            };

            if (newPassword !== confirmPassword) {
                toast.error("New passwords and Confirm password do not match!");
                return;
            };

            const validatePassword = passwordValidation(newPassword);
            if (validatePassword.flag === 0) {
                toast.error(validatePassword.msg);
                return;
            };

            const payload = {
                newPassword: newPassword,
                oldPassword: oldPassword,
            };

            setLoading(true);

            const response = await axios.put(
                `${serverUrl}/api/setting/change-password`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response?.data;
            if (data?.success) {
                toast.success(data?.message);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error(data?.message);
            };
        } catch (error) {
            console.error("Change Password Error-------->", error);
            toast.error(error?.message);
        } finally {
            setLoading(false);
        };
    };

    const handleOnlinePaymentDiscount = async (e) => {
        try {
            e.preventDefault();

            if (!discountedPercentage || discountedPercentage === "") {
                toast.error("Please Enter Discounted Percentage");
                return;
            };

            const payload = {
                discountedPercentage: discountedPercentage,
            };

            setPercentageLoading(true);

            const response = await axios.put(
                `${serverUrl}/api/setting/update-discounted-percentage`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response?.data;
            if (data?.success) {
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            };
        } catch (error) {
            console.error("update discounted percentage Error-------->", error);
            toast.error(error?.message);
        } finally {
            setPercentageLoading(false);
        };
    };

    const handleUpdateSiteSettings = async (e) => {
        try {
            e.preventDefault();
            setSiteSettingsLoading(true);

            const payload = {
                diamondShapes: diamondShapesText.split("\n").map((s) => s.trim()).filter(Boolean),
                priceRanges: priceRanges.map((r) => ({
                    label: r.label,
                    min: Number(r.min),
                    max: r.max === "" || r.max === null ? null : Number(r.max),
                })),
                spotlight,
                heroBanner,
                collectionBanner,
            };

            const response = await api.put(`${serverUrl}/api/setting/update-site-settings`, payload);
            const data = response.data;
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Update site settings error:", error);
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setSiteSettingsLoading(false);
        }
    };

    const handlePaymentShipmentSettings = async (e) => {
        try {
            e.preventDefault();
            setPaymentShipmentLoading(true);

            const payload = {
                paymentMode,
                shipmentMode,
                razorpayKeyId,
                razorpayKeySecret,
                razorpayWebhookSecret,
                shipmentEmail,
                shipmentPassword,
                shipmentBaseUrl,
                freeShippingThreshold,
                defaultShippingCharge,
                goldPriceApiUrl,
                goldPriceApiKey,
                goldPricePerGram24k,
            };

            const response = await api.put(`${serverUrl}/api/setting/update-payment-shipment-settings`, payload);
            const data = response.data;
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Update payment/shipment settings error:", error);
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setPaymentShipmentLoading(false);
        }
    };

    const settingsCategories = [
        {
            title: "General Settings",
            icon: <FaCog />,
            color: "blue",
            settings: [
                { label: "Site Name", value: "ECommerce Shopping", type: "text" },
                {
                    label: "Site Description",
                    value: "Modern e-commerce platform",
                    type: "text",
                },
                { label: "Default Currency", value: "INR", type: "select" },
                { label: "Timezone", value: "UTC-5", type: "select" },
            ],
        },
        {
            title: "User Management",
            icon: <FaUser />,
            color: "green",
            settings: [
                { label: "Allow User Registration", value: true, type: "toggle" },
                { label: "Email Verification Required", value: true, type: "toggle" },
                { label: "Default User Role", value: "Customer", type: "select" },
                { label: "Password Minimum Length", value: "8", type: "number" },
            ],
        },
        {
            title: "Security",
            icon: <FaShieldVirus />,
            color: "red",
            settings: [
                { label: "Two-Factor Authentication", value: false, type: "toggle" },
                { label: "Session Timeout (minutes)", value: "30", type: "number" },
                { label: "Failed Login Attempts", value: "5", type: "number" },
                { label: "IP Whitelist Enabled", value: false, type: "toggle" },
            ],
        },
        {
            title: "Notifications",
            icon: <FaBell />,
            color: "purple",
            settings: [
                { label: "Email Notifications", value: true, type: "toggle" },
                { label: "Order Notifications", value: true, type: "toggle" },
                { label: "Low Stock Alerts", value: true, type: "toggle" },
                { label: "System Maintenance Alerts", value: false, type: "toggle" },
            ],
        },
    ];

    const renderSettingInput = (setting) => {
        switch (setting.type) {
            case "toggle":
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={setting.value}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                );
            case "select":
                return (
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>{setting.value}</option>
                    </select>
                );
            case "number":
                return (
                    <input
                        type="number"
                        defaultValue={setting.value}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        defaultValue={setting.value}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                );
        }
    };

    useEffect(() => {
        fetchSetting();
    }, []);

    if (isSettingLoading) {
        return (
            <div>
                <Title>Setting Details</Title>
                <div className="mt-6">
                    <SkeletonLoader type="settings" />
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">
                    Manage your system configuration and preferences
                </p>
            </div>

            {/* Online Payment Discount Setting */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Online Payment Discount Percentage</h3>
                </div>
                <div className="p-6">
                    <form
                        onSubmit={handleOnlinePaymentDiscount}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="flex flex-col relative">
                            <Label htmlFor="discountedPercentage">
                                Discount Percentage(in %)
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                name="discountedPercentage"
                                value={discountedPercentage}
                                onChange={(e) => setDiscountedPercentage(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div className="md:col-span-3 flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={isPercentageLoading}
                                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                {isPercentageLoading ? "Submitting..." : "Update Percentage"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Enable Maintenance Mode</p>
                            <p className="text-sm text-gray-500 mt-1">
                                When enabled, visitors will see a maintenance page instead of the website
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${comingSoonMode ? 'text-orange-500' : 'text-green-600'}`}>
                                {comingSoonMode ? 'Active' : 'Inactive'}
                            </span>
                            <button
                                type="button"
                                disabled={isComingSoonLoading}
                                onClick={async () => {
                                    const newValue = !comingSoonMode;
                                    setComingSoonMode(newValue);
                                    setComingSoonLoading(true);
                                    try {
                                        const response = await axios.put(
                                            `${serverUrl}/api/setting/update-setting`,
                                            { comingSoonMode: newValue },
                                            { headers: { Authorization: `Bearer ${token}` } },
                                        );
                                        const data = response?.data;
                                        if (data?.success) {
                                            toast.success(newValue ? 'Maintenance mode activated' : 'Maintenance mode deactivated');
                                        } else {
                                            toast.error(data?.message);
                                            setComingSoonMode(!newValue);
                                        }
                                    } catch (error) {
                                        console.error("update setting Error-------->", error);
                                        toast.error(error?.message);
                                        setComingSoonMode(!newValue);
                                    } finally {
                                        setComingSoonLoading(false);
                                    }
                                }}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    comingSoonMode ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                                        comingSoonMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                    {isComingSoonLoading && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </div>
                    )}
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
                            { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
                            { key: "twitter", label: "X (Twitter) URL", placeholder: "https://x.com/..." },
                            { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/..." },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key} className="flex flex-col">
                                <Label htmlFor={key}>{label}</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-400 capitalize w-8 text-center">
                                        {key === "twitter" ? "𝕏" : key.charAt(0).toUpperCase()}
                                    </span>
                                    <input
                                        type="url"
                                        id={key}
                                        value={socialLinks[key]}
                                        onChange={(e) => setSocialLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                                        placeholder={placeholder}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            disabled={isSocialSaving}
                            onClick={async () => {
                                setSocialSaving(true);
                                try {
                                    const social = Object.entries(socialLinks).map(([platform, url], index) => ({
                                        platform,
                                        url: url || "#",
                                        isActive: true,
                                        order: index,
                                    }));
                                    const response = await axios.put(
                                        `${serverUrl}/api/setting/update-footer-links`,
                                        { social },
                                        { headers: { Authorization: `Bearer ${token}` } },
                                    );
                                    if (response?.data?.success) {
                                        toast.success("Social links updated successfully");
                                    } else {
                                        toast.error(response?.data?.message || "Failed to update");
                                    }
                                } catch (error) {
                                    console.error("Update social links error:", error);
                                    toast.error(error?.response?.data?.message || error.message);
                                } finally {
                                    setSocialSaving(false);
                                }
                            }}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isSocialSaving ? "Saving..." : "Save Social Links"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Diamond Shapes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Diamond Shapes</h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-3">Enter one shape name per line</p>
                    <textarea
                        value={diamondShapesText}
                        onChange={(e) => setDiamondShapesText(e.target.value)}
                        rows={6}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Round&#10;Emerald&#10;Princess"
                    />
                </div>
            </div>

            {/* Price Ranges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Price Ranges</h3>
                    <button
                        type="button"
                        onClick={() => setPriceRanges([...priceRanges, { label: "", min: "", max: "" }])}
                        className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                        + Add Range
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {priceRanges.map((range, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="text-xs font-medium text-gray-500">Label</label>
                                <input
                                    type="text"
                                    value={range.label}
                                    onChange={(e) => {
                                        const updated = [...priceRanges];
                                        updated[index].label = e.target.value;
                                        setPriceRanges(updated);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="Under ₹500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Min</label>
                                <input
                                    type="number"
                                    value={range.min}
                                    onChange={(e) => {
                                        const updated = [...priceRanges];
                                        updated[index].min = e.target.value;
                                        setPriceRanges(updated);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Max (leave empty for no limit)</label>
                                <input
                                    type="number"
                                    value={range.max}
                                    onChange={(e) => {
                                        const updated = [...priceRanges];
                                        updated[index].max = e.target.value;
                                        setPriceRanges(updated);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="No limit"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (priceRanges.length > 1) {
                                        setPriceRanges(priceRanges.filter((_, i) => i !== index));
                                    }
                                }}
                                className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spotlight Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Jewelry Spotlight</h3>
                    <button
                        type="button"
                        onClick={() => setSpotlight([...spotlight, { title: "", image: "", link: "" }])}
                        className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                        + Add Item
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {spotlight.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500">Title</label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                        const updated = [...spotlight];
                                        updated[index].title = e.target.value;
                                        setSpotlight(updated);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ombre Jewelry"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <ImageUpload
                                    value={item.image}
                                    onChange={(url) => {
                                        const updated = [...spotlight];
                                        updated[index].image = url;
                                        setSpotlight(updated);
                                    }}
                                    label="Image"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Link</label>
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => {
                                        const updated = [...spotlight];
                                        updated[index].link = e.target.value;
                                        setSpotlight(updated);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="/shop"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (spotlight.length > 1) {
                                            setSpotlight(spotlight.filter((_, i) => i !== index));
                                        }
                                    }}
                                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Hero Banner</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col md:col-span-2">
                            <ImageUpload
                                value={heroBanner.image}
                                onChange={(url) => setHeroBanner({ ...heroBanner, image: url })}
                                label="Image"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Link</label>
                            <input
                                type="text"
                                value={heroBanner.link}
                                onChange={(e) => setHeroBanner({ ...heroBanner, link: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="/shop"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Active</label>
                            <select
                                value={heroBanner.isActive.toString()}
                                onChange={(e) => setHeroBanner({ ...heroBanner, isActive: e.target.value === "true" })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collection Banner */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Collection Banner</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={collectionBanner.title}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, title: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="The Jane Goodall Collection"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Subtitle/Badge</label>
                            <input
                                type="text"
                                value={collectionBanner.subtitle}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, subtitle: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="Limited Edition Collection"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Discount</label>
                            <input
                                type="text"
                                value={collectionBanner.discount}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, discount: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="20% OFF"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">From</label>
                            <input
                                type="number"
                                value={collectionBanner.from}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, from: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Sale Text</label>
                            <input
                                type="text"
                                value={collectionBanner.sale}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, sale: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="Shop The Collection"
                            />
                        </div>
                        <div className="flex flex-col md:col-span-2">
                            <ImageUpload
                                value={collectionBanner.image}
                                onChange={(url) => setCollectionBanner({ ...collectionBanner, image: url })}
                                label="Image"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Link</label>
                            <input
                                type="text"
                                value={collectionBanner.link}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, link: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="/shop"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={collectionBanner.description}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, description: e.target.value })}
                                rows={2}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="Limited Edition, Limitless Impact..."
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Active</label>
                            <select
                                value={collectionBanner.isActive.toString()}
                                onChange={(e) => setCollectionBanner({ ...collectionBanner, isActive: e.target.value === "true" })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Site Settings */}
            <div className="flex justify-end mb-8">
                <button
                    type="button"
                    onClick={handleUpdateSiteSettings}
                    disabled={isSiteSettingsLoading}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSiteSettingsLoading ? "Saving..." : "Save Site Settings"}
                </button>
            </div>

            {/* Payment Gateway Settings */}
            <form onSubmit={handlePaymentShipmentSettings}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Payment Gateway Settings</h3>
                        <p className="text-sm text-gray-500 mt-1">Configure payment gateway mode and production keys</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                                <select
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="test">Test Mode (Sandbox)</option>
                                    <option value="live">Live Mode (Production)</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">Current mode: <span className={paymentMode === "live" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>{paymentMode === "live" ? "LIVE" : "TEST"}</span></p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key ID</label>
                                <input
                                    type="text"
                                    value={razorpayKeyId}
                                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder={paymentMode === "test" ? "Using test key from .env" : "Enter live Razorpay Key ID"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key Secret</label>
                                <input
                                    type="password"
                                    value={razorpayKeySecret}
                                    onChange={(e) => setRazorpayKeySecret(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder={paymentMode === "test" ? "Using test secret from .env" : "Enter live Razorpay Key Secret"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Webhook Secret</label>
                                <input
                                    type="password"
                                    value={razorpayWebhookSecret}
                                    onChange={(e) => setRazorpayWebhookSecret(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Razorpay Webhook Secret"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Shipment Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Shipment Settings</h3>
                        <p className="text-sm text-gray-500 mt-1">Configure shipment provider mode and production credentials</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Mode</label>
                                <select
                                    value={shipmentMode}
                                    onChange={(e) => setShipmentMode(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="test">Test Mode (Mock Data)</option>
                                    <option value="live">Live Mode (Real API)</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">Current mode: <span className={shipmentMode === "live" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>{shipmentMode === "live" ? "LIVE" : "TEST"}</span></p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shiprocket Email</label>
                                <input
                                    type="email"
                                    value={shipmentEmail}
                                    onChange={(e) => setShipmentEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder={shipmentMode === "test" ? "Using test credentials from .env" : "Enter Shiprocket account email"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shiprocket Password</label>
                                <input
                                    type="password"
                                    value={shipmentPassword}
                                    onChange={(e) => setShipmentPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder={shipmentMode === "test" ? "Using test credentials from .env" : "Enter Shiprocket account password"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shiprocket API Base URL</label>
                                <input
                                    type="text"
                                    value={shipmentBaseUrl}
                                    onChange={(e) => setShipmentBaseUrl(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://apiv2.shiprocket.in/v1/external"
                                />
                                <p className="text-xs text-gray-400 mt-1">For production: https://apiv2.shiprocket.in/v1/external</p>
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <h4 className="text-md font-semibold text-gray-800 mb-4">Shipping Charges Configuration</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (INR)</label>
                                    <input
                                        type="number"
                                        value={freeShippingThreshold}
                                        onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                                        min="0"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 999"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping. Set to 0 to disable.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Shipping Charge (INR)</label>
                                    <input
                                        type="number"
                                        value={defaultShippingCharge}
                                        onChange={(e) => setDefaultShippingCharge(Number(e.target.value))}
                                        min="0"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 50"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Default charge applied when product has no specific shipping charge.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mb-8">
                    <button
                        type="submit"
                        disabled={isPaymentShipmentLoading}
                        className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isPaymentShipmentLoading ? "Saving..." : "Save Payment & Shipment Settings"}
                    </button>
                </div>
            </form>

            {/* Gold Price Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Gold Price Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">Configure gold price API and view current rates per karat</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gold Price API URL</label>
                            <input
                                type="text"
                                value={goldPriceApiUrl}
                                onChange={(e) => setGoldPriceApiUrl(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="https://www.goldapi.io/api/XAU/INR"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gold Price API Key</label>
                            <input
                                type="password"
                                value={goldPriceApiKey}
                                onChange={(e) => setGoldPriceApiKey(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your goldapi.io API key"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">24k Gold Price (per gram) — INR</label>
                            <input
                                type="number"
                                value={goldPricePerGram24k}
                                onChange={(e) => setGoldPricePerGram24k(Number(e.target.value))}
                                min="0"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 7500"
                            />
                        </div>
                        <div className="flex items-end gap-3">
                            <button
                                type="button"
                                onClick={async () => {
                                    setGoldPriceFetching(true);
                                    try {
                                        const res = await api.post(`${serverUrl}/api/gold-price/fetch`);
                                        const d = res.data;
                                        if (d.success) {
                                            setGoldPricePerGram24k(d.pricePerGram24k);
                                            toast.success(d.message);
                                        } else {
                                            toast.error(d.message || "Failed to fetch");
                                        }
                                    } catch (err) {
                                        toast.error(err?.response?.data?.message || "Failed to fetch gold price");
                                    } finally {
                                        setGoldPriceFetching(false);
                                    }
                                }}
                                disabled={goldPriceFetching}
                                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
                            >
                                {goldPriceFetching ? "Fetching..." : "Fetch Live Price"}
                            </button>
                        </div>
                    </div>
                    {goldPricePerGram24k > 0 && (
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Gold Rates per Gram</h4>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { karat: "24k", ratio: 1, color: "text-yellow-700 bg-yellow-50" },
                                    { karat: "22k", ratio: 22 / 24, color: "text-yellow-600 bg-yellow-50" },
                                    { karat: "18k", ratio: 18 / 24, color: "text-yellow-600 bg-yellow-50" },
                                    { karat: "14k", ratio: 14 / 24, color: "text-yellow-600 bg-yellow-50" },
                                ].map(({ karat, ratio, color }) => (
                                    <div key={karat} className={`p-4 rounded-lg text-center ${color}`}>
                                        <p className="text-lg font-bold">₹{Math.round(goldPricePerGram24k * ratio).toLocaleString('en-IN')}</p>
                                        <p className="text-xs font-medium mt-1">/gram</p>
                                        <p className="text-xs mt-1">{karat}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={async () => {
                                setGoldPriceSaving(true);
                                try {
                                    const res = await api.put(`${serverUrl}/api/setting/update-payment-shipment-settings`, {
                                        goldPriceApiUrl,
                                        goldPriceApiKey,
                                        goldPricePerGram24k,
                                    });
                                    if (res.data.success) {
                                        toast.success("Gold price settings saved successfully");
                                    } else {
                                        toast.error(res.data.message || "Failed to save");
                                    }
                                } catch (err) {
                                    toast.error(err?.response?.data?.message || "Failed to save gold price settings");
                                } finally {
                                    setGoldPriceSaving(false);
                                }
                            }}
                            disabled={goldPriceSaving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                        >
                            {goldPriceSaving ? "Saving..." : "Save Gold Price"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                </div>
                <div className="p-6">
                    <form
                        onSubmit={handlePasswordChange}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="flex flex-col relative">
                            <label className="text-sm font-medium mb-1">Old Password</label>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute inset-y-25 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                            >
                                {showOldPassword ? (
                                    <svg
                                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-col relative">
                            <label className="text-sm font-medium mb-1">New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-25 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                            >
                                {showNewPassword ? (
                                    <svg
                                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-col relative">
                            <label className="text-sm font-medium mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-25 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                            >
                                {showConfirmPassword ? (
                                    <svg
                                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="md:col-span-3 flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                {isLoading ? "Submitting..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Settings Categories */}
            {/* <div className="space-y-6">
                {settingsCategories.map((category, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                                    <span className={`text-${category.color}-600`}>
                                        {category.icon}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {category.title}
                                </h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {category.settings.map((setting, settingIndex) => (
                                    <div
                                        key={settingIndex}
                                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {setting.label}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Configure {setting.label.toLowerCase()}
                                            </p>
                                        </div>
                                        {renderSettingInput(setting)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}

            {/* Save Settings */}
            {/* <div className="mt-8 flex justify-end gap-4">
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Reset to Defaults
                </button>
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    Save Changes
                </button>
            </div> */}
        </div>
    );
};

export default Settings;
