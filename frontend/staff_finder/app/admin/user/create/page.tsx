"use client";

import { useRouter } from "next/navigation";
import CreateUserForm from "../_components/CreteUserForm";

export default function CreateUserPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Create user</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add a new account to the platform
        </p>
      </div>

      <div className="border rounded-xl p-6 bg-background">
        <CreateUserForm
          onSuccess={() => router.push("/admin/user")}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}