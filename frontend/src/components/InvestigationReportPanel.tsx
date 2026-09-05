interface InvestigationReportPanelProps {
  report: string;
}

interface ReportSection {
  title: string;
  content: string;
}

const SECTION_TITLES = [
  "CASE",
  "SUBJECT",
  "INVESTIGATION REPORT",
  "CONCLUSION",
  "SUSPICION LEVEL",
  "RECOMMENDATION",
];

function parseReport(report: string): ReportSection[] {
  const sections: ReportSection[] = [];

  const escapedTitles = SECTION_TITLES.map((title) =>
    title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  ).join("|");

  const regex = new RegExp(
    `(?:^|\\n)\\s*(${escapedTitles})\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${escapedTitles})\\s*:|$)`,
    "gi",
  );

  let match;

  while ((match = regex.exec(report)) !== null) {
    sections.push({
      title: match[1].trim().toUpperCase(),
      content: match[2].trim(),
    });
  }

  // Fallback if Gemini changes the formatting slightly.
  if (sections.length === 0) {
    return [
      {
        title: "INVESTIGATION REPORT",
        content: report.trim(),
      },
    ];
  }

  return sections;
}

function PixelDetective() {
  return (
    <div
      className="pixel-detective"
      aria-hidden="true"
    >
      {/* Hat */}
      <div className="detective-hat">
        <span />
        <span />
      </div>

      {/* Head */}
      <div className="detective-head">
        <div className="detective-eye detective-eye-left" />
        <div className="detective-eye detective-eye-right" />

        <div className="detective-smile">
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Body */}
      <div className="detective-body">
        {/* Left arm */}
        <div className="detective-arm detective-arm-left">
          <div className="detective-hand" />
        </div>

        {/* Right arm */}
        <div className="detective-arm detective-arm-right">
          <div className="detective-hand" />
        </div>

        {/* Legs */}
        <div className="detective-leg detective-leg-left">
          <div className="detective-foot" />
        </div>

        <div className="detective-leg detective-leg-right">
          <div className="detective-foot" />
        </div>
      </div>

      {/* Magnifying glass */}
      <div className="detective-glass">
        <div className="glass-circle" />
        <div className="glass-handle" />
      </div>
    </div>
  );
}

