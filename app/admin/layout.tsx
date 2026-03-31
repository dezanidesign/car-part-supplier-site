"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            ".site-chrome-top,.site-chrome-bottom{display:none!important}.site-main{padding:0!important}",
        }}
      />
      <div className="fixed inset-0 z-[200] bg-[#0A0A0A] flex">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
          <div className="flex-1 overflow-y-auto p-5 md:p-8">{children}</div>
        </div>
      </div>
    </>
  );
}
