"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Archive,
  Check,
  Download,
  FileImage,
  FileVideo,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Square,
  UploadCloud,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

type ImageFormat = "image/jpeg" | "image/png" | "image/webp";
type ToolStatus = "empty" | "loading" | "ready" | "processing" | "complete" | "error";

type VideoInfo = {
  duration: number;
  width: number;
  height: number;
};

type GeneratedFrame = {
  id: string;
  blob: Blob;
  name: string;
  time: number;
  url: string;
  width: number;
  height: number;
};

const MAX_FRAMES = 240;
const MIN_SEGMENT_LENGTH = 0.1;

const formatOptions: Array<{ value: ImageFormat; label: string; extension: string }> = [
  { value: "image/jpeg", label: "JPG", extension: ".jpg" },
  { value: "image/png", label: "PNG", extension: ".png" },
  { value: "image/webp", label: "WebP", extension: ".webp" },
];

const widthOptions = [
  { value: 0, label: "Original size" },
  { value: 1920, label: "Up to 1920 px" },
  { value: 1280, label: "Up to 1280 px" },
  { value: 720, label: "Up to 720 px" },
];

const intervalPresets = [0.25, 0.5, 1, 2, 5];

function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/") || /\.(mp4|m4v|webm|mov|ogv|ogg)$/i.test(file.name);
}

function getFileStem(fileName: string): string {
  const sanitized = fileName.trim().replace(/[^\w.-]+/g, "-");
  const lastDot = sanitized.lastIndexOf(".");
  const stem = lastDot > 0 ? sanitized.slice(0, lastDot) : sanitized;
  return stem || "video";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);

  return value.toFixed(index === 0 ? 0 : 1) + " " + units[index];
}

function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return hours > 0 ? String(hours) + ":" + paddedMinutes + ":" + paddedSeconds : paddedMinutes + ":" + paddedSeconds;
}

function fileTimestamp(seconds: number): string {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const wholeSeconds = Math.floor((milliseconds % 60_000) / 1_000);
  const remainder = milliseconds % 1_000;

  return (
    String(hours).padStart(2, "0") +
    "h" +
    String(minutes).padStart(2, "0") +
    "m" +
    String(wholeSeconds).padStart(2, "0") +
    "s" +
    String(remainder).padStart(3, "0")
  );
}

