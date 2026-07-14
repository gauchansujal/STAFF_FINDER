"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getAllApplicationsAction,
  updateApplicationStatusAction,
  deleteApplicationAction,
} from "@/app/lib/actions/application-action"; // ✅ fixed import
import { Application } from "@/app/lib/api/application";
import ApplicationTable from "./_components/applicationTable";

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending:  "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100  text-green-700",
    rejected: "bg-red-100    text-red-700",
  }[status] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${styles}`}>
      {status}
    </span>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <p className="text-xs font-semibold text-gray-500 w-28 shrink-0 pt-0.5">{label}</p>
      {children ?? <p className="text-gray-800 text-sm">{value}</p>}
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isPending, startTransition]    = useTransition();
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [selected, setSelected]         = useState<Application | null>(null);

  async function load() {
    startTransition(async () => {
      const res = await getAllApplicationsAction();
      if (res.success) setApplications(res.data!);
    });
  }

  useEffect(() => { load(); }, []);

  async function handleAccept(id: string) {
    const res = await updateApplicationStatusAction(id, "accepted");
    if (res.success) {
      setApplications((prev) =>
        prev.map((a) => (a._id === id || a.id === id) ? { ...a, status: "accepted" as const } : a)
      );
    }
  }

  async function handleReject(id: string) {
    const res = await updateApplicationStatusAction(id, "rejected");
    if (res.success) {
      setApplications((prev) =>
        prev.map((a) => (a._id === id || a.id === id) ? { ...a, status: "rejected" as const } : a)
      );
    }
  }

  async function handleDelete(id: string) {
    const res = await deleteApplicationAction(id);
    if (res.success) {
      setApplications((prev) => prev.filter((a) => a._id !== id && a.id !== id));
    }
    setDeleteId(null);
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
        <p className="text-sm text-orange-500 mt-0.5">
          Review and manage job applications
        </p>
      </div>
      {/* Table */}
      {isPending ? (
        <div className="text-sm text-gray-400 py-12 text-center">
          Loading applications…
        </div>
      ) : (
        <ApplicationTable
          applications={applications}
          onAccept={handleAccept}
          onReject={handleReject}
          onView={(app) => setSelected(app)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border rounded-xl p-6 w-[520px] shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Application Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <Row label="Full Name"  value={selected.fullName} />
              <Row label="Email"      value={selected.email} />
              <Row label="Phone"      value={selected.phoneNumber} />
              <Row label="Position"   value={selected.vacancyId?.position        ?? "—"} />
              <Row label="Restaurant" value={selected.vacancyId?.RestaurantName  ?? "—"} />
              <Row label="Status">
                <StatusBadge status={selected.status} />
              </Row>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Cover Letter</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                  {selected.coverLetter}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">CV</p>
                <a  // ✅ fixed missing opening tag
                  href={selected.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline text-sm"
                >
                  View CV →
                </a>
              </div>
            </div>

            {selected.status === "pending" && (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    handleAccept(selected._id ?? selected.id);
                    setSelected(null);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleReject(selected._id ?? selected.id);
                    setSelected(null);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border rounded-xl p-6 w-[360px] shadow-lg">
            <h2 className="text-base font-semibold mb-2">Delete application?</h2>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteId(null)}
                className="border rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors"
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