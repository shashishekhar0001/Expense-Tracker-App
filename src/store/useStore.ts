import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subDays, format } from "date-fns";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string; // YYYY-MM-DD
  color: string;
  emoji: string;
}

export interface AppState {
  expenses: Expense[];
  budgets: Record<string, number>;
  savingsGoals: SavingsGoal[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateBudget: (category: string, amount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "saved">) => void;
  contributeToGoal: (id: string, amount: number) => void;
  deleteExpense: (id: string) => void;
}

const generateMockData = () => {
  const categories = ["Food", "Transport", "Entertainment", "Bills", "Health", "Shopping", "Other"];
  const expenses: Expense[] = [];

  for (let i = 0; i < 30; i++) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, "yyyy-MM-dd");
    // Generate 1-4 random expenses per day
    const count = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < count; j++) {
      expenses.push({
        id: `mock-${i}-${j}`,
        amount: Math.floor(Math.random() * 800) + 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        note: "Mock expense",
        date: dateStr,
        time: "14:30",
      });
    }
  }

  return expenses;
};

const initialBudgets = {
  Food: 6000,
  Transport: 2500,
  Entertainment: 4000,
  Bills: 5000,
  Health: 2000,
  Shopping: 3500,
  Other: 1500,
};

const initialSavings = [
  {
    id: "goal-1",
    name: "MacBook Pro",
    target: 120000,
    saved: 45000,
    deadline: format(new Date(Date.now() + 45 * 86400000), "yyyy-MM-dd"), // +45 days
    color: "cyan",
    emoji: "🖥",
  },
  {
    id: "goal-2",
    name: "Bali Trip",
    target: 80000,
    saved: 20000,
    deadline: format(new Date(Date.now() + 120 * 86400000), "yyyy-MM-dd"),
    color: "violet",
    emoji: "✈️",
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      expenses: generateMockData(),
      budgets: initialBudgets,
      savingsGoals: initialSavings,
      addExpense: (expense) => {
        const newExpense = { ...expense, id: Date.now().toString() };
        
        // Optimistic UI state update
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
        
        // Background sync to Google Sheets
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExpense),
        }).catch(err => console.error("Failed to sync expense via API:", err));
      },
      updateBudget: (category, amount) =>
        set((state) => ({
          budgets: { ...state.budgets, [category]: amount },
        })),
      addSavingsGoal: (goal) =>
        set((state) => ({
          savingsGoals: [
            ...state.savingsGoals,
            { ...goal, id: Date.now().toString(), saved: 0 },
          ],
        })),
      contributeToGoal: (id, amount) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === id ? { ...g, saved: g.saved + amount } : g
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
    }),
    {
      name: "expense-tracker-storage",
    }
  )
);
