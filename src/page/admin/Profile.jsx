import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import Toast from "@/common/Toast";
import { UserMock } from "@/mockdata/userMock";
import { useAuth } from "@/context/AuthContext";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function AdminProfile() {
  const fileInputRef = useRef(null);
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(UserMock.name ?? "");
  const [username, setUsername] = useState(UserMock.username ?? "");
  const [email, setEmail] = useState(UserMock.email ?? "");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showProfileToast, setShowProfileToast] = useState(false);

  const [previewObjectUrl, setPreviewObjectUrl] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

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
      /* keep fields */
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

  const savedPic = user?.profilePic || UserMock.img;
  const displayAvatar = previewObjectUrl || savedPic;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFieldErrors((prev) => ({ ...prev, profilePic: "", submit: "" }));
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        profilePic: "Please use JPEG, PNG, GIF, or WebP.",
      }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFieldErrors((prev) => ({
        ...prev,
        profilePic: "Image must be 5MB or smaller.",
      }));
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const err = {};
    const trimmedName = name?.trim() ?? "";
    const trimmedUsername = username?.trim() ?? "";
    if (!trimmedName) err.name = "Please enter your name";
    if (!trimmedUsername) err.username = "Please enter your username";
    return err;
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setFieldErrors((prev) => ({ ...prev, submit: "" }));
    const err = validate();
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    if (!token) {
      setFieldErrors((prev) => ({
        ...prev,
        submit:
          "Sign in from the Login page with your account to save profile changes.",
      }));
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
        if (!newPicUrl) throw new Error("Upload did not return an image URL.");
      }
      const payload = {
        name: name.trim(),
        username: username.trim(),
      };
      if (newPicUrl) payload.profilePic = newPicUrl;
      const { data } = await axios.put(`${apiBase}/api/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.user) updateUser(data.user);
      clearPhotoSelection();
      setShowProfileToast(true);
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.error ??
          error.message ??
          "Could not save profile.",
      }));
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
        <div className="flex justify-between items-center pr-16">
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            Profile
          </h1>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saveLoading}
          >
            {saveLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="border-t border-brown-300"></div>

        <div className="w-full mx-auto px-8 pb-[120px]">
          <div className=" rounded-xl p-10 max-w-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brown-100 border-2 border-brown-200">
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {pendingFile && (
                  <span className="text-body-3 text-brown-400 text-center max-w-[160px]">
                    Preview — press Save to apply
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer px-5 py-2.5 border border-brown-300 rounded-full text-body-3 font-semibold bg-white hover:bg-brown-50 transition-colors w-fit"
                >
                  Upload profile picture
                </label>
                <input
                  ref={fileInputRef}
                  id="profile-upload"
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {pendingFile && (
                  <button
                    type="button"
                    onClick={clearPhotoSelection}
                    className="text-body-3 text-brown-500 hover:text-brown-700 underline w-fit text-left"
                  >
                    Remove selected photo
                  </button>
                )}
                {fieldErrors.profilePic && (
                  <p className="text-body-3 text-red-500">{fieldErrors.profilePic}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-brown-200 mb-8" />

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {fieldErrors.submit && (
                <p className="text-body-3 text-red-500">{fieldErrors.submit}</p>
              )}
              <div className="space-y-1">
                <label className="text-body-2 font-semibold text-brown-400">
                  Name
                </label>
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
                <label className="text-body-2 font-semibold text-brown-400">
                  Username
                </label>
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
                  <p className="text-body-3 text-red-500 mt-1">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              <div className="space-y-1 ">
                <label className="text-body-2 font-semibold text-brown-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
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
                <p className="text-body-3 text-brown-400">
                  Bio is not saved to the server yet.
                </p>
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
