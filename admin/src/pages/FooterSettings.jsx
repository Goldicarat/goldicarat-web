import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLink } from "react-icons/fa";
import { serverUrl } from "../../config";
import api from "../api/axiosInstance";

const socialIcons = [
    { value: "facebook", label: "Facebook", icon: <FaFacebook /> },
    { value: "instagram", label: "Instagram", icon: <FaInstagram /> },
    { value: "twitter", label: "Twitter", icon: <FaTwitter /> },
    { value: "youtube", label: "Youtube", icon: <FaYoutube /> },
];

const FooterSettings = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [socialLinks, setSocialLinks] = useState([]);
    const [customerServiceLinks, setCustomerServiceLinks] = useState([]);
    const [bottomLinks, setBottomLinks] = useState([]);

    const fetchFooterLinks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`${serverUrl}/api/setting/list`);
            const data = response.data;
            if (data.success && data.setting.footerLinks) {
                setSocialLinks(data.setting.footerLinks.social || []);
                setCustomerServiceLinks(data.setting.footerLinks.customerService || []);
                setBottomLinks(data.setting.footerLinks.bottomLinks || []);
            }
        } catch (error) {
            console.error("Fetch footer links error:", error);
            toast.error("Failed to load footer settings");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFooterLinks();
    }, [fetchFooterLinks]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put(`${serverUrl}/api/setting/update-footer-links`, {
                social: socialLinks,
                customerService: customerServiceLinks,
                bottomLinks,
            });
            const data = response.data;
            if (data.success) {
                toast.success("Footer links updated successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update footer links");
        } finally {
            setSaving(false);
        }
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: "facebook", icon: "facebook", url: "#", isActive: true, order: socialLinks.length }]);
    };

    const updateSocialLink = (index, field, value) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        if (field === "platform") {
            updated[index].icon = value;
        }
        setSocialLinks(updated);
    };

    const removeSocialLink = (index) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const addServiceLink = () => {
        setCustomerServiceLinks([...customerServiceLinks, { label: "", url: "#", isActive: true, order: customerServiceLinks.length }]);
    };

    const updateServiceLink = (index, field, value) => {
        const updated = [...customerServiceLinks];
        updated[index] = { ...updated[index], [field]: value };
        setCustomerServiceLinks(updated);
    };

    const removeServiceLink = (index) => {
        setCustomerServiceLinks(customerServiceLinks.filter((_, i) => i !== index));
    };

    const addBottomLink = () => {
        setBottomLinks([...bottomLinks, { label: "", url: "#", isActive: true, order: bottomLinks.length }]);
    };

    const updateBottomLink = (index, field, value) => {
        const updated = [...bottomLinks];
        updated[index] = { ...updated[index], [field]: value };
        setBottomLinks(updated);
    };

    const removeBottomLink = (index) => {
        setBottomLinks(bottomLinks.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Footer Settings</h1>
                <p className="text-gray-600 mt-1">Manage social icons, customer service links, and bottom links</p>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                    <button
                        type="button"
                        onClick={addSocialLink}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                        <FaPlus className="w-3 h-3" /> Add Social
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {socialLinks.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No social links added yet</p>
                    ) : (
                        socialLinks.map((link, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Platform</label>
                                    <select
                                        value={link.platform}
                                        onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                    >
                                        {socialIcons.map((si) => (
                                            <option key={si.value} value={si.value}>{si.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500">URL</label>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                        placeholder="https://facebook.com/goldicarat"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Active</label>
                                    <select
                                        value={link.isActive.toString()}
                                        onChange={(e) => updateSocialLink(index, "isActive", e.target.value === "true")}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSocialLink(index)}
                                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 mt-1"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Customer Service Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Service Links</h3>
                    <button
                        type="button"
                        onClick={addServiceLink}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                        <FaPlus className="w-3 h-3" /> Add Link
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {customerServiceLinks.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No customer service links added yet</p>
                    ) : (
                        customerServiceLinks.map((link, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500">Label</label>
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateServiceLink(index, "label", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                        placeholder="Track Order"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500">URL</label>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateServiceLink(index, "url", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                        placeholder="/track-order or https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Active</label>
                                    <select
                                        value={link.isActive.toString()}
                                        onChange={(e) => updateServiceLink(index, "isActive", e.target.value === "true")}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="col-span-4"></div>
                                <button
                                    type="button"
                                    onClick={() => removeServiceLink(index)}
                                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bottom Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Bottom Legal Links</h3>
                    <button
                        type="button"
                        onClick={addBottomLink}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                        <FaPlus className="w-3 h-3" /> Add Link
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {bottomLinks.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No bottom links added yet</p>
                    ) : (
                        bottomLinks.map((link, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500">Label</label>
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateBottomLink(index, "label", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                        placeholder="Privacy Policy"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500">URL</label>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateBottomLink(index, "url", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                        placeholder="/privacy-policy"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Active</label>
                                    <select
                                        value={link.isActive.toString()}
                                        onChange={(e) => updateBottomLink(index, "isActive", e.target.value === "true")}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-black outline-none"
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="col-span-4"></div>
                                <button
                                    type="button"
                                    onClick={() => removeBottomLink(index)}
                                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Footer Settings"}
                </button>
            </div>
        </div>
    );
};

export default FooterSettings;
