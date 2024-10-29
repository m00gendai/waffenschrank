import { create } from "zustand"
import { colorThemes } from "../lib/colorThemes"
import { Color, Languages } from "../interfaces"

interface PreferenceStore {
    language: string
    switchLanguage: (lang: string) => void
    theme: {name: string, colors: Color},
    switchTheme: (name: string) => void,
    caliberDisplayNameList: {name: string, displayName: string}[]
    setCaliberDisplayNameList: (calibers: {name: string, displayName?: string}[]) => void
    gunFilterOn: boolean
    toggleGunFilterOn: () => void
    ammoFilterOn: boolean
    toggleAmmoFilterOn: () => void
    opticsFilterOn: boolean
    toggleOpticsFilterOn: () => void
    magazinesFilterOn: boolean
    toggleMagazinesFilterOn: () => void
    accMiscFilterOn: boolean
    toggleAccMiscFilterOn: () => void
    silencersFilterOn: boolean
    toggleSilencersFilterOn: () => void
  }

  export const usePreferenceStore = create<PreferenceStore>((set) => ({
    language: "de",
    switchLanguage: (lang: Languages) => set((state) => ({ language: lang })),
    theme: { name: "default", colors: colorThemes.default },
    switchTheme: (name: string) => set((state) => ({theme: {name: name, colors: colorThemes[name]}})),
    caliberDisplayNameList: [],
    setCaliberDisplayNameList: (calibers: {name: string, displayName: string}[])  => set((state) =>({caliberDisplayNameList: calibers})),
    gunFilterOn: false,
    toggleGunFilterOn: () => set((state) => ({gunFilterOn: !state.gunFilterOn})),
    ammoFilterOn: false,
    toggleAmmoFilterOn: () => set((state) => ({ammoFilterOn: !state.ammoFilterOn})),
    opticsFilterOn: false,
    toggleOpticsFilterOn: () => set((state) => ({opticsFilterOn: !state.opticsFilterOn})),
    magazinesFilterOn: false,
    toggleMagazinesFilterOn: () => set((state) => ({magazinesFilterOn: !state.magazinesFilterOn})),
    accMiscFilterOn: false,
    toggleAccMiscFilterOn: () => set((state) => ({accMiscFilterOn: !state.accMiscFilterOn})),
    silencersFilterOn: false,
    toggleSilencersFilterOn: () => set((state) => ({silencersFilterOn: !state.silencersFilterOn}))
  }))