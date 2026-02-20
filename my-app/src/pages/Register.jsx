import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer" // Only allow buyer registration for public
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-hide messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Client-side validation
    if (!form.full_name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Invalid email address");
      return;
    }
    if (!form.phone.trim() || form.phone.length < 6) {
      setError("Invalid phone number");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);
      
      // Show success message - don't auto-login
      setSuccess(true);
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      if (err.response?.data?.message === "Email already exists") {
        setError("This email is already registered");
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  function InputField({ label, placeholder, type = "text", value, onChange, showToggle = false, showPassword, setShowPassword }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11.8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7.7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4 tracking-tight">Create Account</h2>
          <p className="text-lg text-gray-600 font-secondary leading-relaxed">Join our agricultural marketplace</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                Registration successful! Redirecting to login...
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <InputField 
                label="Full Name" 
                placeholder="Enter your full name" 
                value={form.full_name} 
                onChange={(value) => setForm({ ...form, full_name: value })} 
              />
              <InputField 
                label="Email Address" 
                placeholder="Enter your email" 
                type="email" 
                value={form.email} 
                onChange={(value) => setForm({ ...form, email: value })} 
              />
              <InputField 
                label="Phone Number" 
                placeholder="Enter your phone number" 
                type="tel" 
                value={form.phone} 
                onChange={(value) => setForm({ ...form, phone: value })} 
              />
              
              <InputField 
                label="Password" 
                placeholder="Enter your password" 
                type={showPassword ? "text" : "password"} 
                value={form.password} 
                onChange={(value) => setForm({ ...form, password: value })} 
                showToggle={true} 
                showPassword={showPassword} 
                setShowPassword={setShowPassword} 
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-xl text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-ui"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-ui">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
