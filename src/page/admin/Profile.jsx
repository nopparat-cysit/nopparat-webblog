import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import Toast from "@/common/Toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

function AdminProfile() {
  const { user, token, login } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showProfileToast, setShowProfileToast] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

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
      const res = await axios.put(
        `${apiBase}/api/update-profile`,
        { name: name.trim(), username: username.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = res.data?.user;
      if (updatedUser) {
        login(token, { ...updatedUser, role: updatedUser.role ?? "user" });
      }
      setShowProfileToast(true);
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? "Failed to update profile";
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
          <Button variant="primary" onClick={handleSave} disabled={profileSaving}>
            {profileSaving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="border-t border-brown-300"></div>

        <div className="w-full mx-auto px-8 pb-[120px]">
          <div className=" rounded-xl p-10 max-w-2xl">
            {/* Profile picture - จาก auth user */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brown-100 shrink-0 border-2 border-brown-200">
                <img
                  src={user?.profilePic ?? defaultAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
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
