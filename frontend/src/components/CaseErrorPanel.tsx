import { PixelIcon } from "./pixel/PixelIcon";
import { TRIANGLE } from "./pixel/pixelArt";

interface CaseErrorPanelProps {
  message: string;
  onRetry: () => void;
}

export function CaseErrorPanel({ message, onRetry }: CaseErrorPanelProps) {
  return (
    <div className="pixel-card mx-auto w-full max-w-md animate-fade-in px-6 py-8 text-center sm:px-10">
      <div className="flex justify-center">
        <PixelIcon rows={TRIANGLE} size={40} className="text-alert" />
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-alert">
        Case Interrupted
      </p>
      <p className="mt-3 text-base font-bold text-ink">
        Our detective hit a snag chasing this one down.
      </p>
      <p className="mt-2 text-xs text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="pixel-btn mt-6 bg-alert px-5 py-2.5 text-xs text-surface"
      >
        ▶ Retry Investigation
      </button>
    </div>
  );
}
