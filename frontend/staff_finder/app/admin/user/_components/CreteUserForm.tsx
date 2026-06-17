"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, CreateUserData } from "../create/schema";
import { createUserAction } from "@/app/lib/actions/admin/admin-actions";
import { CreateUserPayload } from "@/app/lib/api/admin/admin";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { useState } from "react";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateUserForm({ onSuccess, onCancel }: Props) {
  const [error, setError]         = useState("");
  const [preview, setPreview]     = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserData>({
    resolver: zodResolver(CreateUserSchema),
  });

  // ✅ upload image immediately on select
  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch(ENDPOINTS.UPLOAD, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.url);
      } else {
        setError("Image upload failed");
      }
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: CreateUserData) {
    setError("");

    const payload: CreateUserPayload = {
      email:     data.email,
      password:  data.password,
      username:  data.username,
      firstName: data.firstName,
      lastName:  data.lastName,
      ...(uploadedUrl && { imageUrl: uploadedUrl }), // ✅ use uploaded URL
    };

    const res = await createUserAction(payload);
    if (res.success) {
      onSuccess?.();
    } else {
      setError(res.message ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Avatar preview + upload */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-muted-foreground">👤</span>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Profile image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImage}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
          )}
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("firstName")}
            placeholder="John"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Last name
          </label>
          <input
            {...register("lastName")}
            placeholder="Doe"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          {...register("username")}
          placeholder="johndoe"
          className="w-full border rounded-md px-3 py-1.5 text-sm"
        />
        {errors.username && (
          <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="john@example.com"
          className="w-full border rounded-md px-3 py-1.5 text-sm"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Confirm password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border rounded-md px-4 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-foreground text-background rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50 transition-opacity"
        >
          {isSubmitting ? "Creating…" : "Create user"}
        </button>
      </div>

    </form>
  );
}