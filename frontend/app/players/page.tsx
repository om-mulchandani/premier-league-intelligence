'use client';

import { useEffect, useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { fetchJson } from "@/lib/api";

type Player = {
  name: string;
  club: string;
  position: string;
  goals: number;
  assists: number;
  xg: number;
  xa: number;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchJson<Player[]>("/api/players")
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

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return players;

    return players.filter((player) => {
      const haystack = `${player.name} ${player.club} ${player.position}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [players, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Player analytics</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Player Lab</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E4EC] bg-[#F2F1F7] px-3 py-1.5 text-xs font-medium text-[#73798A]">
          <Star className="h-3.5 w-3.5 text-[#817BAF]" />
          Backend payload is wired in for the directory view
        </div>
      </div>

      <SectionCard title="Player directory" description="Searchable Premier League player view">
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] px-3 py-2.5">
          <Search className="h-4 w-4 text-[#73798A]" />
          <input
            aria-label="Filter players"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by club, position or player"
            className="w-full bg-transparent text-sm text-[#303444] outline-none placeholder:text-[#73798A]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[#73798A]">
              <tr className="border-b border-[#E5E4EC]">
                <th className="pb-3 pr-4 font-medium">Player</th>
                <th className="pb-3 pr-4 font-medium">Club</th>
                <th className="pb-3 pr-4 font-medium">Pos</th>
                <th className="pb-3 pr-4 font-medium">Goals</th>
                <th className="pb-3 pr-4 font-medium">Assists</th>
                <th className="pb-3 pr-4 font-medium">xG</th>
                <th className="pb-3 font-medium">xA</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.name} className="border-b border-[#F2F1F7] last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-[#303444]">{player.name}</td>
                  <td className="py-3 pr-4 text-[#73798A]">{player.club}</td>
                  <td className="py-3 pr-4 text-[#73798A]">{player.position}</td>
                  <td className="py-3 pr-4 text-[#303444]">{player.goals}</td>
                  <td className="py-3 pr-4 text-[#303444]">{player.assists}</td>
                  <td className="py-3 pr-4 text-[#303444]">{player.xg}</td>
                  <td className="py-3 text-[#303444]">{player.xa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
