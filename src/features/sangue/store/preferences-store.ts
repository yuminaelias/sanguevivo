import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';
import type { Preferences } from '../types/sangue';
export const usePreferences = create<Preferences>()(persist((set) => ({
  urgent: false, campaigns: false, visits: false, district: 'Todos os distritos', group: 'Todos os grupos',
  setPreference: (key, value) => set({ [key]: value }),
  setFilters: (district, group) => set({ district, group }),
}), { name: 'sangue-preferences', storage: createJSONStorage(() => zustandStorage) }));
