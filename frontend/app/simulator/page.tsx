import { SectionCard } from "@/components/section-card";

const probabilities = [
  { club: "Liverpool", title: "23.4%", top4: "76.2%", relegation: "0.1%" },
  { club: "Arsenal", title: "19.8%", top4: "71.4%", relegation: "0.2%" },
  { club: "Man City", title: "16.9%", top4: "68.9%", relegation: "0.3%" },
  { club: "Everton", title: "0.3%", top4: "2.7%", relegation: "32.1%" },
] as const;

export default function SimulatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Forecasting</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Season Simulator</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Title probability", "23.4%", "Liverpool"],
          ["Top-four probability", "76.2%", "Liverpool"],
          ["Relegation probability", "32.1%", "Everton"],
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
              {probabilities.map((row) => (
                <tr key={row.club} className="border-b border-[#F2F1F7] last:border-b-0">
                  <td className="py-3 pr-4 font-medium text-[#303444]">{row.club}</td>
                  <td className="py-3 pr-4 text-[#303444]">{row.title}</td>
                  <td className="py-3 pr-4 text-[#303444]">{row.top4}</td>
                  <td className="py-3 text-[#303444]">{row.relegation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
