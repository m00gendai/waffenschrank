import { create } from "zustand"
import { colorThemes } from "../lib/colorThemes"
import { Color, Languages, SortingTypesGun, SortingTypesAmmo, SortingTypesAccessory_Silencer, CollectionType, SortingTypes, SortingTypesAccessory_Optic, SortingTypesPart_ConversionKit, SortingTypesAccessory_LightLaser, SortingTypesPart_Barrel, SortingTypesAccessory_Scope, SortingTypesAccessory_Magazine, SortingTypesAccessory_Misc, SortingTypesLiterature_Book, SortingTypesReloading_Die, SortingTypesReloading_Bullet, SortingTypesReloading_Case, SortingTypesReloading_Primer, SortingTypesReloading_Powder, SupportedCountries, weightUnitNames, distUnitNames} from "../lib/interfaces"
import { Language } from "website/src/types/types_global"

export type DisplayVariants = "grid" | "list" | "compactList"

interface GeneralSettings{
  displayImagesInListView: boolean
  displayImagesInListViewGun: boolean
  displayImagesInListViewAmmo: boolean
  displayImagesInListViewAccessory_Silencer: boolean
  displayImagesInListViewAccessory_Optic: boolean
  displayImagesInListViewAccessory_Scope: boolean
  displayImagesInListViewAccessory_LightLaser: boolean
  displayImagesInListViewAccessory_Magazine: boolean
  displayImagesInListViewAccessory_Misc: boolean
  displayImagesInListViewPart_ConversionKit: boolean
  displayImagesInListViewPart_Barrel: boolean
  displayImagesInListViewLiterature_Book: boolean
  displayImagesInListViewReloading_Die: boolean
  displayImagesInListViewReloading_Bullet: boolean
  displayImagesInListViewReloading_Case: boolean
  displayImagesInListViewReloading_Primer: boolean
  displayImagesInListViewReloading_Powder: boolean
  resizeImages: boolean
  loginGuard: boolean
  emptyFields: boolean
  caliberDisplayName: boolean
  titleBelowImage: boolean
  hintsDisplay: boolean
  scanBeep: boolean
  rememberLastScreen: boolean
  displaySoldItems: boolean
}

interface DisplaySettings{
  gunCollection: DisplayVariants
  ammoCollection: DisplayVariants
  accessoryCollection_Silencer: DisplayVariants
  accessoryCollection_Optic: DisplayVariants
  accessoryCollection_Scope: DisplayVariants
  accessoryCollection_LightLaser: DisplayVariants
  accessoryCollection_Magazine: DisplayVariants
  accessoryCollection_Misc: DisplayVariants
  partCollection_ConversionKit: DisplayVariants
  partCollection_Barrel: DisplayVariants
  literatureCollection_Book: DisplayVariants
  reloadingCollection_Die: DisplayVariants
  reloadingCollection_Bullet: DisplayVariants
  reloadingCollection_Case: DisplayVariants
  reloadingCollection_Primer: DisplayVariants
  reloadingCollection_Powder: DisplayVariants
  accessoryView: DisplayVariants
}

export interface SorterSettings{
  gunCollection: {type: SortingTypesGun, direction: "asc" | "desc", icon: string}
  ammoCollection: {type: SortingTypesAmmo, direction: "asc" | "desc", icon: string}
  accessoryCollection_Silencer: {type: SortingTypesAccessory_Silencer, direction: "asc" | "desc", icon: string}
  accessoryCollection_Optic: {type: SortingTypesAccessory_Optic, direction: "asc" | "desc", icon: string}
  accessoryCollection_Scope: {type: SortingTypesAccessory_Scope, direction: "asc" | "desc", icon: string}
  accessoryCollection_LightLaser: {type: SortingTypesAccessory_LightLaser, direction: "asc" | "desc", icon: string}
  accessoryCollection_Magazine: {type: SortingTypesAccessory_Magazine, direction: "asc" | "desc", icon: string}
  accessoryCollection_Misc: {type: SortingTypesAccessory_Misc, direction: "asc" | "desc", icon: string}
  partCollection_ConversionKit: {type: SortingTypesPart_ConversionKit, direction: "asc" | "desc", icon: string}
  partCollection_Barrel: {type: SortingTypesPart_Barrel, direction: "asc" | "desc", icon: string}
  literatureCollection_Book: {type: SortingTypesLiterature_Book, direction: "asc" | "desc", icon: string}
  reloadingCollection_Die: {type: SortingTypesReloading_Die, direction: "asc" | "desc", icon: string}
  reloadingCollection_Bullet: {type: SortingTypesReloading_Bullet, direction: "asc" | "desc", icon: string}
  reloadingCollection_Case: {type: SortingTypesReloading_Case, direction: "asc" | "desc", icon: string}
  reloadingCollection_Primer: {type: SortingTypesReloading_Primer, direction: "asc" | "desc", icon: string}
  reloadingCollection_Powder: {type: SortingTypesReloading_Powder, direction: "asc" | "desc", icon: string}
}

