import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLLECTION_DELIVERY_SECTION } from "@/lib/serviceContent";
import { CONVERSION_COPY } from "@/lib/siteContent";

type Props = {
  className?: string;
};

export default function CollectionDeliverySection({ className = "" }: Props) {
  const media = COLLECTION_DELIVERY_SECTION.media;

  return (
    <section className={`px-6 md:px-16 py-16 md:py-24 bg-[#080808] border-y border-white/10 [--section-bg:#080808] ${className}`}>
      <div className="max-w-[1920px] mx-auto grid lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,420px)] gap-10 md:gap-16 items-center">
        <div>
          <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Nationwide Service
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-[0.95] text-white mb-6">
            Collection & Delivery
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
            {CONVERSION_COPY.collectionDelivery}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-[var(--accent)] text-black px-6 md:px-8 py-4 font-bold uppercase tracking-[0.18em] text-xs md:text-sm hover:brightness-110 transition-all"
          >
            <span>{CONVERSION_COPY.likeWhatYouSee}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="border border-white/10 bg-black/30 overflow-hidden">
          <div className="aspect-[4/5]">
            <video
              className="w-full h-full object-cover"
              src={media.src}
              poster={media.poster}
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
