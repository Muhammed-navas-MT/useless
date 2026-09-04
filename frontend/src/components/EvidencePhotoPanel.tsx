interface EvidencePhotoPanelProps {
  beforeUrl: string;
  afterUrl: string;
}

export function EvidencePhotoPanel({ beforeUrl, afterUrl }: EvidencePhotoPanelProps) {
  const items = [
    { id: "EV-01", label: "Before", url: beforeUrl },
    { id: "EV-02", label: "After", url: afterUrl },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <figure key={item.id} className="paper-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="label-meta text-ink">
              {item.id} &middot; {item.label.toUpperCase()}
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
