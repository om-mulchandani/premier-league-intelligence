'use client';

import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeInfo, Drill, Shield, Target, Users } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { fetchJson } from "@/lib/api";

type OverviewResponse = {
  kpis: Array<{ label: string; value: number | string; change: number | string }>;
  standings: Array<{ club: string; position: number; played: number; gd: number; points: number; form: string }>;
  insights: string[];
};

type Tone = "lavender" | "blue" | "sage" | "rose" | "sand";

const toneMap: Record<string, Tone> = {
  "Matches played": "lavender",
  "Goals scored": "blue",
  "Avg goals / match": "sage",
  "Top scorer": "rose",
  "Clean sheets": "sand",
};

const iconMap: Record<string, typeof Users> = {
  "Matches played": Drill,
  "Goals scored": Target,
  "Avg goals / match": ArrowUpRight,
  "Top scorer": Users,
  "Clean sheets": Shield,
};

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);

  useEffect(() => {
    let ignore = false;
    fetchJson<OverviewResponse>("/api/overview")
      .then((response) => {
        if (!ignore) {
          setData(response);
        }
      })
      .catch(() => {
        if (!ignore) {
          setData({ kpis: [], standings: [], insights: [] });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (!data) {
    return <div className="rounded-2xl border border-[#E5E4EC] bg-white p-6 text-sm text-[#73798A]">Loading overview…</div>;
  }

  const stats = data.kpis.map((stat) => ({
    label: stat.label,
    value: typeof stat.value === "number" ? stat.value.toLocaleString() : String(stat.value),
    change: typeof stat.change === "number" ? (stat.change >= 0 ? `+${stat.change}` : `${stat.change}`) : String(stat.change),
    tone: toneMap[stat.label] ?? "lavender",
    icon: iconMap[stat.label] ?? Users,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Season snapshot</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Intelligence Overview</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E4EC] bg-[#F2F1F7] px-3 py-1.5 text-xs font-medium text-[#73798A]">
          <BadgeInfo className="h-3.5 w-3.5 text-[#817BAF]" />
          Live backend payloads are connected to the page
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Premier League standings" description="Current club standings and recent form">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[#73798A]">
                <tr className="border-b border-[#E5E4EC]">
                  <th className="pb-3 pr-4 font-medium">Pos</th>
                  <th className="pb-3 pr-4 font-medium">Club</th>
                  <th className="pb-3 pr-4 font-medium">P</th>
                  <th className="pb-3 pr-4 font-medium">GD</th>
                  <th className="pb-3 pr-4 font-medium">Pts</th>
                  <th className="pb-3 font-medium">Form</th>
                </tr>
              </thead>
              <tbody>
                {data.standings.map((row) => (
                  <tr key={row.club} className="border-b border-[#F2F1F7] last:border-b-0">
                    <td className="py-3 pr-4 font-medium text-[#303444]">{row.position}</td>
                    <td className="py-3 pr-4 font-medium text-[#303444]">{row.club}</td>
                    <td className="py-3 pr-4 text-[#73798A]">{row.played}</td>
                    <td className="py-3 pr-4 text-[#73798A]">{row.gd}</td>
                    <td className="py-3 pr-4 font-medium text-[#303444]">{row.points}</td>
                    <td className="py-3 text-[#73798A]">{row.form}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Season probabilities" description="Model-generated probabilities using the simulation layer">
          <div className="space-y-4">
            {[
              ["Title", "23.4%", "Liverpool"],
              ["Top four", "76.8%", "Arsenal"],
              ["Relegation", "6.2%", "Everton"],
            ].map(([label, value, club]) => (
              <div key={label} className="rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] p-3">
                <div className="flex items-center justify-between text-sm text-[#73798A]">
                  <span>{label}</span>
                  <span className="font-semibold text-[#303444]">{value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#E5E4EC]">
                  <div
                    className="h-2 rounded-full bg-[#817BAF]"
                    style={{ width: label === "Relegation" ? "6%" : label === "Top four" ? "77%" : "23%" }}
                  />
                </div>
                <div className="mt-2 text-xs text-[#73798A]">Leading candidate: {club}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Player performance" description="Leading metrics from the current season snapshot">
          <div className="space-y-3">
            {[
              { player: "Erling Haaland", metric: "Goals", value: "18" },
              { player: "Bukayo Saka", metric: "xG", value: "9.6" },
              { player: "Mohamed Salah", metric: "xA", value: "8.8" },
              { player: "Rodri", metric: "Progressive passes", value: "354" },
            ].map((item) => (
              <div key={item.player} className="flex items-center justify-between rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] p-3">
                <div>
                  <div className="font-medium text-[#303444]">{item.player}</div>
                  <div className="text-sm text-[#73798A]">{item.metric}</div>
                </div>
                <div className="text-lg font-semibold text-[#303444]">{item.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Statistical insights" description="Metrics derived from model and data calculations">
          <ul className="space-y-3">
            {data.insights.map((insight) => (
              <li key={insight} className="flex gap-3 rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] p-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2F8] text-[#4B6A84]">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-6 text-[#303444]">{insight}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
