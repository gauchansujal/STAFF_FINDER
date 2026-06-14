import { getUserByIdAction } from "@/app/lib/actions/admin/admin-actions";
import UpdateUserForm from "../../_components/UpdateUserForm";
import Link from "next/link";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getUserByIdAction(id);

  if (!res.success) {
    return (
      <div className="p-6">
        <p className="text-red-500">{res.message ?? "Failed to load user"}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/admin/user/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
        >
          ← Back to User Details
        </Link>
        <h1 className="text-xl font-semibold mt-4">Edit user</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update user details
        </p>
      </div>

      <div className="border rounded-xl p-6 bg-background">
        <UpdateUserForm user={res.data!} />
      </div>
    </div>
  );
}