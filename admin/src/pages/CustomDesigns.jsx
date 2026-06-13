import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Title from "../components/ui/title";
import SkeletonLoader from "../components/SkeletonLoader";
import { serverUrl } from "../../config";
import {
    FaEdit,
    FaSearch,
    FaUser,
    FaGem,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaSort,
    FaSync,
    FaEye,
    FaChevronLeft,
} from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import api from "../api/axiosInstance";

const statusOptions = ["pending", "approved", "rejected"];

const CustomDesigns = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [editingDesign, setEditingDesign] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [adminNotes, setAdminNotes] = useState("");
    const [viewingDesign, setViewingDesign] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${serverUrl}/api/custom-design/admin/all`);

            const result = response.data;
            if (result.success) {
                setDesigns(result.data);
            } else {
                toast.error(result.message || "Failed to fetch designs");
            }
        } catch (error) {
            console.error("Error fetching designs:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to load designs");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateDesignStatus = async (designId, status, notes = null) => {
        try {
            const updateData = { designId, status };

            if (notes) {
                updateData.adminNotes = notes;
            }

            const response = await api.put(`${serverUrl}/api/custom-design/admin/update-status`, updateData);

            const data = response.data;
            if (data.success) {
                setShowEditModal(false);
                setEditingDesign(null);
                setAdminNotes("");
                fetchDesigns();
                toast.success(data?.message);
            } else {
                toast.error(data.message || "Failed to update design");
            }
        } catch (error) {
            console.error("Error updating design--------->", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update design");
            }
        }
    };

    const handleEditDesign = (design) => {
        setEditingDesign(design);
        setNewStatus(design.status);
        setAdminNotes(design.adminNotes || "");
        setShowEditModal(true);
    };

    const handleViewDesign = (design) => {
        setViewingDesign(design);
        setShowViewModal(true);
    };

    const handleSaveChanges = () => {
        if (editingDesign) {
            updateDesignStatus(editingDesign._id, newStatus, adminNotes);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <FaClock className="w-3 h-3" />;
            case "approved":
                return <FaCheckCircle className="w-3 h-3" />;
            case "rejected":
                return <FaTimesCircle className="w-3 h-3" />;
            default:
                return <FaClock className="w-3 h-3" />;
        }
    };

    const filteredDesigns = designs
        .filter((d) => {
            const searchStr = searchTerm.toLowerCase();
            const matchesSearch =
                d._id.toLowerCase().includes(searchStr) ||
                d.jewelryType.toLowerCase().includes(searchStr) ||
                d.metal.toLowerCase().includes(searchStr) ||
                d.diamondShape.toLowerCase().includes(searchStr) ||
                d.userId?.name?.toLowerCase().includes(searchStr) ||
                d.userId?.email?.toLowerCase().includes(searchStr);

            const matchesStatus = statusFilter === "all" || d.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "date":
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case "status":
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case "type":
                    aValue = a.jewelryType;
                    bValue = b.jewelryType;
                    break;
                default:
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    useEffect(() => {
        fetchDesigns();
    }, []);

    if (loading) {
        return (
            <div>
                <Title>Custom Designs</Title>
                <div className="mt-6">
                    <SkeletonLoader type="contacts" />
                </div>
            </div>
        );
    }

    const getPreviewImage = (type) => {
        const images = {
            'Engagement Ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop',
            'Wedding Band': 'https://images.unsplash.com/photo-1590611936760-eeb6bc40aa21?w=200&h=200&fit=crop',
            'Necklace': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop',
            'Pendant': 'https://images.unsplash.com/photo-1611652022419-a9410f7433c2?w=200&h=200&fit=crop',
            'Earrings': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=200&h=200&fit=crop',
            'Bracelet': 'https://images.unsplash.com/photo-1573408301185-914d0f2a0f50?w=200&h=200&fit=crop',
        };
        return images[type] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <Title>Custom Designs</Title>
                <button
                    onClick={fetchDesigns}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    title="Refresh Designs"
                >
                    <FaSync className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Total Designs</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{designs.length}</p>
                        </div>
                        <MdDesignServices className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-xl lg:text-2xl font-bold text-yellow-600">
                                {designs.filter((d) => d.status === "pending").length}
                            </p>
                        </div>
                        <FaClock className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Approved</p>
                            <p className="text-xl lg:text-2xl font-bold text-green-600">
                                {designs.filter((d) => d.status === "approved").length}
                            </p>
                        </div>
                        <FaCheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Rejected</p>
                            <p className="text-xl lg:text-2xl font-bold text-red-600">
                                {designs.filter((d) => d.status === "rejected").length}
                            </p>
                        </div>
                        <FaTimesCircle className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative sm:col-span-2 lg:col-span-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search designs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="all">All Status</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="status">Sort by Status</option>
                            <option value="type">Sort by Type</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                        >
                            <FaSort className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDesigns.map((design) => (
                                <tr key={design._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            #{design._id.slice(-8).toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <FaUser className="w-4 h-4 text-gray-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {design.userId?.name || "N/A"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {design.userId?.email || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={getPreviewImage(design.jewelryType)}
                                                alt={design.jewelryType}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <span className="text-sm font-medium text-gray-900">{design.jewelryType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            <span className="block">{design.metal}</span>
                                            <span className="block text-gray-500">{design.diamondShape} | {design.caratSize}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(design.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(design.status)}`}>
                                            {getStatusIcon(design.status)}
                                            {design.status.charAt(0).toUpperCase() + design.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleViewDesign(design)}
                                                className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                title="View Design"
                                            >
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditDesign(design)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                title="Update Status"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDesigns.length === 0 && (
                    <div className="text-center py-12">
                        <MdDesignServices className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Designs Found</h3>
                        <p className="text-gray-500">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "No custom design requests yet"}
                        </p>
                    </div>
                )}
            </div>

            {/* Cards - Mobile/Tablet */}
            <div className="lg:hidden space-y-4">
                {filteredDesigns.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <MdDesignServices className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Designs Found</h3>
                        <p className="text-gray-500">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "No custom design requests yet"}
                        </p>
                    </div>
                ) : (
                    filteredDesigns.map((design) => (
                        <div key={design._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={getPreviewImage(design.jewelryType)}
                                        alt={design.jewelryType}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            #{design._id.slice(-8).toUpperCase()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {design.userId?.name || "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleViewDesign(design)}
                                        className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50"
                                        title="View Design"
                                    >
                                        <FaEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEditDesign(design)}
                                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                                        title="Update Status"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <div className="text-xs text-gray-500">Type</div>
                                    <div className="text-sm font-medium text-gray-900">{design.jewelryType}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Metal</div>
                                    <div className="text-sm font-medium text-gray-900">{design.metal}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Diamond</div>
                                    <div className="text-sm font-medium text-gray-900">{design.diamondShape}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Carat</div>
                                    <div className="text-sm font-medium text-gray-900">{design.caratSize}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(design.status)}`}>
                                    {getStatusIcon(design.status)}
                                    {design.status.charAt(0).toUpperCase() + design.status.slice(1)}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(design.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* View Modal */}
            {showViewModal && viewingDesign && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                    <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <FaChevronLeft
                                    className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600"
                                    onClick={() => { setShowViewModal(false); setViewingDesign(null); }}
                                />
                                Design #{viewingDesign._id.slice(-8).toUpperCase()}
                            </h3>
                            <button
                                onClick={() => { setShowViewModal(false); setViewingDesign(null); }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <FaTimesCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={getPreviewImage(viewingDesign.jewelryType)}
                                    alt={viewingDesign.jewelryType}
                                    className="w-full rounded-lg object-cover h-64"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 block">Customer</label>
                                    <p className="font-medium">{viewingDesign.userId?.name || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{viewingDesign.userId?.email || "N/A"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 block">Jewelry Type</label>
                                        <p className="font-medium flex items-center gap-1"><FaGem className="text-gold-500 w-3 h-3" /> {viewingDesign.jewelryType}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Metal</label>
                                        <p className="font-medium">{viewingDesign.metal}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Diamond Shape</label>
                                        <p className="font-medium">{viewingDesign.diamondShape}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Carat Size</label>
                                        <p className="font-medium">{viewingDesign.caratSize}</p>
                                    </div>
                                </div>
                                {viewingDesign.description && (
                                    <div>
                                        <label className="text-xs text-gray-500 block">Customer Notes</label>
                                        <p className="text-sm text-gray-700">{viewingDesign.description}</p>
                                    </div>
                                )}
                                {viewingDesign.adminNotes && (
                                    <div>
                                        <label className="text-xs text-gray-500 block">Admin Notes</label>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{viewingDesign.adminNotes}</p>
                                    </div>
                                )}
                                <div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewingDesign.status)}`}>
                                        {getStatusIcon(viewingDesign.status)}
                                        {viewingDesign.status.charAt(0).toUpperCase() + viewingDesign.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Status Modal */}
            {showEditModal && editingDesign && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
                    <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Update Design Status</h3>
                                <button
                                    onClick={() => { setShowEditModal(false); setEditingDesign(null); }}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <FaTimesCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        src={getPreviewImage(editingDesign.jewelryType)}
                                        alt={editingDesign.jewelryType}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Design #{editingDesign._id.slice(-8).toUpperCase()}</div>
                                        <div className="text-xs text-gray-500">{editingDesign.jewelryType} - {editingDesign.userId?.name || "N/A"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Notes {newStatus === "rejected" && <span className="text-red-500">*</span>}
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder={newStatus === "rejected" ? "Provide reason for rejection..." : "Add notes (optional)..."}
                                    className="w-full border p-3 rounded-md bg-white outline-none h-32 resize-none"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={newStatus === "rejected" && !adminNotes.trim()}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => { setShowEditModal(false); setEditingDesign(null); }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDesigns;
