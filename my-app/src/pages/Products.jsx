import { useEffect, useState, useMemo } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import AdvancedFilters from "../components/AdvancedFilters";
import { useDebounce } from "../hooks/useDebounce";
import LocationSearch from "../components/LocationSearch";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // UI controls
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("relevance");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const [userLocation, setUserLocation] = useState(null);
    
    // Advanced filters
    const [advancedFilters, setAdvancedFilters] = useState({
        categories: [],
        productType: [],
        rating: [],
        inStockOnly: false
    });
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    
    // Debounced search
    const debouncedSearch = useDebounce(search, 300);

    // Fetch products
    useEffect(() => {
        API.get("/products")
            .then(res => {
                setProducts(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    // Categories list
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return ["all", ...cats];
    }, [products]);

    // Filter + sort logic
    const filteredProducts = useMemo(() => {
        let data = [...products];

        // Search functionality (enhanced)
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            data = data.filter(p => 
                p.product_name?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower) ||
                p.farmer_name?.toLowerCase().includes(searchLower) ||
                p.category?.toLowerCase().includes(searchLower)
            );
        }

        // Category filter
        if (category !== "all") {
            data = data.filter(p => p.category === category);
        }
        
        // Advanced filters
        if (advancedFilters.categories.length > 0) {
            data = data.filter(p => advancedFilters.categories.includes(p.category));
        }
        
        if (advancedFilters.productType.length > 0) {
            data = data.filter(p => 
                advancedFilters.productType.some(type => 
                    p.product_tags?.includes(type.toLowerCase())
                )
            );
        }
        
        if (advancedFilters.rating.length > 0) {
            const minRating = Math.max(...advancedFilters.rating.map(r => parseInt(r)));
            data = data.filter(p => (p.rating || 0) >= minRating);
        }
        
        if (advancedFilters.inStockOnly) {
            data = data.filter(p => (p.stock_quantity || 0) > 0);
        }
        
        // Price range filter
        data = data.filter(p => 
            p.price >= priceRange.min && p.price <= priceRange.max
        );
        
        // Location-based filter (if location is set)
        if (userLocation && userLocation.lat) {
            data = data.filter(p => {
                if (!p.farmer_lat || !p.farmer_lng) return true;
                const distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    p.farmer_lat, p.farmer_lng
                );
                return distance <= 50; // Show farmers within 50 miles
            }).map(p => ({
                ...p,
                distance: p.farmer_lat && p.farmer_lng ? 
                    calculateDistance(userLocation.lat, userLocation.lng, p.farmer_lat, p.farmer_lng) : 
                    null
            }));
        }

        // Sorting
        switch (sort) {
            case "price-low":
                data.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                data.sort((a, b) => b.price - a.price);
                break;
            case "name":
                data.sort((a, b) => a.product_name.localeCompare(b.product_name));
                break;
            case "rating":
                data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "newest":
                data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
                break;
            case "distance":
                if (userLocation) {
                    data.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
                }
                break;
            case "relevance":
            default:
                if (debouncedSearch) {
                    // Simple relevance scoring
                    data.sort((a, b) => {
                        const aScore = (a.product_name?.toLowerCase().includes(searchLower) ? 3 : 0) +
                                      (a.description?.toLowerCase().includes(searchLower) ? 2 : 0) +
                                      (a.farmer_name?.toLowerCase().includes(searchLower) ? 1 : 0);
                        const bScore = (b.product_name?.toLowerCase().includes(searchLower) ? 3 : 0) +
                                      (b.description?.toLowerCase().includes(searchLower) ? 2 : 0) +
                                      (b.farmer_name?.toLowerCase().includes(searchLower) ? 1 : 0);
                        return bScore - aScore;
                    });
                }
                break;
        }

        return data;
    }, [products, debouncedSearch, category, sort, advancedFilters, priceRange]);
    
    // Pagination
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredProducts.slice(startIndex, startIndex + productsPerPage);
    }, [filteredProducts, currentPage]);
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Helper function to calculate distance
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Add to cart
    const handleAddToCart = (product) => {
        const cartProduct = {
            id: product.product_id,
            name: product.product_name,
            price: product.price,
            image: product.image,
            farmerName: product.farmer_name,
            unit: product.unit
        };
        
        addToCart(cartProduct);
    };
    
    // Filter handlers
    const handleFilterChange = (filterType, value) => {
        setAdvancedFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };
    
    const handleClearFilters = () => {
        setAdvancedFilters({
            categories: [],
            productType: [],
            rating: [],
            inStockOnly: false
        });
        setPriceRange({ min: 0, max: 1000 });
        setCurrentPage(1);
    };
    
    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
        setCurrentPage(1);
    };
    
    const handleLocationSelect = (location) => {
        setUserLocation(location);
        setCurrentPage(1);
    };

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
                <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 py-10">

            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Marketplace Products
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Search, filter and buy fresh farmer products
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredProducts.length} products found
                    </p>
                </div>

                {/* Advanced Filters */}
                <AdvancedFilters
                    categories={categories.filter(c => c !== "all")}
                    filters={advancedFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    priceRange={priceRange}
                    onPriceRangeChange={handlePriceRangeChange}
                />

                {/* Controls */}
                <div className="grid md:grid-cols-5 gap-4 mb-10 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg">

                    <div className="md:col-span-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products, farmers, categories..."
                                className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <LocationSearch
                        onLocationSelect={handleLocationSelect}
                        placeholder="Find local farmers..."
                    />

                    <select
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>
                                {c === "all" ? "All Categories" : c}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="relevance">Sort by Relevance</option>
                        <option value="distance" disabled={!userLocation}>Nearest First</option>
                        <option value="price-low">Price Low → High</option>
                        <option value="price-high">Price High → Low</option>
                        <option value="name">Name A → Z</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                    </select>

                </div>
                
                {/* View Mode Toggle */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded ${viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length}
                    </div>
                </div>

                {/* Products */}
                {paginatedProducts.length === 0 ? (

                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                        <button
                            onClick={handleClearFilters}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>

                ) : (
                    <>
                        {/* Grid/List View */}
                        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-4"}>

                            {paginatedProducts.map(p => (

                                <div
                                    key={p.product_id}
                                    className={viewMode === "grid" 
                                        ? "bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden"
                                        : "bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex items-center space-x-4"
                                    }
                                >

                                    {/* Image */}
                                    <div className={viewMode === "grid" ? "h-48 overflow-hidden" : "w-24 h-24 overflow-hidden flex-shrink-0 rounded-lg"}>
                                        <img
                                            src={p.image ? `http://localhost:5000/${p.image}` : "/images/placeholder.jpg"}
                                            alt={p.product_name}
                                            className={`w-full h-full object-cover ${viewMode === "grid" ? "hover:scale-110" : ""} transition duration-500`}
                                            onError={(e) => {
                                                e.target.src = "/images/placeholder.jpg";
                                            }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className={viewMode === "grid" ? "p-5" : "flex-grow"}>

                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-semibold text-gray-800 ${viewMode === "grid" ? "text-lg" : "text-base"}`}>
                                                {p.product_name}
                                            </h3>
                                            {p.rating && (
                                                <div className="flex items-center text-sm text-yellow-500">
                                                    <span>{'★'.repeat(Math.floor(p.rating))}</span>
                                                    <span className="text-gray-400 ml-1">{p.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-green-600 font-bold mt-1 text-lg">
                                            ${p.price}
                                            <span className="text-sm text-gray-500 font-normal">/{p.unit || 'unit'}</span>
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Farmer: {p.full_name}
                                            {p.distance && (
                                                <span className="ml-2 text-green-600">
                                                    ({p.distance.toFixed(1)} miles away)
                                                </span>
                                            )}
                                        </p>
                                        
                                        {p.description && viewMode === "list" && (
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {p.description}
                                            </p>
                                        )}
                                        
                                        {/* Stock Status */}
                                        {(p.stock_quantity !== undefined) && (
                                            <div className="mt-2">
                                                {p.stock_quantity > 0 ? (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        In Stock ({p.stock_quantity} available)
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className={`flex gap-2 mt-5 ${viewMode === "list" ? "flex-shrink-0" : ""}`}>

                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                disabled={p.stock_quantity === 0}
                                                className={`flex-1 ${p.stock_quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-2 rounded-lg transition`}
                                            >
                                                {p.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>

                                            <Link
                                                to={`/farmer/${p.farmer_id}`}
                                                className="flex-1 text-center border py-2 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                View Farm
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    const isCurrentPage = page === currentPage;
                                    const isNearCurrent = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                                    
                                    if (!isNearCurrent && page !== 1 && page !== totalPages) {
                                        if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="px-2">...</span>;
                                        }
                                        return null;
                                    }
                                    
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg ${isCurrentPage ? 'bg-green-600 text-white' : 'border hover:bg-gray-50'}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>

                )}

            </div>

        </div>
    );
}

export default Products;
