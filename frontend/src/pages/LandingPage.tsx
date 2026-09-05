import { useEffect, useState } from "react";
import { EvidenceCaptureSlot } from "../components/EvidenceCaptureSlot";
import { StampBadge } from "../components/StampBadge";
import { WalkingPixelDetective } from "../components/WalkingCharacter";

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
      <section className="relative flex animate-fade-in flex-wrap items-start justify-between gap-6">
        <div>
          <StampBadge text="Case Open" tone="green" />

          <h1 className="mt-5 font-pixel text-xl uppercase leading-[1.15] tracking-[0.08em] text-ink sm:text-3xl">
            Who Moved
            <br />
            My Stuff?
          </h1>

          <p className="mt-4 max-w-xl text-[11px] uppercase tracking-[0.1em] text-muted">
            Photographic evidence analysis for unexplained changes.
          </p>
        </div>

        <WalkingPixelDetective />
      </section>

      <section className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.step} className="pixel-card px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-alert">
              Step {s.step}
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{s.title}</p>
            <p className="mt-1 text-xs text-muted">{s.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 border-2 border-ink bg-surface px-5 py-4 shadow-pixel-sm">
        <p className="pixel-label text-ink">Evidence Protocol</p>
        <p className="mt-1 text-sm text-ink">
          Capture both photographs from the <strong>same viewpoint</strong> —
          identical camera position, angle, and distance. A shifted camera will
          be misread as a moved object.
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

      <section className="mt-10 border-t-2 border-ink pt-8">
        <div className="pixel-card px-5 py-4">
          <p className="pixel-label text-ink">Capture Declaration</p>
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
              className="mt-1 h-4 w-4 shrink-0 border-2 border-ink accent-ink"
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
            className="pixel-btn bg-ink px-8 py-3 text-sm text-surface disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted/30 disabled:text-muted disabled:shadow-none"
          >
            ▶ Start the Investigation!
          </button>
          {!canOpen && (
            <p className="pixel-label text-muted">
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
