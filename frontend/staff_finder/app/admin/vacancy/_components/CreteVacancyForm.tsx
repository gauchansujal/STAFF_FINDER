"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createVacancyAction } from "@/app/lib/actions/vacancy-action";
import { useState, useRef } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";

const CreateVacancySchema = z.object({
  RestaurantName: z.string().min(1, "Restaurant name is required"),
  location:       z.string().min(1, "Location is required"),
  imageUrl:       z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  salary:         z.number().min(1, "Salary must be positive"),
  position:       z.string().min(1, "Position is required"),
  jobType:        z.enum(["full-time", "part-time"]),
  description:    z.string().min(20, "Description must be at least 20 characters"),
  applications:   z.number().min(0).optional(),
});

type CreateVacancyData = z.infer<typeof CreateVacancySchema>;

interface Props {
  onSuccess?: () => void;
  onCancel?:  () => void;
}

const UPLOAD_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/upload`
  : "/upload";

export default function CreateVacancyForm({ onSuccess, onCancel }: Props) {
  const [error, setError]               = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadError, setUploadError]   = useState("");
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateVacancyData>({
    resolver: zodResolver(CreateVacancySchema),
    defaultValues: {
      jobType:      "full-time",
      applications: 0,
      salary:       0,
      imageUrl:     "",
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

      setValue("imageUrl", data.url, { shouldValidate: true });
      setImagePreview(data.url);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Could not upload image"
      );
      setImagePreview(null);
      setValue("imageUrl", "");
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
    setValue("imageUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(data: CreateVacancyData) {
    setError("");
    const res = await createVacancyAction({
      ...data,
      applications: data.applications ?? 0,
      imageUrl:     data.imageUrl || undefined,
    });
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
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Cover Image
        </label>
        <div
  onClick={() => !isUploading && fileInputRef.current?.click()}
  onDragOver={(e) => e.preventDefault()}
  onDrop={isUploading ? undefined : handleDrop}
  style={{
    height: "200px",
    width: "50%",
    border: "2px dashed #999",
    borderRadius: "12px",
    backgroundColor: "#f3f4f6",
    position: "relative",
    cursor: isUploading ? "not-allowed" : "pointer",
    overflow: "hidden",
     marginBottom: "24px",
   
  }}
>

      
          {imagePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-full h-full object-cover transition-opacity ${
                  isUploading ? "opacity-50" : ""
                }`}
              />

              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                  <Loader2 className="animate-spin text-white" size={24} />
                  <span className="text-white text-xs font-medium">
                    Uploading…
                  </span>
                </div>
              )}

              {!isUploading && (
                <>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80
                               text-white rounded-full p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity">
                      Click to change
                    </span>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                <ImageIcon size={20} className="text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload image</p>
              <p className="text-xs text-gray-500">or drag and drop · PNG, JPG, WEBP</p>
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
          <p className="text-xs text-red-600 mt-1">{uploadError}</p>
        )}

        <input type="hidden" {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="text-xs text-red-600 mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* ── Restaurant + Location ── */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Restaurant Name" required error={errors.RestaurantName?.message}>
          <input
            {...register("RestaurantName")}
            placeholder="The Grand Kitchen"
            className={inputCls}
          />
        </Field>
        <Field label="Location" required error={errors.location?.message}>
          <input
            {...register("location")}
            placeholder="Kathmandu, Nepal"
            className={inputCls}
          />
        </Field>
      </div>

      {/* ── Position + Job Type ── */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Position" required error={errors.position?.message}>
          <input
            {...register("position")}
            placeholder="Head Chef"
            className={inputCls}
          />
        </Field>
        <Field label="Job Type" required error={errors.jobType?.message}>
          <select {...register("jobType")} className={inputCls}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </Field>
      </div>

      {/* ── Salary + Applications ── */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Salary (Rs.)" required error={errors.salary?.message}>
          <input
            {...register("salary", { valueAsNumber: true })}
            type="number"
            placeholder="50000"
            className={inputCls}
          />
        </Field>
        <Field label="Applications" error={undefined}>
          <input
            {...register("applications", { valueAsNumber: true })}
            type="number"
            placeholder="0"
            className={inputCls}
          />
        </Field>
      </div>

      {/* ── Description ── */}
      <Field label="Description" required error={errors.description?.message}>
        <textarea
          {...register("description")}
          placeholder="We are looking for an experienced…"
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* ── Global error ── */}
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium
                       hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium   hover:bg-gray-100 transition-colors"
        >
          {isSubmitting ? "Creating…" : isUploading ? "Waiting for image…" : "Create vacancy"}
        </button>
      </div>
    </form>
  );
}

/* ── Helpers ── */

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white " +
  "text-gray-900 placeholder:text-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}