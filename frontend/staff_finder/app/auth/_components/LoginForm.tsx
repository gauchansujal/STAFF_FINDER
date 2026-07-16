"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { LoginDTO, type LoginDTOType } from "../auth.schema";
import { loginAction, logoutAction } from "@/app/lib/actions/auth-action";

type LoginMode = "jobseeker" | "admin";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode]                 = useState<LoginMode>("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [remember, setRemember]         = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTOType>({ resolver: zodResolver(LoginDTO) });

  const onFormSubmit = async (data: LoginDTOType) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const res = await loginAction(data);

      if (!res.success) {
        setServerError(res.message ?? "Login failed");
        return;
      }

      const userRole = res.user?.role;

      // wrong role — delete cookie immediately
      if (mode === "jobseeker" && userRole === "admin") {
        await logoutAction();
        setServerError("No job seeker account found with these credentials.");
        return;
      }

      if (mode === "admin" && userRole !== "admin") {
        await logoutAction();
        setServerError("No admin account found with these credentials.");
        return;
      }

      // correct role — redirect
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf8f5]">

      {/* Left — image */}
      <div className="hidden lg:flex w-[55%] p-8 items-end">
        <div className="relative w-full h-full max-h-[85vh] rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-10">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Welcome Back!
            </h2>
            <p className="text-white/80 mt-2 text-base">
              Continue your journey in the culinary world
            </p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <img
                src="/image/chef-hat.png"
                alt="logo"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className="text-base font-semibold text-gray-900">
              Restaurant Staff Finder
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h1>
          <p className="text-sm text-gray-500 mb-6">
            Welcome back! Please enter your details.
          </p>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setMode("jobseeker"); setServerError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === "jobseeker"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => { setMode("admin"); setServerError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === "admin"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Restaurant Admin
            </button>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {serverError}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border rounded-xl outline-none transition-all
                    ${errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-14 py-2.5 text-sm text-gray-900 bg-white border rounded-xl outline-none transition-all
                    ${errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-orange-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In button */}
            <button
              type="button"
              onClick={() => handleSubmit(onFormSubmit)()}
              disabled={isLoading}
              className={`w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2
                ${isLoading ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98]"}`}
            >
              {isLoading ? "Signing in..." : <>Sign In <span>→</span></>}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-orange-500 font-bold hover:text-orange-600"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}