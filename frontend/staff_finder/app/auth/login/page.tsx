"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/app/auth/_components/LoginForm";
import { loginAction } from "@/app/lib/actions/auth-action";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f4f0] p-6">
      <LoginForm
        onNavigateToRegister={() => router.push("/auth/register")}
        onSubmit={async (data) => {
          const result = await loginAction(data);
          if (!result.success) throw new Error(result.message);
          router.push("/"); // change to your protected route
        }}
      />
    </main>
  );
}