"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import ExpandableVideo from "@/components/shared/ExpandableVideo";
import { getMediaVisualSrc, type CuratedMediaItem } from "@/lib/curatedMedia";

type Props = {
  media: CuratedMediaItem[];
  categoryLabel: string;
  brandLabel?: string;
  intro?: string;
  eyebrow?: string;
  title?: string;
};

function ProjectFilters({
  projects,
  activeProject,
  onChange,
}: {
  projects: { key: string; label: string }[];
  activeProject: string;
  onChange: (project: string) => void;
}) {
  if (projects.length <= 1) return null;

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
          activeProject === "all"
            ? "bg-[#D3BF89] text-black"
            : "border border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:text-white"
        }`}
      >
        All Projects
      </button>

      {projects.map((project) => (
        <button
          key={project.key}
          type="button"
          onClick={() => onChange(project.key)}
          className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
            activeProject === project.key
              ? "bg-[#D3BF89] text-black"
              : "border border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:text-white"
          }`}
        >
          {project.label}
        </button>
      ))}
    </div>
  );
}

export default function VehicleMediaShowcase({
  media,
  categoryLabel,
  brandLabel,
  intro,
  eyebrow,
  title,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState("all");

  const projects = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of media) map.set(item.project, item.projectLabel);
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [media]);

  const filteredMedia = useMemo(() => {
    if (activeProject === "all") return media;
    return media.filter((item) => item.project === activeProject);
  }, [activeProject, media]);

  const images = filteredMedia.filter((item) => item.type === "image");
  const videos = filteredMedia.filter((item) => item.type === "video");
  const carouselItems = images.length > 0 ? images : videos.filter((item) => item.poster);

  const scrollCarousel = (direction: "previous" | "next") => {
    const element = carouselRef.current;
    if (!element) return;

    const delta = Math.round(element.clientWidth * 0.86);
    element.scrollBy({
      left: direction === "next" ? delta : -delta,
      behavior: "smooth",
    });
  };

  if (media.length === 0 || (carouselItems.length === 0 && videos.length === 0)) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-14">
      <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#D3BF89]">
            {eyebrow || "Project Media"}
          </p>
          <h2 className="font-display text-2xl font-bold uppercase leading-tight md:text-4xl">
            {title || `Recent ${categoryLabel} Work`}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-gray-500">
          {intro ||
            `Exact ${brandLabel || categoryLabel} project media from the FDL archive, ordered image-first with videos below.`}
        </p>
      </div>

      <ProjectFilters
        projects={projects}
        activeProject={activeProject}
        onChange={setActiveProject}
      />

      {carouselItems.length > 0 && (
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-3 no-scrollbar"
            aria-label={`${categoryLabel} image carousel`}
          >
            {carouselItems.map((item, index) => {
              const src = getMediaVisualSrc(item);

              return (
                <article
                  key={item.id}
                  className="group relative min-w-[86%] snap-start overflow-hidden border border-white/10 bg-black sm:min-w-[58%] lg:min-w-[44%] xl:min-w-[36%]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={src}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1280px) 36vw, (min-width: 1024px) 44vw, (min-width: 640px) 58vw, 86vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      priority={index === 0}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm">
                      {item.type === "video" ? "Video Poster" : item.projectLabel}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {carouselItems.length > 1 && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => scrollCarousel("previous")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#D3BF89] hover:text-[#D3BF89]"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("next")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#D3BF89] hover:text-[#D3BF89]"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-8 md:mt-10">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#D3BF89]">
                Video
              </p>
              <h3 className="font-display text-xl font-bold uppercase text-white md:text-3xl">
                Clips & Reels
              </h3>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              Tap fullscreen for a cleaner view on mobile or desktop.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden border border-white/10 bg-black"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ExpandableVideo
                    src={item.src}
                    poster={item.poster}
                    title={item.title}
                    autoPlay={false}
                    className="h-full w-full"
                    videoClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                    <Play size={10} />
                    Video
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
