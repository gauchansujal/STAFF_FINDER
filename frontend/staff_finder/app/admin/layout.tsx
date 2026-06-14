import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import AdminHeader from "./_components/header";
import { withToken } from "@/app/lib/api/axios";

function decodeJwt(token: string) {
  try {
    const base64 = token.split(".")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login");

  const payload = decodeJwt(token);
  if (!payload || payload.role !== "admin") redirect("/auth/login");

  let displayName = "Admin";
  let image: string | undefined;

  try {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    const res  = await withToken(token).get(`${BASE}/admin/users/${payload.id}`);
    const user = res.data?.data ?? res.data?.user ?? res.data;

    // backend uses lowercase firstname/lastname
    const first = user?.firstname ?? user?.firstName ?? "";
    const last  = user?.lastname  ?? user?.lastName  ?? "";
    displayName  = `${first} ${last}`.trim() || user?.username || "Admin";
    image        = user?.image ?? user?.imageUrl;
  } catch (err: any) {
    console.log("LAYOUT ERROR:", err.message);
    displayName = "Admin";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex gap-4 p-4">
      <Sidebar
        user={{
          name:  displayName,
          role:  payload.role,
          image: image,
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={{
            name:  displayName,
            image: image,
          }}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}