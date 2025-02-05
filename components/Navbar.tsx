"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/20 backdrop-blur-xl border border-white/10">
      <div className="px-8 py-4">
        <div className="flex items-center justify-center space-x-12">
          <Link
            href="/"
            className={cn(
              "text-lg font-medium transition-colors",
              pathname === "/" ? "text-white" : "text-white/70 hover:text-white/90"
            )}
          >
            StartUps
          </Link>
          <Link
            href="/investors"
            className={cn(
              "text-lg transition-colors",
              pathname === "/investors" ? "text-white" : "text-white/70 hover:text-white/90"
            )}
          >
            Investors
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-lg transition-colors",
              pathname === "/contact" ? "text-white" : "text-white/70 hover:text-white/90"
            )}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
