"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Intelligence Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Player Lab", href: "/players", icon: Users },
  { label: "Team Intelligence", href: "/teams", icon: ShieldCheck },
  { label: "Tactical Lab", href: "/tactics", icon: Radar },
  { label: "Transfer Intelligence", href: "/transfers", icon: CircleDollarSign },
  { label: "Season Simulator", href: "/simulator", icon: Workflow },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#303444]">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden min-h-[calc(100vh-3rem)] w-72 shrink-0 rounded-3xl border border-[#E5E4EC] bg-white p-4 shadow-[0_10px_30px_rgba(42,40,65,0.04)] lg:flex lg:flex-col">
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#EEEAF7] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#817BAF] text-white">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[#73798A]">Competition</div>
              <div className="text-sm font-semibold text-[#303444]">Premier League</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#EEEAF7] text-[#303444] shadow-sm"
                      : "text-[#73798A] hover:bg-[#F2F1F7] hover:text-[#303444]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#E5E4EC] bg-[#F2F1F7] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#303444]">
              <Sparkles className="h-4 w-4 text-[#817BAF]" />
              Data status
            </div>
            <p className="mt-2 text-sm text-[#73798A]">
              Demo data model in place. Full source validation pending provider audit.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-6 rounded-3xl border border-[#E5E4EC] bg-white px-4 py-3 shadow-[0_8px_22px_rgba(42,40,65,0.04)] sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#4B6A84]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#73798A]">Premier League Intelligence</div>
                  <div className="text-lg font-semibold text-[#303444]">Analytics workspace</div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 xl:max-w-[700px] xl:flex-row xl:items-center xl:justify-end">
                <div className="relative xl:min-w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73798A]" />
                  <input
                    aria-label="Global search"
                    placeholder="Search players or teams"
                    className="w-full rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] py-2.5 pl-9 pr-3 text-sm text-[#303444] outline-none transition focus:border-[#817BAF]"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] px-3 py-2 text-sm text-[#303444]">
                  <Activity className="h-4 w-4 text-[#6F927B]" />
                  <span>2026/27</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] px-3 py-2 text-sm text-[#303444]">
                  <span>Last update</span>
                  <span className="font-medium text-[#73798A]">14 Nov 2026</span>
                </div>
              </div>
            </div>
          </header>

          <div className="pb-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