function getOutputDimensions(sourceWidth: number, sourceHeight: number, maxWidth: number) {
  if (!maxWidth || sourceWidth <= maxWidth) {
    return { width: sourceWidth, height: sourceHeight };
  }

  return {
    width: maxWidth,
    height: Math.round((sourceHeight / sourceWidth) * maxWidth),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, format: ImageFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Your browser could not create this image format."));
      },
      format,
      format === "image/png" ? undefined : quality,
    );
  });
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const target = Math.min(Math.max(0, time), Math.max(0, video.duration - 0.001));

    if (Math.abs(video.currentTime - target) < 0.01) {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      return;
    }

    let settled = false;
    let timeoutId = 0;

    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      window.clearTimeout(timeoutId);
    };

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };

    const onSeeked = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => finish(resolve)));
    };

    const onError = () => {
      finish(() => reject(new Error("The video could not be decoded at this point.")));
    };

    timeoutId = window.setTimeout(() => {
      finish(() => reject(new Error("This video took too long to seek. Try a shorter clip or a larger interval.")));
    }, 10_000);

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    try {
      video.currentTime = target;
    } catch {
      finish(() => reject(new Error("This video cannot be seeked by your browser.")));
    }
  });
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function VideoToFramesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [status, setStatus] = useState<ToolStatus>("empty");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [interval, setInterval] = useState(1);
  const [imageFormat, setImageFormat] = useState<ImageFormat>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [progress, setProgress] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const [frames, setFrames] = useState<GeneratedFrame[]>([]);
  const [selectedFrameIds, setSelectedFrameIds] = useState<Set<string>>(new Set());
  const [isCreatingArchive, setIsCreatingArchive] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceUrlRef = useRef<string | null>(null);
  const frameUrlsRef = useRef<string[]>([]);
  const cancelRequestedRef = useRef(false);

  const estimatedFrameCount = useMemo(() => {
    if (!videoInfo || interval <= 0 || endTime < startTime) return 0;

    return Math.floor((endTime - startTime) / interval + 0.0001) + 1;
  }, [endTime, interval, startTime, videoInfo]);

  const estimatedDimensions = useMemo(() => {
    if (!videoInfo) return null;
    return getOutputDimensions(videoInfo.width, videoInfo.height, maxWidth);
  }, [maxWidth, videoInfo]);

  const selectedFrames = useMemo(
    () => frames.filter((frame) => selectedFrameIds.has(frame.id)),
    [frames, selectedFrameIds],
  );

  const totalFrameSize = useMemo(
    () => frames.reduce((total, frame) => total + frame.blob.size, 0),
    [frames],
  );

  const revokeFrameUrls = useCallback(() => {
    frameUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    frameUrlsRef.current = [];
  }, []);

  const clearFrames = useCallback(() => {
    revokeFrameUrls();
    setFrames([]);
    setSelectedFrameIds(new Set());
    setProgress(0);
    setArchiveProgress(0);
  }, [revokeFrameUrls]);

  const resetTool = useCallback(() => {
    cancelRequestedRef.current = true;
    videoRef.current?.pause();

    if (sourceUrlRef.current) {
      URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = null;
    }

    revokeFrameUrls();
    setFile(null);
    setVideoUrl("");
    setVideoInfo(null);
    setStatus("empty");
    setError("");
    setStartTime(0);
    setEndTime(0);
    setFrames([]);
    setSelectedFrameIds(new Set());
    setProgress(0);
    setArchiveProgress(0);
    setIsCancelling(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [revokeFrameUrls]);

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) {
        URL.revokeObjectURL(sourceUrlRef.current);
      }
      revokeFrameUrls();
    };
  }, [revokeFrameUrls]);

  const selectFile = useCallback(
    (nextFile: File) => {
      if (!isVideoFile(nextFile)) {
        setError("Choose a video file to continue. MP4 and WebM are the most reliable options.");
        return;
      }

      if (nextFile.size === 0) {
        setError("This video file is empty. Please choose another file.");
        return;
      }

      cancelRequestedRef.current = true;
      videoRef.current?.pause();

      if (sourceUrlRef.current) {
        URL.revokeObjectURL(sourceUrlRef.current);
      }

      revokeFrameUrls();
      const objectUrl = URL.createObjectURL(nextFile);
      sourceUrlRef.current = objectUrl;

      setFile(nextFile);
      setVideoUrl(objectUrl);
      setVideoInfo(null);
      setStatus("loading");
      setError("");
      setStartTime(0);
      setEndTime(0);
      setFrames([]);
      setSelectedFrameIds(new Set());
      setProgress(0);
      setArchiveProgress(0);
      setIsCancelling(false);
      cancelRequestedRef.current = false;
    },
    [revokeFrameUrls],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (nextFile) {
      selectFile(nextFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const nextFile = event.dataTransfer.files?.[0];
    if (nextFile) {
      selectFile(nextFile);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      setStatus("error");
      setError("We could not read this video. Try an MP4 (H.264) or WebM file.");
      return;
    }

    const duration = Math.round(video.duration * 1_000) / 1_000;

    setVideoInfo({
      duration,
      width: video.videoWidth,
      height: video.videoHeight,
    });
    setStartTime(0);
    setEndTime(duration);
    setStatus("ready");
    setError("");
  };

  const handleVideoError = () => {
    setStatus("error");
    setError("This browser could not decode the video. Try an MP4 (H.264) or WebM file instead.");
  };

  const handleGenerate = async () => {
    const video = videoRef.current;
    if (!file || !video || !videoInfo || status === "processing") return;

    if (estimatedFrameCount === 0) {
      setError("Choose a valid start time, end time, and capture interval.");
      return;
    }

    if (estimatedFrameCount > MAX_FRAMES) {
      setError(
        "This selection would create " +
          String(estimatedFrameCount) +
          " frames. Choose a longer interval or a shorter range to stay within " +
          String(MAX_FRAMES) +
          " frames.",
      );
      return;
    }

    const format = formatOptions.find((option) => option.value === imageFormat) || formatOptions[0];
    const dimensions = getOutputDimensions(videoInfo.width, videoInfo.height, maxWidth);
    const timestamps: number[] = [];
    const safeEnd = Math.max(startTime, endTime);
    let nextTimestamp = startTime;

    while (nextTimestamp <= safeEnd + 0.0001) {
      timestamps.push(Math.min(nextTimestamp, safeEnd));
      nextTimestamp += interval;
    }

    if (!timestamps.length) {
      setError("There are no frames in this selected range.");
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: imageFormat !== "image/jpeg" });
    if (!context) {
      setError("Your browser does not support image frame generation.");
      return;
    }

    cancelRequestedRef.current = false;
    setIsCancelling(false);
    clearFrames();
    setStatus("processing");
    setError("");
    video.pause();

    const initialTime = video.currentTime;
    const fileStem = getFileStem(file.name);

    try {
      for (let index = 0; index < timestamps.length; index += 1) {
        if (cancelRequestedRef.current) break;

        const timestamp = timestamps[index];
        await seekVideo(video, timestamp);

        if (cancelRequestedRef.current) break;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        context.drawImage(video, 0, 0, dimensions.width, dimensions.height);

        const blob = await canvasToBlob(canvas, imageFormat, quality / 100);
        const id = String(Date.now()) + "-" + String(index);
        const name =
          fileStem +
          "-frame-" +
          String(index + 1).padStart(3, "0") +
          "-" +
          fileTimestamp(timestamp) +
          format.extension;
        const url = URL.createObjectURL(blob);
        const frame: GeneratedFrame = {
          id,
          blob,
          name,
          time: timestamp,
          url,
          width: dimensions.width,
          height: dimensions.height,
        };

        frameUrlsRef.current.push(url);
        setFrames((current) => current.concat(frame));
        setSelectedFrameIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });
        setProgress(Math.round(((index + 1) / timestamps.length) * 100));

        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }

      if (cancelRequestedRef.current) {
        setStatus("ready");
        setError(
          "Extraction stopped. The frames created before stopping are still available below.",
        );
      } else {
        setStatus("complete");
      }
    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "Frame extraction failed. Try a shorter range or another video.";
      setStatus("error");
      setError(message);
    } finally {
      cancelRequestedRef.current = false;
      setIsCancelling(false);

      try {
        video.currentTime = Math.min(initialTime, Math.max(0, video.duration - 0.001));
      } catch {
        // The generated frames remain usable even when the preview cannot seek back.
      }
    }
  };

  const handleCancel = () => {
    cancelRequestedRef.current = true;
    setIsCancelling(true);
  };

  const toggleFrame = (frameId: string) => {
    setSelectedFrameIds((current) => {
      const next = new Set(current);
      if (next.has(frameId)) {
        next.delete(frameId);
      } else {
        next.add(frameId);
      }
      return next;
    });
  };

  const downloadArchive = async () => {
    if (!selectedFrames.length || isCreatingArchive) return;

    setIsCreatingArchive(true);
    setArchiveProgress(0);
    setError("");

    try {
      const { default: JSZip } = await import("jszip");
      const archive = new JSZip();
      const folder = archive.folder(getFileStem(file?.name || "video") + "-frames");

      selectedFrames.forEach((frame) => {
        folder?.file(frame.name, frame.blob);
      });

      const blob = await archive.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        },
        (metadata) => setArchiveProgress(Math.round(metadata.percent)),
      );

      downloadBlob(blob, getFileStem(file?.name || "video") + "-frames.zip");
    } catch {
      setError("We could not create the ZIP file. Please try again.");
    } finally {
      setIsCreatingArchive(false);
    }
  };

  const isProcessing = status === "processing";
  const tooManyFrames = estimatedFrameCount > MAX_FRAMES;
  const canGenerate =
    !!file &&
    !!videoInfo &&
    !isProcessing &&
    status !== "loading" &&
    estimatedFrameCount > 0 &&
    !tooManyFrames;

  return (
    <section className="overflow-hidden border border-[#C5BEB6] bg-[#FFFDF8]">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg,.mp4,.m4v,.webm,.mov,.ogv"
        className="sr-only"
        onChange={handleInputChange}
      />

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
          className={cn(
            "m-3 flex min-h-[22rem] cursor-pointer flex-col items-center justify-center border border-dashed px-6 text-center transition-colors sm:m-4 sm:min-h-[25rem]",
            isDragging
              ? "border-[#A85C40] bg-[#F7F1EA]"
              : "border-[#C5BEB6] bg-[#F7F1EA] hover:border-[#A85C40] hover:bg-[#F3EBE2]",
          )}
        >
          <span className="flex size-14 items-center justify-center bg-[#1A1A1A] text-[#D4916E]">
            <UploadCloud className="size-7" />
          </span>
          <p className="mt-6 font-mono text-[10px] font-semibold tracking-[0.12em] text-[#A85C40]">SOURCE VIDEO / LOCAL ONLY</p>
          <h2 className="mt-3 text-xl font-bold tracking-[-0.035em] text-[#1A1A1A]">
            Drop a video to extract frames
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#3D3D3D]">
            or click to browse from your device. Video to Frames supports MP4 and WebM best.
          </p>
          <span className="mt-6 bg-[#D4916E] px-4 py-2 text-sm font-semibold text-[#1A1A1A]">
            Choose video
          </span>
          <p className="mt-5 font-mono text-[10px] tracking-[0.06em] text-[#6B6B6B]">
            Your file stays on this device. Nothing is uploaded.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-[#C5BEB6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center bg-[#1A1A1A] text-[#D4916E]">
                <FileVideo className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#1A1A1A]">{file.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-[#6B6B6B]">
                  {formatFileSize(file.size)}
                  {videoInfo ? " · " + formatTime(videoInfo.duration) + " · " + videoInfo.width + " × " + videoInfo.height : ""}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex h-9 items-center gap-1.5 border border-[#C5BEB6] px-3 text-xs font-semibold text-[#3D3D3D] transition-colors hover:border-[#A85C40] hover:bg-[#F7F1EA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="size-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={resetTool}
                disabled={isProcessing}
                className="inline-flex size-9 items-center justify-center border border-[#C5BEB6] text-[#6B6B6B] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove video"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="border-b border-[#C5BEB6] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:border-[#C5BEB6]">
              <div className="relative overflow-hidden bg-[#1A1A1A]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={handleVideoError}
                  className="aspect-video w-full"
                />
                {status === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-sm font-semibold text-white">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Reading your video…
                  </div>
                )}
              </div>

              {videoInfo && (
                <div className="mt-4 border border-[#C5BEB6] bg-[#F7F1EA] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B6B6B]">Capture range</p>
                      <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">
                        {formatTime(startTime)} — {formatTime(endTime)}
                      </p>
                    </div>
                    <span className="border border-[#C5BEB6] bg-[#FFFDF8] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#3D3D3D]">
                      {formatTime(Math.max(0, endTime - startTime))}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="block">
                      <span className="flex items-center justify-between text-xs font-semibold text-[#3D3D3D]">
                        Start
                        <input
                          type="number"
                          min={0}
                          max={Math.max(0, endTime - MIN_SEGMENT_LENGTH)}
                          step={0.1}
                          value={Number(startTime.toFixed(1))}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            if (!Number.isFinite(value)) return;
                            setStartTime(Math.min(Math.max(0, value), Math.max(0, endTime - MIN_SEGMENT_LENGTH)));
                          }}
                          disabled={isProcessing}
                          className="ml-3 w-20 border border-[#C5BEB6] bg-[#FFFDF8] px-2 py-1 text-right font-mono text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#A85C40] disabled:opacity-50"
                          aria-label="Start time in seconds"
                        />
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, endTime - MIN_SEGMENT_LENGTH)}
                        step={0.1}
                        value={startTime}
                        onChange={(event) => setStartTime(Number(event.target.value))}
                        disabled={isProcessing}
                        className="mt-2 w-full accent-[#D4916E] disabled:opacity-50"
                      />
                    </label>

                    <label className="block">
                      <span className="flex items-center justify-between text-xs font-semibold text-[#3D3D3D]">
                        End
                        <input
                          type="number"
                          min={Math.min(videoInfo.duration, startTime + MIN_SEGMENT_LENGTH)}
                          max={videoInfo.duration}
                          step={0.1}
                          value={Number(endTime.toFixed(1))}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            if (!Number.isFinite(value)) return;
                            setEndTime(
                              Math.min(
                                videoInfo.duration,
                                Math.max(startTime + MIN_SEGMENT_LENGTH, value),
                              ),
                            );
                          }}
                          disabled={isProcessing}
                          className="ml-3 w-20 border border-[#C5BEB6] bg-[#FFFDF8] px-2 py-1 text-right font-mono text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#A85C40] disabled:opacity-50"
                          aria-label="End time in seconds"
                        />
                      </span>
                      <input
                        type="range"
                        min={Math.min(videoInfo.duration, startTime + MIN_SEGMENT_LENGTH)}
                        max={videoInfo.duration}
                        step={0.1}
                        value={endTime}
                        onChange={(event) => setEndTime(Number(event.target.value))}
                        disabled={isProcessing}
                        className="mt-2 w-full accent-[#D4916E] disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#FFFDF8] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center bg-[#1A1A1A] text-[#D4916E]">
                  <SlidersHorizontal className="size-4" />
                </span>
                <div>
                  <h2 className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[#1A1A1A]">VIDEO TO FRAMES SETTINGS</h2>
                  <p className="text-xs text-[#6B6B6B]">Fine-tune how your frames are saved.</p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <fieldset disabled={!videoInfo || isProcessing}>
                  <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B6B6B]">
                    Capture every
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {intervalPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInterval(preset)}
                        className={cn(
                          "border px-3 py-1.5 font-mono text-[10px] font-semibold transition-colors disabled:cursor-not-allowed",
                          interval === preset
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FFFDF8]"
                            : "border-[#C5BEB6] bg-[#FFFDF8] text-[#3D3D3D] hover:border-[#A85C40] hover:text-[#A85C40]",
                        )}
                      >
                        {preset < 1 ? String(preset) + " sec" : String(preset) + " second" + (preset > 1 ? "s" : "")}
                      </button>
                    ))}
                  </div>
                  <label className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-[#3D3D3D]">
                    Custom interval
                    <span className="relative">
                      <input
                        type="number"
                        min={0.1}
                        max={60}
                        step={0.1}
                        value={interval}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          if (Number.isFinite(value)) setInterval(Math.min(60, Math.max(0.1, value)));
                        }}
                        className="w-24 border border-[#C5BEB6] bg-[#FFFDF8] px-2.5 py-1.5 text-right font-mono text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#A85C40]"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6B6B6B]">s</span>
                    </span>
                  </label>
                </fieldset>

                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B6B6B]">Format</span>
                    <select
                      value={imageFormat}
                      onChange={(event) => setImageFormat(event.target.value as ImageFormat)}
                      disabled={!videoInfo || isProcessing}
                      className="mt-2 h-10 w-full border border-[#C5BEB6] bg-[#FFFDF8] px-2.5 font-mono text-sm font-semibold text-[#1A1A1A] outline-none focus:border-[#A85C40] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {formatOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B6B6B]">Image size</span>
                    <select
                      value={maxWidth}
                      onChange={(event) => setMaxWidth(Number(event.target.value))}
                      disabled={!videoInfo || isProcessing}
                      className="mt-2 h-10 w-full border border-[#C5BEB6] bg-[#FFFDF8] px-2.5 font-mono text-sm font-semibold text-[#1A1A1A] outline-none focus:border-[#A85C40] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {widthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className={cn("block", imageFormat === "image/png" && "opacity-50")}>
                  <span className="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B6B6B]">
                    Image quality
                    <span className="normal-case tracking-normal text-[#1A1A1A]">{quality}%</span>
                  </span>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={1}
                    value={quality}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    disabled={!videoInfo || isProcessing || imageFormat === "image/png"}
                    className="mt-3 w-full accent-[#D4916E] disabled:cursor-not-allowed"
                  />
                  <span className="mt-1 block text-[11px] leading-4 text-[#6B6B6B]">
                    PNG is lossless, so its quality setting does not apply.
                  </span>
                </label>
              </div>

              <div className="mt-6 border border-[#C5BEB6] bg-[#F7F1EA] p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-[#A85C40]" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1A1A1A]">
                      {estimatedFrameCount ? String(estimatedFrameCount) + " frame" + (estimatedFrameCount === 1 ? "" : "s") + " estimated" : "Set a capture range"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6B6B6B]">
                      {estimatedDimensions
                        ? estimatedDimensions.width + " × " + estimatedDimensions.height + " output · limit " + String(MAX_FRAMES) + " frames"
                        : "We will show the output size after the video loads."}
                    </p>
                  </div>
                </div>
              </div>

              {tooManyFrames && (
                <div className="mt-3 flex gap-2 border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    This selection exceeds the {MAX_FRAMES}-frame browser limit. Increase the interval or shorten the range.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 bg-[#D4916E] px-4 font-mono text-[11px] font-bold tracking-[0.08em] text-[#1A1A1A] transition-colors hover:bg-[#A85C40] hover:text-[#FFFDF8] disabled:cursor-not-allowed disabled:bg-[#C5BEB6] disabled:text-[#6B6B6B]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Extracting {progress}%
                  </>
                ) : (
                  <>
                    <FileImage className="size-4" />
                    Extract {estimatedFrameCount || 0} frame{estimatedFrameCount === 1 ? "" : "s"}
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden bg-[#E5DED5]">
                    <div
                      className="h-full bg-[#D4916E] transition-[width] duration-300"
                      style={{ width: String(progress) + "%" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#3D3D3D] hover:text-red-700 disabled:opacity-60"
                  >
                    <Square className="size-3 fill-current" />
                    {isCancelling ? "Stopping…" : "Stop extraction"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {error && (
        <div className={cn("mx-5 mb-5 flex gap-2 border px-3 py-2.5 text-xs leading-5 sm:mx-6 sm:mb-6", status === "error" ? "border-red-300 bg-red-50 text-red-800" : "border-amber-300 bg-amber-50 text-amber-900")}>
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {frames.length > 0 && (
        <section className="border-t border-[#C5BEB6] bg-[#F7F1EA] px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-[-0.03em] text-[#1A1A1A]">Captured frames</h2>
                <span className="bg-[#1A1A1A] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FFFDF8]">{frames.length}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-[#6B6B6B]">
                {selectedFrames.length} selected · {formatFileSize(totalFrameSize)} generated
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFrameIds(new Set(frames.map((frame) => frame.id)))}
                className="text-xs font-bold text-[#3D3D3D] hover:text-[#A85C40]"
              >
                Select all
              </button>
              <span className="text-[#C5BEB6]">/</span>
              <button
                type="button"
                onClick={() => setSelectedFrameIds(new Set())}
                className="text-xs font-bold text-[#3D3D3D] hover:text-[#A85C40]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={downloadArchive}
                disabled={!selectedFrames.length || isCreatingArchive}
                className="ml-1 inline-flex h-9 items-center gap-1.5 bg-[#1A1A1A] px-3 font-mono text-[10px] font-semibold tracking-[0.06em] text-[#FFFDF8] transition-colors hover:bg-[#A85C40] disabled:cursor-not-allowed disabled:bg-[#C5BEB6]"
              >
                {isCreatingArchive ? <Loader2 className="size-3.5 animate-spin" /> : <Archive className="size-3.5" />}
                {isCreatingArchive ? "Packing " + String(archiveProgress) + "%" : "Download ZIP"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {frames.map((frame, index) => {
              const selected = selectedFrameIds.has(frame.id);

              return (
                <article
                  key={frame.id}
                  className={cn(
                    "overflow-hidden border bg-[#FFFDF8] transition-colors",
                    selected ? "border-[#A85C40] ring-1 ring-[#D4916E]" : "border-[#C5BEB6]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFrame(frame.id)}
                    aria-pressed={selected}
                    className="group relative block aspect-video w-full overflow-hidden bg-slate-100 text-left"
                    title={selected ? "Deselect frame" : "Select frame"}
                  >
                    <img
                      src={frame.url}
                      alt={"Frame " + String(index + 1) + " at " + formatTime(frame.time)}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className={cn(
                        "absolute right-2 top-2 flex size-5 items-center justify-center border text-white",
                        selected ? "border-[#A85C40] bg-[#A85C40]" : "border-white/80 bg-[#1A1A1A]/40",
                      )}
                    >
                      {selected && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-[#1A1A1A]">#{String(index + 1).padStart(2, "0")}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-[#6B6B6B]">{formatTime(frame.time)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadBlob(frame.blob, frame.name)}
                      className="inline-flex size-7 shrink-0 items-center justify-center border border-transparent text-[#6B6B6B] transition-colors hover:border-[#C5BEB6] hover:bg-[#F3EBE2] hover:text-[#A85C40]"
                      aria-label={"Download frame " + String(index + 1)}
                      title="Download frame"
                    >
                      <Download className="size-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}
