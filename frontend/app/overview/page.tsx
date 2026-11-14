import { ArrowUpRight, BadgeInfo, Drill, Shield, Target, Users } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";

const stats = [
  { label: "Matches played", value: "380", change: "+12", tone: "lavender", icon: Drill },
  { label: "Goals scored", value: "1,042", change: "+44", tone: "blue", icon: Target },
  { label: "Avg goals / match", value: "2.74", change: "+0.12", tone: "sage", icon: ArrowUpRight },
  { label: "Top scorer", value: "Haaland", change: "18 goals", tone: "rose", icon: Users },
  { label: "Clean sheets", value: "86", change: "+5", tone: "sand", icon: Shield },
] as const;

const standings = [
  { club: "Liverpool", pos: 1, p: 12, gd: 17, pts: 30, form: "W W D W W" },
  { club: "Arsenal", pos: 2, p: 12, gd: 13, pts: 28, form: "W D W L W" },
  { club: "Man City", pos: 3, p: 12, gd: 10, pts: 25, form: "W D W D W" },
  { club: "Chelsea", pos: 4, p: 12, gd: 7, pts: 24, form: "D W L W W" },
  { club: "Spurs", pos: 5, p: 12, gd: 2, pts: 22, form: "W L D W D" },
  { club: "Villa", pos: 6, p: 12, gd: -1, pts: 19, form: "W D L D L" },
] as const;

const leaderboards = [
  { player: "Erling Haaland", metric: "Goals", value: "18" },
  { player: "Bukayo Saka", metric: "xG", value: "9.6" },
  { player: "Mohamed Salah", metric: "xA", value: "8.8" },
  { player: "Rodri", metric: "Progressive passes", value: "354" },
] as const;

const insights = [
  "Liverpool are converting a higher share of high-value chances than their expected-goals profile suggests.",
  "Arsenal’s pressing structure is producing the league’s strongest turnover rate in the final third.",
  "Chelsea’s expected-goals conceded has improved sharply over the last five fixtures.",
] as const;

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Season snapshot</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Intelligence Overview</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E4EC] bg-[#F2F1F7] px-3 py-1.5 text-xs font-medium text-[#73798A]">
          <BadgeInfo className="h-3.5 w-3.5 text-[#817BAF]" />
          Demo data only until source validation is complete
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
                {standings.map((row) => (
                  <tr key={row.club} className="border-b border-[#F2F1F7] last:border-b-0">
                    <td className="py-3 pr-4 font-medium text-[#303444]">{row.pos}</td>
                    <td className="py-3 pr-4 font-medium text-[#303444]">{row.club}</td>
                    <td className="py-3 pr-4 text-[#73798A]">{row.p}</td>
                    <td className="py-3 pr-4 text-[#73798A]">{row.gd}</td>
                    <td className="py-3 pr-4 font-medium text-[#303444]">{row.pts}</td>
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
            {leaderboards.map((item) => (
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
            {insights.map((insight) => (
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
