import { create } from "zustand"
import { colorThemes } from "../lib/colorThemes"
import { Color} from "../interfaces"

interface PreferenceStore {
    language: string
    switchLanguage: (lang: string) => void
    theme: {name: string, colors: Color},
    switchTheme: (name: string) => void,
    dbImport: Date,
    setDbImport: (date: Date) => void
  }

  export const usePreferenceStore = create<PreferenceStore>((set) => ({
    language: "de",
    switchLanguage: (lang: string) => set((state) => ({ language: lang })),
    theme: { name: "default", colors: colorThemes.default },
    switchTheme: (name: string) => set((state) => ({theme: {name: name, colors: colorThemes[name]}})),
    dbImport: null,
    setDbImport: (date: Date) => set((state) => ({dbImport: date}))
  }))