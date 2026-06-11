import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-orange-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <img
            src="/image/chef-hat.png"
            alt="Restaurant Staff Finder logo"
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
          Restaurant Staff Finder
        </span>
      </div>

      {/* Nav Actions */}
      <nav className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-gray-900 px-3.5 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="text-sm font-semibold text-white bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600 active:scale-95 transition-all duration-150"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
};

export default Header;