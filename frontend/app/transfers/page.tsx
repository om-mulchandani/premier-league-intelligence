import { SectionCard } from "@/components/section-card";

const players = [
  { name: "M. Rashford", club: "Villa", age: 27, listed: "€55M", model: "€61M", gap: "+€6M" },
  { name: "E. Eze", club: "Crystal Palace", age: 26, listed: "€42M", model: "€49M", gap: "+€7M" },
  { name: "B. Saka", club: "Arsenal", age: 23, listed: "€110M", model: "€118M", gap: "+€8M" },
  { name: "J. Bellingham", club: "Real Madrid", age: 21, listed: "€180M", model: "€171M", gap: "-€9M" },
] as const;

export default function TransfersPage() {
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
                  <td className="py-3 pr-4 text-[#303444]">{player.listed}</td>
                  <td className="py-3 pr-4 text-[#303444]">{player.model}</td>
                  <td className={`py-3 font-medium ${player.gap.startsWith("-") ? "text-[#B77B7D]" : "text-[#6F927B]"}`}>{player.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
