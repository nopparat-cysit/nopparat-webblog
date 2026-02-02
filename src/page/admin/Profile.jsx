import { useState, useRef } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/common/Button";
import Toast from "@/common/Toast";
import { UserMock } from "@/mockdata/userMock";

function AdminProfile() {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(UserMock.img ?? "");
  const [name, setName] = useState(UserMock.name ?? "");
  const [username, setUsername] = useState(UserMock.username ?? "");
  const [email] = useState(UserMock.email ?? "");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showProfileToast, setShowProfileToast] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const err = {};
    const trimmedName = name?.trim() ?? "";
    const trimmedUsername = username?.trim() ?? "";
    if (!trimmedName) err.name = "กรุณากรอก Name";
    if (!trimmedUsername) err.username = "กรุณากรอก Username";
    return err;
  };

  const handleSave = (e) => {
    e?.preventDefault?.();
    setFieldErrors({});
    const err = validate();
    if (Object.keys(err).length > 0) {
      setFieldErrors(err);
      return;
    }
    setShowProfileToast(true);
  };

  return (
    <div className="flex min-h-screen bg-brown-100 font-sans text-brown-600">
      <AdminSidebar />

      <main className="flex-1 ml-[280px]">
      
        <div className='flex justify-between items-center pr-16'>
          <h1 className="text-headline-3 text-brown-600 font-semibold px-16 py-8">
            Profile
          </h1>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
        <div className="border-t border-brown-300"></div>

        <div className="w-full mx-auto pt-10 px-[60px] pb-[120px]">
          <div className=" rounded-xl p-10 max-w-2xl">
            {/* Profile picture */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brown-100 shrink-0 border-2 border-brown-200">
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profile-upload"
                className="cursor-pointer px-5 py-2.5 border border-brown-300 rounded-full text-body-3 font-semibold bg-white hover:bg-brown-50 transition-colors"
              >
                Upload profile picture
              </label>
              <input
                ref={fileInputRef}
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="h-px bg-brown-200 mb-8" />

            <form onSubmit={handleSave} className="flex flex-col gap-6">
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
