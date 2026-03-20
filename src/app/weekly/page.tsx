"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, TrendingUp, Calendar, ArrowDownUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function WeeklyExpenses() {
  const { expenses } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate week dates
  const currentStart = startOfWeek(subDays(new Date(), weekOffset * 7), { weekStartsOn: 1 }); // Monday start

  const weekData = useMemo(() => {
    const days = [];
    let weekTotal = 0;
    let highestDay = { label: "", amount: 0 };

    for (let i = 0; i < 7; i++) {
      const d = addDays(currentStart, i);
      const dStr = format(d, "yyyy-MM-dd");
      
      const dayTotal = expenses
        .filter(e => e.date === dStr)
        .reduce((sum, e) => sum + e.amount, 0);

      weekTotal += dayTotal;
      if (dayTotal > highestDay.amount) {
        highestDay = { label: format(d, "EEEE"), amount: dayTotal };
      }

      days.push({
        name: format(d, "EEE"), // Mon, Tue
        fullDate: format(d, "MMM d, yyyy"),
        amount: dayTotal,
        isToday: isSameDay(d, new Date())
      });
    }

    const average = weekTotal / 7;

    return { days, weekTotal, highestDay, average };
  }, [expenses, currentStart, weekOffset]);

  const { days, weekTotal, highestDay, average } = weekData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white/60 font-medium text-sm mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-[var(--color-brand-cyan)] font-heading font-bold text-2xl">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Weekly Insights</h1>
          <p className="text-white/60 font-medium">Analyze your 7-day spending trends</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1">
          <button 
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="px-4 font-medium text-sm tracking-widest text-white/80 w-48 text-center uppercase min-w-[200px]">
            {format(currentStart, "MMM d")} - {format(addDays(currentStart, 6), "MMM d, yyyy")}
          </div>
          <button 
            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
            disabled={weekOffset === 0}
            className={`p-2 rounded-full transition-colors ${weekOffset === 0 ? "text-white/20" : "hover:bg-white/10 text-white"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 h-[400px]"
        >
          <h3 className="text-xl font-heading font-bold text-white mb-6">Spending Trend</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 4, 4]} 
                  isAnimationActive={true} 
                  animationDuration={1200}
                >
                  {days.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isToday ? "var(--color-brand-cyan)" : "rgba(0,245,255,0.4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 3 Stat Cards */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-[var(--color-brand-cyan)]/30 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-cyan)]/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="text-sm font-medium text-[var(--color-brand-cyan)] mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Week Total
            </div>
            <div className="text-4xl font-heading font-bold text-white">
              <AnimatedCounter value={weekTotal} prefix="₹" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-[var(--color-brand-violet)]/30 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-violet)]/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="text-sm font-medium text-[var(--color-brand-violet)] mb-2 flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4" /> Daily Average
            </div>
            <div className="text-4xl font-heading font-bold text-white">
              <AnimatedCounter value={average} prefix="₹" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-[var(--color-brand-amber)]/30 rounded-3xl p-6 relative overflow-hidden flex-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-amber)]/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="text-sm font-medium text-[var(--color-brand-amber)] mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Highest Spend
            </div>
            <div className="text-3xl font-heading font-bold text-white mb-1">
              {highestDay.label || "N/A"}
            </div>
            <div className="text-[var(--color-brand-amber)] font-medium text-lg">
              ₹{highestDay.amount.toLocaleString("en-IN")}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Breakdown List */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
      >
        <h3 className="text-xl font-heading font-bold text-white mb-6">Daily Breakdown</h3>
        <div className="flex flex-col gap-6">
          {days.map((day, i) => {
            const percent = weekTotal > 0 ? (day.amount / weekTotal) * 100 : 0;
            return (
              <div key={day.name} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white/80">{day.name} <span className="text-white/40 font-normal ml-2">{day.fullDate}</span></span>
                  <span className="font-medium text-white">₹{day.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[var(--color-brand-cyan)] to-blue-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
