"use client";

import { User } from "@/app/lib/api/admin/admin";

interface Props {
  users: User[];
  onEdit:   (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  function initials(name?: string) {
    if (!name || typeof name !== "string" || !name.trim()) return "?";
    return name.trim().split(" ").filter(Boolean)
      .map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  function displayName(u: User) {
    return (u as any).name ||
      `${(u as any).firstname ?? ""} ${(u as any).lastname ?? ""}`.trim() ||
      u.username;
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-100">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">User</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Username</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Role</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Joined</th>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wide">Updated</th>
            <th />
          </tr>
        </thead>
        <tbody className="bg-gray-50">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-500 text-sm font-medium">
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const name = displayName(u);
              const id   = (u as any)._id ?? u.id;
              return (
                <tr
                  key={id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-100 transition-colors"
                >
                  {/* User */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {u.image ? (
                        <img
                          src={u.image}
                          alt={name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials(name)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td className="px-4 py-3.5 font-semibold text-gray-800">
                    @{u.username}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.role === "admin"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3.5 font-semibold text-gray-800">
                    {fmt(u.createdAt)}
                  </td>

                  {/* Updated */}
                  <td className="px-4 py-3.5 font-semibold text-gray-800">
                    {fmt(u.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(u)}
                        className="p-1.5 rounded-md hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}