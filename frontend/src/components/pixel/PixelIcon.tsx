interface PixelIconProps {
  /** Each string is one row; "X" marks a filled pixel, anything else is transparent. */
  rows: string[];
  size?: number;
  className?: string;
}

/** Renders a small bitmap (see pixelArt.ts) as crisp, hard-edged pixel art. */
export function PixelIcon({ rows, size = 20, className = "" }: PixelIconProps) {
  const height = rows.length;
  const width = rows[0]?.length ?? 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "X" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
          ) : null
        )
      )}
    </svg>
  );
}
