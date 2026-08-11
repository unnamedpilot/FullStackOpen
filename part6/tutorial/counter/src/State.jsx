import { create } from "zustand";

const useCountStore = create((set) => ({
  count: 0,
  actions: {
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count + -1 })),
    reset: () => set({ count: 0 }),
  },
}));

export const useCounter = () => useCountStore(state => state.count)
export const useCounterControls = () => useCountStore(state => state.actions)