"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Filter, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import galleryJson from "../data/gallery.json";

type GalleryData = Record<string, string[]>;

const gallery = galleryJson as GalleryData;
const BATCH_SIZE = 12; // Number of images to load per click

export default function GalleryPage() {
  const [active, setActive] = useState<string>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const makes = useMemo(() => ["all", ...Object.keys(gallery)], []);

  // Get full list of images for current filter
  const allImages = useMemo(() => {
    if (active === "all") return Object.values(gallery).flat();
    return gallery[active] ?? [];
  }, [active]);

  // Only slice the chunk we want to show currently
  const displayedImages = useMemo(() => {
    return allImages.slice(0, visibleCount);
  }, [allImages, visibleCount]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [active]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToNext, goToPrevious, closeLightbox]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF4D00] selection:text-white">
      {/* Editorial Hero Section */}
      <header className="pt-32 pb-12 px-6 md:px-12 max-w-[1920px] mx-auto border-b border-white/5">
        <div
          className={`transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="font-display text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] mb-6">
            The <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px #FF4D00" }}
            >
              Archive
            </span>
            <span className="text-[#FF4D00]">.</span>
          </h1>

          <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed border-l-2 border-[#FF4D00] pl-6 mt-8">
            A curated collection of our finest automotive transformations. From full body conversions to bespoke
            interior tailoring.
          </p>
        </div>
      </header>

      {/* Sticky Glass Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 mb-12">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <span className="text-[#FF4D00] mr-2 hidden md:block">
              <Filter size={20} />
            </span>

            {makes.map((make) => (
              <button
                key={make}
                onClick={() => setActive(make)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap
                  ${
                    active === make
                      ? "bg-[#FF4D00] text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]"
                      : "bg-white/5 text-gray-400 hover:bg-white hover:text-black hover:scale-105"
                  }`}
              >
                {make.replace("-", " ")}
              </button>
            ))}
          </div>

          <div className="hidden md:block text-xs font-bold uppercase tracking-widest text-gray-500">
            {/* Show "Showing X of Y Projects" */}
            Showing {Math.min(visibleCount, allImages.length)} of {allImages.length} Projects
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="px-6 md:px-12 pb-32 max-w-[1920px] mx-auto">
        {displayedImages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedImages.map((src: string, index: number) => {
                // Calculate the actual index in allImages array
                const actualIndex = allImages.indexOf(src);
                return (
                  <div
                    key={`${src}-${index}`}
                    className={`group relative aspect-[4/3] overflow-hidden bg-[#111] border border-white/5 
                      transition-all duration-700 ease-out transform cursor-pointer
                      ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
                    style={{ transitionDelay: `${(index % BATCH_SIZE) * 50}ms` }}
                    onClick={() => openLightbox(actualIndex)}
                  >
                    <img
                      src={src}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < allImages.length && (
              <div className="flex justify-center mt-20">
                <button
                  onClick={handleLoadMore}
                  className="group flex items-center gap-4 px-10 py-5 border border-white/20 hover:bg-white hover:text-black transition-all duration-500"
                >
                  <span className="text-sm font-bold uppercase tracking-[0.2em]">Load More Projects</span>
                  <div className="p-1 border border-white/30 rounded-full group-hover:border-black/30 transition-colors">
                    <Plus size={16} />
                  </div>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600">
            <p className="text-sm font-bold uppercase tracking-widest">
              No images found in this collection.
            </p>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            aria-label="Close lightbox"
          >
            <X size={24} className="md:w-6 md:h-6" />
          </button>

          {/* Previous Button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="md:w-7 md:h-7" />
            </button>
          )}

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="md:w-7 md:h-7" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}