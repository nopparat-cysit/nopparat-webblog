import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import Dialog from "@/common/Dialog";
import Toast from "@/common/Toast";
import { Eye, EyeOff } from "lucide-react";
import { UserMock } from "@/mockdata/userMock";

function AdminResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validatePassword = () => {
    const newErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    } else if (currentPassword !== UserMock.password) {
      newErrors.currentPassword = "Current password is incorrect";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      currentPassword === newPassword &&
      newPassword.trim() &&
      currentPassword === UserMock.password
    ) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      setShowModal(true);
    }
  };

  const handleConfirmReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowModal(false);
    setShowToast(true);
  };

  const inputBaseClass = "w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2";
  const inputErrorClass = "border-2 border-red-500 focus:ring-red-500/20";
  const inputNormalClass = "border-brown-200";

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">

        <div className='flex justify-between items-center pr-16'>
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            Reset password
          </h1>
          <Button variant="primary" onClick={() => navigate('/categories/create')}>
            <div className='flex items-center gap-2'>
              Reset password
            </div>
          </Button>
        </div>
        <div className="border-t border-brown-300"></div>

        <div className="w-full mx-auto pt-8 px-[60px] pb-[120px]">
          <div className=" rounded-xl max-w-2xl">
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (errors.currentPassword)
                        setErrors((prev) => ({ ...prev, currentPassword: "" }));
                    }}
                    placeholder="Current password"
                    className={`${inputBaseClass} ${errors.currentPassword ? inputErrorClass : inputNormalClass
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-body-3 text-red-500 mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword)
                        setErrors((prev) => ({ ...prev, newPassword: "" }));
                      if (e.target.value === confirmPassword && errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    placeholder="New password"
                    className={`${inputBaseClass} ${errors.newPassword ? inputErrorClass : inputNormalClass
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-body-3 text-red-500 mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    placeholder="Confirm new password"
                    className={`${inputBaseClass} ${errors.confirmPassword ? inputErrorClass : inputNormalClass
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-body-3 text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>


            </form>
          </div>
        </div>
      </main>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset password"
        description="Do you want to reset your password?"
        confirmButtonText="Reset"
        cancelButtonText="Cancel"
      />

      <Toast
        type="success"
        title="Password updated"
        message="Your password has been changed successfully."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        autoClose={3000}
      />
    </div>
  );
}

export default AdminResetPassword;
