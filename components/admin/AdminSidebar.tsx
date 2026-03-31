"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Package,
  ArrowLeft,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative z-50 top-0 left-0 h-full w-60 bg-[#0A0A0A] border-r border-white/5
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Image
              src="https://fdlbespoke.co.uk/wp-content/uploads/2025/06/cropped-cropped-FDL-UK-Logo-White-Sq.png"
              alt="FDL"
              width={28}
              height={28}
              className="h-7 w-auto opacity-70"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Admin
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors
                  ${
                    active
                      ? "bg-white/5 text-[var(--accent)] border-l-2 border-[var(--accent)] -ml-px"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Site
          </Link>
        </div>
      </aside>
    </>
  );
}
