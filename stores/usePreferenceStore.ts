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
    displayAsGrid: boolean
    setDisplayAsGrid: (status: boolean) => void
    toggleDisplayAsGrid: () => void
    sortBy: "alphabetical" | "chronological" | "caliber"
    setSortBy: (type: "alphabetical" | "chronological" | "caliber") => void
    ammoDbImport: Date
    setAmmoDbImport: (date: Date) => void
    displayAmmoAsGrid: boolean
    setDisplayAmmoAsGrid: (status: boolean) => void
    toggleDisplayAmmoAsGrid: () => void
    sortAmmoBy: "alphabetical" | "chronological" | "caliber"
    setSortAmmoBy: (type: "alphabetical" | "chronological" | "caliber") => void
  }

  export const usePreferenceStore = create<PreferenceStore>((set) => ({
    language: "de",
    switchLanguage: (lang: string) => set((state) => ({ language: lang })),
    theme: { name: "default", colors: colorThemes.default },
    switchTheme: (name: string) => set((state) => ({theme: {name: name, colors: colorThemes[name]}})),
    dbImport: null,
    setDbImport: (date: Date) => set((state) => ({dbImport: date})),
    displayAsGrid: true,
    setDisplayAsGrid: (status: boolean) => set((state) => ({displayAsGrid: status})),
    toggleDisplayAsGrid: () => set((state) => ({displayAsGrid: !state.displayAsGrid})),
    sortBy: "alphabetical",
    setSortBy: (type: "alphabetical" | "chronological" | "caliber") => set((state) => ({sortBy: type})),
    ammoDbImport: null,
    setAmmoDbImport: (date: Date) => set((state) => ({ammoDbImport: date})),
    displayAmmoAsGrid: true,
    setDisplayAmmoAsGrid: (status: boolean) => set((state) => ({displayAmmoAsGrid: status})),
    toggleDisplayAmmoAsGrid: () => set((state) => ({displayAmmoAsGrid: !state.displayAmmoAsGrid})),
    sortAmmoBy: "alphabetical",
    setSortAmmoBy: (type: "alphabetical" | "chronological" | "caliber") => set((state) => ({sortAmmoBy: type})),
  }))