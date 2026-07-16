"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase, Heart, FileText,
  User, Settings, LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/lib/actions/auth-action";

const navItems = [
  { label: "Browse Jobs",   href: "/user",              icon: Briefcase },
  { label: "Saved Jobs",    href: "/user/saved",        icon: Heart,     badge: "0" },
  { label: "Applications",  href: "/user/applications", icon: FileText },
  { label: "Profile",       href: "/user/profile",      icon: User },
  { label: "Settings",      href: "/user/settings",     icon: Settings },
];

interface Props {
  user: { name?: string; role?: string; image?: string };
}

export default function UserSidebar({ user }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  function initials(name?: string) {
    if (!name?.trim()) return "U";
    return name.trim().split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  async function handleLogout() {
    await logoutAction();
    router.push("/auth/login");
  }

  const displayName = user?.name?.trim() || "User";
  const photo       = user?.image;

  return (
    <aside className="w-64 min-h-screen bg-white rounded-2xl shadow-sm p-6 flex flex-col shrink-0">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-orange-100">
          {photo ? (
            <img src={photo} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-semibold">
              {initials(displayName)}
            </div>
          )}
        </div>
        <p className="font-semibold text-gray-900 text-base leading-tight">{displayName}</p>
        <p className="text-sm text-gray-400 mt-0.5">{user?.role ?? "Job Seeker"}</p>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const active = href === "/user"
            ? pathname === "/user"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-orange-50 text-orange-500" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} className={active ? "text-orange-500" : "text-gray-400"} />
              {label}
              {badge !== undefined && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  ({badge})
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2"
      >
        <LogOut size={18} strokeWidth={1.8} />
        Logout
      </button>
    </aside>
  );
}