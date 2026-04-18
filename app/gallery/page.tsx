"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Filter, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import ExpandableVideo from "@/components/shared/ExpandableVideo";
import {
  GALLERY_FILTERS,
  GALLERY_FILTER_LABELS,
  getGalleryBrands,
  getGalleryItemsForFilter,
  type CuratedMediaItem,
} from "@/lib/curatedMedia";

type GallerySection = {
  key: string;
  eyebrow: string;
  title: string;
  items: CuratedMediaItem[];
};

function buildSections(filter: string, items: CuratedMediaItem[]): GallerySection[] {
  if (filter === "all") {
    return getGalleryBrands()
      .map((brand) => {
        const brandItems = items.filter((item) => item.brand === brand);
        return {
          key: brand,
          eyebrow: "Brand",
          title: GALLERY_FILTER_LABELS[brand] || brand,
          items: brandItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }

  if (filter === "videos") {
    return [
      {
        key: "videos",
        eyebrow: "Curated",
        title: "Video Library",
        items,
      },
    ];
  }

  const projects = new Map<string, CuratedMediaItem[]>();
  for (const item of items) {
    const current = projects.get(item.projectLabel) || [];
    current.push(item);
    projects.set(item.projectLabel, current);
  }

  return Array.from(projects.entries()).map(([projectLabel, projectItems]) => ({
    key: `${filter}-${projectLabel}`,
    eyebrow: GALLERY_FILTER_LABELS[filter] || filter,
    title: projectLabel,
    items: projectItems,
  }));
}

export default function GalleryPage() {
  const [active, setActive] = useState<string>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems = useMemo(() => getGalleryItemsForFilter(active), [active]);
  const filteredImages = useMemo(
    () => filteredItems.filter((item) => item.type === "image"),
    [filteredItems],
  );
  const sections = useMemo(
    () => buildSections(active, filteredItems),
    [active, filteredItems],
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const openLightbox = (imageId: string) => {
    const imageIndex = filteredImages.findIndex((item) => item.id === imageId);
    if (imageIndex < 0) return;

    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToNext, goToPrevious, closeLightbox]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D3BF89] selection:text-black [--section-bg:#050505]">
      <header className="pb-12 px-6 md:px-12 max-w-[1920px] mx-auto border-b border-white/5">
        <div
          className={`transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="font-display text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] mb-6">
            Curated <br />
            <span className="text-outline-accent">Projects</span>
            <span className="text-[#D3BF89]">.</span>
          </h1>

          <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed border-l-2 border-[#D3BF89] pl-6 mt-8">
            A rebuilt archive from the new FDL content library, organised by brand and project with selected image-led reels where video adds something real.
          </p>
        </div>
      </header>

      <div className="header-sticky sticky z-40 bg-[#050505]/85 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 mb-12">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <span className="text-[#D3BF89] mr-2 hidden md:block">
              <Filter size={20} />
            </span>

            {GALLERY_FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActive(filter.key)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                  active === filter.key
                    ? "bg-[#D3BF89] text-black shadow-[0_0_25px_rgba(211,191,137,0.4)]"
                    : "bg-white/5 text-gray-400 hover:bg-white hover:text-black hover:scale-105"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block text-xs font-bold uppercase tracking-widest text-gray-500">
            Showing {filteredItems.length} curated assets
          </div>
        </div>
      </div>

      <main className="px-6 md:px-12 pb-32 max-w-[1920px] mx-auto space-y-16 md:space-y-20">
        {sections.length > 0 ? (
          sections.map((section, sectionIndex) => (
            <section key={section.key}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D3BF89] mb-2">
                    {section.eyebrow}
                  </p>
                  <h2 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                  {sectionIndex === 0 && active === "all"
                    ? "Selected stills and reels grouped by the projects that best represent each brand."
                    : "Curated visuals from the new content library, arranged by project rather than dumped as a flat grid."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className={`border border-white/5 bg-[#111] overflow-hidden transition-all duration-700 ${
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${(itemIndex % 6) * 50}ms` }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                      {item.type === "video" ? (
                        <>
                          <ExpandableVideo
                            src={item.src}
                            poster={item.poster}
                            title={item.title}
                            autoPlay={false}
                            className="h-full w-full"
                            videoClassName="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-2">
                            <Play size={10} />
                            Video
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openLightbox(item.id)}
                          className="w-full h-full text-left"
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            loading="lazy"
                          />
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600">
            <p className="text-sm font-bold uppercase tracking-widest">
              No media found in this collection.
            </p>
          </div>
        )}
      </main>

      {lightboxOpen && filteredImages.length > 0 && (
        <div
          className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-[160] flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-2xl shadow-black/40 transition-all duration-300 hover:scale-105 hover:bg-[#D3BF89] md:right-8 md:h-12 md:w-12"
            aria-label="Close lightbox"
          >
            <X size={24} className="md:w-6 md:h-6" />
          </button>

          {filteredImages.length > 1 && (
            <>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="md:w-7 md:h-7" />
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="md:w-7 md:h-7" />
              </button>
            </>
          )}

          <div
            className="relative w-full h-full flex items-center justify-center max-w-7xl max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {filteredImages.length > 1 && (
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                {lightboxIndex + 1} / {filteredImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
