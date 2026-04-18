"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";

type ExpandableVideoProps = {
  src: string;
  poster?: string;
  title: string;
  className?: string;
  videoClassName?: string;
  buttonClassName?: string;
  modalVideoClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: "none" | "metadata" | "auto";
};

export default function ExpandableVideo({
  src,
  poster,
  title,
  className = "",
  videoClassName = "",
  buttonClassName = "",
  modalVideoClassName = "",
  autoPlay = true,
  loop = true,
  muted = true,
  preload = "metadata",
}: ExpandableVideoProps) {
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const openExpandedView = async () => {
    const video = inlineVideoRef.current;

    if (video) {
      const nativeVideo = video as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
      };

      try {
        if (
          typeof nativeVideo.webkitEnterFullscreen === "function" &&
          /iPad|iPhone|iPod/i.test(window.navigator.userAgent)
        ) {
          nativeVideo.webkitEnterFullscreen();
          return;
        }

        if (typeof video.requestFullscreen === "function") {
          await video.requestFullscreen();
          return;
        }
      } catch {
        // Fall back to the in-app modal viewer.
      }
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <video
          ref={inlineVideoRef}
          className={videoClassName}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          loop={loop}
          autoPlay={autoPlay}
          preload={preload}
          aria-label={title}
        />

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void openExpandedView();
          }}
          className={`absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/80 ${buttonClassName}`}
          aria-label={`Open ${title} in fullscreen`}
        >
          <Maximize2 size={12} />
          <span>Fullscreen</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} expanded video`}
          onClick={() => setIsModalOpen(false)}
        >
          <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-[160] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-black shadow-2xl shadow-black/40 transition-colors hover:bg-[#D3BF89] md:right-8"
              aria-label="Close expanded video"
            >
              <X size={18} />
            </button>

            <div
              className="relative flex w-full max-w-6xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <video
                className={`max-h-[88vh] w-full rounded-2xl bg-black object-contain ${modalVideoClassName}`}
                src={src}
                poster={poster}
                controls
                playsInline
                autoPlay
                preload="metadata"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
