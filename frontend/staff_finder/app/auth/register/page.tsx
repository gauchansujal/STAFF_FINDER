"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/app/auth/_components/RegisterForm";
import { registerAction } from "@/app/lib/actions/auth-action";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterForm
      onSubmit={async (data) => {
        const result = await registerAction(data);
        if (result.success) {
          router.push("/auth/login");
        } else {
          throw new Error(result.message);
        }
      }}
    />
  );
}