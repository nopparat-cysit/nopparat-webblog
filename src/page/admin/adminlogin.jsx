import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Toast from "../../common/Toast";
import { AdminMock } from "@/mockdata/adminMock";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ล้าง error เมื่อผู้ใช้พิมพ์
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // ล้าง login error เมื่อผู้ใช้เริ่มพิมพ์
    if (isLoginError) {
      setIsLoginError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลเบื้องต้น
    const newErrors = {
      email: formData.email.trim() ? "" : "Email is required",
      password: formData.password ? "" : "Password is required",
    };

    setErrors(newErrors);

    // ตรวจสอบว่ามี validation errors หรือไม่
    const hasValidationErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasValidationErrors) {
      return;
    }

    // ตรวจสอบข้อมูลล็อกอิน admin
    if (formData.email.trim() === AdminMock.email && formData.password === AdminMock.password) {
      // เก็บ role ใน sessionStorage เพื่อให้ NavBar อ่านได้
      sessionStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('online', 'true');
      // Login สำเร็จ - redirect ไปหน้า admin
      navigate('/articles');
      return;
    }

    // ข้อมูลล็อกอินไม่ถูกต้อง
    // รีเซ็ตข้อมูลฟอร์ม
    setFormData({
      email: "",
      password: "",
    });
    
    // ล้าง errors
    setErrors({
      email: "",
      password: "",
    });
    
    // ตั้งค่า login error เพื่อแสดงกรอบสีแดง
    setIsLoginError(true);
    
    // แสดง toast notification
    setShowToast(true);
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-4 py-3 bg-white border rounded-lg text-body-1 placeholder:text-brown-400 focus:outline-none focus:ring-2 transition-all duration-300";

    // แสดงกรอบสีแดงถ้ามี validation error หรือ login error
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
            <h1 className="text-headline-4 font-semibold text-brand-orange text-center ">Admin Login</h1>
          <h1 className="text-headline-2 text-brown-600 font-semibold text-center mb-8">
            Login
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
              {errors.email && errors.email !== "" && (
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
              {errors.password && errors.password !== "" && (
                <p className="text-red-500 text-body-2 mt-1">{errors.password}</p>
              )}
            </div>

            {/* ปุ่มส่งข้อมูล */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-12 py-3 bg-brown-600 text-white rounded-full text-body-1 font-medium hover:bg-brown-500 transition-all duration-300"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* การแจ้งเตือน Toast */}
      <Toast
        type="error"
        title="Your password is incorrect or this email doesn't exist"
        message="Please try another password or email"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        autoClose={3000}
      />
    </div>
  );
}

export default AdminLogin;
