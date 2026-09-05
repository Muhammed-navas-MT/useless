import { PixelIcon } from "./pixel/PixelIcon";
import { CIRCLE, DIAMOND, SQUARE, TRIANGLE } from "./pixel/pixelArt";

export type FindingKind = "moved" | "missing" | "new" | "unchanged";

interface ObjectFindingCardProps {
  kind: FindingKind;
  objectName: string;
  detail: string;
}

const KIND_META: Record<FindingKind, { label: string; color: string; icon: string[] }> = {
  moved: { label: "Moved", color: "text-amber", icon: TRIANGLE },
  missing: { label: "Missing", color: "text-alert", icon: CIRCLE },
  new: { label: "New", color: "text-green", icon: DIAMOND },
  unchanged: { label: "Unchanged", color: "text-blue", icon: SQUARE },
};

export function ObjectFindingCard({ kind, objectName, detail }: ObjectFindingCardProps) {
  const meta = KIND_META[kind];
  return (
    <div className="pixel-card flex animate-fade-in items-start gap-3 px-4 py-3">
      <PixelIcon rows={meta.icon} size={22} className={`mt-0.5 shrink-0 ${meta.color}`} />
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold uppercase tracking-wide text-ink">
            {objectName}
          </p>
          <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wider ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted">{detail}</p>
      </div>
    </div>
  );
}
