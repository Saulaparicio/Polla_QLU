"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/leaderboard" || pathname === "/dashboard" || pathname === "/matches" || pathname === "/calendar" || pathname.startsWith("/admin");

  return (
    <main className={isHome ? "flex-1" : "flex-1 p-4 md:p-12 pb-32 md:pb-12"}>
      {children}
    </main>
  );
}
