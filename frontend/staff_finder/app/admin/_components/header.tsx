"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageLightbox from "./ImageLightBox"; // ✅ adjust path if needed

interface Props {
  user: {
    name:      string;
    image?:    string;
    imageUrl?: string; // ✅
  };
}

export default function AdminHeader({ user }: Props) {
  const router = useRouter();
  const [showLightbox, setShowLightbox] = useState(false); // ✅

  function initials(name: string) {
    if (!name) return "A";
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  const role  = "Restaurant Admin";
  const photo = user.imageUrl || user.image; // ✅

  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-orange-100 rounded-xl mb-4">

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <img
            src="/image/chef-hat.png"
            alt="Restaurant Staff Finder logo"
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
          Restaurant Staff Finder
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Post Vacancy button */}
        <button
          onClick={() => router.push("/admin/vacancy/create")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          Post Vacancy
        </button>

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => photo && setShowLightbox(true)} // ✅ only opens if there's an actual photo
            className={`w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-orange-100 ${photo ? "cursor-pointer hover:ring-orange-300 transition-all" : ""}`}
          >
            {photo ? (
              <img
                src={photo}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                {initials(user.name)}
              </div>
            )}
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>

      </div>

      {/* ✅ Lightbox */}
      {showLightbox && photo && (
        <ImageLightbox
          src={photo}
          alt={user.name}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </header>
  );
}