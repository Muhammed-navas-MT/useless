import { useMemo, type ReactNode } from "react";
import type { InvestigationResult } from "../types/investigation";
import { StampBadge } from "../components/StampBadge";
import { EvidencePhotoPanel } from "../components/EvidencePhotoPanel";
import { ObjectFindingCard } from "../components/ObjectFindingCard";
import { InvestigationReportPanel } from "../components/InvestigationReportPanel";

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
  const status = totalChanges > 0 ? "Under Investigation" : "Case Closed";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="flex flex-wrap items-start justify-between gap-6 animate-fade-in border-b-2 border-ink pb-6">
        <div>
          <p className="label-meta text-investigation">Case File</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Case No. {caseNumber}</h1>
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 font-mono text-xs text-muted">
            <div className="flex gap-2">
              <dt>STATUS:</dt>
              <dd className="text-ink">{status.toUpperCase()}</dd>
            </div>
            <div className="flex gap-2">
              <dt>DATE:</dt>
              <dd className="text-ink">{dateLabel}</dd>
            </div>
          </dl>
        </div>
        <StampBadge text={totalChanges > 0 ? "Under Investigation" : "Evidence Reviewed"} />
      </section>

      <section className="mt-10">
        <h2 className="label-meta text-ink">Photographic Evidence</h2>
        <div className="mt-3">
          <EvidencePhotoPanel beforeUrl={beforeUrl} afterUrl={afterUrl} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="label-meta text-ink">Object Findings</h2>

        <FindingGroup title="Moved Objects" empty="No objects changed position.">
          {result.moved.map((m) => (
            <ObjectFindingCard
              key={m.object}
              kind="moved"
              objectName={m.object}
              detail={`DISPLACEMENT: ${m.distance} PX`}
            />
          ))}
        </FindingGroup>

        <FindingGroup title="Missing Objects" empty="No objects are missing.">
          {result.missing.map((name) => (
            <ObjectFindingCard
              key={name}
              kind="missing"
              objectName={name}
              detail="NOT DETECTED IN SECOND INSPECTION"
            />
          ))}
        </FindingGroup>

        <FindingGroup title="New Objects" empty="No new objects detected.">
          {result.new.map((name) => (
            <ObjectFindingCard
              key={name}
              kind="new"
              objectName={name}
              detail="NOT PRESENT DURING INITIAL INSPECTION"
            />
          ))}
        </FindingGroup>

        <FindingGroup title="Unchanged Objects" empty="No unchanged objects on file.">
          {result.unchanged.map((name) => (
            <ObjectFindingCard
              key={name}
              kind="unchanged"
              objectName={name}
              detail="POSITION CONSISTENT"
            />
          ))}
        </FindingGroup>
      </section>

      <section className="mt-10">
        <InvestigationReportPanel report={result.report} />
      </section>

      <div className="mt-10 border-t border-line pt-6">
        <button
          type="button"
          onClick={onNewCase}
          className="border border-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-paper"
        >
          Open New Case
        </button>
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
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{title}</p>
      {hasChildren ? (
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
      ) : (
        <p className="mt-2 text-xs italic text-muted/70">{empty}</p>
      )}
    </div>
  );
}
