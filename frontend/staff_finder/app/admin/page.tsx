"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAllUsersAction } from "@/app/lib/actions/admin/admin-actions";
import { getAllVacanciesAction } from "@/app/lib/actions/vacancy-action";
import {
  getAllApplicationsAction,
  updateApplicationStatusAction,
} from "@/app/lib/actions/application-action";
import { Application } from "@/app/lib/api/application";
import { Users, Briefcase, FileText, TrendingUp, FileCheck } from "lucide-react";

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${mins} min${mins !== 1 ? "s" : ""} ago`;
}

export default function AdminPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [totalUsers,        setTotalUsers]        = useState(0);
  const [totalVacancies,    setTotalVacancies]    = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [applications,      setApplications]      = useState<Application[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const [usersRes, vacanciesRes, appsRes] = await Promise.all([
        getAllUsersAction(),
        getAllVacanciesAction(),
        getAllApplicationsAction(),
      ]);
      if (usersRes.success)     setTotalUsers(usersRes.data?.length ?? 0);
      if (vacanciesRes.success) setTotalVacancies(vacanciesRes.data?.length ?? 0);
      if (appsRes.success) {
        setTotalApplications(appsRes.data?.length ?? 0);
        setApplications(appsRes.data?.slice(0, 5) ?? []); // latest 5
      }
    });
  }, []);

  async function handleAccept(id: string) {
    await updateApplicationStatusAction(id, "accepted");
    setApplications((prev) =>
      prev.map((a) => (a._id === id || a.id === id) ? { ...a, status: "accepted" as const } : a)
    );
  }

  async function handleReject(id: string) {
    await updateApplicationStatusAction(id, "rejected");
    setApplications((prev) =>
      prev.map((a) => (a._id === id || a.id === id) ? { ...a, status: "rejected" as const } : a)
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "+12%",
      icon: <Users size={22} className="text-white" />,
      bg: "bg-blue-500",
    },
    {
      label: "Active Vacancies",
      value: totalVacancies.toLocaleString(),
      change: "+8%",
      icon: <Briefcase size={22} className="text-white" />,
      bg: "bg-orange-500",
    },
    {
      label: "Applications",
      value: totalApplications.toLocaleString(),
      change: "+23%",
      icon: <FileText size={22} className="text-white" />,
      bg: "bg-green-500",
    },
    {
      label: "Active Jobs",
      value: totalVacancies.toLocaleString(),
      change: "+5%",
      icon: <TrendingUp size={22} className="text-white" />,
      bg: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your restaurant job postings and applicants
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                {s.icon}
              </div>
              <span className="text-xs font-bold text-green-500">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{isPending ? "…" : s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
          <button
            onClick={() => router.push("/admin/applications")}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            View all →
          </button>
        </div>

        {isPending ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No applications yet</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const id             = app._id ?? app.id;
              const vacancyName    = app.vacancyId?.position       ?? "Unknown Position";
              const restaurantName = app.vacancyId?.RestaurantName ?? "Unknown Restaurant";
              const userImage      = app.userId?.imageUrl ?? app.userId?.image ?? null;

              return (
                <div
                  key={id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative w-11 h-11 shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 absolute inset-0">
                      <FileCheck size={18} />
                    </div>
                    {userImage && (
                      <img
                        src={userImage}
                        alt={app.fullName}
                        className="w-11 h-11 rounded-full object-cover absolute inset-0"
                        onError={(e) => (e.target as HTMLImageElement).style.display = "none"}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{app.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Applied for{" "}
                      <span className="font-semibold text-gray-700">{vacancyName}</span>
                      {" "}at{" "}
                      <span className="font-semibold text-gray-700">{restaurantName}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(app.createdAt)}</p>
                  </div>

                  {/* Status / Actions */}
                  {app.status === "pending" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAccept(id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                        title="Accept"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleReject(id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                        title="Reject"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize shrink-0 ${
                      app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {app.status}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}