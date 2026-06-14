"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/lib/actions/auth-action";

const navItems = [
  { label: "Overview",     href: "/admin",              icon: LayoutDashboard },
  { label: "Vacancies",    href: "/admin/vacancies",    icon: Briefcase },
  { label: "Users",        href: "/admin/user",         icon: Users },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Settings",     href: "/admin/settings",     icon: Settings },
];

interface Props {
  user: {
    name?:  string;
    role?:  string;
    image?: string;
  };
}

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  function initials(name?: string) {
    if (!name || typeof name !== "string" || name.trim() === "") return "A";
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  async function handleLogout() {
    await logoutAction();
    router.push("/auth/login");
  }

  const displayName = user?.name?.trim() || "Admin";
  const displayRole = user?.role ?? "Admin";

  return (
    <aside className="w-64 min-h-screen bg-white rounded-2xl shadow-sm p-6 flex flex-col shrink-0">

      {/* Avatar + user info */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-orange-100">
          {user?.image ? (
            <img
              src={user.image}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-semibold">
              {initials(displayName)}
            </div>
          )}
        </div>
        <p className="font-semibold text-gray-900 text-base leading-tight">
          {displayName}
        </p>
        <p className="text-sm text-gray-400 mt-0.5 capitalize">{displayRole}</p>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                className={active ? "text-orange-500" : "text-gray-400"}
              />
              {label}
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