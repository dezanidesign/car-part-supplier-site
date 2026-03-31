"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

export default function AdminHeader({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-5 md:px-8 bg-[#0A0A0A]/80 backdrop-blur-sm shrink-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-gray-400 hover:text-white"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
      >
        <LogOut size={14} />
        Sign Out
      </button>
    </header>
  );
}
