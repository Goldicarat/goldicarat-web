import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { serverUrl } from "../../config";

const ImageUpload = ({ value, onChange, label, className }) => {
    const [preview, setPreview] = useState(value || "");
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setPreview(value || "");
    }, [value]);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const token = localStorage.getItem("token");
            const res = await fetch(`${serverUrl}/api/upload/image`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                onChange(data.url);
                setPreview(data.url);
                toast.success("Image uploaded");
            } else {
                toast.error(data.message || "Upload failed");
                setPreview(value || "");
            }
        } catch (err) {
            console.error("Image upload error:", err);
            toast.error("Failed to upload image");
            setPreview(value || "");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        onChange(url);
        if (url) setPreview(url);
    };

    return (
        <div className={`flex flex-col ${className || ""}`}>
            <label className="text-sm font-medium mb-1">{label || "Image"}</label>
            <div className="flex gap-3 items-start">
                <div className="flex-1">
                    <input
                        type="text"
                        value={value || ""}
                        onChange={handleUrlChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <label className="cursor-pointer">
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <span className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 border border-gray-300">
                            {uploading ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                            )}
                            {uploading ? "Uploading..." : "Upload"}
                        </span>
                    </label>
                </div>
            </div>
            {preview && (
                <div className="mt-2 relative w-full max-w-xs">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                        onError={() => setPreview("")}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
