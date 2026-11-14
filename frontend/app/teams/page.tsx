import { CircleDot, Shield, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/section-card";

const teams = [
  { club: "Liverpool", pts: 30, xg: 27.3, xga: 11.4, form: "W W D W W" },
  { club: "Arsenal", pts: 28, xg: 24.7, xga: 13.5, form: "W D W L W" },
  { club: "Man City", pts: 25, xg: 22.1, xga: 12.6, form: "W D W D W" },
  { club: "Chelsea", pts: 24, xg: 21.4, xga: 15.3, form: "D W L W W" },
] as const;

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Team analytics</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Team Intelligence</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Attack and efficiency" description="Goals, xG and conversion profile">
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team.club} className="flex items-center justify-between rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] p-3">
                <div>
                  <div className="font-medium text-[#303444]">{team.club}</div>
                  <div className="text-sm text-[#73798A]">xG {team.xg} · xGA {team.xga}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#303444]">{team.pts} pts</div>
                  <div className="text-xs text-[#73798A]">{team.form}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Team style fingerprint" description="High-level tactical profile from normalized metrics">
          <div className="space-y-4">
            {[
              ["Possession orientation", "76%", "legendary"],
              ["Chance creation", "82%", "progressive"],
              ["Defensive activity", "71%", "mid-block"],
            ].map(([label, value, note]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#73798A]">{label}</span>
                  <span className="font-medium text-[#303444]">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#E5E4EC]">
                  <div className="h-2 rounded-full bg-[#A9A3D0]" style={{ width: value }} />
                </div>
                <div className="mt-2 text-xs text-[#73798A]">{note}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E4EC] bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-[#303444]">
            <TrendingUp className="h-4 w-4 text-[#817BAF]" />
            <span className="font-medium">Best attack</span>
          </div>
          <div className="text-xl font-semibold">Liverpool</div>
          <div className="mt-2 text-sm text-[#73798A]">Expected goals ranking and scoring efficiency</div>
        </div>
        <div className="rounded-2xl border border-[#E5E4EC] bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-[#303444]">
            <Shield className="h-4 w-4 text-[#6F927B]" />
            <span className="font-medium">Best defence</span>
          </div>
          <div className="text-xl font-semibold">Arsenal</div>
          <div className="mt-2 text-sm text-[#73798A]">Low expected-goals-against, strong compact shape</div>
        </div>
        <div className="rounded-2xl border border-[#E5E4EC] bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-[#303444]">
            <CircleDot className="h-4 w-4 text-[#7896B2]" />
            <span className="font-medium">Most efficient</span>
          </div>
          <div className="text-xl font-semibold">Chelsea</div>
          <div className="mt-2 text-sm text-[#73798A]">High chance creation with improving finishing profile</div>
        </div>
      </div>
    </div>
  );
}
