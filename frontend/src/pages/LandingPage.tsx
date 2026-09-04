import { useEffect, useState } from "react";
import { EvidenceCaptureSlot } from "../components/EvidenceCaptureSlot";
import { StampBadge } from "../components/StampBadge";

interface LandingPageProps {
  onOpenInvestigation: (before: Blob, after: Blob) => void;
}

interface CapturedEvidence {
  blob: Blob;
  url: string;
}

const STEPS = [
  {
    step: "01",
    title: "Capture Before",
    detail: "Photograph the scene from a fixed camera position.",
  },
  {
    step: "02",
    title: "Capture After",
    detail: "Return to the exact same position, angle, and distance.",
  },
  {
    step: "03",
    title: "Open Investigation",
    detail: "Confirm capture conditions and begin analysis.",
  },
];

export function LandingPage({ onOpenInvestigation }: LandingPageProps) {
  const [before, setBefore] = useState<CapturedEvidence | null>(null);
  const [after, setAfter] = useState<CapturedEvidence | null>(null);
  const [viewpointConfirmed, setViewpointConfirmed] = useState(false);

  const bothCaptured = Boolean(before && after);
  const canOpen = bothCaptured && viewpointConfirmed;

  // Any change to the captured evidence (new capture or retake) requires the
  // declaration to be re-confirmed rather than carrying over a stale check.
  useEffect(() => {
    setViewpointConfirmed(false);
  }, [before, after]);

  const handleSubmit = () => {
    if (before && after && viewpointConfirmed) {
      onOpenInvestigation(before.blob, after.blob);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="animate-fade-in">
        <StampBadge text="Case Open" />
        <p className="mt-6 label-meta text-investigation">Case Investigation</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Who Moved My Stuff?
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          Photographic evidence analysis for unexplained changes.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.step} className="border-l-2 border-investigation pl-4">
            <p className="label-meta text-investigation">Step {s.step}</p>
            <p className="mt-1 font-serif text-base text-ink">{s.title}</p>
            <p className="mt-1 text-xs text-muted">{s.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 border border-investigation/40 bg-investigation/[0.04] px-5 py-4">
        <p className="label-meta text-investigation">Evidence Protocol</p>
        <p className="mt-1 text-sm text-ink">
          Capture both photographs from the <strong>same viewpoint</strong> —
          identical camera position, angle, and distance. A shifted camera
          will be misread as a moved object.
        </p>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <EvidenceCaptureSlot
          index={1}
          label="Before"
          imageUrl={before?.url ?? null}
          onCapture={(blob, url) => setBefore({ blob, url })}
          onRetake={() => setBefore(null)}
        />
        <EvidenceCaptureSlot
          index={2}
          label="After"
          imageUrl={after?.url ?? null}
          onCapture={(blob, url) => setAfter({ blob, url })}
          onRetake={() => setAfter(null)}
        />
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <div className="paper-card px-5 py-4">
          <p className="label-meta text-ink">Capture Declaration</p>
          <label
            className={`mt-3 flex items-start gap-3 ${
              bothCaptured ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            <input
              type="checkbox"
              checked={viewpointConfirmed}
              disabled={!bothCaptured}
              onChange={(e) => setViewpointConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 border border-ink accent-investigation"
            />
            <span className="text-sm text-ink">
              I confirm both photographs were captured from the{" "}
              <strong>same viewpoint</strong> — identical camera position,
              angle, and distance.
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3">
          <button
            type="button"
            disabled={!canOpen}
            onClick={handleSubmit}
            className="bg-investigation px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-investigation/90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            Open Investigation
          </button>
          {!canOpen && (
            <p className="label-meta">
              {bothCaptured
                ? "Confirm the capture declaration to open a case."
                : "Both photographs are required to open a case."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
