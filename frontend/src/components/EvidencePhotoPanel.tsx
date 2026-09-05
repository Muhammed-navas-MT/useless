interface EvidencePhotoPanelProps {
  beforeUrl: string;
  afterUrl: string;
}

export function EvidencePhotoPanel({ beforeUrl, afterUrl }: EvidencePhotoPanelProps) {
  const items = [
    { label: "Before", url: beforeUrl },
    { label: "After", url: afterUrl },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <figure key={item.label} className="pixel-card overflow-hidden">
          <div className="window-bar">
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              {item.label}
            </span>
          </div>
          <img
            src={item.url}
            alt={`${item.label} evidence`}
            className="aspect-[4/3] w-full object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
