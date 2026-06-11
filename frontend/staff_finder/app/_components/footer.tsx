import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#131c2e] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <img
                  src="/image/chef-hat.png"
                  alt="Restaurant Staff Finder logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-[17px] font-semibold tracking-tight">
                Restaurant Staff Finder
              </span>
            </div>
            <p className="text-sm text-[#8a95a8] leading-relaxed max-w-[220px]">
              Connecting talented professionals with amazing restaurant opportunities.
            </p>
          </div>

          {/* For Job Seekers */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">For Job Seekers</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/jobs" className="text-sm text-[#8a95a8] hover:text-white transition-colors duration-150">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-[#8a95a8] hover:text-white transition-colors duration-150">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-[#8a95a8] hover:text-white transition-colors duration-150">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">For Employers</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/post-job" className="text-sm text-[#8a95a8] hover:text-white transition-colors duration-150">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-[#8a95a8] hover:text-white transition-colors duration-150">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-[#8a95a8] hover:text-white transition-colors duration-150">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-[#8a95a8]">support@restaurantstaff.com</li>
              <li className="text-sm text-[#8a95a8]">(555) 123-4567</li>
              <li className="text-sm text-[#8a95a8]">123 Main St, New York, NY</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1e2d42]">
        <div className="max-w-7xl mx-auto px-8 py-5 text-center">
          <p className="text-sm text-[#8a95a8]">
            © 2026 Restaurant Staff Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;