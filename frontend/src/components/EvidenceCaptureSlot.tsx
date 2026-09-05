import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { PixelIcon } from "./pixel/PixelIcon";
import { UPLOAD_ARROW } from "./pixel/pixelArt";

interface EvidenceCaptureSlotProps {
  index: number;
  label: "Before" | "After";
  imageUrl: string | null;
  onCapture: (blob: Blob, url: string) => void;
  onRetake: () => void;
}

/**
 * A single evidence capture slot: webcam capture with a click-to-upload
 * fallback. Displays the captured photograph inside a pixel-framed card
 * once logged.
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
      setCameraError("Camera access unavailable — upload a photo instead.");
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

  return (
    <div className="pixel-card flex flex-col">
      <div className="window-bar">
        <span className="text-xs font-bold uppercase tracking-wider text-ink">
          {label} photo
        </span>
        {imageUrl && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-green">
            Logged ✓
          </span>
        )}
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${label} evidence`}
            className="h-full w-full animate-fade-in object-cover"
          />
        ) : cameraActive ? (
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 border-4 border-dashed border-ink/30 px-6 text-center transition hover:border-ink/60"
          >
            <PixelIcon rows={UPLOAD_ARROW} size={36} className="text-ink/50" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Click to upload
            </span>
            {cameraError && (
              <p className="max-w-[220px] text-xs text-alert">{cameraError}</p>
            )}
          </button>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {imageUrl ? `Captured ${capturedAt}` : `Slot ${index} · awaiting capture`}
        </span>

        {imageUrl ? (
          <button
            type="button"
            onClick={onRetake}
            className="text-[11px] font-bold uppercase tracking-wider text-ink underline decoration-2 underline-offset-2 hover:text-alert"
          >
            Retake
          </button>
        ) : cameraActive ? (
          <button
            type="button"
            onClick={capturePhoto}
            className="pixel-btn bg-ink px-3 py-1.5 text-[11px] text-surface"
          >
            Capture
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={activateCamera}
              className="pixel-btn bg-surface px-3 py-1.5 text-[11px] text-ink"
            >
              Camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="pixel-btn bg-surface px-3 py-1.5 text-[11px] text-ink"
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
