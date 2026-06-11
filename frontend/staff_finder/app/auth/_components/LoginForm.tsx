"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoginDTO, type LoginDTOType } from "../auth.schema";

interface LoginFormProps {
  onSubmit?: (data: LoginDTOType) => Promise<void> | void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTOType>({ resolver: zodResolver(LoginDTO) });

  const onFormSubmit = async (data: LoginDTOType) => {
    setServerError(null);
    setIsLoading(true);
    try {
      await onSubmit?.(data);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Completely bypass form submission — use button onClick instead
  const handleClick = async () => {
    handleSubmit(onFormSubmit)();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-6">
      <div className="w-full max-w-md bg-white border border-black rounded-md p-8">

        <h1 className="text-2xl font-bold text-black mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-7">
          Welcome back. Enter your credentials to continue.
        </p>

        {serverError && (
          <div className="border border-black rounded px-4 py-3 text-sm text-black bg-red-50 mb-5">
            {serverError}
          </div>
        )}

        {/* ✅ No onSubmit, no method — prevents any native form submission */}
        <form onSubmit={(e) => e.preventDefault()} noValidate>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full px-3 py-2.5 text-sm text-black bg-white rounded outline-none border
                ${errors.email ? "border-red-600" : "border-black"}
                focus:ring-2 focus:ring-black focus:ring-offset-1`}
              {...register("email")}
            />
            {errors.email && (
              <span className="block mt-1 text-xs text-red-600" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-black mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Min. 6 characters"
                className={`w-full px-3 py-2.5 pr-14 text-sm text-black bg-white rounded outline-none border
                  ${errors.password ? "border-red-600" : "border-black"}
                  focus:ring-2 focus:ring-black focus:ring-offset-1`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 text-xs font-semibold text-black cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span className="block mt-1 text-xs text-red-600" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-5">
            <button type="button" className="text-xs text-black underline cursor-pointer bg-transparent border-none">
              Forgot password?
            </button>
          </div>

          {/* ✅ onClick instead of type="submit" */}
          <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={`w-full py-3 bg-black text-white text-sm font-semibold rounded border border-black cursor-pointer mb-5 hover:bg-gray-800 transition-colors
              ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-black font-semibold underline text-sm">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}