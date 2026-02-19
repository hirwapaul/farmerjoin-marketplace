import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import FarmerProfile from "./pages/FarmerProfile";
import SubscriptionBoxes from "./pages/SubscriptionBoxes";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/farmer/:farmerId" element={<FarmerProfile />} />
              <Route path="/subscription-boxes" element={<SubscriptionBoxes />} />

              {/* Buyer Dashboard (protected) */}
              <Route
                path="/buyer-dashboard"
                element={
                  <ProtectedRoute role="buyer">
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin/Farmer Dashboard (protected, role optional) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="farmer">
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Edit Product (protected for farmers) */}
              <Route
                path="/edit-product/:productId"
                element={
                  <ProtectedRoute role="farmer">
                    <EditProduct />
                  </ProtectedRoute>
                }
              />

              {/* Orders (protected for buyers) */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute role="buyer">
                    <Orders />
                  </ProtectedRoute>
                }
              />

              {/* Add Product (protected for farmers/admins) */}
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute role="farmer">
                    <AddProduct />
                  </ProtectedRoute>
                }
              />

              {/* Fallback: redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />}
              />
              
              {/* Auth Redirect for direct access */}
              <Route path="/auth-redirect" element={<AuthRedirect />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
