export function WalkingPixelDetective() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        right-0
        top-1/2
        hidden
        h-32
        w-[280px]
        -translate-y-1/2
        overflow-hidden
        sm:block
      "
      aria-hidden="true"
    >
      <div className="pixel-walker">
        {/* Head */}
        <div className="pixel-head">
          {/* Hair / top pixels */}
          <span className="head-pixel head-pixel-1" />
          <span className="head-pixel head-pixel-2" />

          {/* Eyes */}
          <span className="pixel-eye pixel-eye-left" />
          <span className="pixel-eye pixel-eye-right" />

          {/* Smile */}
          <span className="pixel-smile smile-1" />
          <span className="pixel-smile smile-2" />
          <span className="pixel-smile smile-3" />
        </div>

        {/* Body */}
        <div className="pixel-body">
          {/* Left arm */}
          <div className="pixel-arm pixel-arm-left">
            <span className="pixel-hand" />
          </div>

          {/* Right arm */}
          <div className="pixel-arm pixel-arm-right">
            <span className="pixel-hand" />
          </div>

          {/* Left leg */}
          <div className="pixel-leg pixel-leg-left">
            <span className="pixel-foot" />
          </div>

          {/* Right leg */}
          <div className="pixel-leg pixel-leg-right">
            <span className="pixel-foot" />
          </div>
        </div>
      </div>

      {/* Pixel ground */}
      <div className="pixel-ground">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}