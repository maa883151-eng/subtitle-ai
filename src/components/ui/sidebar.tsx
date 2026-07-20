"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Subtitles, LayoutDashboard, Upload, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/generate", icon: Upload, label: "New Job" },
  { href: "/history", icon: History, label: "History" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ credits = 0 }: { credits?: number }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Subtitles className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-lg">SubtitleAI</span>
        </div>
      </div>
      <div className="p-4">
        <Link href="/generate" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" /> New Subtitle Job
        </Link>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors", active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg px-3 py-2 mb-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Credits</span>
          <span className="text-xs font-bold text-blue-400">{credits} left</span>
        </div>
        <div className="flex items-center gap-3"><UserButton afterSignOutUrl="/" /><span className="text-sm text-slate-400">Account</span></div>
      </div>
    </aside>
  );
}