export function InvestigationReportPanel({
  report,
}: InvestigationReportPanelProps) {
  const sections = parseReport(report);

  const getSection = (title: string) =>
    sections.find((section) => section.title === title);

  const caseSection = getSection("CASE");
  const subjectSection = getSection("SUBJECT");
  const investigationSection = getSection("INVESTIGATION REPORT");
  const conclusionSection = getSection("CONCLUSION");
  const suspicionSection = getSection("SUSPICION LEVEL");
  const recommendationSection = getSection("RECOMMENDATION");

  const suspicionValue = suspicionSection?.content.match(/\d+/)?.[0] ?? "0";

  return (
    <div className="pixel-card overflow-hidden border-2 border-ink bg-surface">
      {/* =========================================
          REPORT HEADER
          ========================================= */}
      <div className="relative border-b-2 border-ink bg-ink px-6 py-5 text-surface sm:px-8">
        {/* Decorative pixels */}
        <div className="absolute right-5 top-5 h-2 w-2 bg-alert" />
        <div className="absolute right-9 top-8 h-2 w-2 bg-amber" />
        <div className="absolute right-5 top-11 h-2 w-2 bg-blue-500" />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-surface/60">
              Photographic Evidence Division
            </p>

            <h2 className="mt-2 font-pixel text-lg uppercase tracking-wide sm:text-2xl">
              Investigation Report
            </h2>
          </div>

          <div className="font-mono text-[9px] uppercase tracking-wider text-surface/60">
            FINAL REPORT
          </div>
        </div>
      </div>

      {/* =========================================
          CASE META
          ========================================= */}
      {(caseSection || subjectSection) && (
        <div className="grid grid-cols-1 border-b-2 border-ink sm:grid-cols-2">
          {caseSection && (
            <div className="border-b-2 border-ink px-6 py-4 sm:border-b-0 sm:border-r-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                Case
              </p>

              <p className="mt-2 font-mono text-sm font-bold text-ink">
                {caseSection.content}
              </p>
            </div>
          )}

          {subjectSection && (
            <div className="px-6 py-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                Subject
              </p>

              <p className="mt-2 text-sm font-bold text-ink">
                {subjectSection.content}
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          INVESTIGATION REPORT
          ========================================= */}
      {investigationSection && (
        <section className="px-6 py-6 sm:px-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center bg-amber font-mono text-xs font-black text-ink">
              01
            </span>

            <h3 className="font-pixel text-sm uppercase text-ink sm:text-base">
              Investigation Report
            </h3>
          </div>

          <div className="border-l-4 border-ink/20 pl-4">
            <p className="animate-fade-in text-sm leading-7 text-ink sm:text-[15px]">
              {investigationSection.content}
            </p>
          </div>
        </section>
      )}

      {/* =========================================
          CONCLUSION
          ========================================= */}
      {conclusionSection && (
        <section className="border-t-2 border-ink px-6 py-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-500 font-mono text-xs font-black text-white">
              02
            </div>

            <div>
              <h3 className="font-pixel text-sm uppercase text-ink sm:text-base">
                Conclusion
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink">
                {conclusionSection.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          SUSPICION LEVEL
          ========================================= */}
      {suspicionSection && (
        <section className="border-t-2 border-ink px-6 py-6 sm:px-8">
          <div className="pixel-card relative overflow-hidden border-2 border-alert bg-alert/5 px-5 py-5">
            {/* Pixel decorations */}
            <div className="absolute right-4 top-4 h-3 w-3 bg-alert" />
            <div className="absolute right-9 top-4 h-3 w-3 bg-amber" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                  Threat Assessment
                </p>

                <h3 className="mt-1 font-pixel text-sm uppercase text-ink">
                  Suspicion Level
                </h3>
              </div>

              <div className="font-mono text-4xl font-black text-alert">
                {suspicionValue}%
              </div>
            </div>

            {/* Suspicion bar */}
            <div className="mt-5 h-4 border-2 border-ink p-1">
              <div
                className="h-full bg-alert transition-all duration-1000"
                style={{
                  width: `${Math.min(Number(suspicionValue), 100)}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between font-mono text-[8px] font-bold uppercase text-muted">
              <span>Totally Innocent</span>
              <span>Highly Suspicious</span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          RECOMMENDATION + DETECTIVE
          ========================================= */}
      {recommendationSection && (
        <section className="relative overflow-hidden border-t-2 border-ink bg-amber/10 px-6 py-6 sm:px-8 sm:py-8">
          {/* Decorative Bauhaus pixels */}
          <div className="absolute left-0 top-0 h-3 w-3 bg-alert" />
          <div className="absolute left-4 top-0 h-3 w-3 bg-ink" />
          <div className="absolute right-0 top-0 h-3 w-3 bg-blue-500" />

          <div className="grid grid-cols-[110px_1fr] items-center gap-5 sm:grid-cols-[140px_1fr] sm:gap-8">
            {/* Detective */}
            <div className="relative flex h-36 items-end justify-center">
              <PixelDetective />
            </div>

            {/* Recommendation */}
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                  Final Recommendation
                </span>

                <span className="bg-alert px-2 py-1 font-mono text-[8px] font-black uppercase text-white">
                  URGENT
                </span>
              </div>

              <h3 className="mt-2 font-pixel text-sm uppercase text-ink sm:text-base">
                Detective&apos;s Advice
              </h3>

              <p className="mt-4 text-sm leading-7 text-ink sm:text-[15px]">
                {recommendationSection.content}
              </p>

              <div className="mt-5 border-t-2 border-ink/20 pt-3">
                <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted">
                  — Your Very Serious AI Detective
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          FOOTER
          ========================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink bg-ink px-6 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-surface/60">
        <span>Evidence reviewed</span>

        <span>Case status: OPEN</span>

        <span>WMS // AI-01</span>
      </div>
    </div>
  );
}