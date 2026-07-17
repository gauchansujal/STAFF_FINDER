"use client";

import { useState, useRef, useTransition } from "react";
import { User, Mail, Phone, MapPin, Camera, Loader2 } from "lucide-react";

const UPLOAD_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/upload`;

export default function ProfilePage() {
  const [isPending, startTransition]    = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState("");
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // show preview instantly
    setImagePreview(URL.createObjectURL(file));
    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch(UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setImagePreview(data.url);
      } else {
        setUploadError("Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your personal information</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                "U"
              )}
            </div>

            {/* ✅ camera button triggers file input */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={14} />}
            </button>

            {/* ✅ hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>

          <div>
            <p className="font-bold text-gray-900 text-lg">User</p>
            <p className="text-sm text-gray-500">Job Seeker</p>
            {uploading && <p className="text-xs text-orange-500 mt-0.5">Uploading…</p>}
            {uploadError && <p className="text-xs text-red-500 mt-0.5">{uploadError}</p>}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" placeholder="John" icon={<User size={16} />} />
            <Field label="Last Name"  placeholder="Doe"  icon={<User size={16} />} />
          </div>
          <Field label="Email"    placeholder="john@example.com" icon={<Mail size={16} />}  type="email" />
          <Field label="Phone"    placeholder="9800000000"       icon={<Phone size={16} />} type="tel" />
          <Field label="Location" placeholder="Kathmandu, Nepal" icon={<MapPin size={16} />} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea
              rows={4}
              placeholder="Tell employers about yourself..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, icon, type = "text" }: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-gray-900"
        />
      </div>
    </div>
  );
}