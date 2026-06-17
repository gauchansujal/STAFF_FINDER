"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema, UpdateUserData } from "../create/schema";
import { updateUserAction } from "@/app/lib/actions/admin/admin-actions";
import { User } from "@/app/lib/api/admin/admin";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import { useState } from "react";

interface Props {
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateUserForm({ user, onSuccess, onCancel }: Props) {
  const [error, setError]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    (user as any).imageUrl ?? user.image ?? null // ✅ support both fields
  );
  const [uploadedUrl, setUploadedUrl] = useState<string>(
    (user as any).imageUrl ?? user.image ?? ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstName: (user as any).firstname ?? "",
      lastName:  (user as any).lastname  ?? "",
      username:  user.username  ?? "",
      email:     user.email,
    },
  });

  // ✅ upload image to server immediately on select
  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // show preview instantly
    setPreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch(ENDPOINTS.UPLOAD, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.url); // ✅ store real URL
      } else {
        setError("Image upload failed");
      }
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: UpdateUserData) {
    setError("");

    // ✅ only send dirty (changed) fields
    const dirty: Record<string, any> = {};
    Object.keys(dirtyFields).forEach((k) => {
      dirty[k] = data[k as keyof UpdateUserData];
    });

    // ✅ include imageUrl only if a new image was uploaded
    if (uploadedUrl && uploadedUrl !== ((user as any).imageUrl ?? user.image ?? "")) {
      dirty.imageUrl = uploadedUrl;
    }

    // nothing changed
    if (Object.keys(dirty).length === 0) {
      onSuccess?.();
      return;
    }

    const res = await updateUserAction(user.id, dirty);
    if (res.success) {
      onSuccess?.();
    } else {
      setError(res.message ?? "Something went wrong");
    }
  }

  const displayInitials = `${(user as any).firstname?.[0] ?? ""}${(user as any).lastname?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-semibold">
              {displayInitials}
            </div>
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
          <label className="text-xs font-medium text-muted-foreground block mb-1">First name</label>
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
          <label className="text-xs font-medium text-muted-foreground block mb-1">Last name</label>
          <input
            {...register("lastName")}
            placeholder="Doe"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Username</label>
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
        <label className="text-xs font-medium text-muted-foreground block mb-1">Email</label>
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

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="border rounded-md px-4 py-1.5 text-sm">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-foreground text-background rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}