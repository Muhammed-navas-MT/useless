const STEPS = [
  "Detecting Objects",
  "Comparing Positions",
  "Identifying Changes",
  "Generating Investigation Report",
];

interface CaseAnalysisLoaderProps {
  /** Index of the step currently in progress; earlier steps are complete. */
  activeStep: number;
}

export function CaseAnalysisLoader({ activeStep }: CaseAnalysisLoaderProps) {
  return (
    <div className="paper-card mx-auto w-full max-w-md animate-fade-in px-6 py-8 sm:px-10">
      <p className="label-meta text-investigation">Case Analysis In Progress</p>
      <h2 className="mt-2 font-serif text-xl text-ink">
        Analyzing Photographic Evidence
      </h2>

      <ul className="mt-8 space-y-4">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <li
              key={step}
              className="flex items-center justify-between border-b border-line/70 pb-3 font-mono text-xs uppercase tracking-wider"
            >
              <span className={done || active ? "text-ink" : "text-muted/50"}>
                {step}
              </span>
              {done ? (
                <span className="text-investigation">&#10003;</span>
              ) : active ? (
                <span className="animate-blink text-muted">&middot;&middot;&middot;</span>
              ) : (
                <span className="text-muted/30">&mdash;</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
