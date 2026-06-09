import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <main className="flex flex-col items-center text-center gap-8 px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">🚲</span>
          <span className="text-2xl font-bold tracking-tight text-[#1a1a18]">
            BikeRental
          </span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-[#1a1a18] sm:text-5xl">
            Welcome to BikeRental
          </h1>
          <p className="text-lg text-[#888680] max-w-md">
            Rent bikes easily and explore your city at your own pace.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            href="/auth/login"
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#1a1a18] text-white text-sm font-semibold transition-colors hover:bg-[#2d2d2a]"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#d8d6d0] bg-white text-[#1a1a18] text-sm font-semibold transition-colors hover:bg-[#f5f4f0]"
          >
            Create account
          </Link>
        </div>
      </main>
    </div>
  );
}