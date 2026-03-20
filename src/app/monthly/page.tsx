"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subMonths, addMonths, startOfMonth, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, PieChart as PieIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#00F5FF",        // Cyan
  Transport: "#7C3AED",   // Violet
  Entertainment: "#F59E0B", // Amber
  Bills: "#10B981",       // Emerald
  Health: "#EF4444",      // Red
  Shopping: "#EC4899",    // Pink
  Other: "#A8A29E"        // Gray
};

export default function MonthlyExpenses() {
  const { expenses, budgets } = useStore();
  const [monthOffset, setMonthOffset] = useState(0);

  const currentMonth = startOfMonth(subMonths(new Date(), monthOffset));
  const monthStr = format(currentMonth, "yyyy-MM");

  // Filter expenses for selected month
  const monthExpenses = useMemo(() => expenses.filter(e => e.date.startsWith(monthStr)), [expenses, monthStr]);

  // Total Spend vs Budget
  const totalSpend = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);

  // Category Breakdown for PieChart
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
        percent: totalSpend > 0 ? (value / totalSpend) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value); // highest first
  }, [monthExpenses, totalSpend]);

  // Last 6 months for Stacked BarChart
  const sixMonthData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const m = startOfMonth(subMonths(new Date(), i));
      const mStr = format(m, "yyyy-MM");
      
      const mExpenses = expenses.filter(e => e.date.startsWith(mStr));
      
      const monthObj: any = { name: format(m, "MMM") };
      Object.keys(CATEGORY_COLORS).forEach(cat => {
        monthObj[cat] = mExpenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
      });
      data.push(monthObj);
    }
    return data;
  }, [expenses]);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  // State for direction to determine animation slide
  const [direction, setDirection] = useState(1);

  const changeMonth = (offset: number) => {
    setDirection(offset > 0 ? 1 : -1);
    setMonthOffset(prev => Math.max(0, prev + offset)); // Prevent going into future if preferred, though mock data is only past
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl z-50">
          <p className="text-white/80 font-medium flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color || payload[0].fill }} />
            {payload[0].name}
          </p>
          <p className="font-heading font-bold text-xl text-white mt-1">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Monthly Overview</h1>
          <p className="text-white/60 font-medium">Detailed category analysis</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 w-full md:w-auto overflow-hidden">
          <button 
            onClick={() => changeMonth(1)}
            className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="relative w-48 h-10 flex items-center justify-center overflow-hidden flex-1 md:flex-none">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={monthOffset}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute text-lg font-heading font-bold text-white tracking-widest uppercase text-center w-full"
              >
                {format(currentMonth, "MMMM yyyy")}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => changeMonth(-1)}
            disabled={monthOffset === 0}
            className={`p-3 rounded-full transition-colors ${monthOffset === 0 ? "text-white/20 bg-transparent" : "bg-white/5 hover:bg-white/10 text-white"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-6 rounded-3xl">
          <p className="text-white/60 font-medium mb-1 uppercase tracking-widest text-sm">Total Spend vs Budget</p>
          <div className="text-3xl md:text-5xl font-heading font-bold mb-2">
            <span className="text-[var(--color-brand-cyan)] drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]">
              ₹{totalSpend.toLocaleString("en-IN")}
            </span>
            <span className="text-white/40 text-2xl md:text-4xl mx-2">/</span>
            <span className="text-white/80">₹{totalBudget.toLocaleString("en-IN")}</span>
          </div>
          <div className="w-full max-w-sm h-3 bg-black/40 rounded-full mt-4 overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (totalSpend / totalBudget) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute left-0 top-0 h-full rounded-full ${
                totalSpend > totalBudget ? "bg-[var(--color-brand-red)]" : "bg-gradient-to-r from-[var(--color-brand-cyan)] to-[var(--color-brand-emerald)]"
              }`}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-64 h-64 flex-shrink-0 relative">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={true}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
                    <PieIcon className="w-8 h-8 text-white/50" />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40 border-2 border-dashed border-white/10 rounded-full">
                <span className="text-4xl mb-2">📭</span>
                <p>No data</p>
              </div>
            )}
          </div>

          <div className="flex-1 w-full max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
            <h3 className="text-lg font-bold text-white mb-4">Breakdown</h3>
            <div className="flex flex-col gap-3">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: cat.color, boxShadow: `0 0 10px ${cat.color}80` }} />
                    <span className="font-medium text-white/90">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">₹{cat.value.toLocaleString("en-IN")}</div>
                    <div className="text-xs text-white/50">{cat.percent.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 6-Month Trend */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col"
        >
          <h3 className="text-xl font-heading font-bold text-white mb-4">6-Month Trend</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sixMonthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <Bar 
                    key={cat}
                    dataKey={cat} 
                    stackId="a" 
                    fill={CATEGORY_COLORS[cat]} 
                    radius={[0, 0, 0, 0]} 
                    isAnimationActive={true}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