interface FilterState{
  gunCollection: boolean
  ammoCollection: boolean
  accessoryCollection_Silencer: boolean
  accessoryCollection_Optic: boolean
  accessoryCollection_Scope: boolean
  accessoryCollection_LightLaser: boolean
  accessoryCollection_Magazine: boolean
  accessoryCollection_Misc: boolean
  partCollection_ConversionKit: boolean
  partCollection_Barrel: boolean
  literatureCollection_Book: boolean
  reloadingCollection_Die: boolean
  reloadingCollection_Bullet: boolean
  reloadingCollection_Case: boolean
  reloadingCollection_Primer: boolean
  reloadingCollection_Powder: boolean
}

export interface PreferredUnits{
  selectedCurrency: string
  generalWeightUnit: weightUnitNames
  bulletWeightUnit: weightUnitNames
  powderWeightUnit: weightUnitNames
  criticalPowderWeightUnit: weightUnitNames
  generalLengthUnit: distUnitNames
  barrelLengthUnit: distUnitNames
  caseLengthUnit: distUnitNames
}

interface InitialStoreState {
  language: Languages
  theme: {name: string, colors: Color}
  country: SupportedCountries
  generalSettings: GeneralSettings
  displaySettings: DisplaySettings
  preferredUnits: PreferredUnits
  sortBy: SorterSettings
  caliberDisplayNameList: { name: string; displayName?: string }[]
  filterOn: FilterState
  hasCheckedForLegacyGunData: boolean
  hasCheckedForLegacyAmmoData: boolean
  hasConvertedLegacyDateFieldsToUnixTimeStamp: boolean
  hasConvertedLegacyAmmoCaliberFieldToStringArray: boolean
  hasBeenOnboarded: boolean
  hasSeenReviewRequest: boolean
}

const initialState:InitialStoreState = {
    language: "de",
    theme: { name: "default", colors: colorThemes.default },
    country: "ch",
    generalSettings: {
      displayImagesInListView: true,
      displayImagesInListViewGun: true,
      displayImagesInListViewAmmo: true,
      displayImagesInListViewAccessory_Silencer: true,
      displayImagesInListViewAccessory_Optic: true,
      displayImagesInListViewAccessory_Scope: true,
      displayImagesInListViewAccessory_LightLaser: true,
      displayImagesInListViewAccessory_Magazine: true,
      displayImagesInListViewAccessory_Misc: true,
      displayImagesInListViewPart_ConversionKit: true,
      displayImagesInListViewPart_Barrel: true,
      displayImagesInListViewLiterature_Book: true,
      displayImagesInListViewReloading_Die: true,
      displayImagesInListViewReloading_Bullet: true,
      displayImagesInListViewReloading_Case: true,
      displayImagesInListViewReloading_Primer: true,
      displayImagesInListViewReloading_Powder: true,
      resizeImages: true,
      loginGuard: false,
      emptyFields: false,
      caliberDisplayName: false,
      titleBelowImage: false,
      hintsDisplay: true,
      scanBeep: false,
      rememberLastScreen: true,
      displaySoldItems: true
    },
    displaySettings: {
      gunCollection: "grid",
      ammoCollection: "grid",
      accessoryCollection_Silencer: "grid",
      accessoryCollection_Optic: "grid",
      accessoryCollection_Scope: "grid",
      accessoryCollection_LightLaser: "grid",
      accessoryCollection_Magazine: "grid",
      accessoryCollection_Misc: "grid",
      partCollection_ConversionKit: "grid",
      partCollection_Barrel: "grid",
      literatureCollection_Book: "grid",
      reloadingCollection_Die: "grid",
      reloadingCollection_Bullet: "grid",
      reloadingCollection_Case: "grid",
      reloadingCollection_Primer: "grid",
      reloadingCollection_Powder: "grid",
      accessoryView: "grid"
    },
    preferredUnits: {
      selectedCurrency: "CHF",
      generalWeightUnit: "gr",
      bulletWeightUnit: "gr",
      powderWeightUnit: "g",
      criticalPowderWeightUnit: "g",
      generalLengthUnit: "cm",
      barrelLengthUnit: "in",
      caseLengthUnit: "in",
    },
    sortBy: {
      gunCollection: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      ammoCollection: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      accessoryCollection_Silencer: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      accessoryCollection_Optic: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      accessoryCollection_Scope: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      accessoryCollection_LightLaser: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      accessoryCollection_Magazine: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      accessoryCollection_Misc: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      partCollection_ConversionKit: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      partCollection_Barrel: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      literatureCollection_Book: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      reloadingCollection_Die: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      reloadingCollection_Bullet: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      reloadingCollection_Case: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      reloadingCollection_Primer: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"},
      reloadingCollection_Powder: {type: "alphabetical", direction: "asc", icon: "alphabetical-variant"}
    },
    caliberDisplayNameList: [],
    filterOn: {
      gunCollection: false,
      ammoCollection: false,
      accessoryCollection_Silencer: false,
      accessoryCollection_Optic: false,
      accessoryCollection_Scope: false,
      accessoryCollection_LightLaser: false,
      accessoryCollection_Magazine: false,
      accessoryCollection_Misc: false,
      partCollection_ConversionKit: false,
      partCollection_Barrel: false,
      literatureCollection_Book: false,
      reloadingCollection_Die: false,
      reloadingCollection_Bullet: false,
      reloadingCollection_Case: false,
      reloadingCollection_Primer: false,
      reloadingCollection_Powder: false,
    },
    hasCheckedForLegacyGunData: false,
    hasCheckedForLegacyAmmoData: false,
    hasConvertedLegacyDateFieldsToUnixTimeStamp: false,
    hasConvertedLegacyAmmoCaliberFieldToStringArray: false,
    hasBeenOnboarded: false,
    hasSeenReviewRequest: false
  }


