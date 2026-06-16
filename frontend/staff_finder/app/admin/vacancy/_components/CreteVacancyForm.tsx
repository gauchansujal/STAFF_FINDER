"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createVacancyAction } from "@/app/lib/actions/vacancy-action";
import { useState, useRef } from "react";
import { ImageIcon, X } from "lucide-react";

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

export default function CreateVacancyForm({ onSuccess, onCancel }: Props) {
  const [error, setError]           = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

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
    },
  });

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    // If you want to upload to a server and get a URL, do it here.
    // For now we store the local blob preview and clear imageUrl field.
    setValue("imageUrl", "");
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
        <label className="block text-sm font-medium text-foreground mb-2">
          Cover Image
        </label>

        {/* Rectangle upload zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative w-full h-44 rounded-xl border-2 border-dashed border-border
                     bg-muted/40 hover:bg-muted/70 hover:border-foreground/40
                     transition-colors cursor-pointer overflow-hidden group"
        >
          {imagePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview(null);
                  setValue("imageUrl", "");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
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
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <p className="text-sm font-medium text-foreground">Click to upload image</p>
              <p className="text-xs">or drag and drop · PNG, JPG, WEBP</p>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFilePick}
        />

        {/* Optional: paste a URL instead */}
        <div className="mt-2">
          <input
            {...register("imageUrl")}
            placeholder="Or paste an image URL…"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm
                       bg-background text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
          />
          {errors.imageUrl && (
            <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>
          )}
        </div>
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
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-border rounded-lg px-4 py-2 text-sm font-medium
                       hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-foreground text-background rounded-lg px-5 py-2 text-sm font-medium
                     disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? "Creating…" : "Create vacancy"}
        </button>
      </div>
    </form>
  );
}

/* ── Helpers ── */

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background " +
  "text-foreground placeholder:text-muted-foreground " +
  "focus:outline-none focus:ring-2 focus:ring-foreground/20 transition";

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
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}