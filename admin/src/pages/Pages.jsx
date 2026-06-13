import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    FaPlus, FaEdit, FaTrash, FaSearch, FaGlobe, FaQuestionCircle,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { serverUrl } from "../../config";
import api from "../api/axiosInstance";

const iconMap = {
    page: <FaGlobe className="text-blue-500" />,
    faq: <FaQuestionCircle className="text-purple-500" />,
};

const Pages = () => {
    const { token } = useSelector((state) => state.auth);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        metaDescription: "",
        type: "page",
        isActive: true,
        order: 0,
        faqs: [],
    });

    const fetchPages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`${serverUrl}/api/admin/pages`);
            const data = response.data;
            if (data.success) {
                setPages(data.pages);
            } else {
                toast.error(data.message || "Failed to fetch pages");
            }
        } catch (error) {
            console.error("Fetch pages error:", error);
            toast.error("Failed to fetch pages");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const openCreateModal = () => {
        setEditing(null);
        setFormData({
            title: "",
            slug: "",
            content: "",
            metaDescription: "",
            type: "page",
            isActive: true,
            order: 0,
            faqs: [],
        });
        setShowModal(true);
    };

    const openEditModal = (page) => {
        setEditing(page);
        setFormData({
            title: page.title || "",
            slug: page.slug || "",
            content: page.content || "",
            metaDescription: page.metaDescription || "",
            type: page.type || "page",
            isActive: page.isActive,
            order: page.order || 0,
            faqs: page.faqs || [],
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFaqChange = (index, field, value) => {
        const updated = [...formData.faqs];
        updated[index] = { ...updated[index], [field]: value };
        setFormData((prev) => ({ ...prev, faqs: updated }));
    };

    const addFaq = () => {
        setFormData((prev) => ({
            ...prev,
            faqs: [...prev.faqs, { question: "", answer: "", order: prev.faqs.length }],
        }));
    };

    const removeFaq = (index) => {
        setFormData((prev) => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.slug) {
            toast.error("Title and slug are required");
            return;
        }
        setSubmitting(true);
        try {
            const payload = { ...formData };
            if (formData.type !== "faq") {
                payload.faqs = [];
            }
            let response;
            if (editing) {
                response = await api.put(`${serverUrl}/api/admin/pages/${editing._id}`, payload);
            } else {
                response = await api.post(`${serverUrl}/api/admin/pages`, payload);
            }
            const data = response.data;
            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                fetchPages();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save page");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this page?")) return;
        try {
            const response = await api.delete(`${serverUrl}/api/admin/pages/${id}`);
            const data = response.data;
            if (data.success) {
                toast.success(data.message);
                fetchPages();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete page");
        }
    };

    const filteredPages = pages.filter(
        (p) =>
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
                    <p className="text-gray-600 mt-1">Manage dynamic pages, FAQ entries, and footer content</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <FaPlus /> Add Page
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {filteredPages.length === 0 ? (
                    <div className="p-12 text-center">
                        <FaGlobe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No pages found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPages.map((page) => (
                                    <tr key={page._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {iconMap[page.type] || iconMap.page}
                                                <span className="text-sm capitalize text-gray-600">{page.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">/{page.slug}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${page.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {page.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(page)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(page._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editing ? "Edit Page" : "Create New Page"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <IoMdClose className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none"
                                    >
                                        <option value="page">Page</option>
                                        <option value="faq">FAQ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                            slug: editing
                                                ? prev.slug
                                                : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                                        }));
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none"
                                    placeholder="Track Order"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none"
                                    placeholder="track-order"
                                />
                                <p className="text-xs text-gray-400 mt-1">URL: /{formData.slug || "slug"}</p>
                            </div>

                            {formData.type === "page" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            rows={12}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                                            placeholder="<h1>Track Your Order</h1><p>Enter your order number...</p>"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                        <textarea
                                            name="metaDescription"
                                            value={formData.metaDescription}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none"
                                            placeholder="SEO description..."
                                        />
                                    </div>
                                </>
                            )}

                            {formData.type === "faq" && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">FAQ Items</label>
                                        <button
                                            type="button"
                                            onClick={addFaq}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                                        >
                                            <FaPlus className="w-3 h-3" /> Add Question
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.faqs.map((faq, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-500">Q{idx + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFaq(idx)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Question"
                                                    value={faq.question}
                                                    onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-2 focus:ring-2 focus:ring-black outline-none"
                                                />
                                                <textarea
                                                    placeholder="Answer"
                                                    value={faq.answer}
                                                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : editing ? "Update Page" : "Create Page"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pages;
