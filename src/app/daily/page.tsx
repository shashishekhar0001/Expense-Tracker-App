"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Trash2, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AddExpenseModal } from "@/components/AddExpenseModal";

export default function DailyExpenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { expenses, deleteExpense } = useStore();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const totalSpend = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getEmojiForCategory = (cat: string) => {
    const map: Record<string, string> = {
      Food: "🍔", Transport: "🚗", Entertainment: "🎮", Bills: "💡", Health: "💊", Shopping: "🛍", Other: "📦"
    };
    return map[cat] || "💸";
  };

  const confirmDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
      setDeletingId(null);
    } else {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center mb-8 mt-4"
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
          {format(new Date(), "MMMM d, yyyy")}
        </h1>
        <p className="text-white/60 font-medium tracking-wide uppercase text-sm mb-4">Total Daily Spend</p>
        <div className="text-6xl md:text-7xl font-heading font-bold text-[var(--color-brand-cyan)] drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">
          <AnimatedCounter value={totalSpend} prefix="₹" />
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full max-w-sm py-4 rounded-xl font-bold text-black text-lg bg-gradient-to-r from-[var(--color-brand-cyan)] to-blue-400 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(0,245,255,0.3)] mb-10"
      >
        <Plus className="w-6 h-6" /> Add Expense
      </motion.button>

      <div className="w-full">
        {todayExpenses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-10 opacity-60"
          >
            <div className="w-40 h-40 mb-6 flex items-center justify-center rounded-full bg-white/5 border border-dashed border-white/20">
              <span className="text-6xl">✨</span>
            </div>
            <p className="text-xl font-heading text-white">No expenses today.</p>
            <p className="text-white/60">Start tracking your spending!</p>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col gap-4 w-full"
            variants={{
              show: { transition: { staggerChildren: 0.07 } },
            }}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {todayExpenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 },
                  }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  className="relative group w-full"
                >
                  <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                        {getEmojiForCategory(expense.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{expense.category}</h4>
                        <p className="text-sm text-white/50">{expense.note || expense.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-xl md:text-2xl font-heading font-bold text-white">
                        -₹{expense.amount.toLocaleString("en-IN")}
                      </div>
                      <button 
                        onClick={() => confirmDelete(expense.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-all ml-2"
                        title="Delete expense"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
