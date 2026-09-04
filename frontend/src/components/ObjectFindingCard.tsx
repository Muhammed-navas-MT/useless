export type FindingKind = "moved" | "missing" | "new" | "unchanged";

interface ObjectFindingCardProps {
  kind: FindingKind;
  objectName: string;
  detail: string;
}

const KIND_META: Record<FindingKind, { label: string; accent: string }> = {
  moved: { label: "Moved", accent: "text-investigation" },
  missing: { label: "Missing", accent: "text-investigation" },
  new: { label: "New", accent: "text-evidence" },
  unchanged: { label: "Unchanged", accent: "text-muted" },
};

export function ObjectFindingCard({ kind, objectName, detail }: ObjectFindingCardProps) {
  const meta = KIND_META[kind];
  return (
    <div className="paper-card flex flex-col gap-1 px-4 py-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Object
        </span>
        <span className={`font-mono text-[11px] uppercase tracking-wider ${meta.accent}`}>
          {meta.label}
        </span>
      </div>
      <p className="text-sm font-semibold uppercase tracking-wide text-ink">{objectName}</p>
      <p className="font-mono text-[11px] text-muted">{detail}</p>
    </div>
  );
}
