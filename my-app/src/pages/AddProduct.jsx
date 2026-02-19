import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function AddProduct() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        product_name: "",
        category: "",
        price: "",
        quantity: "",
        image: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const categories = [
        "Vegetables",
        "Fruits",
        "Grains",
        "Dairy",
        "Livestock",
        "Other"
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const formData = new FormData();
            formData.append('product_name', product.product_name);
            formData.append('category', product.category);
            formData.append('price', product.price);
            formData.append('quantity', product.quantity);
            
            if (selectedFile) {
                formData.append('image', selectedFile);
            } else if (product.image) {
                formData.append('image_url', product.image);
            }
            
            await API.post("/products/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setTimeout(() => {
                navigate("/products");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Add New Product
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Fill in the details to list your product
                    </p>
                </div>

                {/* Form */}
                <form className="bg-white p-8 rounded-xl shadow-md" onSubmit={handleSubmit}>
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-6">
                            Product added successfully! Redirecting to products...
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name *
                            </label>
                            <input
                                id="product_name"
                                type="text"
                                placeholder="Enter product name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={product.product_name}
                                onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                id="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={product.category}
                                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($) *
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity *
                                </label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={product.quantity}
                                    onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Photo *
                            </label>
                            
                            {/* Preview */}
                            {preview && (
                                <div className="mb-4">
                                    <img 
                                        src={preview} 
                                        alt="Product preview" 
                                        className="h-32 w-32 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                            
                            {/* File Input */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Upload from device</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Enter image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        value={product.image}
                                        onChange={(e) => setProduct({ ...product, image: e.target.value })}
                                        disabled={!!selectedFile}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding product...
                                </span>
                            ) : (
                                "Add Product"
                            )}
                        </button>
                        
                        <Link
                            to="/products"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
