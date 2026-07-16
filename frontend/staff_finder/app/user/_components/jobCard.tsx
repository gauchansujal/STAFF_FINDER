"use client";

import { MapPin, DollarSign, Briefcase, Clock } from "lucide-react";
import { Vacancy } from "@/app/lib/api/vacancy";
import { useRouter } from "next/navigation";

interface Props {
  vacancy: Vacancy;
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff  = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0)  return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function JobCard({ vacancy }: Props) {
  const router = useRouter();
  const id     = vacancy._id ?? vacancy.id;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-5 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-gray-100">
        {vacancy.imageUrl ? (
          <img src={vacancy.imageUrl} alt={vacancy.position} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Briefcase size={24} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{vacancy.position}</h3>
            <p className="text-orange-500 font-medium text-sm mt-0.5">{vacancy.RestaurantName}</p>
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
            🔖
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} className="text-orange-400" /> {vacancy.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <DollarSign size={12} className="text-orange-400" /> Rs. {vacancy.salary?.toLocaleString()}/year
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Briefcase size={12} className="text-orange-400" /> {vacancy.jobType}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} className="text-orange-400" /> {timeAgo(vacancy.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{vacancy.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{vacancy.applications ?? 0} applicants</span>
          <button
            onClick={() => router.push(`/user/jobs/${id}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}