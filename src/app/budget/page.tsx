"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Edit2, Check, AlertTriangle } from "lucide-react";
import { useStore } from "@/store/useStore";

const EMOJIS: Record<string, string> = {
  Food: "🍔", Transport: "🚗", Entertainment: "🎮", Bills: "💡", Health: "💊", Shopping: "🛍", Other: "📦"
};

export default function BudgetTracker() {
  const { expenses, budgets, updateBudget } = useStore();
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const currentMonth = format(new Date(), "yyyy-MM");
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));

  // Determine spend per category
  const categorySpend = Object.keys(budgets).reduce((acc, cat) => {
    acc[cat] = monthExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalSpend = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const overallPercent = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
  
  const getHealthColor = (percent: number) => {
    if (percent < 70) return "var(--color-brand-emerald)";
    if (percent <= 90) return "var(--color-brand-amber)";
    return "var(--color-brand-red)";
  };
  
  const overallColor = getHealthColor(overallPercent);

  // SVG Ring calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(overallPercent, 100) / 100) * circumference;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSaveBudget = (cat: string) => {
    const val = Number(editAmount);
    if (!isNaN(val) && val > 0) {
      updateBudget(cat, val);
    }
    setEditingCat(null);
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-heading font-bold text-white mb-4"
        >
          Budget Health
        </motion.h1>

        {/* Big Circular Progress */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative inline-flex items-center justify-center mt-4"
        >
          {/* Background Ring */}
          <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="24"
              fill="transparent"
            />
            {/* Animated Value Ring */}
            {mounted && (
              <motion.circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={overallColor}
                strokeWidth="24"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                style={{ filter: `drop-shadow(0 0 12px ${overallColor}80)` }}
              />
            )}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-white/60 font-medium tracking-widest text-sm uppercase">Used</span>
            <span className="text-5xl md:text-6xl font-heading font-bold my-1" style={{ color: overallColor }}>
              {Math.round(overallPercent)}%
            </span>
            <span className="text-white/80 font-medium bg-white/5 px-3 py-1 rounded-full text-sm mt-2">
              ₹{totalSpend.toLocaleString("en-IN")} / ₹{totalBudget.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Category Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
      >
        {Object.entries(budgets).map(([cat, limit]) => {
          const spent = categorySpend[cat] || 0;
          const pct = Math.min((spent / limit) * 100, 100);
          const rawPct = (spent / limit) * 100;
          const isOver = rawPct > 100;
          const barColor = getHealthColor(rawPct);

          return (
            <motion.div
              key={cat}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-colors duration-500 group-hover:bg-white/10" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {EMOJIS[cat] || "💸"}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-xl">{cat}</h3>
                    {isOver && (
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1 mt-1 bg-red-400/10 px-2 py-0.5 rounded-md w-max">
                        <AlertTriangle className="w-3 h-3" /> Over budget
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {editingCat === cat ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-sm">₹</span>
                        <input
                          type="number"
                          autoFocus
                          className="w-24 bg-black/50 border border-[var(--color-brand-cyan)] rounded-md py-1 pl-6 pr-2 text-white text-sm outline-none"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveBudget(cat)}
                        />
                      </div>
                      <button 
                        onClick={() => handleSaveBudget(cat)}
                        className="p-1.5 bg-[var(--color-brand-cyan)] text-black rounded-md hover:scale-105 transition-transform"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="group/edit flex items-center gap-2">
                      <span className="text-lg font-bold text-white">₹{limit.toLocaleString("en-IN")}</span>
                      <button 
                        onClick={() => { setEditingCat(cat); setEditAmount(limit.toString()); }}
                        className="opacity-0 group-hover/edit:opacity-100 p-1.5 bg-white/10 text-white rounded-md hover:bg-white/20 transition-all"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {!editingCat && <span className="text-xs text-white/50 block">Limit</span>}
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color: barColor }}>₹{spent.toLocaleString("en-IN")} spent</span>
                  <span className="text-white/40">{Math.round(rawPct)}%</span>
                </div>
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                    style={{ backgroundColor: barColor, boxShadow: `0 0 10px ${barColor}80` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
