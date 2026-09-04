interface StampBadgeProps {
  text: string;
  className?: string;
}

/** A fictional case stamp — e.g. "CASE OPEN", "UNDER INVESTIGATION". */
export function StampBadge({ text, className = "" }: StampBadgeProps) {
  return (
    <span
      className={`inline-flex -rotate-3 animate-stamp-in items-center gap-1.5 border-2 border-investigation px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-investigation ${className}`}
    >
      {text}
    </span>
  );
}
