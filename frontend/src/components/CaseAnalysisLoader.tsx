import { PixelIcon } from "./pixel/PixelIcon";
import { MAGNIFIER, TOAST } from "./pixel/pixelArt";

const STEPS = [
  "Detecting objects",
  "Comparing positions",
  "Identifying changes",
  "Generating investigation report",
];

const BAR_WIDTH = 8;

interface CaseAnalysisLoaderProps {
  /** Index of the step currently in progress; earlier steps are complete. */
  activeStep: number;
}

export function CaseAnalysisLoader({ activeStep }: CaseAnalysisLoaderProps) {
  return (
    <div className="pixel-card mx-auto w-full max-w-md animate-fade-in px-6 py-8 sm:px-10">
      <div className="flex items-center justify-center">
        <PixelIcon rows={MAGNIFIER} size={48} className="animate-scan text-ink" />
      </div>

      <h2 className="mt-4 text-center font-pixel text-sm uppercase leading-relaxed text-ink">
        Analyzing Evidence
      </h2>

      <ul className="mt-8 space-y-3">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          const filled = done ? BAR_WIDTH : active ? Math.ceil(BAR_WIDTH * 0.6) : 0;
          const bar = "■".repeat(filled) + "□".repeat(BAR_WIDTH - filled);
          return (
            <li key={step} className="flex items-center justify-between gap-3 text-xs">
              <span
                className={`font-bold uppercase tracking-wide ${
                  done || active ? "text-ink" : "text-muted/50"
                }`}
              >
                {step}
              </span>
              <span className="flex shrink-0 items-center gap-2 font-mono">
                <span
                  className={`tracking-tighter ${
                    done ? "text-green" : active ? "text-ink" : "text-muted/30"
                  } ${active ? "animate-blink" : ""}`}
                >
                  {bar}
                </span>
                {done && <span className="text-green">✓</span>}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted">
        <PixelIcon rows={TOAST} size={22} className="text-ink" />
        Our AI detective is on the case!
      </p>
    </div>
  );
}
