"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVacancyByIdAction } from "@/app/lib/actions/vacancy-action";
import { Vacancy } from "@/app/lib/api/vacancy";
import {
  MapPin, DollarSign, Briefcase, Clock,
  Users, ArrowLeft, CheckCircle2
} from "lucide-react";

export default function VacancyDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getVacancyByIdAction(id);
      console.log("VACANCY RES:", JSON.stringify(res)); // 👈 debug
      if (res.success && res.data) {
        // handle nested data
        const v = (res.data as any)?.data ?? (res.data as any)?.vacancy ?? res.data;
        setVacancy(v);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400">Loading…</p>
    </div>
  );

  if (!vacancy) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400">Vacancy not found</p>
    </div>
  );

  // ✅ safe values
  const salary       = typeof vacancy.salary === "number" ? vacancy.salary : 0;
  const applications = vacancy.applications ?? 0;
  const requirements = vacancy.requirements ?? [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-72 rounded-2xl overflow-hidden mx-6 mt-6">
        {vacancy.imageUrl ? (
          <img src={vacancy.imageUrl} alt={vacancy.position} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-2 text-white text-sm font-medium bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl font-bold text-white">{vacancy.position}</h1>
          <p className="text-white/80 mt-1">{vacancy.RestaurantName}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Tag icon={<MapPin size={13} />}     label={vacancy.location} />
            <Tag icon={<DollarSign size={13} />} label={`Rs. ${salary.toLocaleString()}`} />
            <Tag icon={<Briefcase size={13} />}  label={vacancy.jobType} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-3 gap-6 px-6 mt-6 pb-10">

        {/* Left */}
        <div className="col-span-2 space-y-5">
          <Section title="Job Description">
            <p className="text-gray-600 leading-relaxed text-sm">{vacancy.description}</p>
            <div className="flex gap-2 mt-4">
              <Chip label={vacancy.jobType} color="orange" />
            </div>
          </Section>

          {requirements.length > 0 && (
            <Section title="Requirements">
              <ul className="space-y-2.5">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title={`About ${vacancy.RestaurantName}`}>
            <p className="text-gray-600 text-sm leading-relaxed">
              {vacancy.RestaurantName} is a restaurant located in {vacancy.location}.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InfoBox icon={<Users size={16} />}  label="Applicants" value={`${applications} candidates`} />
              <InfoBox icon={<MapPin size={16} />} label="Location"   value={vacancy.location} />
            </div>
          </Section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Posted</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={14} className="text-orange-500" />
                <span className="text-sm text-gray-700">{timeAgo(vacancy.createdAt)}</span>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Applicants</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Users size={14} className="text-orange-500" />
                <span className="text-sm text-gray-700">{applications} candidates</span>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Salary</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                Rs. {salary.toLocaleString()}
              </p>
            </div>
            <hr className="border-gray-100" />
            <button
              onClick={() => router.push(`/admin/applications`)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              View Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "—";
  const diff  = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0)  return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full">
      {icon}{label}
    </span>
  );
}

function Chip({ label, color }: { label: string; color: "orange" | "blue" }) {
  const cls = color === "orange"
    ? "bg-orange-100 text-orange-700"
    : "bg-blue-100 text-blue-700";
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${cls}`}>
      {label}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}