// src/pages/BuyerDashboard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function BuyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchBuyerData(parsedUser.id, token);
  }, []);

  const fetchBuyerData = async (buyerId, token) => {
    try {
      // Fetch only this buyer's orders
      const res = await API.get(`/orders/buyer/${buyerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orders = res.data || [];

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const deliveredOrders = orders.filter(
        o => o.status === "delivered" || o.status === "completed"
      ).length;
      const totalSpent = orders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );

      setStats({ totalOrders, pendingOrders, deliveredOrders, totalSpent });

      // Show latest 5 orders
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Error fetching buyer data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || "Buyer"}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your orders and browse fresh products from farmers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} color="blue" />
          <StatCard title="Total Spent" value={`$${stats.totalSpent.toFixed(2)}`} color="green" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} color="yellow" />
          <StatCard title="Delivered Orders" value={stats.deliveredOrders} color="purple" />
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/products"
                className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/orders"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                My Orders
              </Link>
              <Link
                to="/"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Purchases</h2>
              <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No recent purchases</p>
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">#{order.order_id}</td>
                        <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link
                            to={`/orders/${order.order_id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View
                          </Link>
                          <Link
                            to="/products"
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            Buy Again
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Browse Products Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Fresh Products Await!</h3>
              <p className="text-primary-100">Browse our collection of fresh produce directly from farmers</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Continue Shopping Button */}
      <Link
        to="/products"
        className="fixed bottom-6 right-6 bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

// Reusable Stat Card Component
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <span className="font-bold text-lg">{title[0]}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
