import { SectionCard } from "@/components/section-card";

const pitchSlots = [
  ["GK", "LB", "CB", "CB", "RB"],
  ["LM", "CM", "CAM", "CM", "RM"],
  ["CF", "ST", "LW", "RW"],
] as const;

export default function TacticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#73798A]">Event analysis</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#303444]">Tactical Lab</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Formation analysis" description="Pitch-based starting lineup and role layout">
          <div className="relative overflow-hidden rounded-[28px] border border-[#E5E4EC] bg-[radial-gradient(circle_at_center,_rgba(133,125,183,0.12),_rgba(255,255,255,1)_65%)] p-6">
            <div className="relative mx-auto h-[420px] w-full max-w-[700px] rounded-[28px] border-[3px] border-[#303444] bg-[linear-gradient(180deg,#EAF1EB_0%,#F2F1F7_100%)]">
              <div className="absolute inset-0 rounded-[26px] border border-[#303444]/15" />
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#303444]/40" />
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#303444]/40" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#303444]/70" />

              <div className="absolute inset-0 grid place-items-center">
                <div className="grid w-full max-w-[560px] grid-cols-5 gap-4 px-8 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#303444]">
                  {pitchSlots.flat().map((slot) => (
                    <div key={slot} className="flex h-12 items-center justify-center rounded-full border border-[#303444]/25 bg-white/75 shadow-sm">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Coverage status" description="Event-derived tactical coverage and data limitations">
          <div className="space-y-4">
            {[
              ["Current match coverage", "82%"],
              ["Shot map coverage", "76%"],
              ["Passing network coverage", "68%"],
              ["Pressing indicators", "Limited"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E5E4EC] bg-[#F7F7FA] p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#73798A]">{label}</span>
                  <span className="font-semibold text-[#303444]">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
