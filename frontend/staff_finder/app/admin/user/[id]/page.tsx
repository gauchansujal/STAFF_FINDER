import { getUserByIdAction } from "@/app/lib/actions/admin/admin-actions";
import Link from "next/link";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default async function UserDetailPage({
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

  const u = res.data!;

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/user"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
      >
        ← Back to Users
      </Link>

      {/* Card */}
      <div className="border rounded-xl p-6 bg-background mt-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
            {u.image ? (
              <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-semibold">
                {u.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{u.name}</h1>
            <p className="text-sm text-muted-foreground">@{u.username}</p>
          </div>
          <Link
            href={`/admin/user/${id}/edit`}
            className="ml-auto border rounded-lg px-3 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            ✏️ Edit
          </Link>
        </div>

        <hr className="mb-4" />

        {/* Fields */}
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{u.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">First name</dt>
            <dd className="font-medium">{u.firstName ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Last name</dt>
            <dd className="font-medium">{u.lastName ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Role</dt>
            <dd>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                u.role === "admin"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-muted text-muted-foreground"
              }`}>
                {u.role}
              </span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Joined</dt>
            <dd className="font-medium">{fmt(u.createdAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Last updated</dt>
            <dd className="font-medium">{fmt(u.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}