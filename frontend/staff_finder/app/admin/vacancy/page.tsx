"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAllVacanciesAction, deleteVacancyAction } from "@/app/lib/actions/vacancy-action";
import { Vacancy } from "@/app/lib/api/vacancy";
import VacancyTable from "./_components/VacancyTable";
import UpdateVacancyForm from "./_components/UpdateVacancyForm";
import { Plus } from "lucide-react";

export default function VacancyPage() {
  const router = useRouter();
  const [vacancies, setVacancies]    = useState<Vacancy[]>([]);
  const [deleteId, setDeleteId]      = useState<string | null>(null);
  const [editing, setEditing]        = useState<Vacancy | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    startTransition(async () => {
      const res = await getAllVacanciesAction();
      if (res.success) setVacancies(res.data!);
    });
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    const res = await deleteVacancyAction(id);
    if (res.success) setVacancies((prev) => prev.filter((v) => (v._id ?? v.id) !== id));
    setDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Vacancies</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all job postings</p>
        </div>
        <button
          onClick={() => router.push("/admin/vacancy/create")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                     text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm
                     transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Vacancy
        </button>
      </div>

      {/* ── Table ── */}
      {isPending ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-sm text-gray-400">Loading vacancies…</p>
        </div>
      ) : (
        <VacancyTable
          vacancies={vacancies}
          onEdit={(v) => setEditing(v)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {/* ── Edit modal ── */}
      {editing && (
        <Modal title="Edit vacancy" onClose={() => setEditing(null)}>
          <UpdateVacancyForm
            vacancy={editing}
            onSuccess={() => { setEditing(null); load(); }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-[360px] shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Delete vacancy?</h2>
            <p className="text-sm text-gray-500">This action cannot be undone. The vacancy will be permanently removed.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium
                           text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2
                           text-sm font-medium transition-colors"
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

/* ── Reusable modal shell ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-[580px] shadow-xl max-h-[30vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
                       hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}