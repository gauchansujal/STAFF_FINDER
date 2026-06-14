"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema, UpdateUserData } from "../create/schema";
import { updateUserAction } from "@/app/lib/actions/admin/admin-actions";
import { User } from "@/app/lib/api/admin/admin";
import { useState } from "react";

interface Props {
  user: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateUserForm({ user, onSuccess, onCancel }: Props) {
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(user.image ?? null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName:  user.lastName  ?? "",
      username:  user.username  ?? "",
      email:     user.email,
    },
  });

  async function onSubmit(data: UpdateUserData) {
    setError("");
    // only send fields that were actually changed
    const dirty = Object.fromEntries(
      Object.keys(dirtyFields).map((k) => [k, data[k as keyof UpdateUserData]])
    );
    const res = await updateUserAction(user.id, dirty);
    if (res.success) {
      onSuccess?.();
    } else {
      setError(res.message ?? "Something went wrong");
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file, { shouldValidate: true, shouldDirty: true });
    setPreview(URL.createObjectURL(file));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-medium">
              {user.name.slice(0, 2).toUpperCase()}
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
            className="text-sm"
          />
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
          disabled={isSubmitting}
          className="bg-foreground text-background rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}