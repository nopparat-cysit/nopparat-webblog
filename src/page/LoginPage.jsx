import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Toast from "../common/Toast";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear login error when user starts typing
    if (isLoginError) {
      setIsLoginError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {
      email: formData.email.trim() ? "" : "Email is required",
      password: formData.password ? "" : "Password is required",
    };

    setErrors(newErrors);

    // Check if there are validation errors
    const hasValidationErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasValidationErrors) {
      return;
    }

    // TODO: Replace with actual API call
    // Simulate login failure for demo
    // Reset form data
    setFormData({
      email: "",
      password: "",
    });
    
    // Clear errors
    setErrors({
      email: "",
      password: "",
    });
    
    // Set login error to show red border
    setIsLoginError(true);
    
    // Show toast notification
    setShowToast(true);
    
    // Auto hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-4 py-3 bg-white border rounded-lg text-body-1 placeholder:text-brown-400 focus:outline-none focus:ring-2 transition-all duration-300";

    // Show red border if there's a validation error or login error
    if (errors[fieldName] || isLoginError) {
      return `${baseClass} border-red-400 text-red-500 focus:ring-red-300`;
    }
    return `${baseClass} border-brown-300 text-brown-600 focus:ring-brown-400`;
  };

  return (
    <div className="min-h-screen bg-brown-200">
      <NavBar />

      <main className="flex items-center justify-center px-4 py-12 md:py-20">
        <div className="bg-brown-100 rounded-[16px] p-8 md:p-12 w-full max-w-[640px]">
          <h1 className="text-headline-2 text-brown-600 font-semibold text-center mb-8">
            Log in
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div>
              <label className="block text-body-2 text-brown-500 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={getInputClassName("email")}
              />
              {errors.email && errors.email !== "" && (
                <p className="text-red-500 text-body-2 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-body-2 text-brown-500 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={getInputClassName("password")}
              />
              {errors.password && errors.password !== "" && (
                <p className="text-red-500 text-body-2 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-12 py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300"
              >
                Log in
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-body-2 text-brown-400 text-center mt-6">
            Don't have any account?{" "}
            <Link to="/signup" className="text-brown-600 font-medium underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        type="error"
        title="Please check your email or password"
        message="The email or password you entered is incorrect. Please try again."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default LoginPage;
