"use client";

import { Application } from "@/app/lib/api/application";
import { FileText } from "lucide-react";

interface Props {
  applications: Application[];
  onAccept:     (id: string) => void;
  onReject:     (id: string) => void;
  onView:       (app: Application) => void;
  onDelete:     (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${mins} min${mins !== 1 ? "s" : ""} ago`;
}

function StatusBadge({ status }: { status: string }) {
  const styles = ({
    pending:  "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100  text-green-700",
    rejected: "bg-red-100    text-red-700",
  } as Record<string, string>)[status] ?? "bg-gray-100 text-gray-700";

  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${styles}`}>
      {status}
    </span>
  );
}

export default function ApplicationTable({
  applications,
  onAccept,
  onReject,
  onView,
  onDelete,
}: Props) {
  if (applications.length === 0) {
    return (
      <div className="text-sm text-gray-400 py-12 text-center">
        No applications yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => {
        const id             = app._id ?? app.id;
        const vacancyName    = app.vacancyId?.position       ?? "Unknown Position";
        const restaurantName = app.vacancyId?.RestaurantName ?? "Unknown Restaurant";
        const userImage      = app.userId?.imageUrl ?? app.userId?.image ?? null;

        return (
          <div
            key={id}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4"
          >
            {/* Avatar */}
            <div className="relative w-12 h-12 shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 absolute inset-0">
                <FileText size={20} />
              </div>
              {userImage && (
                <img
                  src={userImage}
                  alt={app.fullName}
                  className="w-12 h-12 rounded-full object-cover absolute inset-0"
                  onError={(e) => (e.target as HTMLImageElement).style.display = "none"}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 leading-tight">{app.fullName}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Applied for{" "}
                <span className="font-semibold text-orange-500">{vacancyName}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {restaurantName} · {timeAgo(app.createdAt)}
              </p>
            </div>

            {/* Status badge */}
            <StatusBadge status={app.status} />

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {app.status === "pending" && (
                <>
                  <button
                    onClick={() => onAccept(id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => onView(app)}
                className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onDelete(id)}
                className="text-xs text-red-400 hover:text-red-600 border border-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}