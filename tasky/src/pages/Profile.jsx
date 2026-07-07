import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../services/userService.js";
import Navbar from "../components/Navbar.jsx";
import UpdateSecurity from "../components/UpdateSecurity.jsx";
import { Upload, Save, ArrowLeft, ShieldCheck } from 'lucide-react';
import Spinner from "../components/Spinner.jsx";

const resolveAvatar = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return avatar;
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(resolveAvatar(user?.avatar));
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: user?.name || "" } });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const inputClasses =
    "w-full rounded-2xl border px-4 py-2.5 text-sm transition-all duration-200 " +
    "border-[#C4B7A6] bg-[#EAE2D6] text-[#3E362E] placeholder:text-[#8A7D6A] " +
    "focus:outline-none focus:ring-2 focus:ring-[#A38666] focus:border-transparent " +
    "focus:ring-offset-2 focus:ring-offset-[#EAE2D6] " +
    "dark:border-[#4A3F32] dark:bg-[#2B241C] dark:text-[#EAE2D6] dark:placeholder:text-[#6B5F52] " +
    "dark:focus:ring-offset-[#2B241C]";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setStatus({ type: "error", msg: "Please choose a JPEG, PNG, or WebP image." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus({ type: "error", msg: "Image must be under 2 MB." });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setStatus(null);
  };

  const onSubmit = async ({ name }) => {
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) formData.append("avatar", selectedFile);

      const { user: updated } = await updateProfile(formData);

      updateUser({ name: updated.name, avatar: updated.avatar });
      setPreview(resolveAvatar(updated.avatar));
      setSelectedFile(null);
      setStatus({ type: "success", msg: "Profile updated successfully." });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Update failed. Please try again.",
      });
    }
  };

  // Auto-dismiss success messages after a short delay
  useEffect(() => {
    if (status?.type === "success") {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#5D4E3A] dark:bg-[#211B14] dark:text-[#DCD0C0]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#8A7D6A] transition-colors hover:text-[#5D4E3A] dark:text-[#9A8B76] dark:hover:text-[#DCD0C0]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        {/* Grid: stacked on mobile, 1/3 - 2/3 on md+ */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          {/* Profile card — spans 1/3 on desktop */}
          <div className="w-full rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-6 shadow-md dark:border-[#4A3F32] dark:bg-[#2B241C] md:col-span-1">
            <h1 className="mb-6 text-xl font-semibold text-ink dark:text-[#EDE4D3]">Edit Profile</h1>

            {status && (
              <div
                className={`mb-5 rounded-lg px-4 py-2.5 text-sm transition-opacity duration-500 ${
                  status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
              {/* Profile Header: avatar + photo controls */}
              <div className="mb-8 flex items-center gap-4">
                {/* Avatar / preview */}
                <div className="shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Avatar preview"
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-[#DCD0C0] dark:ring-[#4A3F32]"
                    />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A38666] text-xl font-semibold text-[#F5F0E6]">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Button + instruction text group */}
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] px-4 py-2 text-sm font-semibold text-[#5D4E3A] transition-colors hover:bg-[#DCD0C0] dark:border-[#4A3F32] dark:bg-[#2B241C] dark:text-[#DCD0C0] dark:hover:bg-[#4A3F32]"
                  >
                    <Upload size={16} />
                    Change photo
                  </button>
                  <p className="mt-2 text-xs text-[#8A7D6A] dark:text-[#9A8B76]">
                    JPEG, PNG or WebP. Max 2 MB.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                  Display name
                </label>
                <input id="name" type="text" className={inputClasses} {...register("name", {
                  required: "Name is required",
                  maxLength: { value: 60, message: "Max 60 characters" },
                })} />
                {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5D4E3A] dark:text-[#DCD0C0]">Email</label>
                <input type="email" value={user?.email || ""} readOnly className={inputClasses + " cursor-default opacity-90"} />
                <p className="mt-1.5 text-xs text-[#8A7D6A] dark:text-[#9A8B76]">Change your email in the Security section below.</p>
              </div>

              <div>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? <Spinner size={16} /> : <Save size={16} />}
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Security card — spans 2/3 on desktop */}
          <div className="w-full rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-6 shadow-md dark:border-[#4A3F32] dark:bg-[#211B14] md:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#A38666]" />
              <h2 className="text-lg font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">Security</h2>
            </div>

            <UpdateSecurity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
