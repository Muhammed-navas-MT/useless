import { PixelIcon } from "./pixel/PixelIcon";
import { MAGNIFIER } from "./pixel/pixelArt";

export function AppHeader() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
        <div className="flex items-center gap-2.5">
          <PixelIcon rows={MAGNIFIER} size={22} className="text-ink" />
          <span className="font-pixel text-[10px] leading-none text-ink sm:text-xs">
            Who Moved My Stuff?
          </span>
        </div>
        <span className="pixel-label hidden text-muted sm:block">Home Detective Agency</span>
      </div>
    </header>
  );
}
