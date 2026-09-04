import { useEffect, useRef, useState } from "react";
import { DfiHeader } from "./components/DfiHeader";
import { CaseAnalysisLoader } from "./components/CaseAnalysisLoader";
import { CaseErrorPanel } from "./components/CaseErrorPanel";
import { LandingPage } from "./pages/LandingPage";
import { CaseFilePage } from "./pages/CaseFilePage";
import { submitInvestigation, InvestigationRequestError } from "./services/api";
import type { InvestigationResult } from "./types/investigation";

type Stage =
  | { name: "capture" }
  | { name: "analyzing" }
  | { name: "complete"; result: InvestigationResult }
  | { name: "error"; message: string };

function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(1000 + Math.random() * 9000);
  return `WMMS-${year}-${sequence}`;
}

export default function App() {
  const [stage, setStage] = useState<Stage>({ name: "capture" });
  const [loaderStep, setLoaderStep] = useState(0);
  const [caseNumber, setCaseNumber] = useState(generateCaseNumber);
  const evidenceRef = useRef<{ beforeUrl: string; afterUrl: string } | null>(null);

  // Advance the loader's step checklist while the request is in flight.
  // The backend runs one atomic pipeline (no progress events), so this is a
  // plausible progression capped at the final step until the real response
  // actually arrives — it never claims completion before the network call resolves.
  useEffect(() => {
    if (stage.name !== "analyzing") return;
    setLoaderStep(0);
    const timer = window.setInterval(() => {
      setLoaderStep((step) => (step < 3 ? step + 1 : step));
    }, 900);
    return () => window.clearInterval(timer);
  }, [stage.name]);

  const handleOpenInvestigation = async (before: Blob, after: Blob) => {
    evidenceRef.current = {
      beforeUrl: URL.createObjectURL(before),
      afterUrl: URL.createObjectURL(after),
    };
    setCaseNumber(generateCaseNumber());
    setStage({ name: "analyzing" });

    try {
      const result = await submitInvestigation(before, after);
      setStage({ name: "complete", result });
    } catch (error) {
      const message =
        error instanceof InvestigationRequestError
          ? error.message
          : "An unexpected error interrupted the investigation.";
      setStage({ name: "error", message });
    }
  };

  const resetCase = () => {
    if (evidenceRef.current) {
      URL.revokeObjectURL(evidenceRef.current.beforeUrl);
      URL.revokeObjectURL(evidenceRef.current.afterUrl);
      evidenceRef.current = null;
    }
    setStage({ name: "capture" });
  };

  return (
    <div className="min-h-screen">
      <DfiHeader />
      <main>
        {stage.name === "capture" && (
          <LandingPage onOpenInvestigation={handleOpenInvestigation} />
        )}

        {stage.name === "analyzing" && (
          <div className="flex min-h-[70vh] items-center justify-center px-5">
            <CaseAnalysisLoader activeStep={loaderStep} />
          </div>
        )}

        {stage.name === "error" && (
          <div className="flex min-h-[70vh] items-center justify-center px-5">
            <CaseErrorPanel message={stage.message} onRetry={resetCase} />
          </div>
        )}

        {stage.name === "complete" && evidenceRef.current && (
          <CaseFilePage
            result={stage.result}
            beforeUrl={evidenceRef.current.beforeUrl}
            afterUrl={evidenceRef.current.afterUrl}
            caseNumber={caseNumber}
            onNewCase={resetCase}
          />
        )}
      </main>
    </div>
  );
}
