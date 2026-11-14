import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, description, action, children }: Props) {
  return (
    <section className="rounded-2xl border border-[#E5E4EC] bg-white p-5 shadow-[0_8px_24px_rgba(49,46,75,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#303444]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[#73798A]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
