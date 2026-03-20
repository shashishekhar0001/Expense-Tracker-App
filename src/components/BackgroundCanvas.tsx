"use client";

import { motion } from "framer-motion";

export function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden bg-[#080B14] pointer-events-none">
      <div
        className="absolute inset-0 z-10 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      <div className="absolute inset-0 z-0 mix-blend-screen overflow-hidden">
        {/* Cyan Orb */}
        <motion.div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#00F5FF]/30 blur-[120px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Violet Orb */}
        <motion.div
          className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#7C3AED]/30 blur-[120px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Emerald Orb */}
        <motion.div
          className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-[#10B981]/20 blur-[120px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Blue/extra Orb to balance as requested: "Colors: #00F5FF, #7C3AED, #10B981, #3B82F6" */}
        <motion.div
          className="absolute top-[60%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/20 blur-[120px]"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
