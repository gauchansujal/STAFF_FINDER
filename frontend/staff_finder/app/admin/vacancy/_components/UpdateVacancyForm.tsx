"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateVacancyAction } from "@/app/lib/actions/vacancy-action";
import { Vacancy } from "@/app/lib/api/vacancy";
import { useState, useRef } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";

const UpdateVacancySchema = z.object({
  RestaurantName: z.string().min(1).optional(),
  location:       z.string().min(1).optional(),
  imageUrl:       z.string().url().or(z.literal("")).optional(),
  salary:         z.number().positive().optional(),
  position:       z.string().min(1).optional(),
  jobType:        z.enum(["full-time", "part-time"]).optional(),
  description:    z.string().min(20).optional(),
});

type UpdateVacancyData = z.infer<typeof UpdateVacancySchema>;

interface Props {
  vacancy:    Vacancy;
  onSuccess?: () => void;
  onCancel?:  () => void;
}

const UPLOAD_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/upload`
  : "/upload";

export default function UpdateVacancyForm({ vacancy, onSuccess, onCancel }: Props) {
  const [error, setError]               = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(vacancy.imageUrl ?? null);
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadError, setUploadError]   = useState("");
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UpdateVacancyData>({
    resolver: zodResolver(UpdateVacancySchema),
    defaultValues: {
      RestaurantName: vacancy.RestaurantName,
      location:       vacancy.location,
      imageUrl:       vacancy.imageUrl ?? "",
      salary:         vacancy.salary,
      position:       vacancy.position,
      jobType:        vacancy.jobType,
      description:    vacancy.description,
    },
  });

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;

    setUploadError("");
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body:   formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed");
      }

      setValue("imageUrl", data.url, { shouldValidate: true, shouldDirty: true });
      setImagePreview(data.url);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Could not upload image"
      );
      setImagePreview(vacancy.imageUrl ?? null);
      setValue("imageUrl", vacancy.imageUrl ?? "");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  }

  function clearImage(e: React.MouseEvent) {
    e.stopPropagation();
    setImagePreview(null);
    setUploadError("");
    setValue("imageUrl", "", { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(data: UpdateVacancyData) {
    setError("");

    // ── PARTIAL UPDATE: only send fields the user actually changed ──
    const changedFields = Object.keys(dirtyFields) as Array<keyof UpdateVacancyData>;
    const payload: Partial<UpdateVacancyData> = {};

    for (const key of changedFields) {
      const value = data[key];
      if (key === "imageUrl") {
        payload.imageUrl = value === "" ? undefined : (value as string);
      } else {
        // @ts-expect-error – dynamic partial assignment
        payload[key] = value;
      }
    }

    if (Object.keys(payload).length === 0) {
      // Nothing changed — treat as a no-op success
      onSuccess?.();
      return;
    }

    const id  = vacancy._id ?? vacancy.id;
    const res = await updateVacancyAction(id, payload);
    if (res.success) {
      onSuccess?.();
    } else {
      setError(res.message ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* ── Image upload ── */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#111827" }}>
          Cover Image
        </label>

        {/* Dropzone — ALL sizing/layout/clipping forced via inline style
            so it can never silently collapse or overflow regardless of
            whether Tailwind compiles arbitrary/utility classes here. */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={isUploading ? undefined : handleDrop}
          style={{
            position: "relative",
            width: "100%",
            height: "180px",
            boxSizing: "border-box",
            border: "2px dashed #d1d5db",
            borderRadius: "12px",
            backgroundColor: "#f9fafb",
            overflow: "hidden",
            cursor: isUploading ? "not-allowed" : "pointer",
            marginBottom: "24px",
          }}
          className="group"
        >
          {imagePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: isUploading ? 0.5 : 1,
                }}
              />

              {isUploading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "rgba(0,0,0,0.4)",
                  }}
                >
                  <Loader2 className="animate-spin" size={22} style={{ color: "#fff" }} />
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>
                    Uploading…
                  </span>
                </div>
              )}

              {!isUploading && (
                <>
                  <button
                    type="button"
                    onClick={clearImage}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      borderRadius: "9999px",
                      border: "none",
                      padding: 6,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                  <div
                    className="group-hover:opacity-100"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "6px 14px",
                        borderRadius: "9999px",
                      }}
                    >
                      Click to change
                    </span>
                  </div>
                </>
              )}
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  backgroundColor: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={20} style={{ color: "#4b5563" }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#374151", margin: 0 }}>
                Click to upload image
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                or drag and drop · PNG, JPG, WEBP
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFilePick}
          disabled={isUploading}
        />

        {uploadError && (
          <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{uploadError}</p>
        )}

        <input type="hidden" {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.imageUrl.message}</p>
        )}
      </div>

      {/* ── Restaurant + Location ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "#6b7280" }}>Restaurant Name</label>
          <input {...register("RestaurantName")} className="w-full border rounded-md px-3 py-1.5 text-sm" style={{ color: "#111827", backgroundColor: "#fff", borderColor: "#d1d5db" }} />
          {errors.RestaurantName && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.RestaurantName.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "#6b7280" }}>Location</label>
          <input {...register("location")} className="w-full border rounded-md px-3 py-1.5 text-sm" style={{ color: "#111827", backgroundColor: "#fff", borderColor: "#d1d5db" }} />
          {errors.location && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.location.message}</p>}
        </div>
      </div>

      {/* ── Position + Job Type ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "#6b7280" }}>Position</label>
          <input {...register("position")} className="w-full border rounded-md px-3 py-1.5 text-sm" style={{ color: "#111827", backgroundColor: "#fff", borderColor: "#d1d5db" }} />
          {errors.position && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.position.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "#6b7280" }}>Job Type</label>
          <select {...register("jobType")} className="w-full border rounded-md px-3 py-1.5 text-sm" style={{ color: "#111827", backgroundColor: "#fff", borderColor: "#d1d5db" }}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>
      </div>

      {/* ── Salary ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "#6b7280" }}>Salary (Rs.)</label>
          <input
            {...register("salary", { valueAsNumber: true })}
            type="number"
            className="w-full border rounded-md px-3 py-1.5 text-sm"
            style={{ color: "#111827", backgroundColor: "#fff", borderColor: "#d1d5db" }}
          />
          {errors.salary && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.salary.message}</p>}
        </div>
        <div />
      </div>

      {/* ── Description ── */}
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: "#6b7280" }}>Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full border rounded-md px-3 py-1.5 text-sm resize-none"
          style={{ color: "#111827", backgroundColor: "#fff", borderColor: "#d1d5db" }}
        />
        {errors.description && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.description.message}</p>}
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded-md" style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}>
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border rounded-md px-4 py-1.5 text-sm transition-colors"
            style={{ color: "#374151", borderColor: "#d1d5db" }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: "#111827", color: "#fff" }}
        >
          {isSubmitting ? "Saving…" : isUploading ? "Waiting for image…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}