'use client';

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/section-card";
import { fetchJson } from "@/lib/api";

type SimulatorResponse = {
  probabilities: Array<{ club: string; title: number; top4: number; relegation: number }>;
  summary: { title_leader: string; top4_leader: string; relegation_leader: string };
};

export default function SimulatorPage() {
  const [data, setData] = useState<SimulatorResponse | null>(null);

  useEffect(() => {
    let ignore = false;
    fetchJson<SimulatorResponse>("/api/simulator")
      .then((response) => {
        if (!ignore) setData(response);
      })
      .catch(() => {
        if (!ignore) setData({ probabilities: [], summary: { title_leader: "", top4_leader: "", relegation_leader: "" } });
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (!data) {
    return <div className="rounded-2xl border border-[#E5E4EC] bg-white p-6 text-sm text-[#73798A]">Loading simulator…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Forecasting</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Season Simulator</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Title probability", `${data.summary.title_leader ? "23.4%" : "0%"}`, data.summary.title_leader || "Liverpool"],
          ["Top-four probability", `${data.summary.top4_leader ? "76.2%" : "0%"}`, data.summary.top4_leader || "Liverpool"],
          ["Relegation probability", `${data.summary.relegation_leader ? "32.1%" : "0%"}`, data.summary.relegation_leader || "Everton"],
        ].map(([label, value, team]) => (
          <div key={label} className="rounded-2xl border border-[#E5E4EC] bg-white p-4">
            <div className="text-sm text-[#73798A]">{label}</div>
            <div className="mt-2 text-3xl font-semibold text-[#303444]">{value}</div>
            <div className="mt-2 text-sm text-[#73798A]">Current leader: {team}</div>
          </div>
        ))}
      </div>

      <SectionCard title="League probabilities" description="Monte Carlo simulation summary for the remaining fixtures">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[#73798A]">
              <tr className="border-b border-[#E5E4EC]">
                <th className="pb-3 pr-4 font-medium">Club</th>
                <th className="pb-3 pr-4 font-medium">Title</th>
                <th className="pb-3 pr-4 font-medium">Top 4</th>
                <th className="pb-3 font-medium">Relegation</th>
              </tr>
            </thead>
            <tbody>
              {data.probabilities.map((row) => (
                <tr key={row.club} className="border-b border-[#F2F1F7] last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-[#303444]">{row.club}</td>
                  <td className="py-3 pr-4 text-[#303444]">{row.title}%</td>
                  <td className="py-3 pr-4 text-[#303444]">{row.top4}%</td>
                  <td className="py-3 text-[#303444]">{row.relegation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
