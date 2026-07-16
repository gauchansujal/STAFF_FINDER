"use client";

import { Bell } from "lucide-react";

interface Props {
  user: { name: string; image?: string };
}

export default function UserHeader({ user }: Props) {
  function initials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-orange-100 rounded-xl mb-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
          <img src="/image/chef-hat.png" alt="logo" className="w-6 h-6 object-contain"
            onError={(e) => (e.target as HTMLImageElement).style.display = "none"} />
        </div>
        <span className="text-[17px] font-semibold text-gray-900">Restaurant Staff Finder</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-100">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                {initials(user.name)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-400">Job Seeker</p>
          </div>
        </div>
      </div>
    </header>
  );
}