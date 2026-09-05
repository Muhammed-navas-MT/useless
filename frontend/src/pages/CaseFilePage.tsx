import { useMemo, type ReactNode } from "react";
import type { InvestigationResult } from "../types/investigation";
import { StampBadge } from "../components/StampBadge";
import { EvidencePhotoPanel } from "../components/EvidencePhotoPanel";
import { ObjectFindingCard } from "../components/ObjectFindingCard";
import { InvestigationReportPanel } from "../components/InvestigationReportPanel";
import { PixelIcon } from "../components/pixel/PixelIcon";
import { DETECTIVE } from "../components/pixel/pixelArt";

interface CaseFilePageProps {
  result: InvestigationResult;
  beforeUrl: string;
  afterUrl: string;
  caseNumber: string;
  onNewCase: () => void;
}

export function CaseFilePage({
  result,
  beforeUrl,
  afterUrl,
  caseNumber,
  onNewCase,
}: CaseFilePageProps) {
  const dateLabel = useMemo(
    () =>
      new Date()
        .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        .toUpperCase(),
    []
  );

  const totalChanges = result.moved.length + result.missing.length + result.new.length;
  const caseClosed = totalChanges === 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="flex animate-fade-in flex-wrap items-start justify-between gap-6 border-b-2 border-ink pb-6">
        <div>
          <p className="pixel-label text-alert">Case File</p>
          <h1 className="mt-1 font-pixel text-lg uppercase text-ink sm:text-2xl">
            Case #{caseNumber}
          </h1>
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-xs text-muted">
            <div className="flex gap-2">
              <dt className="font-bold text-ink">Date:</dt>
              <dd>{dateLabel}</dd>
            </div>
          </dl>
        </div>
        <StampBadge
          text={caseClosed ? "Case Closed 🎉" : "Under Investigation"}
          tone={caseClosed ? "green" : "alert"}
        />
      </section>

      <section className="mt-10">
        <h2 className="pixel-label text-ink">Photographic Evidence</h2>
        <div className="mt-3">
          <EvidencePhotoPanel beforeUrl={beforeUrl} afterUrl={afterUrl} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="pixel-label text-ink">Object Findings</h2>

        <FindingGroup title="Moved Objects" empty="No objects changed position.">
          {result.moved.map((m) => (
            <ObjectFindingCard
              key={m.object}
              kind="moved"
              objectName={m.object}
              detail={`Went on a ${m.distance}px adventure across the scene.`}
            />
          ))}
        </FindingGroup>

        <FindingGroup title="Missing Objects" empty="No objects are missing.">
          {result.missing.map((name) => (
            <ObjectFindingCard
              key={name}
              kind="missing"
              objectName={name}
              detail="Not spotted in the second inspection."
            />
          ))}
        </FindingGroup>

        <FindingGroup title="New Objects" empty="No new objects detected.">
          {result.new.map((name) => (
            <ObjectFindingCard
              key={name}
              kind="new"
              objectName={name}
              detail="Wasn't there during the initial inspection."
            />
          ))}
        </FindingGroup>

        <FindingGroup title="Unchanged Objects" empty="No unchanged objects on file.">
          {result.unchanged.map((name) => (
            <ObjectFindingCard
              key={name}
              kind="unchanged"
              objectName={name}
              detail="Right where it should be."
            />
          ))}
        </FindingGroup>
      </section>

      <section className="mt-10">
        <InvestigationReportPanel report={result.report} />
      </section>

      <div className="mt-10 flex items-center justify-between gap-6 border-t-2 border-ink pt-8">
        <button
          type="button"
          onClick={onNewCase}
          className="pixel-btn bg-ink px-6 py-3 text-xs text-surface"
        >
          ▶ Open New Case
        </button>
        <PixelIcon rows={DETECTIVE} size={56} className="hidden text-ink/80 sm:block" />
      </div>
    </div>
  );
}

function FindingGroup({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: ReactNode[];
}) {
  const hasChildren = children.length > 0;
  return (
    <div className="mt-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{title}</p>
      {hasChildren ? (
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
      ) : (
        <p className="mt-2 text-xs italic text-muted/70">{empty}</p>
      )}
    </div>
  );
}
