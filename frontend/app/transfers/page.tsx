'use client';

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/section-card";
import { fetchJson } from "@/lib/api";

type Transfer = {
  name: string;
  club: string;
  age: number;
  listed: number;
  model: number;
  gap: number;
};

export default function TransfersPage() {
  const [players, setPlayers] = useState<Transfer[]>([]);

  useEffect(() => {
    let ignore = false;
    fetchJson<Transfer[]>("/api/transfers")
      .then((response) => {
        if (!ignore) setPlayers(response);
      })
      .catch(() => {
        if (!ignore) setPlayers([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Recruitment analytics</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Transfer Intelligence</h1>
      </div>

      <SectionCard title="Valuation model" description="Market-value comparison and value-gap ranking">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[#73798A]">
              <tr className="border-b border-[#E5E4EC]">
                <th className="pb-3 pr-4 font-medium">Player</th>
                <th className="pb-3 pr-4 font-medium">Club</th>
                <th className="pb-3 pr-4 font-medium">Age</th>
                <th className="pb-3 pr-4 font-medium">Listed</th>
                <th className="pb-3 pr-4 font-medium">Model</th>
                <th className="pb-3 font-medium">Gap</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.name} className="border-b border-[#F2F1F7] last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-[#303444]">{player.name}</td>
                  <td className="py-3 pr-4 text-[#73798A]">{player.club}</td>
                  <td className="py-3 pr-4 text-[#73798A]">{player.age}</td>
                  <td className="py-3 pr-4 text-[#303444]">€{player.listed}M</td>
                  <td className="py-3 pr-4 text-[#303444]">€{player.model}M</td>
                  <td className={`py-3 font-medium ${player.gap < 0 ? "text-[#B77B7D]" : "text-[#6F927B]"}`}>
                    {player.gap > 0 ? `+€${player.gap}M` : `-€${Math.abs(player.gap)}M`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
