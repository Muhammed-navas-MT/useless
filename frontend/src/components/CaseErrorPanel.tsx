interface CaseErrorPanelProps {
  message: string;
  onRetry: () => void;
}

export function CaseErrorPanel({ message, onRetry }: CaseErrorPanelProps) {
  return (
    <div className="paper-card mx-auto w-full max-w-md animate-fade-in border-investigation/40 px-6 py-8 text-center sm:px-10">
      <span className="label-meta text-investigation">Case Analysis Interrupted</span>
      <p className="mt-4 font-serif text-base text-ink">
        Unable to complete photographic evidence analysis.
      </p>
      <p className="mt-2 text-xs text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 border border-investigation px-5 py-2 text-xs font-semibold uppercase tracking-widest text-investigation hover:bg-investigation hover:text-ink"
      >
        Retry Investigation
      </button>
    </div>
  );
}
