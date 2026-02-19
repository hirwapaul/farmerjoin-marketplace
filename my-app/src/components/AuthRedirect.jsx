import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      // User is logged in, redirect to appropriate dashboard
      if (user.role === "buyer") {
        navigate("/buyer-dashboard");
      } else if (user.role === "farmer") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      // User is not logged in, redirect to home
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full"></div>
    </div>
  );
};

export default AuthRedirect;
