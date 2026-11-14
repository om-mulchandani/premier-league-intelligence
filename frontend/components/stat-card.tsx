import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "lavender" | "blue" | "sage" | "rose" | "sand";

const toneStyles: Record<Tone, string> = {
  lavender: "bg-[#EEEAF7] text-[#5A558A]",
  blue: "bg-[#EAF2F8] text-[#4B6A84]",
  sage: "bg-[#EAF1EB] text-[#406452]",
  rose: "bg-[#F7ECEB] text-[#8D5E5F]",
  sand: "bg-[#F6F0E4] text-[#7D694A]",
};

export function StatCard({
  label,
  value,
  change,
  tone = "lavender",
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: string;
  tone?: Tone;
  icon: LucideIcon;
}) {
  const isPositive = change ? !change.startsWith("-") : true;

  return (
    <div className="rounded-2xl border border-[#E5E4EC] bg-white p-4 shadow-[0_6px_16px_rgba(52,48,75,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[#73798A]">{label}</span>
        <div className={cn("rounded-xl p-2", toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-semibold text-[#303444]">{value}</div>
      {change ? (
        <div className="mt-2 flex items-center gap-1 text-xs font-medium">
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-[#6F927B]" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-[#B77B7D]" />
          )}
          <span className={isPositive ? "text-[#6F927B]" : "text-[#B77B7D]"}>{change}</span>
        </div>
      ) : null}
    </div>
  );
}
