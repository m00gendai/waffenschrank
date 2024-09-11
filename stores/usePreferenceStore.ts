import { create } from "zustand"
import { colorThemes } from "../lib/colorThemes"
import { Color, Languages, SortingTypes} from "../interfaces"

interface GeneralSettings{
  displayImagesInListViewGun: boolean
  displayImagesInListViewAmmo: boolean
  resizeImages: boolean
  loginGuard: boolean
  emptyFields: boolean
  caliberDisplayName: boolean
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
    sortAmmoIcon: string
    setSortAmmoIcon: (data: string) => void
    sortGunIcon: string
    setSortGunIcon: (data: string) => void
    sortGunsAscending: boolean
    toggleSortGunsAscending: () => void
    setSortGunsAscending: (status: boolean) => void
    sortAmmoAscending: boolean
    toggleSortAmmoAscending: () => void
    setSortAmmoAscending: (status: boolean) => void
    firstOpen: boolean
    setFirstOpen: () => void
    caliberDisplayNameList: {name: string, displayName: string}[]
    setCaliberDisplayNameList: (calibers: {name: string, displayName?: string}[]) => void
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
    sortAmmoIcon: "alphabetical-variant",
    setSortAmmoIcon: (data: string) => set((state) => ({sortAmmoIcon: data})),
    sortGunIcon: "alphabetical-variant",
    setSortGunIcon: (data: string) => set((state) => ({sortGunIcon: data})),
    sortGunsAscending: true,
    toggleSortGunsAscending: () => set((state) => ({sortGunsAscending: !state.sortGunsAscending})),
    setSortGunsAscending: (status: boolean) => set((state) => ({sortGunsAscending: status})),
    sortAmmoAscending: true,
    toggleSortAmmoAscending: () => set((state) => ({sortAmmoAscending: !state.sortAmmoAscending})),
    setSortAmmoAscending: (status: boolean) => set((state) => ({sortAmmoAscending: status})),
    generalSettings: {
      displayImagesInListViewGun: true,
      displayImagesInListViewAmmo: true,
      resizeImages: true,
      loginGuard: false,
      emptyFields: false,
      caliberDisplayName: false,
    },
    setGeneralSettings: (settings: GeneralSettings) => set((state) => ({generalSettings: settings})),
    firstOpen: true,
    setFirstOpen: () => set((state) => ({firstOpen: !state.firstOpen})),
    caliberDisplayNameList: [],
    setCaliberDisplayNameList: (calibers: {name: string, displayName: string}[])  => set((state) =>({caliberDisplayNameList: calibers}))
  }))