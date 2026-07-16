"use client";

import { useEffect, useState, useTransition } from "react";
import { getAllVacanciesAction } from "@/app/lib/actions/vacancy-action";
import { Vacancy } from "@/app/lib/api/vacancy";
import JobCard from "./_components/jobCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function BrowseJobsPage() {
  const [vacancies, setVacancies]   = useState<Vacancy[]>([]);
  const [search, setSearch]         = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const res = await getAllVacanciesAction();
      if (res.success) setVacancies(res.data!);
    });
  }, []);

  const filtered = vacancies.filter((v) =>
    v.position.toLowerCase().includes(search.toLowerCase()) ||
    v.RestaurantName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Job</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Explore {vacancies.length} restaurant opportunities
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title or restaurant..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Job list */}
      {isPending ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading jobs…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-400 py-12 text-center">No jobs found</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((v) => (
            <JobCard key={v._id ?? v.id} vacancy={v} />
          ))}
        </div>
      )}
    </div>
  );
}