interface StoreFunctions {
    switchLanguage: (lang: Language) => void
    switchTheme: (name: string) => void,
    switchCountry: (iso: SupportedCountries) => void
    setGeneralSettings: (settings: GeneralSettings) => void
    setPreferredUnits: (units: PreferredUnits) => void
    setCaliberDisplayNameList: (calibers: {name: string}[]) => void
    setDisplaySettings: (settings: DisplaySettings) => void
    setSortBy: (collection: keyof SorterSettings, settings: SorterSettings[keyof SorterSettings]) => void
    setFilterOn: (status: FilterState) => void
    setHasCheckedForLegacyGunData: (status: boolean) => void
    setHasCheckedForLegacyAmmoData: (status: boolean) => void
    setHasConvertedLegacyDateFieldsToUnixTimeStamp: (status: boolean) => void
    setHasConvertedLegacyAmmoCaliberFieldToStringArray: (status: boolean) => void
    resetPreferenceStore: () => void
    setHasBeenOnboarded: (status: boolean) => void
    setHasSeenReviewRequest: (status: boolean) => void
  }

  
  export const usePreferenceStore = create<InitialStoreState & StoreFunctions>((set, store) => ({
    ...initialState,
    
    switchLanguage: (lang: Languages) => set((state) => ({ language: lang })),
    switchTheme: (name: string) => set((state) => ({theme: {name: name, colors: colorThemes[name]}})),
    switchCountry: (iso: SupportedCountries) => set((state) => ({ country: iso })),
    setGeneralSettings: (settings: GeneralSettings) => set((state) => ({generalSettings: settings})),
    setPreferredUnits: (settings: PreferredUnits) => set((state) => ({preferredUnits: settings})),
    setDisplaySettings: (settings: DisplaySettings) => set((state) => ({displaySettings: settings})),
    setCaliberDisplayNameList: (calibers: {name: string}[])  => set((state) =>({caliberDisplayNameList: calibers})),
    setSortBy: (collection, settings) => set((state) => ({
      sortBy: { 
        ...state.sortBy, 
        [collection]: settings 
      }
    })),
    setFilterOn: (status: FilterState) => set((state) => ({filterOn: status})),
    setHasCheckedForLegacyGunData: (status: boolean) => set((state) => ({hasCheckedForLegacyGunData: status})),
    setHasCheckedForLegacyAmmoData: (status: boolean) => set((state) => ({hasCheckedForLegacyAmmoData: status})),
    setHasConvertedLegacyDateFieldsToUnixTimeStamp: (status: boolean) => set((state) => ({hasConvertedLegacyDateFieldsToUnixTimeStamp: status})),
    setHasConvertedLegacyAmmoCaliberFieldToStringArray: (status: boolean) => set((state) => ({hasConvertedLegacyAmmoCaliberFieldToStringArray: status})),
    resetPreferenceStore: () => {set(initialState)},
    setHasBeenOnboarded: (status: boolean) => set((state) => ({hasBeenOnboarded: status})),
    setHasSeenReviewRequest: (status: boolean) => set((state) => ({hasSeenReviewRequest: status}))
}))