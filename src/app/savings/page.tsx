"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { CopyPlus, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/store/useStore";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { CreateGoalModal } from "@/components/CreateGoalModal";

export default function SavingsMode() {
  const { savingsGoals, contributeToGoal } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundingId, setFundingId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleFund = (id: string, targetValue: number, savedValue: number) => {
    const val = Number(fundAmount);
    if (!isNaN(val) && val > 0) {
      contributeToGoal(id, val);
      
      // Check if this contribution reached the goal
      if (savedValue + val >= targetValue) {
        triggerConfetti();
      }
    }
    setFundingId(null);
    setFundAmount("");
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#00F5FF', '#7C3AED', '#10B981', '#F59E0B'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          Savings Mode 🎯
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/60 font-medium"
        >
          Every rupee saved is a step closer to your dream
        </motion.p>

        {/* Summary Row */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl">
            <div className="text-sm font-medium text-white/60 uppercase tracking-widest mb-1">Total Saved</div>
            <div className="text-3xl font-heading font-bold text-white">
              <AnimatedCounter value={totalSaved} prefix="₹" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl">
            <div className="text-sm font-medium text-white/60 uppercase tracking-widest mb-1">Total Target</div>
            <div className="text-3xl font-heading font-bold text-white">
              <AnimatedCounter value={totalTarget} prefix="₹" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[var(--color-brand-cyan)] to-[var(--color-brand-violet)] p-[1px] rounded-2xl">
            <div className="bg-black/60 backdrop-blur-xl px-6 py-4 rounded-2xl h-full flex flex-col justify-center">
              <div className="text-sm font-medium text-white/60 uppercase tracking-widest mb-1">Overall Progress</div>
              <div className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-cyan)] to-[var(--color-brand-violet)]">
                <AnimatedCounter value={overallProgress} suffix="%" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal, i) => {
          const rawPct = (goal.saved / goal.target) * 100;
          const pct = Math.min(rawPct, 100);
          const isReached = rawPct >= 100;
          const themeColor = `var(--color-brand-${goal.color})`;
          
          const radius = 60;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (pct / 100) * circumference;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className={`bg-white/5 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden transition-all duration-500 border-2 ${
                isReached ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl -ml-10 -mt-10 opacity-20" style={{ backgroundColor: themeColor }} />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{goal.emoji}</div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-xl">{goal.name}</h3>
                    {isReached ? (
                      <span className="text-xs font-bold text-black flex items-center gap-1 mt-1 bg-white px-2 py-0.5 rounded-md w-max">
                        <Trophy className="w-3 h-3" /> Goal Reached!
                      </span>
                    ) : (
                      <span className="text-xs text-white/50 block mt-1">
                        Due in {formatDistanceToNow(new Date(goal.deadline))}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                    {mounted && (
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={themeColor}
                        strokeWidth="12"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-heading font-bold" style={{ color: themeColor }}>
                      <AnimatedCounter value={pct} suffix="%" />
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-white/50 mb-1">Saved</div>
                  <div className="text-2xl font-bold text-white mb-4">₹{goal.saved.toLocaleString("en-IN")}</div>
                  <div className="text-sm font-medium text-white/50 mb-1">Target</div>
                  <div className="text-xl font-bold text-white/80">₹{goal.target.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {!isReached && (
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {fundingId === goal.id ? (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="number"
                          autoFocus
                          placeholder="Amount"
                          className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-white/50 transition-colors"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleFund(goal.id, goal.target, goal.saved)}
                        />
                        <button
                          onClick={() => handleFund(goal.id, goal.target, goal.saved)}
                          className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-transform"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setFundingId(null)}
                          className="px-4 py-2 bg-transparent border border-white/20 text-white rounded-xl hover:bg-white/10 active:scale-95 transition-transform"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setFundingId(goal.id); setFundAmount(""); }}
                        className="w-full py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <CopyPlus className="w-5 h-5" /> Add Funds
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Create Goal Card */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + savingsGoals.length * 0.1, duration: 0.5 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent border-2 border-dashed border-white/20 rounded-3xl p-6 min-h-[300px] flex flex-col items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/20 transition-all mb-4">
            <CopyPlus className="w-8 h-8" />
          </div>
          <span className="text-xl font-heading font-bold text-white/50 group-hover:text-white transition-colors">
            Create New Goal
          </span>
        </motion.button>
      </div>

      <CreateGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
