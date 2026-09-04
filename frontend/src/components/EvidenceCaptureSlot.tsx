import { useEffect, useRef, useState, type ChangeEvent } from "react";

interface EvidenceCaptureSlotProps {
  index: number;
  label: "Before" | "After";
  imageUrl: string | null;
  onCapture: (blob: Blob, url: string) => void;
  onRetake: () => void;
}

/**
 * A single evidence capture slot: webcam capture with a file-upload
 * fallback. Displays the captured photograph inside a document-style
 * evidence frame once logged.
 */
export function EvidenceCaptureSlot({
  index,
  label,
  imageUrl,
  onCapture,
  onRetake,
}: EvidenceCaptureSlotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => stopCamera, []);

  useEffect(() => {
    if (!imageUrl) setCapturedAt(null);
  }, [imageUrl]);

  const activateCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("Camera access unavailable — upload a photograph instead.");
    }
  };

  const timestamp = () =>
    new Date().toLocaleTimeString("en-GB", { hour12: false });

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapturedAt(timestamp());
        onCapture(blob, URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.92
    );
    stopCamera();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setCapturedAt(timestamp());
    onCapture(file, URL.createObjectURL(file));
  };

  const idLabel = `EV-${String(index).padStart(2, "0")}`;

  return (
    <div className="paper-card flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="label-meta text-ink">
          {idLabel} &middot; {label.toUpperCase()} PHOTOGRAPH
        </span>
        {imageUrl && <span className="label-meta text-investigation">Logged</span>}
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${label} evidence`}
            className="h-full w-full animate-fade-in object-cover"
          />
        ) : cameraActive ? (
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="label-meta">No Photograph On File</span>
            {cameraError && (
              <p className="max-w-[220px] text-xs text-investigation">{cameraError}</p>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />

        <span className="pointer-events-none absolute left-2 top-2 border border-evidence/70 bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          {idLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="label-meta">
          {imageUrl ? `Captured: ${capturedAt}` : "Awaiting capture"}
        </span>

        {imageUrl ? (
          <button
            type="button"
            onClick={onRetake}
            className="label-meta underline decoration-line underline-offset-2 hover:text-investigation"
          >
            Retake
          </button>
        ) : cameraActive ? (
          <button
            type="button"
            onClick={capturePhoto}
            className="bg-investigation px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-investigation/90"
          >
            Capture
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={activateCamera}
              className="border border-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper"
            >
              Camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:border-ink hover:text-ink"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
