interface StampBadgeProps {
  text: string;
  tone?: "ink" | "alert" | "green";
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<StampBadgeProps["tone"]>, string> = {
  ink: "border-ink text-ink",
  alert: "border-alert text-alert",
  green: "border-green text-green",
};

/** A bordered pixel status box — e.g. "Case Open", "Case Closed 🎉". */
export function StampBadge({ text, tone = "ink", className = "" }: StampBadgeProps) {
  return (
    <span
      className={`inline-flex animate-pixel-pop items-center gap-1.5 border-2 bg-surface px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] shadow-pixel-sm ${TONE_CLASSES[tone]} ${className}`}
    >
      {text}
    </span>
  );
}
