'use client';

import { useEffect, useState } from "react";
import { CircleDot, Shield, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { fetchJson } from "@/lib/api";

type Team = {
  club: string;
  points: number;
  xg: number;
  xga: number;
  form: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    let ignore = false;
    fetchJson<Team[]>("/api/teams")
      .then((response) => {
        if (!ignore) setTeams(response);
      })
      .catch(() => {
        if (!ignore) setTeams([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

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
                  <div className="font-semibold text-[#303444]">{team.points} pts</div>
                  <div className="text-xs text-[#73798A]">{team.form}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Team style fingerprint" description="High-level tactical profile from normalized metrics">
          <div className="space-y-4">
            {[
              ["Possession orientation", "76%", "progressive"],
              ["Chance creation", "82%", "dynamic"],
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
