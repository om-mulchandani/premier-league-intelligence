import { Search, Star } from "lucide-react";
import { SectionCard } from "@/components/section-card";

const players = [
  { name: "Mohamed Salah", club: "Liverpool", position: "RW", goals: 14, assists: 9, xg: 12.7, xa: 8.1 },
  { name: "Erling Haaland", club: "Man City", position: "ST", goals: 18, assists: 6, xg: 17.3, xa: 5.2 },
  { name: "Bukayo Saka", club: "Arsenal", position: "RW", goals: 11, assists: 8, xg: 10.9, xa: 9.4 },
  { name: "Rodri", club: "Man City", position: "CM", goals: 4, assists: 6, xg: 3.2, xa: 5.5 },
] as const;

export default function PlayersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Player analytics</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Player Lab</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E4EC] bg-[#F2F1F7] px-3 py-1.5 text-xs font-medium text-[#73798A]">
          <Star className="h-3.5 w-3.5 text-[#817BAF]" />
          Demo dataset — role-aware clustering pending data validation
        </div>
      </div>

      <SectionCard title="Player directory" description="Searchable Premier League player view">
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] px-3 py-2.5">
          <Search className="h-4 w-4 text-[#73798A]" />
          <input
            aria-label="Filter players"
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
              {players.map((player) => (
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
