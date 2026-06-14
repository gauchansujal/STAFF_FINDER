"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  getAllUsersAction,
  deleteUserAction,
} from "@/app/lib/actions/admin/admin-actions";
import { User } from "@/app/lib/api/admin/admin";
import UserTable from "./_components/UserTable";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers]       = useState<User[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getAllUsersAction();
      if (res.success) setUsers(res.data!);
    });
  }, []);

  async function handleDelete(id: string) {
    const res = await deleteUserAction(id);
    if (res.success) setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all registered accounts
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/user/create")}
          className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add user
        </button>
      </div>

      {isPending ? (
        <div className="text-sm text-muted-foreground py-12 text-center">
          Loading users…
        </div>
      ) : (
        <UserTable
          users={users}
          onEdit={(u) => router.push(`/admin/user/${u.id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-background border rounded-xl p-6 w-[360px] shadow-lg">
            <h2 className="text-base font-semibold mb-2">Delete user?</h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteId(null)}
                className="border rounded-lg px-4 py-1.5 text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}