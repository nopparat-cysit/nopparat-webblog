import NavBar from "@/components/NavBar";
import { RotateCcw, User, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/common/Button";
import { UserMock } from "@/mockdata/userMock";
import Dialog from "@/common/Dialog";
import Toast from "@/common/Toast";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTap] = useState("profile");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [previewObjectUrl, setPreviewObjectUrl] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [profilePicError, setProfilePicError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (location.state?.tab === "reset") {
      setActiveTap("reset");
    }
  }, [location.state]);

  useEffect(() => {
    if (!sessionStorage.getItem("access_token")) {
      navigate("/login", { replace: true, state: { from: "/profile" } });
    }
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${apiBase}/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateUser(data);
      setName(data.name ?? "");
      setUsername(data.username ?? "");
      setEmail(data.email ?? "");
    } catch {
      /* keep existing form fields */
    }
  }, [token, updateUser]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (!user) return;
    setName((n) => (n === "" ? (user.name ?? "") : n));
    setUsername((u) => (u === "" ? (user.username ?? "") : u));
    setEmail((em) => (em === "" ? (user.email ?? "") : em));
  }, [user?.id, user?.name, user?.username, user?.email]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    };
  }, [previewObjectUrl]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showProfileToast, setShowProfileToast] = useState(false);

  const displayAvatar =
    previewObjectUrl || user?.profilePic || UserMock.img;
  const headerUsername = username || user?.username || UserMock.username;

  const handleProfileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicError("");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setProfilePicError("Please use JPEG, PNG, GIF, or WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setProfilePicError("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    setPreviewObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setPendingFile(file);
  };

  const clearPhotoSelection = () => {
    setPreviewObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPendingFile(null);
    setProfilePicError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError("");
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    if (!trimmedName || !trimmedUsername) {
      setSaveError("Name and username are required.");
      return;
    }
    if (!token) {
      setSaveError("Session expired. Please sign in again.");
      return;
    }
    setSaveLoading(true);
    try {
      let newPicUrl = null;
      if (pendingFile) {
        const fd = new FormData();
        fd.append("imageFile", pendingFile);
        const up = await axios.post(`${apiBase}/api/upload-profile-image`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        newPicUrl = up.data?.profilePic;
        if (!newPicUrl) {
          throw new Error("Upload did not return an image URL.");
        }
      }

      const payload = { name: trimmedName, username: trimmedUsername };
      if (newPicUrl) payload.profilePic = newPicUrl;

      const { data } = await axios.put(`${apiBase}/api/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.user) updateUser(data.user);
      clearPhotoSelection();
      setShowProfileToast(true);
    } catch (err) {
      setSaveError(
        err.response?.data?.error ?? err.message ?? "Could not save profile."
      );
    } finally {
      setSaveLoading(false);
    }
  };

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
      newErrors.newPassword =
        "New password must be different from current password";
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

  return (
    <>
      <NavBar />

      <div className="py-4 md:py-8 px-4 md:px-0 flex justify-center">
        <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[800px]">
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

          <div className="flex items-center gap-3 md:gap-4 order-2 md:order-1">
            <img
              src={displayAvatar}
              alt="avatar"
              className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
            />

            <h1 className="md:text-headline-3 text-headline-4 text-brown-400 truncate max-w-[95px] md:max-w-none">
              {headerUsername}
            </h1>

            <div className="h-6 md:h-8 w-[2px] bg-brown-300" />
            {activeTab === "profile" ? (
              <h1 className="text-[20px] font-semibold md:text-headline-3">
                Profile
              </h1>
            ) : (
              <h1 className="text-[20px] font-semibold md:text-headline-3">
                Reset password
              </h1>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 order-3">
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
                  className={`text-body-1 font-medium ${
                    activeTab === "profile"
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
                  className={`text-body-1 font-medium ${
                    activeTab === "reset" ? "text-brown-500" : "text-brown-400"
                  }`}
                >
                  Reset password
                </span>
              </button>
            </div>

            <div className="w-full md:w-[550px] bg-[#EFEEEB] rounded-2xl p-6 md:p-10 flex flex-col gap-6 md:gap-10">
              {activeTab === "profile" && (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <img
                        src={displayAvatar}
                        alt="Profile preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-neutral-300 bg-white"
                      />
                      {pendingFile && (
                        <span className="text-xs text-neutral-500 text-center max-w-[140px]">
                          Preview — press Save to apply
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="profile-upload"
                        accept={ALLOWED_IMAGE_TYPES.join(",")}
                        className="hidden"
                        onChange={handleProfileFileChange}
                      />

                      <label
                        htmlFor="profile-upload"
                        className="cursor-pointer inline-flex px-4 sm:px-6 py-2 sm:py-2.5 border border-neutral-400 rounded-full text-xs sm:text-sm font-semibold bg-white hover:bg-neutral-50 transition-all active:scale-95 w-fit"
                      >
                        Upload profile picture
                      </label>
                      {pendingFile && (
                        <button
                          type="button"
                          onClick={clearPhotoSelection}
                          className="text-xs text-neutral-500 hover:text-neutral-700 underline w-fit text-left"
                        >
                          Remove selected photo
                        </button>
                      )}
                      {profilePicError && (
                        <p className="text-sm text-red-600">{profilePicError}</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-neutral-300" />

                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                    {saveError && (
                      <p className="text-sm text-red-600">{saveError}</p>
                    )}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-500">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-500">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-neutral-400">Email</label>
                      <input
                        type="email"
                        disabled
                        value={email}
                        readOnly
                        className="px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="w-fit">
                      <Button type="submit" disabled={saveLoading}>
                        {saveLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {activeTab === "reset" && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-500">
                      Current password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          if (errors.currentPassword) {
                            setErrors({ ...errors, currentPassword: "" });
                          }
                        }}
                        placeholder="Current password"
                        className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                          errors.currentPassword
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-500">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword) {
                            setErrors({ ...errors, newPassword: "" });
                          }
                          if (
                            e.target.value === confirmPassword &&
                            errors.confirmPassword
                          ) {
                            setErrors({ ...errors, confirmPassword: "" });
                          }
                        }}
                        placeholder="New password"
                        className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                          errors.newPassword
                            ? "border-red-500"
                            : "border-neutral-300"
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-500">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: "" });
                          }
                        }}
                        placeholder="Confirm new password"
                        className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="w-fit">
                    <Button type="submit">Reset password</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset password"
        description="Do you want to reset your password?"
        confirmButtonText="Reset"
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
  );
}
export default profile;
