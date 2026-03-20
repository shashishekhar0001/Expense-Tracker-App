"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Bills", "Health", "Shopping", "Other"];

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const addExpense = useStore((state) => state.addExpense);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setCategory("Food");
      setNote("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    addExpense({
      amount: Number(amount),
      category,
      note,
      date,
      time: format(new Date(), "HH:mm"),
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#0b0e17] sm:rounded-3xl rounded-t-3xl border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-[var(--color-brand-cyan)]"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <CheckCircle2 className="w-20 h-20 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-heading font-bold text-white">Expense Added!</h2>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading font-bold text-white">Add Expense</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Amount Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/60 text-center uppercase tracking-wider">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      autoFocus
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-center text-5xl font-heading font-bold text-white outline-none placeholder:text-white/20 focus:ring-4 focus:ring-[var(--color-brand-cyan)]/20 rounded-2xl py-2 transition-all"
                      required
                    />
                  </div>

                  {/* Category Pills */}
                  <div>
                    <label className="text-sm font-medium text-white/60 mb-3 block">Category</label>
                    <motion.div
                      className="flex flex-wrap gap-2"
                      variants={{
                        show: { transition: { staggerChildren: 0.05 } },
                      }}
                      initial="hidden"
                      animate="show"
                    >
                      {CATEGORIES.map((cat, i) => (
                        <motion.button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            show: { opacity: 1, scale: 1 },
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            category === cat
                              ? "bg-[var(--color-brand-cyan)] text-black"
                              : "bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {cat}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>

                  {/* Note & Date */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-white/60 mb-2 block">Note</label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-brand-cyan)] focus:ring-1 focus:ring-[var(--color-brand-cyan)] transition-all"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-sm font-medium text-white/60 mb-2 block">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-cyan)] focus:ring-1 focus:ring-[var(--color-brand-cyan)] transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 w-full py-4 rounded-xl font-bold text-black text-lg bg-gradient-to-r from-[var(--color-brand-cyan)] to-blue-400 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                  >
                    Save Expense
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
