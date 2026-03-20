"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";

const COLORS = ["cyan", "violet", "emerald", "amber"];
const EMOJIS = ["🖥", "✈️", "🚗", "🏠", "📱", "💍", "🎓", "🎮"];

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const addSavingsGoal = useStore((state) => state.addSavingsGoal);
  
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmoji(EMOJIS[0]);
      setTarget("");
      setDeadline("");
      setColor(COLORS[0]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;

    addSavingsGoal({
      name,
      emoji,
      target: Number(target),
      deadline,
      color,
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#0b0e17] rounded-3xl border border-white/10 p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-white">Create New Goal</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex gap-4">
                <div className="w-20">
                  <label className="text-sm font-medium text-white/60 mb-2 block">Emoji</label>
                  <select
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-white text-2xl text-center focus:outline-none focus:border-[var(--color-brand-cyan)]"
                  >
                    {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-white/60 mb-2 block">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. MacBook Pro"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-brand-cyan)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="100000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-brand-cyan)] transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-cyan)] transition-all [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Theme Color</label>
                <div className="flex gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        color === c ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: `var(--color-brand-${c})` }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full py-4 rounded-xl font-bold text-black text-lg bg-[var(--color-brand-cyan)] hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_15px_rgba(0,245,255,0.3)]"
              >
                Create Goal
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
