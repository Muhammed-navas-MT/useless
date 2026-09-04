export function DfiHeader() {
  return (
    <header className="border-b border-line bg-paper/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-ink text-xs font-bold tracking-wide">
            D.F.I.
          </div>
          <div className="leading-tight">
            <p className="label-meta text-ink">Digital Forensic</p>
            <p className="label-meta">Investigation Unit</p>
          </div>
        </div>
        <p className="label-meta hidden sm:block">Unit 07 — Household Division</p>
      </div>
    </header>
  );
}
