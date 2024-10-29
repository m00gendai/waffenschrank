export interface GunType{
  id: string
  manufacturer?: string | null
  model: string
  manufacturingDate?: string | null
  originCountry?: string | null
  gunType?: string | null
  functionType?: string | null
  caliber?: string[] | null
  serial?: string | null
  permit?: string | null
  acquisitionDate?: string | null
  boughtFrom?: string | null
  mainColor?: string | null
  remarks? : string | null
  images: string[]
  createdAt: number
  lastModifiedAt: number
  status?: GunTypeStatus
  shotCount?: string
  tags: string[]
  lastShotAt?: string
  lastCleanedAt?: string
  paidPrice?: string
  marketValue?: string
  cleanInterval?: string | null
}

interface DbId{
  db_id: number
}

export type GunTypeWithDbId = GunType & DbId

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
  tags: string[]
  images: string[]
  remarks?: string
}

export type AmmoTypeWithDbId = AmmoType & DbId

export interface AccessoryType_Optic{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string[]
  manufacturer?: string
  designation: string
  type?: string
  lastBatteryChange?: number
  reticle?: string
  clicksVert?: number
  clicksHor?: number
  acquisitionDate?: string
  paidPrice?: string
  boughtFrom?: string
  marketValue?: string
  currentlyMountedOn?: string
  remarks? : string | null
}

export type AccessoryType_OpticWithDbId = AccessoryType_Optic & DbId

export interface AccessoryType_Magazine{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string[]
  manufacturer?: string
  designation: string
  platform?: string
  capacity?: number
  acquisitionDate?: string
  paidPrice?: string
  boughtFrom?: string
  marketValue?: string
  stock?: number
  remarks? : string | null
}

export type AccessoryType_MagazineWithDbId = AccessoryType_Magazine & DbId

export interface AccessoryType_Misc{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string[]
  manufacturer?: string
  designation: string
  acquisitionDate?: string
  paidPrice?: string
  boughtFrom?: string
  marketValue?: string
  stock?: number
  remarks? : string | null
}

export type AccessoryType_MiscWithDbId = AccessoryType_Misc & DbId

export interface AccessoryType_Silencer{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string[]
  manufacturer?: string
  designation: string
  acquisitionDate?: string
  paidPrice?: string
  boughtFrom?: string
  marketValue?: string
  remarks? : string | null
  mountingType?: string
  caliber?: string[]
  decibel?: string
  currentlyMountedOn?: string
}

export type AccessoryType_SilencerWithDbId = AccessoryType_Silencer & DbId

export type CollectionItems = GunType | AmmoType | AccessoryType_Optic | AccessoryType_Magazine | AccessoryType_Misc | AccessoryType_Silencer | null
export type CollectionItemsWithId = GunTypeWithDbId | AmmoTypeWithDbId | AccessoryType_OpticWithDbId | AccessoryType_MagazineWithDbId | AccessoryType_MiscWithDbId | AccessoryType_SilencerWithDbId

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

export type SortingTypes_Gun =   "alphabetical" | 
                                "createdAt" | 
                                "lastModifiedAt" | 
                                "caliber" | 
                                "paidPrice" | 
                                "marketValue" | 
                                "acquisitionDate" | 
                                "lastCleanedAt" |
                                "lastShotAt"

export type SortingTypes_Ammo = "alphabetical" | 
                                "createdAt" | 
                                "lastModifiedAt" | 
                                "caliber" | 
                                "currentStock" 

export type SortingTypes_Accessory_Optic =  "alphabetical" | 
                                            "createdAt" | 
                                            "lastModifiedAt" | 
                                            "lastBatteryChangeAt"
                                            
export type SortingTypes_Accessory_Silencer = "alphabetical" | 
                                              "createdAt" | 
                                              "lastModifiedAt" | 
                                              "caliber" |
                                              "decibel"
                                              
export type SortingTypes_Accessory_Magazine = "alphabetical" |
                                              "createdAt" |
                                              "lastModifiedAt" |
                                              "capacity" |
                                              "platform"

export type SortingTypes_Accessory_Misc = "alphabetical" |
                                          "createdAt" |
                                          "lastModifiedAt"

export type SortingTypes_All = SortingTypes_Gun | SortingTypes_Ammo | SortingTypes_Accessory_Optic | SortingTypes_Accessory_Silencer | SortingTypes_Accessory_Magazine | SortingTypes_Accessory_Misc
                            
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


export type ItemTypes = "Gun" | "Ammo" | "Accessory_Optic" | "Accessory_Magazine" | "Accessory_Misc" | "Accessory_Silencer"

export type StackParamList = {
  Home: undefined
  MainMenu: undefined
  GunCollection: undefined
  AmmoCollection: undefined
  AccessoryCollection_Optics: undefined
  AccessoryCollection_Magazines: undefined
  AccessoryCollection_Misc: undefined
  AccessoryCollection_Silencers: undefined
  NewGun: undefined
  NewAmmo: undefined
  NewAccessory: undefined
  Gun: undefined
  Ammo: undefined
  Item: {itemType: ItemTypes}
  EditItem: {itemType: ItemTypes}
  NewItem: {itemType: ItemTypes}
  EditGun: undefined
  EditAmmo: undefined
  QuickStock: undefined
  QuickShot: undefined
}

export type ScreenNames = "GunCollection" | "AmmoCollection" | "AccessoryCollection_Optics" | "AccessoryCollection_Magazines" | "AccessoryCollection_Misc" | "AccessoryCollection_Silencers"