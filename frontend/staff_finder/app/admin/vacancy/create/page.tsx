"use client";

import { useRouter } from "next/navigation";
import CreateVacancyForm from "../_components/CreteVacancyForm";

export default function CreateVacancyPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Post a Vacancy</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fill in the details to post a new job vacancy
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <CreateVacancyForm
          onSuccess={() => router.push("/admin/vacancy")}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}