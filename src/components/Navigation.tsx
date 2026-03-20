"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Calendar, BarChart3, PieChart, Target } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Daily", href: "/daily", icon: Calendar },
  { name: "Weekly", href: "/weekly", icon: BarChart3 },
  { name: "Monthly", href: "/monthly", icon: PieChart },
  { name: "Savings", href: "/savings", icon: Target },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-white/5 backdrop-blur-xl p-4 z-40">
        <div className="mb-10 mt-4 px-4 font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-cyan)] flex items-center justify-center text-black">
            ₹
          </div>
          Tracker
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group ${
                  isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <>
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                      layoutId="sidebar-border"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-[var(--color-brand-cyan)] shadow-[0_0_12px_var(--color-brand-cyan)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </>
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Desktop Creator Footer */}
        <div className="mt-auto pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            Made by <br />
            <a href="https://github.com/shashishekhar0001" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-cyan)] hover:text-white transition-colors duration-200 font-medium">Shashi Shekhar</a>
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-san pt-2 px-2 flex justify-between items-center z-40">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 h-full py-2 ${
                isActive ? "text-[var(--color-brand-cyan)]" : "text-white/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-2 w-12 h-1 rounded-b-md bg-[var(--color-brand-cyan)] shadow-[0_0_12px_var(--color-brand-cyan)]"
                />
              )}
              <item.icon className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]" : ""}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
