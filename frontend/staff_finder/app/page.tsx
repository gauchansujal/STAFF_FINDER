"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./_components/footer";
import Header from "./_components/header";
import { Briefcase, UserPlus, TrendingUp, X } from "lucide-react";
import { getAllVacanciesAction } from "@/app/lib/actions/vacancy-action";
import { getMyApplicationsAction } from "@/app/lib/actions/application-action";
import { Vacancy } from "@/app/lib/api/vacancy";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const [activeJobs,  setActiveJobs]  = useState<number | null>(null);
  const [restaurants, setRestaurants] = useState<number | null>(null);
  const [myApps,      setMyApps]      = useState<number | null>(null);
  const [successRate, setSuccessRate] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      const [vacanciesRes, appsRes] = await Promise.all([
        getAllVacanciesAction(),
        getMyApplicationsAction(),
      ]);

      if (!mounted) return;

      if (vacanciesRes.success && vacanciesRes.data) {
        const vacancies: Vacancy[] = vacanciesRes.data;
        setActiveJobs(vacancies.length);
        const uniqueRestaurants = new Set(
          vacancies.map((v) => v.RestaurantName?.trim().toLowerCase()).filter(Boolean)
        );
        setRestaurants(uniqueRestaurants.size);
      }

      if (appsRes.success && appsRes.data) {
        const total    = appsRes.data.length;
        const accepted = appsRes.data.filter((a: any) => a.status === "accepted").length;
        setMyApps(total);
        const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;
        setSuccessRate(`${rate}%`);
      }
    }

    loadStats();
    return () => { mounted = false; };
  }, []);

  const handleProtectedClick = () => setShowPopup(true);

  function formatCount(n: number | null): string {
    if (n === null) return "—";
    return `${n.toLocaleString()}${n > 0 ? "+" : ""}`;
  }

  const stats = [
    { value: formatCount(activeJobs),  label: "Active Jobs" },
    { value: formatCount(restaurants), label: "Restaurants" },
    { value: formatCount(myApps),      label: "My Applications" },
    { value: successRate ?? "0%",      label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Header />

      <main className="flex flex-col flex-1">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 gap-10 bg-[#faf8f5]">
          <div className="flex flex-col gap-6 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight text-[#1a1a18]">
              Find Your Perfect{" "}
              <span className="text-orange-500">Restaurant Job</span>
            </h1>
            <p className="text-[#6b6b68] text-lg leading-relaxed">
              Connect with top restaurants and culinary opportunities. Whether
              you&apos;re a chef, server, or manager, discover your next career move.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleProtectedClick}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150"
              >
                <Briefcase size={18} />
                Find Jobs
              </button>
              <button
                onClick={handleProtectedClick}
                className="flex items-center gap-2 bg-[#1a1a18] hover:bg-[#2d2d2a] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150"
              >
                <UserPlus size={18} />
                Post Vacancy
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-lg flex-shrink-0">
            <img
              src="/image/italian_restaurant.jpg"
              alt="Italian Restaurant"
              className="w-full h-[420px] object-cover rounded-2xl"
            />
            <div className="absolute bottom-[-20px] left-[-20px] bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1a1a18]">{formatCount(activeJobs)}</p>
                <p className="text-sm text-[#888680]">Active Jobs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#131c2e] py-12 mt-10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-10 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-3xl font-bold text-orange-500">{stat.value}</p>
                <p className="text-sm text-[#8a95a8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Login Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Briefcase size={24} className="text-orange-500" />
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-bold text-[#1a1a18]">Login Required</h2>
              <p className="text-sm text-[#888680]">
                You should be logged in first to continue.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#1a1a18] text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}