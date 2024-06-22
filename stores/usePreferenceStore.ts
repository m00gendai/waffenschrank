import { create } from "zustand"
import { colorThemes } from "../lib/colorThemes"
import { Color, Languages, SortingTypes} from "../interfaces"
import { GeneratedIdentifierFlags } from "typescript"

interface GeneralSettings{
  displayImagesInListViewGun: boolean
  displayImagesInListViewAmmo: boolean
}

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
    sortBy: SortingTypes
    setSortBy: (type: SortingTypes) => void
    ammoDbImport: Date
    setAmmoDbImport: (date: Date) => void
    displayAmmoAsGrid: boolean
    setDisplayAmmoAsGrid: (status: boolean) => void
    toggleDisplayAmmoAsGrid: () => void
    sortAmmoBy: SortingTypes
    setSortAmmoBy: (type: SortingTypes) => void
    generalSettings: GeneralSettings
    setGeneralSettings: (settings: GeneralSettings) => void
  }

  export const usePreferenceStore = create<PreferenceStore>((set) => ({
    language: "de",
    switchLanguage: (lang: Languages) => set((state) => ({ language: lang })),
    theme: { name: "default", colors: colorThemes.default },
    switchTheme: (name: string) => set((state) => ({theme: {name: name, colors: colorThemes[name]}})),
    dbImport: null,
    setDbImport: (date: Date) => set((state) => ({dbImport: date})),
    displayAsGrid: true,
    setDisplayAsGrid: (status: boolean) => set((state) => ({displayAsGrid: status})),
    toggleDisplayAsGrid: () => set((state) => ({displayAsGrid: !state.displayAsGrid})),
    sortBy: "alphabetical",
    setSortBy: (type: SortingTypes) => set((state) => ({sortBy: type})),
    ammoDbImport: null,
    setAmmoDbImport: (date: Date) => set((state) => ({ammoDbImport: date})),
    displayAmmoAsGrid: true,
    setDisplayAmmoAsGrid: (status: boolean) => set((state) => ({displayAmmoAsGrid: status})),
    toggleDisplayAmmoAsGrid: () => set((state) => ({displayAmmoAsGrid: !state.displayAmmoAsGrid})),
    sortAmmoBy: "alphabetical",
    setSortAmmoBy: (type: SortingTypes) => set((state) => ({sortAmmoBy: type})),
    generalSettings: {
      displayImagesInListViewGun: true,
      displayImagesInListViewAmmo: true
    },
    setGeneralSettings: (settings: GeneralSettings) => set((state) => ({generalSettings: settings}))
  }))