import { useState, useEffect, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import Toast from "@/common/Toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

function AdminProfile() {
  const { user, token, login } = useAuth();
  const avatarInputRef = useRef(null);
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showProfileToast, setShowProfileToast] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const displayAvatar = avatarPreview || user?.profilePic || defaultAvatar;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarError("");
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview("");
    }
    setAvatarFile(null);
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError("กรุณาเลือกไฟล์รูป (JPEG, PNG, GIF, WebP)");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("ขนาดไฟล์เกิน 5MB");
      e.target.value = "";
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const clearPendingAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview("");
    setAvatarFile(null);
    setAvatarError("");
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setUsername(user.username ?? "");
    }
  }, [user]);

  const validate = () => {
    const err = {};
    const trimmedName = name?.trim() ?? "";
    const trimmedUsername = username?.trim() ?? "";
    if (!trimmedName) err.name = "กรุณากรอก Name";
    if (!trimmedUsername) err.username = "กรุณากรอก Username";
    return err;
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setFieldErrors({});
    setProfileError("");
    const err = validate();
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    if (!token) {
      setProfileError("Please log in again");
      return;
    }
    setProfileSaving(true);
    try {
      let profilePicUrl = user?.profilePic;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("imageFile", avatarFile);
        const uploadRes = await axios.post(`${apiBase}/api/upload-profile-image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        profilePicUrl = uploadRes.data?.profilePic ?? profilePicUrl;
      }

      const payload = { name: name.trim(), username: username.trim() };
      if (profilePicUrl && profilePicUrl !== user?.profilePic) {
        payload.profilePic = profilePicUrl;
      }

      const res = await axios.put(`${apiBase}/api/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = res.data?.user;
      if (updatedUser) {
        login(token, { ...updatedUser, role: updatedUser.role ?? "user" });
      }
      clearPendingAvatar();
      setShowProfileToast(true);
    } catch (err) {
      const msg =
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to update profile";
      setProfileError(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
      
        <div className='flex justify-between items-center pr-16'>
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            Profile
          </h1>
          <Button variant="dark" onClick={handleSave} disabled={profileSaving}>
            {profileSaving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="border-t border-brown-300"></div>

        <div className="w-full mx-auto px-8 pb-[120px]">
          <div className=" rounded-xl p-10 max-w-2xl">
            {/* Profile picture — preview ก่อนบันทึก */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brown-100 shrink-0 border-2 border-brown-200">
                <img
                  src={displayAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outlineDark"
                    onClick={() => avatarInputRef.current?.click()}
                    className="!min-w-0 shrink-0"
                  >
                    Upload profile picture
                  </Button>
                </div>

                {avatarError && (
                  <p className="text-body-3 text-red-500">{avatarError}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-brown-200 mb-8" />

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {profileError && (
                <p className="text-red-500 text-body-3">{profileError}</p>
              )}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Thompson P."
                  className={`w-full h-[48px] px-4 border rounded-lg focus:outline-none text-body-2 bg-white ${
                    fieldErrors.name
                      ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-brown-200 focus:ring-2 focus:ring-brand-green/20"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  placeholder="thompson"
                  className={`w-full h-[48px] px-4 border rounded-lg focus:outline-none text-body-2 bg-white ${
                    fieldErrors.username
                      ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-brown-200 focus:ring-2 focus:ring-brand-green/20"
                  }`}
                />
                {fieldErrors.username && (
                  <p className="text-body-3 text-red-500 mt-1">{fieldErrors.username}</p>
                )}
              </div>

              <div className="space-y-1 ">
                <label className="text-body-2 font-semibold text-brown-400">Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className="w-full h-[48px] px-4 border border-brown-200 rounded-lg bg-white text-brown-400 cursor-not-allowed text-body-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">
                  Bio (max 120 letters)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 120))}
                  placeholder="I am a pet enthusiast and freelance writer..."
                  rows={5}
                  className="w-full p-4 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 text-body-2 resize-none bg-white"
                />
              </div>
            </form>
          </div>
        </div>
      </main>

      <Toast
        type="success"
        title="Saved profile"
        message="Your profile has been successfully updated."
        isVisible={showProfileToast}
        onClose={() => setShowProfileToast(false)}
        autoClose={3000}
      />
    </div>
  );
}

export default AdminProfile;
