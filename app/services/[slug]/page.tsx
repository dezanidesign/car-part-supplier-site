import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CollectionDeliverySection from "@/components/shared/CollectionDeliverySection";
import ExpandableVideo from "@/components/shared/ExpandableVideo";
import TintPreviewSlider from "@/components/shared/TintPreviewSlider";
import { getServiceBySlug } from "@/lib/serviceContent";
import { CONVERSION_COPY } from "@/lib/siteContent";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Service Not Found | FDL Bespoke",
    };
  }

  return {
    title: `${service.title} | FDL Bespoke`,
    description: service.description,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const media = service.mediaItems?.[0] || service.media;

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white">
      <section className="px-6 md:px-16 pb-16 md:pb-20">
        <div className="max-w-[1920px] mx-auto grid lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,520px)] gap-10 md:gap-16 items-end">
          <div>
            <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
              Service Page Coming Soon
            </p>
            <h1 className="font-display text-4xl md:text-7xl font-bold uppercase leading-[0.9] mb-6">
              {service.title}
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              We&apos;re building out a dedicated page for this service. For now, the fastest way to move forward is to contact us directly with your brief.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-[var(--accent)] text-black px-6 md:px-8 py-4 font-bold uppercase tracking-[0.18em] text-xs md:text-sm hover:brightness-110 transition-all"
              >
                <span>{CONVERSION_COPY.likeWhatYouSee}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-3 border border-white/15 px-6 md:px-8 py-4 font-bold uppercase tracking-[0.18em] text-xs md:text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <span>Back to Services</span>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden border border-white/10 bg-black/30">
            <div className="relative aspect-[4/5]">
              {service.visualType === "tint-slider" ? (
                <TintPreviewSlider compact imageAlt={`${service.title} preview`} />
              ) : service.visualType === "pending" || !media ? (
                <div className="flex h-full w-full items-center justify-center bg-white/[0.03] p-8 text-center">
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
                      Media Pending
                    </p>
                    <p className="text-sm leading-relaxed text-gray-500">
                      Confirmed project media will be added here soon.
                    </p>
                  </div>
                </div>
              ) : media.type === "video" ? (
                <ExpandableVideo
                  src={media.src}
                  poster={media.poster}
                  title={service.title}
                  className="h-full w-full"
                  videoClassName="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={media.src}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <CollectionDeliverySection />
    </div>
  );
}
