import { create } from "zustand"

interface PreferenceStore {
    language: string
    switchLanguage: (lang: string) => void
  }

  export const usePreferenceStore = create<PreferenceStore>((set) => ({
    language: "de",
    switchLanguage: (lang: string) => set((state) => ({ language: lang })),
  }))