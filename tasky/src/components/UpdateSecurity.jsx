import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const inputClasses =
  "w-full rounded-2xl border border-[#C4B7A6] bg-[#EAE2D6] px-4 py-2.5 text-sm text-[#3E362E] " +
  "placeholder:text-[#8C7B6A] transition-all duration-200 focus:outline-none focus:ring-2 " +
  "focus:ring-[#A38666] focus:border-transparent " +
  "dark:border-[#4A3F32] dark:bg-[#2B241C] dark:text-[#EAE2D6] dark:placeholder:text-[#6B5F52]";

const cardClasses =
  "rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-6 dark:border-[#4A3F32] dark:bg-[#2B241C]";

const labelClasses = "mb-1.5 block text-sm font-medium text-[#5D4E3A] dark:text-[#DCD0C0]";

const buttonClasses =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A38666] px-5 py-2.5 text-sm " +
  "font-semibold text-[#F5F0E6] transition-colors hover:bg-[#8A7057] disabled:cursor-not-allowed disabled:opacity-60";

const friendlyError = (err, fallback) => {
  const msg = err.response?.data?.message || "";
  const status = err.response?.status;

  if (status === 401 || /incorrect|invalid.*password/i.test(msg)) return "Incorrect current password.";
  if (status === 404 || /not found/i.test(msg)) return "User not found.";
  if (status === 409 || /already in use|taken/i.test(msg)) return "That email is already in use.";

  return msg || fallback;
};

const PasswordField = ({ register, error, autoComplete, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputClasses + " pr-11"}
          {...register}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A38666] transition-colors hover:text-[#8A7057]"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="mt-1 block text-xs text-red-600">{error.message}</span>}
    </div>
  );
};

const UpdateSecurity = () => {
  const { user, updateUser } = useAuth();

  const emailForm = useForm({ defaultValues: { newEmail: "", currentPassword: "" } });
  const pwdForm = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmitEmail = async ({ newEmail, currentPassword }) => {
    const trimmedEmail = newEmail.trim();
    const trimmedPassword = currentPassword.trim();

    try {
      const { data } = await api.put("/user/update-security", {
        currentPassword: trimmedPassword,
        newEmail: trimmedEmail,
      });

      updateUser({ email: data.user?.email ?? trimmedEmail });
      if (data.token) localStorage.setItem("token", data.token);
      toast.success("Email updated successfully.");
      emailForm.reset();
    } catch (err) {
      const msg = friendlyError(err, "Couldn't update email.");
      emailForm.setError("root", { message: msg });
      toast.error(msg);
    }
  };

  const onSubmitPassword = async ({ currentPassword, newPassword }) => {
    const trimmedPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    try {
      const { data } = await api.put("/user/update-security", {
        currentPassword: trimmedPassword,
        newPassword: trimmedNewPassword,
      });

      if (data.token) localStorage.setItem("token", data.token);
      toast.success("Password updated successfully.");
      pwdForm.reset();
    } catch (err) {
      const msg = friendlyError(err, "Couldn't update password.");
      pwdForm.setError("root", { message: msg });
      toast.error(msg);
    }
  };

  const newPassword = pwdForm.watch("newPassword");

  return (
    <div className="grid gap-6">
      <section className={cardClasses}>
        <div className="mb-5 flex items-center gap-2">
          <Mail size={18} className="text-[#A38666]" />
          <h2 className="text-lg font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">Change Email</h2>
        </div>

        {emailForm.formState.errors.root && (
          <p className="mb-4 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
            {emailForm.formState.errors.root.message}
          </p>
        )}

        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="grid gap-4">
          <div>
            <label className={labelClasses}>Current email</label>
            <input type="email" value={user?.email || ""} readOnly className={inputClasses + " cursor-default opacity-80"} />
          </div>

          <div>
            <label className={labelClasses}>New email</label>
            <input
              type="email"
              autoComplete="email"
              className={inputClasses}
              {...emailForm.register("newEmail", {
                required: "New email is required",
                setValueAs: (value) => value?.trim(),
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            {emailForm.formState.errors.newEmail && (
              <span className="mt-1 block text-xs text-red-600">{emailForm.formState.errors.newEmail.message}</span>
            )}
          </div>

          <div>
            <label className={labelClasses}>Current password <span className="text-[#A38666]">*</span></label>
            <PasswordField
              register={emailForm.register("currentPassword", {
                required: "Current password is required",
                setValueAs: (value) => value?.trim(),
              })}
              error={emailForm.formState.errors.currentPassword}
              autoComplete="current-password"
              placeholder="Enter current password to confirm"
            />
          </div>

          <button type="submit" disabled={emailForm.formState.isSubmitting} className={buttonClasses}>
            {emailForm.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            {emailForm.formState.isSubmitting ? "Updating..." : "Update Email"}
          </button>
        </form>
      </section>

      <section className={cardClasses}>
        <div className="mb-5 flex items-center gap-2">
          <Lock size={18} className="text-[#A38666]" />
          <h2 className="text-lg font-semibold text-[#5D4E3A] dark:text-[#DCD0C0]">Change Password</h2>
        </div>

        {pwdForm.formState.errors.root && (
          <p className="mb-4 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
            {pwdForm.formState.errors.root.message}
          </p>
        )}

        <form onSubmit={pwdForm.handleSubmit(onSubmitPassword)} className="grid gap-4">
          <div>
            <label className={labelClasses}>Current password <span className="text-[#A38666]">*</span></label>
            <PasswordField
              register={pwdForm.register("currentPassword", {
                required: "Current password is required",
                setValueAs: (value) => value?.trim(),
              })}
              error={pwdForm.formState.errors.currentPassword}
              autoComplete="current-password"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className={labelClasses}>New password</label>
            <PasswordField
              register={pwdForm.register("newPassword", {
                required: "New password is required",
                setValueAs: (value) => value?.trim(),
                minLength: { value: 8, message: "Must be at least 8 characters" },
              })}
              error={pwdForm.formState.errors.newPassword}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className={labelClasses}>Confirm new password</label>
            <input
              type="password"
              autoComplete="new-password"
              className={inputClasses}
              {...pwdForm.register("confirmPassword", {
                setValueAs: (value) => value?.trim(),
                validate: (value) => value === newPassword || "Passwords do not match",
              })}
            />
            {pwdForm.formState.errors.confirmPassword && (
              <span className="mt-1 block text-xs text-red-600">{pwdForm.formState.errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" disabled={pwdForm.formState.isSubmitting} className={buttonClasses}>
            {pwdForm.formState.isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            {pwdForm.formState.isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default UpdateSecurity;
