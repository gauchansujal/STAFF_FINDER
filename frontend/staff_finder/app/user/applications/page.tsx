"use client";

import { useEffect, useState, useTransition } from "react";
import { getMyApplicationsAction } from "@/app/lib/actions/application-action";
import { Application } from "@/app/lib/api/application";
import { FileText, MapPin, Clock } from "lucide-react";

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0)  return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
}

function StatusBadge({ status }: { status: string }) {
  const styles = ({
    pending:  "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100  text-green-700",
    rejected: "bg-red-100    text-red-700",
  } as Record<string, string>)[status] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${styles}`}>
      {status}
    </span>
  );
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isPending, startTransition]    = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getMyApplicationsAction();
      if (res.success) setApplications(res.data!);
    });
  }, []);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Track your job application status
        </p>
      </div>

      {isPending ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading…</div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No applications yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse jobs and apply to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const id             = app._id ?? app.id;
            const vacancyName    = app.vacancyId?.position       ?? "Unknown Position";
            const restaurantName = app.vacancyId?.RestaurantName ?? "Unknown Restaurant";
            const location       = app.vacancyId?.location       ?? "";
            const imageUrl       = app.vacancyId?.imageUrl       ?? null;

            return (
              <div key={id} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {imageUrl ? (
                    <img src={imageUrl} alt={vacancyName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{vacancyName}</p>
                      <p className="text-sm text-orange-500 font-medium">{restaurantName}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    {location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} /> {location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} /> Applied {timeAgo(app.createdAt)}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Cover Letter</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{app.coverLetter}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}