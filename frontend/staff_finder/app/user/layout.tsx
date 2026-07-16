import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserSidebar from "./_components/sidebar";
import UserHeader from "@/app/user/_components/header";
import { withToken } from "@/app/lib/api/axios";

function decodeJwt(token: string) {
  try {
    const base64  = token.split(".")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token       = cookieStore.get("token")?.value;

  if (!token) redirect("/auth/login");

  const payload = decodeJwt(token);
  if (!payload) redirect("/auth/login");

  // admin should go to admin panel
  if (payload.role === "admin") redirect("/admin");

  let displayName = "User";
  let image: string | undefined;

  try {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    const res  = await withToken(token).get(`${BASE}/admin/users/${payload.id}`);
    const user = res.data?.data ?? res.data?.user ?? res.data;
    const first = user?.firstname ?? user?.firstName ?? "";
    const last  = user?.lastname  ?? user?.lastName  ?? "";
    displayName  = `${first} ${last}`.trim() || user?.username || "User";
    image        = user?.imageUrl ?? user?.image;
  } catch {
    displayName = "User";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex gap-4 p-4">
      <UserSidebar user={{ name: displayName, role: "Job Seeker", image }} />
      <div className="flex-1 flex flex-col min-w-0">
        <UserHeader user={{ name: displayName, image }} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}