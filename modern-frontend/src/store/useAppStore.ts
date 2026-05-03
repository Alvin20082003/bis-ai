import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryItem, FavoriteItem, StandardResult } from '../types';

interface AppState {
  // Search state
  currentQuery: string;
  isLoading: boolean;
  setQuery: (q: string) => void;
  setLoading: (v: boolean) => void;

  // History
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  removeHistory: (id: string) => void;

  // Favorites
  favorites: FavoriteItem[];
  addFavorite: (standard: StandardResult, query: string) => void;
  removeFavorite: (standardNo: string) => void;
  isFavorite: (standardNo: string) => boolean;

  // Analytics
  totalQueries: number;
  avgLatency: number;
  updateAnalytics: (latency: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentQuery: '',
      isLoading: false,
      setQuery: (q) => set({ currentQuery: q }),
      setLoading: (v) => set({ isLoading: v }),

      history: [],
      addHistory: (item) =>
        set((s) => ({ history: [item, ...s.history].slice(0, 50) })),
      clearHistory: () => set({ history: [] }),
      removeHistory: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

      favorites: [],
      addFavorite: (standard, query) => {
        const existing = get().favorites.find(
          (f) => f.standard.standard_no === standard.standard_no
        );
        if (existing) return;
        set((s) => ({
          favorites: [
            { id: crypto.randomUUID(), standard, savedAt: Date.now(), query },
            ...s.favorites,
          ],
        }));
      },
      removeFavorite: (standardNo) =>
        set((s) => ({
          favorites: s.favorites.filter(
            (f) => f.standard.standard_no !== standardNo
          ),
        })),
      isFavorite: (standardNo) =>
        get().favorites.some((f) => f.standard.standard_no === standardNo),

      totalQueries: 0,
      avgLatency: 0,
      updateAnalytics: (latency) =>
        set((s) => {
          const n = s.totalQueries + 1;
          return {
            totalQueries: n,
            avgLatency: parseFloat(
              ((s.avgLatency * s.totalQueries + latency) / n).toFixed(0)
            ),
          };
        }),
    }),
    { name: 'bis-app-store' }
  )
);
