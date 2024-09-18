export interface GunType{
  id: string
  manufacturer?: string | null
  model: string
  manufacturingDate?: string | null
  originCountry?: string | null
  gunType?: string | null
  functionType?: string | null
  caliber?: string[] | string | null
  serial?: string | null
  permit?: string | null
  acquisitionDate?: string | null
  boughtFrom?: string | null
  mainColor?: string | null
  remarks? : string | null
  images: string
  createdAt: number
  lastModifiedAt: number
  status?: GunTypeStatus
  shotCount?: string
  tags: string
  lastShotAt?: string
  lastCleanedAt?: string
  paidPrice?: string
  marketValue?: string
  cleanInterval?: string | null
}

export interface GunTypeStatus{
  exFullAuto: boolean
  highCapacityMagazine: boolean
  short: boolean
  fullAuto: boolean
  launcher: boolean
  decepticon: boolean
  blooptoob: boolean
  grandfather: boolean
}

export interface AmmoType{
  id: string
  manufacturer?: string | null
  caliber: string | null
  designation: string
  originCountry?: string | null
  createdAt: number,
  lastModifiedAt: number,
  headstamp?: string | null
  currentStock?: number
  previousStock?: number
  lastTopUpAt?: string
  criticalStock?: string
  tags: string
  images: string
  remarks?: string
}

export interface MenuVisibility{
  sortBy: boolean
  filterBy: boolean
}

export interface ColorTheme{
  [key:string]:Color
}

export interface Color {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  elevation: Elevation
  surfaceDisabled: string
  onSurfaceDisabled: string
  backdrop: string
}

export interface Elevation {
  level0: string
  level1: string
  level2: string
  level3: string
  level4: string
  level5: string
}

export interface CommonStyles {
  allPageMargin: string
  allPageMarginIOS: number
  allTitleFontSize: string
  allSubtitleFontSize: string
  allTableFontSize: string
  imageGap: string
  tableVerticalMargin: string
  tableRowVerticalPadding: string
  tableCellPadding: string
  footerWidth: string
  footerFontSize: string
  footerTopBorder: string
  footerPaddingTop: string
  footerMarginTop: string
  tagPadding: string
  tagFontSize: string
  tagContainerGap: string
}

export type SortingTypes =  "alphabetical" | 
                            "lastAdded" | 
                            "lastModified" | 
                            "caliber" | 
                            "paidPrice" | 
                            "marketValue" | 
                            "acquisitionDate" | 
                            "lastCleaned" |
                            "lastShot"
                            
export type Languages = "de" | "en" | "fr" | "it" | "ch"
export type CaliberArray = {id: string, amount: string }
export type DBOperations = "save_arsenal_gun_db" | 
                           "save_arsenal_gun_csv" | 
                           "save_arsenal_ammo_db" | 
                           "save_arsenal_ammo_csv" | 
                           "import_arsenal_gun_db" | 
                           "import_custom_gun_csv" | 
                           "import_arsenal_gun_csv" | 
                           "import_arsenal_ammo_db" | 
                           "import_custom_ammo_csv" | 
                           "import_arsenal_ammo_csv" | 
                           "share_arsenal_gun_db" |
                           "share_arsenal_gun_csv" |
                           "share_arsenal_ammo_db" |
                           "share_arsenal_ammo_csv"


export type StackParamList = {
  Home: undefined
  MainMenu: undefined
  GunCollection: undefined
  AmmoCollection: undefined
  NewGun: undefined
  NewAmmo: undefined
  Gun: undefined
  Ammo: undefined
  EditGun: undefined
  EditAmmo: undefined
  QuickStock: undefined
  QuickShot: undefined
}