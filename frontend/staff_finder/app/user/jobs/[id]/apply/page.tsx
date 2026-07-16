"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { applyForVacancyAction } from "@/app/lib/actions/application-action";
import { ArrowLeft, Upload, Loader2, FileText } from "lucide-react";

const ApplySchema = z.object({
  fullName:    z.string().min(1, "Full name is required"),
  email:       z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters"),
  cvUrl:       z.string().min(1, "CV is required"),
});

type ApplyData = z.infer<typeof ApplySchema>;

const UPLOAD_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/upload`;

export default function ApplyPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading]   = useState(false);
  const [cvName, setCvName]         = useState<string>("");
  const [uploadError, setUploadError] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyData>({
    resolver: zodResolver(ApplySchema),
  });

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch(UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setValue("cvUrl", data.url);
        setCvName(file.name);
      } else {
        setUploadError("Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: ApplyData) {
    setServerError("");
    const res = await applyForVacancyAction(id, {
      fullName:    data.fullName,
      email:       data.email,
      phoneNumber: data.phoneNumber,
      coverLetter: data.coverLetter,
      cvUrl:       data.cvUrl,
    });
    if (res.success) {
      router.push("/user/applications");
    } else {
      setServerError(res.message ?? "Something went wrong");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Apply for this Job</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Fill in your details to submit your application
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">

          {/* Full Name */}
          <Field label="Full Name" required error={errors.fullName?.message}>
            <input
              {...register("fullName")}
              placeholder="Sujal Gauchan"
              className={inputCls}
            />
          </Field>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" required error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                placeholder="sujal@gmail.com"
                className={inputCls}
              />
            </Field>
            <Field label="Phone Number" required error={errors.phoneNumber?.message}>
              <input
                {...register("phoneNumber")}
                placeholder="9800000000"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Cover Letter */}
          <Field label="Cover Letter" required error={errors.coverLetter?.message}>
            <textarea
              {...register("coverLetter")}
              placeholder="Tell the employer why you're a great fit for this position..."
              rows={5}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              CV / Resume <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                cvName ? "border-orange-300 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={24} className="text-orange-500 animate-spin" />
                  <p className="text-sm text-gray-500">Uploading…</p>
                </div>
              ) : cvName ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText size={24} className="text-orange-500" />
                  <p className="text-sm font-medium text-gray-700">{cvName}</p>
                  <p className="text-xs text-gray-400">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Click to upload CV</p>
                  <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              className="hidden"
              onChange={handleCvUpload}
              disabled={uploading}
            />
            <input type="hidden" {...register("cvUrl")} />
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            {errors.cvUrl && <p className="text-xs text-red-500 mt-1">{errors.cvUrl.message}</p>}
          </div>

        </div>

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
            {serverError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition";

function Field({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}