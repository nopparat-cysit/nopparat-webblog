import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Check, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Loading } from "@/common/Loading";

function SignUpPage() {
  const navigate = useNavigate();
  const [isLoading , setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
 console.log(formData);
 
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  // เรียก API เช็ค username ซ้ำ (client-side validation ก่อน submit)
  const checkUsernameTaken = async (username) => {
    if (!username || !username.trim()) return false;
    try {
      const { data } = await axios.get(
        `${apiBase}/api/signup/check?username=${encodeURIComponent(username.trim())}`
      );
      return data.usernameTaken === true;
    } catch {
      return false;
    }
  };

  const SignUp = async () => {
    try {
      const payload = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
      await axios.post(`${apiBase}/api/signup`, payload);
      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      const message =
        data?.error ?? data?.message ?? (data && JSON.stringify(data)) ?? error.message ?? "Unknown error";
      let field = null;
      if (message.includes("username") && message.toLowerCase().includes("taken")) field = "username";
      else if (message.includes("email") && (message.includes("exists") || message.includes("already"))) field = "email";
      return { success: false, field, message };
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        return "";
      case "username":
        if (!value.trim()) return "Username is required";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Email must be a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUsernameBlur = async () => {
    const u = formData.username.trim();
    if (!u) return;
    const taken = await checkUsernameTaken(u);
    setErrors((prev) => ({ ...prev, username: taken ? "This username is already taken" : "" }));
    setTouched((prev) => ({ ...prev, username: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let newErrors = {
      name: validateField("name", formData.name),
      username: validateField("username", formData.username),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    const usernameTaken = await checkUsernameTaken(formData.username.trim());
    if (usernameTaken) newErrors = { ...newErrors, username: "This username is already taken" };

    setErrors(newErrors);
    setTouched({
      name: true,
      username: true,
      email: true,
      password: true,
    });

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      const result = await SignUp();
      if (result.success) {
        setShowSuccess(true);
      } else {
        if (result.field) setErrors((prev) => ({ ...prev, [result.field]: result.message }));
        else alert(`Signup failed: ${result.message}`);
      }
    }
    setIsLoading(false);
  };

  const backTo = sessionStorage.getItem('prevPath') || '/';
  const successBtn = () => {
    navigate(backTo);
    sessionStorage.removeItem('prevPath');
  }

  const getInputClassName = (fieldName, hasRightPadding = false) => {
    const baseClass =
      "w-full px-4 py-3 bg-white border rounded-lg text-body-1 placeholder:text-brown-400 focus:outline-none focus:ring-2 transition-all duration-300" +
      (hasRightPadding ? " pr-12" : "");

    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-400 text-red-500 focus:ring-red-300`;
    }
    return `${baseClass} border-brown-300 text-brown-600 focus:ring-brown-400`;
  };

  return (
    <div className="min-h-screen bg-brown-200">
      <NavBar />
      {isLoading ? <Loading /> : <main className="flex items-center justify-center px-4 py-12 md:py-20">
        <div className="bg-brown-100 rounded-[16px] p-8 md:p-12 w-full max-w-[640px]">
          {showSuccess ? (
            // ข้อความสำเร็จ
            <div className="flex flex-col items-center text-center">
              {/* ไอคอนสำเร็จ */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
              </div>

              {/* ข้อความสำเร็จ */}
              <h2 className="text-headline-3 md:text-headline-2 text-brown-600 font-semibold mb-8">
                Registration success
              </h2>

              {/* ปุ่มดำเนินการต่อ */}
              <button
                onClick={successBtn}
                className="px-12 py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-headline-2 text-brown-600 font-semibold text-center mb-8">
                Sign up
              </h1>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* ชื่อ */}
            <div>
              <label className="block text-body-2 text-brown-500 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className={getInputClassName("name")}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-body-2 mt-1">{errors.name}</p>
              )}
            </div>

            {/* ชื่อผู้ใช้ */}
            <div>
              <label className="block text-body-2 text-brown-500 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleUsernameBlur}
                placeholder="Username"
                className={getInputClassName("username")}
              />
              {errors.username && touched.username && (
                <p className="text-red-500 text-body-2 mt-1">{errors.username}</p>
              )}
            </div>

            {/* อีเมล */}
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
              {errors.email && touched.email && (
                <p className="text-red-500 text-body-2 mt-1">{errors.email}</p>
              )}
            </div>

            {/* รหัสผ่าน */}
            <div>
              <label className="block text-body-2 text-brown-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={getInputClassName("password", true)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-body-2 mt-1">{errors.password}</p>
              )}
            </div>

            {/* ปุ่มส่งข้อมูล */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-12 py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300"
              >
                Sign up
              </button>
            </div>
          </form>

              {/* ลิงก์เข้าสู่ระบบ */}
              <p className="text-body-2 text-brown-400 text-center mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-brown-600 font-medium underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>}
      
    </div>
  );
}

export default SignUpPage;
