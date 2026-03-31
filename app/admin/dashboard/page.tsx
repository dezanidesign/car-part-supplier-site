"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, FilePlus, Eye, PenLine } from "lucide-react";

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/blog?stats=true")
      .then((r) => r.json())
      .then((d) => setStats(d.stats))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Total Posts",
      value: stats?.total ?? "—",
      icon: FileText,
      color: "text-white",
    },
    {
      label: "Published",
      value: stats?.published ?? "—",
      icon: Eye,
      color: "text-emerald-400",
    },
    {
      label: "Drafts",
      value: stats?.drafts ?? "—",
      icon: PenLine,
      color: "text-amber-400",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
          Dashboard
        </h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:brightness-110 transition-all"
        >
          <FilePlus size={14} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-[#111] border border-white/5 p-5 flex items-center gap-4"
            >
              <Icon size={20} className={card.color} />
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/blog/new"
          className="bg-[#111] border border-white/5 p-6 hover:border-[var(--accent)]/30 transition-colors group"
        >
          <FilePlus
            size={24}
            className="text-gray-500 group-hover:text-[var(--accent)] transition-colors mb-3"
          />
          <h3 className="font-bold text-sm mb-1">Write a New Post</h3>
          <p className="text-xs text-gray-500">
            Create a new blog post with the rich text editor
          </p>
        </Link>
        <Link
          href="/admin/blog"
          className="bg-[#111] border border-white/5 p-6 hover:border-[var(--accent)]/30 transition-colors group"
        >
          <FileText
            size={24}
            className="text-gray-500 group-hover:text-[var(--accent)] transition-colors mb-3"
          />
          <h3 className="font-bold text-sm mb-1">Manage Posts</h3>
          <p className="text-xs text-gray-500">
            Edit, publish, or delete existing blog posts
          </p>
        </Link>
      </div>
    </div>
  );
}
