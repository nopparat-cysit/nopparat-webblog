import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Check } from "lucide-react";

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลทั้งหมด
    const newErrors = {
      name: validateField("name", formData.name),
      username: validateField("username", formData.username),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      username: true,
      email: true,
      password: true,
    });

    // ตรวจสอบว่ามี error หรือไม่
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      console.log("Form submitted:", formData);
      // TODO: แทนที่ด้วยการเรียก API จริง
      // จำลองการสมัครสมาชิกสำเร็จ
      setRole('user')
      // เก็บ role ใน sessionStorage เพื่อให้ NavBar อ่านได้
      sessionStorage.setItem('userRole', 'user');
      setShowSuccess(true);
    }
  };

  const backTo = sessionStorage.getItem('prevPath') || '/';
  const successBtn = () => {
    navigate(backTo);
    sessionStorage.removeItem('prevPath');
  }

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-4 py-3 bg-white border rounded-lg text-body-1 placeholder:text-brown-400 focus:outline-none focus:ring-2 transition-all duration-300";
    
    // ฟิลด์ทั้งหมดจะตรวจสอบเมื่อกด submit เท่านั้น
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-400 text-red-500 focus:ring-red-300`;
    }
    return `${baseClass} border-brown-300 text-brown-600 focus:ring-brown-400`;
  };

  return (
    <div className="min-h-screen bg-brown-200">
      <NavBar />

      <main className="flex items-center justify-center px-4 py-12 md:py-20">
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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={getInputClassName("password")}
              />
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
      </main>
    </div>
  );
}

export default SignUpPage;
