"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Target, IndianRupee, Wallet } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AddExpenseModal } from "@/components/AddExpenseModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { expenses, budgets, savingsGoals } = useStore();

  const today = new Date();
  const dateString = format(today, "EEEE, d MMMM yyyy");

  // Calculate metrics
  const todayStr = format(today, "yyyy-MM-dd");
  const todaySpend = expenses.filter(e => e.date === todayStr).reduce((sum, e) => sum + e.amount, 0);
  
  const monthStr = format(today, "yyyy-MM");
  const monthExpenses = expenses.filter(e => e.date.startsWith(monthStr));
  const monthSpend = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Approximate Week Total
  const weekSpend = expenses.slice(0, 15).reduce((sum, e) => sum + e.amount, 0) * 0.4; // using mock data slice just for presentation

  // Savings Rate
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const savingsRate = Math.max(0, Math.round(((totalBudget - monthSpend) / totalBudget) * 100));

  const metrics = [
    { title: "Today's Spend", value: todaySpend, prefix: "₹", icon: IndianRupee, color: "var(--color-brand-cyan)", change: "+12.5%", isUp: true },
    { title: "Week Total", value: Math.round(weekSpend), prefix: "₹", icon: Wallet, color: "var(--color-brand-violet)", change: "-4.2%", isUp: false },
    { title: "Month Total", value: monthSpend, prefix: "₹", icon: TrendingUp, color: "var(--color-brand-amber)", change: "+2.1%", isUp: true },
    { title: "Savings Rate", value: savingsRate, suffix: "%", icon: Target, color: "var(--color-brand-emerald)", change: "+5.0%", isUp: true },
  ];

  const recentExpenses = expenses.slice(0, 5);

  const getEmojiForCategory = (cat: string) => {
    const map: Record<string, string> = {
      Food: "🍔", Transport: "🚗", Entertainment: "🎮", Bills: "💡", Health: "💊", Shopping: "🛍", Other: "📦"
    };
    return map[cat] || "💸";
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-2"
          >
            Good Morning, Shekhar 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 font-medium"
          >
            {dateString}
          </motion.p>
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex bg-gradient-to-r from-[var(--color-brand-cyan)] to-blue-400 text-black font-bold px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(0,245,255,0.3)]"
        >
          + Add Expense
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-colors duration-500 group-hover:bg-white/10" style={{ backgroundColor: `${m.color}20` }} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10"
                style={{ color: m.color }}
              >
                <m.icon className="w-6 h-6" />
              </div>
              <div className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${m.isUp ? (m.title === "Savings Rate" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10") : "text-emerald-400 bg-emerald-400/10"}`}>
                {m.change}
                {m.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            </div>
            
            <h3 className="text-white/60 font-medium mb-1 relative z-10">{m.title}</h3>
            <div className="text-4xl font-heading font-bold text-white relative z-10">
              <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-white">Recent Transactions</h2>
          <button className="text-[var(--color-brand-cyan)] font-medium hover:underline">View All</button>
        </div>
        
        <div className="flex flex-col gap-4">
          {recentExpenses.map((expense, i) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                  {getEmojiForCategory(expense.category)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{expense.category}</h4>
                  <p className="text-sm text-white/50">{expense.note || expense.time}</p>
                </div>
              </div>
              <div className="text-xl font-heading font-bold text-white">
                -₹{expense.amount.toLocaleString("en-IN")}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mobile FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-[var(--color-brand-cyan)] to-blue-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)] z-40 text-black active:scale-95 transition-transform"
      >
        <TrendingUp className="w-6 h-6" />
      </button>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
