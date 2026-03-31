"use client";

export default function BlogContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-300 prose-p:leading-relaxed
        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-gray-300 prose-blockquote:not-italic
        prose-code:text-[var(--accent)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/10
        prose-img:rounded prose-img:border prose-img:border-white/10 prose-img:mx-auto
        prose-li:text-gray-300
        prose-hr:border-white/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
