import NavBar from "@/components/NavBar"
import { RotateCcw, User, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@/common/Button";
import { UserMock } from "@/mockdata/userMock";
import Dialog from "@/common/Dialog";
import Toast from "@/common/Toast";


function profile() {
  const location = useLocation();
  const [activeTab, setActiveTap] = useState('profile')
  
  useEffect(() => {
    // เช็ค location state เพื่อเปิด tab reset password
    if (location.state?.tab === 'reset') {
      setActiveTap('reset');
    }
  }, [location.state]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showProfileToast, setShowProfileToast] = useState(false);
  
  const validatePassword = () => {
    const newErrors = {};
    
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    } else if (currentPassword !== UserMock.password) {
      newErrors.currentPassword = 'Current password is incorrect';
    }
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (currentPassword === newPassword && newPassword.trim() && currentPassword === UserMock.password) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // Open confirmation modal
      setShowModal(true);
    }
  };

  const handleConfirmReset = () => {
    // Handle password reset logic here
    console.log('Password reset confirmed:', { currentPassword, newPassword });
    
    // Update UserMock password (in real app, this would be an API call)
    // UserMock.password = newPassword;
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowModal(false);
    setShowToast(true);
    
  
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Handle profile save logic here
    console.log('Profile saved');
    
    // Show success toast
    setShowProfileToast(true);
  };
  
  console.log(activeTab);

  return (
    <>
      <NavBar />

      <div className="py-4 md:py-8 px-4 md:px-0 flex justify-center">
        <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[800px]">
          {/* Mobile Tabs - Show first on mobile */}
          <div className="flex md:hidden gap-2 border-b border-brown-200 pb-2 order-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === "profile" 
                  ? "bg-brown-200 text-brown-600" 
                  : "text-brown-400"
              }`}
              onClick={() => setActiveTap("profile")}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === "reset" 
                  ? "bg-brown-200 text-brown-600" 
                  : "text-brown-400"
              }`}
              onClick={() => setActiveTap("reset")}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reset password</span>
            </button>
          </div>

          {/* Header - Show second on mobile */}
          <div className="flex items-center gap-3 md:gap-4 order-2 md:order-1">
            <img
              src={UserMock.img}
              alt="avatar"
              className="h-12 w-12 md:h-16 md:w-16 rounded-full"
            />

            <h1 className="md:text-headline-3 text-headline-4 text-brown-400 truncate max-w-[95px] md:max-w-none">{UserMock.username}</h1>

            <div className="h-6 md:h-8 w-[2px] bg-brown-300" />
            {activeTab === "profile" ? <h1 className="text-[20px] font-semibold md:text-headline-3">Profile</h1> : <h1 className="text-[20px] font-semibold md:text-headline-3">Reset password</h1>}
            
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 order-3">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col">
              <button
                className="flex items-center w-full gap-3 px-5 py-2 cursor-pointer transition-all"
                onClick={() => setActiveTap("profile")}
              >
                <User
                  className={
                    activeTab === "profile"
                      ? "text-brown-400"
                      : "text-brown-300"
                  }
                />
                <span
                  className={`text-body-1 font-medium ${activeTab === "profile"
                    ? "text-brown-500"
                    : "text-brown-400"
                    }`}
                >
                  Profile
                </span>
              </button>

              <button
                className="flex items-center w-full gap-3 px-5 py-2 cursor-pointer transition-all"
                onClick={() => setActiveTap("reset")}
              >
                <RotateCcw
                  className={
                    activeTab === "reset"
                      ? "text-brown-400"
                      : "text-brown-300"
                  }
                />
                <span
                  className={`text-body-1 font-medium ${activeTab === "reset"
                    ? "text-brown-500"
                    : "text-brown-400"
                    }`}
                >
                  Reset password
                </span>
              </button>
            </div>

            {/* Content */}
            <div className="w-full md:w-[550px] bg-[#EFEEEB] rounded-2xl p-6 md:p-10 flex flex-col gap-6 md:gap-10">
              {activeTab === "profile" && (
                <>
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <img
                      src={UserMock.img}
                      alt="profile"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />

                    <input
                      type="file"
                      id="profile-upload"
                      className="hidden"
                      onChange={(e) => console.log(e.target.files[0])}
                    />

                    <label
                      htmlFor="profile-upload"
                      className="cursor-pointer px-4 sm:px-6 py-2 sm:py-2.5 border border-neutral-400 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-neutral-50 transition-all active:scale-95"
                    >
                      Upload profile picture
                    </label>
                  </div>

                  <div className="h-px bg-neutral-300" />

                  {/* Form */}
                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-500">Name</label>
                      <input
                        type="text"
                        defaultValue={UserMock.name}
                        className="px-4 py-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-500">Username</label>
                      <input
                        type="text"
                        defaultValue={UserMock.username}
                        className="px-4 py-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-400">Email</label>
                      <input
                        type="email"
                        disabled
                        defaultValue={UserMock.email}
                        className="px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      />
                    </div>
                    {/* Save Button */}
                    <div className="w-12">
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </>
              )}

              {activeTab === "reset" && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-500">Current password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          if (errors.currentPassword) {
                            setErrors({ ...errors, currentPassword: '' });
                          }
                        }}
                        placeholder="Current password"
                        className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                          errors.currentPassword ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-500">New password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword) {
                            setErrors({ ...errors, newPassword: '' });
                          }
                          // Clear confirm password error if passwords now match
                          if (e.target.value === confirmPassword && errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: '' });
                          }
                        }}
                        placeholder="New password"
                        className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                          errors.newPassword ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-500">Confirm new password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: '' });
                          }
                        }}
                        placeholder="Confirm new password"
                        className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Reset Button */}
                  <div className="w-fit">
                    <Button type="submit">Reset password</Button>
                  </div>
                </form>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Confirmation Modal */}
      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset password"
        description='Do you want to reset your password?'
        confirmButtonText='Reset'
      />
      <Toast
        type="success"
        title="Password updated"
        message="Your password has been changed successfully."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        autoClose={3000}
      />
      <Toast
        type="success"
        title="Saved profile"
        message="Your profile has been successfully updated."
        isVisible={showProfileToast}
        onClose={() => setShowProfileToast(false)}
        autoClose={3000}
      />
    </>


  )
}
export default profile
