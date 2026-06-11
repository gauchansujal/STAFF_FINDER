"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";

const RegisterDTO = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname:  z.string().min(1, "Last name is required"),
  email:     z.string().email("Enter a valid email"),
  password:  z.string().min(6, "Password must be at least 6 characters"),
  imageUrl:  z.string().url("Enter a valid URL").optional().or(z.literal("")).or(z.undefined()),
});

type RegisterDTOType = z.infer<typeof RegisterDTO>;

interface RegisterFormProps {
  onSubmit?: (data: RegisterDTOType & { username: string }) => Promise<void> | void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTOType>({
    resolver: zodResolver(RegisterDTO),
    mode: "onTouched",
    defaultValues: { firstname: "", lastname: "", email: "", password: "", imageUrl: "" },
  });

  const firstnameValue = watch("firstname", "");
  const lastnameValue  = watch("lastname",  "");

  const derivedUsername = `${firstnameValue.trim().toLowerCase()}_${lastnameValue.trim().toLowerCase()}`
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      setValue("imageUrl", result, { shouldValidate: false });
    };
    reader.readAsDataURL(file);
  };

  const onFormSubmit = async (data: RegisterDTOType) => {
    setServerError(null);
    const username = derivedUsername || data.email.split("@")[0];
    const payload = {
      username,
      firstname: data.firstname.trim(),
      lastname:  data.lastname.trim(),
      email:     data.email,
      password:  data.password,
      ...(avatarPreview ? { imageUrl: avatarPreview } : {}),
    };
    try {
      await onSubmit?.(payload);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2.5 text-sm text-black bg-white rounded-lg outline-none border transition-colors
     ${hasError
       ? "border-red-500 focus:ring-2 focus:ring-red-100"
       : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-100"}`;

  const initials = `${firstnameValue.charAt(0)}${lastnameValue.charAt(0)}`.toUpperCase() || "?";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white border border-black rounded-xl shadow-sm">

        {/* Avatar */}
        <div className="flex flex-col items-center pt-8 pb-2 px-8">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full border-2 border-black bg-gray-100 overflow-hidden cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            aria-label="Upload profile photo"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-500">
                {initials}
              </span>
            )}
            <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <p className="mt-2 text-xs text-gray-400">Click to upload photo</p>
        </div>

        <div className="px-8 pb-8">
          <h1 className="text-2xl font-bold text-black mb-1 text-center">Create account</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Fill in your details to get started.</p>

          {serverError && (
            <div className="border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 bg-red-50 mb-5">
              ⚠ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <div className="space-y-4">

              {/* First + Last Name */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="firstname" className="block text-sm font-semibold text-black mb-1">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input id="firstname" type="text" autoComplete="given-name" placeholder="John"
                    className={inputClass(!!errors.firstname)} {...register("firstname")} />
                  {errors.firstname && (
                    <span className="block mt-1 text-xs text-red-500" role="alert">{errors.firstname.message}</span>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="lastname" className="block text-sm font-semibold text-black mb-1">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input id="lastname" type="text" autoComplete="family-name" placeholder="Doe"
                    className={inputClass(!!errors.lastname)} {...register("lastname")} />
                  {errors.lastname && (
                    <span className="block mt-1 text-xs text-red-500" role="alert">{errors.lastname.message}</span>
                  )}
                </div>
              </div>

              {derivedUsername.length > 1 && (
                <p className="text-xs text-gray-400 -mt-1">
                  Username will be <span className="font-semibold text-gray-600">@{derivedUsername}</span>
                </p>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                  className={inputClass(!!errors.email)} {...register("email")} />
                {errors.email && (
                  <span className="block mt-1 text-xs text-red-500" role="alert">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-black mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
                    placeholder="Min. 6 characters" className={`${inputClass(!!errors.password)} pr-14`}
                    {...register("password")} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 text-xs font-semibold text-gray-500 hover:text-black transition-colors">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <span className="block mt-1 text-xs text-red-500" role="alert">{errors.password.message}</span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-black text-white text-sm font-semibold rounded-lg border border-black transition-colors mt-2
                  ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800 active:bg-gray-900"}`}
              >
                {isSubmitting ? "Creating account…" : "Create Account"}
              </button>
            </div>
          </form>

          {/* Navigate to Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-black font-semibold underline text-sm hover:text-gray-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}