import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: ""
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
    if (!form.role) {
      setError("Please select a role");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);
      
      // Auto-login after successful registration
      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      // Save token and user data
      localStorage.setItem("token", loginRes.data.token);
      const user = loginRes.data.user || { role: form.role, name: form.full_name };
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(true);
      
      // Navigate based on role after successful registration
      setTimeout(() => {
        if (user.role === "buyer") {
          navigate("/buyer-dashboard");
        } else if (user.role === "farmer") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
      
    } catch (err) {
      if (err.response?.data?.message === "Email already exists") {
        setError("This email is already registered");
      } else {
        setError(err.response?.data?.message || t("register.failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">{t("register.title")}</h2>
          <p className="mt-2 text-gray-600">{t("register.subtitle")}</p>
        </div>

        {/* Form */}
        <form
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-md"
          onSubmit={handleSubmit}
        >
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              Registration successful! Redirecting to your dashboard...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <InputField
              label={t("register.full_name")}
              placeholder={t("register.full_name_placeholder")}
              value={form.full_name}
              onChange={(value) => setForm({ ...form, full_name: value })}
            />

            {/* Email */}
            <InputField
              label={t("register.email")}
              type="email"
              placeholder={t("register.email_placeholder")}
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
            />

            {/* Phone */}
            <InputField
              label={t("register.phone")}
              type="tel"
              placeholder={t("register.phone_placeholder")}
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
            />

            {/* Password */}
            <InputField
              label={t("register.password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("register.password_placeholder")}
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              showToggle
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                {t("register.role")}
              </label>
              <select
                id="role"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select a role</option>
                <option value="farmer">{t("register.farmer")}</option>
                <option value="buyer">{t("register.buyer")}</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("register.submitting")}
              </span>
            ) : (
              t("register.submit")
            )}
          </button>

          {/* Already have account */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t("register.already_have")}{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {t("register.sign_in")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable InputField component
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

export default Register;
