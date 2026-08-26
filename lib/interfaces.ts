export interface GunTypeDetails{
  id: string
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  caliber: string[] | null
  serial: string | null
  permit: string | null
  acquisitionDate_unix: number | null
  boughtFrom: string | null
  mainColor: string | null
  remarks: string | null
  images: string[]
  createdAt: number
  lastModifiedAt: number
  status?: GunTypeStatus
  shotCount: string | null
  tags: string[]
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  paidPrice: string | null
  marketValue: string | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
  de_wbkColor: string | null,
  de_wbkNumber: string | null,
  de_wbkRunningNumber: string | null,
  de_nwrId: string | null,
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
  pistol: boolean
  rifle: boolean
  shotgun: boolean
  sbr: boolean
  sbs: boolean
  aow: boolean
  machineGun: boolean
  dd: boolean
  pmf: boolean
  cr: boolean
  nfa: boolean
  antique: boolean
}

export type GunType = GunTypeDetails & GunTypeStatus

export interface LegacyAmmoType{
  id: string
  manufacturer: string | null
  caliber: string | null
  designation: string
  originCountry: string | null
  createdAt: number,
  lastModifiedAt: number,
  bulletType: string,
  bulletWeight: string,
  headstamp: string | null
  currentStock: string
  lastTopUpAt_unix: number | null
  criticalStock: string
  tags: string[]
  images: string[]
  remarks: string
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface AmmoType{
  id: string
  manufacturer: string | null
  caliber: string[] | null
  designation: string
  originCountry: string | null
  createdAt: number,
  lastModifiedAt: number,
  bulletType: string,
  bulletWeight: string,
  headstamp: string | null
  currentStock: string
  lastTopUpAt_unix: number | null
  criticalStock: string
  tags: string[]
  images: string[]
  remarks: string
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface AccessoryType_Silencer{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  caliber: string[]
  thread: string | null
  serial: string | null
  material: string | null
  decibelRating: string | null
  permit: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
  de_wbkColor: string | null,
  de_wbkNumber: string | null,
  de_wbkRunningNumber: string | null,
  de_nwrId: string | null,
}

export interface AccessoryType_Optic{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  serial: string | null
  reticle: string | null
  reticleColor: string | null
  glassDimensions: string | null
  footprint: string | null
  zoom: string | null
  unit: string | null
  clicksToUnitElevation: string | null
  clicksToUnitWindage: string | null
  material: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  batteryType: string| null
  batteryLastChangedAt_unix: number | null
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string  | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface AccessoryType_Scope{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  serial: string | null
  reticle: string | null
  reticleColor: string | null
  glassDimensions: string | null
  focalPlane: string | null
  zoom: string | null
  unit: string | null
  clicksToUnitElevation: string | null
  clicksToUnitWindage: string | null
  material: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  batteryType: string | null
  batteryLastChangedAt_unix: number | null
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface AccessoryType_LightLaser{
  id: string;
  createdAt: number;
  lastModifiedAt: number
  images: string[]
  tags: string[]             
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  serial: string | null
  permit: string | null
  lumen: string | null
  candela: string | null
  wavelength: string | null
  laserPower: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  batteryType: string | null
  batteryLastChangedAt_unix: number | null
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface AccessoryType_Magazine{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  caliber: string[]
  serial: string | null
  material: string | null
  permit: string | null
  capacity: string | null
  platform: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  currentStock: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface AccessoryType_Misc{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  serial: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface PartType_ConversionKit{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  caliber: string[]
  serial: string | null
  permit: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
  de_wbkColor: string | null,
  de_wbkNumber: string | null,
  de_wbkRunningNumber: string | null,
  de_nwrId: string | null,
}

export interface PartType_Barrel{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string []
  manufacturer: string | null
  model: string | null
  manufacturingDate: string | null
  originCountry: string | null
  caliber: string[]
  thread: string | null
  barrelLength: string | null
  serial: string | null
  permit: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  shotCount: string | null
  lastShotAt_unix: number | null
  lastCleanedAt_unix: number | null
  cleanInterval: null | string
  cleanInterval_CustomTime: null | string
  cleanInterval_ShotCount: null | string
  cleanIntervalDisplay: null | string
  mainColor: string | null
  remarks: string | null
  currentlyMountedOn: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
  de_wbkColor: string | null,
  de_wbkNumber: string | null,
  de_wbkRunningNumber: string | null,
  de_nwrId: string | null,
}

export interface LiteratureType_Book{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string[]
  language: string | null
  title: string | null
  subtitle: string | null
  isbn: string | null
  publishingDate: string | null
  author: string | null
  publisher: string | null
  edition: string | null
  series: string | null
  volume: string | null
  pages: string | null
  format: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  remarks: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface ReloadingType_Die{
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[]
  tags: string[]
  manufacturer: string | null
  model: string | null
  caliber: string[]
  dieSeries: string | null
  group: string | null
  partNumber: string | null
  shellHolder: string | null
  acquisitionDate_unix: number | null
  paidPrice: string | null
  boughtFrom: string | null
  marketValue: string | null
  remarks: string | null
  customInventoryDesignation: null | string
  qrCode: null | string
  sold_isSold: boolean,
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface ReloadingType_Bullet {
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[],
  tags: string[],
  manufacturer: string | null
  model: string | null
  caliber: string[]
  bulletWeight: string | null
  bulletType: string | null
  ballisticCoefficient: string | null
  currentStock: string | null
  lastTopUpAt_unix: number | null
  criticalStock: string | null
  remarks: string | null
  customInventoryDesignation: string | null
  qrCode: string | null
  sold_isSold: boolean
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface ReloadingType_Case {
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[],
  tags: string[],
  manufacturer: string | null
  model: string | null
  caliber: string[]
  headstamp: string | null
  primer: string | null
  caseLength: string | null
  material: string | null
  currentStock: string | null
  lastTopUpAt_unix: number | null
  criticalStock: string | null
  remarks: string | null
  customInventoryDesignation: string | null
  qrCode: string | null
  sold_isSold: boolean
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface ReloadingType_Primer {
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[],
  tags: string[],
  manufacturer: string | null
  model: string | null
  type: string | null
  currentStock: string | null
  lastTopUpAt_unix: number | null
  criticalStock: string | null
  remarks: string | null
  customInventoryDesignation: string | null
  qrCode: string | null
  sold_isSold: boolean
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export interface ReloadingType_Powder {
  id: string
  createdAt: number
  lastModifiedAt: number
  images: string[],
  tags: string[],
  manufacturer: string | null
  designation: string | null
  texture: string | null
  application: string | null
  powderWeight: string | null
  lastTopUpAt_unix: number | null
  criticalPowderWeight: string | null
  remarks: string | null
  customInventoryDesignation: string | null
  qrCode: string | null
  sold_isSold: boolean
  sold_sellDate_unix: number | null,
  sold_buyerName: string | null,
  sold_sellPrice: string | null,
  sold_buyerPermit: string | null,
  sold_remarks: string | null,
}

export type ItemType =  | GunType 
                        | AmmoType 
                        | AccessoryType_Silencer 
                        | AccessoryType_Optic
                        | AccessoryType_Scope
                        | AccessoryType_LightLaser
                        | AccessoryType_Magazine
                        | AccessoryType_Misc
                        | PartType_ConversionKit
                        | PartType_Barrel
                        | LiteratureType_Book
                        | ReloadingType_Die
                        | ReloadingType_Bullet
                        | ReloadingType_Case
                        | ReloadingType_Primer
                        | ReloadingType_Powder

export type CollectionType =  | "gunCollection" 
                              | "ammoCollection" 
                              | "accessoryCollection_Silencer" 
                              | "accessoryCollection_Optic"
                              | "accessoryCollection_Scope"
                              | "accessoryCollection_LightLaser"
                              | "accessoryCollection_Magazine"
                              | "accessoryCollection_Misc"
                              | "partCollection_ConversionKit"
                              | "partCollection_Barrel"
                              | "literatureCollection_Book"
                              | "reloadingCollection_Die"
                              | "reloadingCollection_Bullet"
                              | "reloadingCollection_Case"
                              | "reloadingCollection_Primer"
                              | "reloadingCollection_Powder"

export type Screens = "itemCollection"

interface DbId{
  db_id: number
}

export type ItemTypeWithDbId = ItemType & DbId

export type NumberBadgeType = AmmoType | AccessoryType_Magazine | ReloadingType_Bullet | ReloadingType_Case | ReloadingType_Primer
export type CriticalStockType = AmmoType | ReloadingType_Bullet | ReloadingType_Case | ReloadingType_Primer

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

export type SortingTypesGun = | "alphabetical" 
                              | "createdAt" 
                              | "lastModifiedAt" 
                              | "caliber" 
                              | "paidPrice" 
                              | "marketValue"
                              | "acquisitionDate" 
                              | "lastCleanedAt" 
                              | "lastShotAt"

export type SortingTypesAmmo =  | "alphabetical" 
                                | "createdAt" 
                                | "lastModifiedAt" 
                                | "currentStock" 
                                | "lastTopUpAt"

export type SortingTypesAccessory_Silencer =  | "alphabetical" 
                                              | "createdAt" 
                                              | "lastModifiedAt" 
                                              | "paidPrice" 
                                              | "marketValue" 
                                              | "acquisitionDate" 
                                              | "lastCleanedAt" 
                                              | "lastShotAt" 
                                              | "decibelRating"

export type SortingTypesAccessory_Optic = | "alphabetical" 
                                          | "createdAt" 
                                          | "lastModifiedAt" 
                                          | "paidPrice" 
                                          | "marketValue" 
                                          | "acquisitionDate" 
                                          | "lastCleanedAt" 
                                          | "lastBatteryChangeAt" 

export type SortingTypesAccessory_Scope = | "alphabetical" 
                                          | "createdAt" 
                                          | "lastModifiedAt" 
                                          | "paidPrice" 
                                          | "marketValue" 
                                          | "acquisitionDate" 
                                          | "lastCleanedAt" 
                                          | "lastBatteryChangeAt" 

export type SortingTypesAccessory_LightLaser =  | "alphabetical" 
                                                | "createdAt" 
                                                | "lastModifiedAt" 
                                                | "paidPrice" 
                                                | "marketValue" 
                                                | "acquisitionDate" 
                                                | "lastBatteryChangeAt" 

export type SortingTypesAccessory_Magazine =  | "alphabetical" 
                                              | "createdAt" 
                                              | "lastModifiedAt" 
                                              | "paidPrice" 
                                              | "marketValue" 
                                              | "acquisitionDate" 
                                              | "lastCleanedAt" 
                                              | "lastShotAt" 
                                              | "capacity"

export type SortingTypesAccessory_Misc =  | "alphabetical" 
                                          | "createdAt" 
                                          | "lastModifiedAt" 
                                          | "paidPrice" 
                                          | "marketValue" 
                                          | "acquisitionDate" 

export type SortingTypesPart_ConversionKit =  | "alphabetical" 
                                              | "createdAt" 
                                              | "lastModifiedAt" 
                                              | "caliber" 
                                              | "paidPrice" 
                                              | "marketValue"
                                              | "acquisitionDate" 
                                              | "lastCleanedAt" 
                                              | "lastShotAt"

export type SortingTypesPart_Barrel = | "alphabetical" 
                                      | "createdAt" 
                                      | "lastModifiedAt" 
                                      | "paidPrice" 
                                      | "marketValue" 
                                      | "acquisitionDate" 
                                      | "lastCleanedAt" 
                                      | "lastShotAt"

export type SortingTypesLiterature_Book = | "alphabetical" 
                                          | "createdAt" 
                                          | "lastModifiedAt" 
                                          | "paidPrice" 
                                          | "marketValue" 
                                          | "acquisitionDate" 
                                          | "pages" 

export type SortingTypesReloading_Die = | "alphabetical" 
                                        | "createdAt" 
                                        | "lastModifiedAt" 
                                        | "caliber" 
                                        | "paidPrice" 
                                        | "marketValue"
                                        | "acquisitionDate" 

export type SortingTypesReloading_Bullet =  | "alphabetical" 
                                            | "createdAt" 
                                            | "lastModifiedAt" 
                                            | "caliber" 
                                            | "currentStock" 

export type SortingTypesReloading_Case =  | "alphabetical" 
                                          | "createdAt" 
                                          | "lastModifiedAt" 
                                          | "caliber" 
                                          | "currentStock" 

export type SortingTypesReloading_Primer =  | "alphabetical" 
                                            | "createdAt" 
                                            | "lastModifiedAt" 
                                            | "currentStock" 

export type SortingTypesReloading_Powder =  | "alphabetical" 
                                            | "createdAt" 
                                            | "lastModifiedAt" 
                                            | "currentStock" 

export type SortingTypes =  | SortingTypesGun 
                            | SortingTypesAmmo 
                            | SortingTypesAccessory_Silencer
                            | SortingTypesAccessory_Optic
                            | SortingTypesAccessory_Scope
                            | SortingTypesAccessory_LightLaser
                            | SortingTypesAccessory_Magazine
                            | SortingTypesAccessory_Misc
                            | SortingTypesPart_ConversionKit
                            | SortingTypesPart_Barrel
                            | SortingTypesLiterature_Book
                            | SortingTypesReloading_Die
                            | SortingTypesReloading_Bullet
                            | SortingTypesReloading_Case
                            | SortingTypesReloading_Primer
                            | SortingTypesReloading_Powder

                            
export type Languages = | "de" 
                        | "en" 
                        | "fr" 
                        | "it" 
                        | "ch"

export type SupportedCountries =  | "ch"
                                  | "us"
                                  | "de"
                                  | "--"

export interface CountrySelection {
  flag: string
  name: {de: string, en: string, fr: string, it: string, ch: string}
  iso: SupportedCountries
}

export type CaliberArray = {id: string, amount: string }

export type DBOperations =  | "save_arsenal_db" 
                            | "save_arsenal_csv" 
                            | "import_arsenal_db" 
                            | "import_arsenal_csv" 
                            | "import_custom_csv" 
                            | "import_legacy_db"
                           
export type StackParamList = {
  Home: undefined
  MainMenu: undefined
  itemCollection: {collectionType: CollectionType};
  item: undefined
  newItem: { clone: boolean }
  editItem: undefined
  QuickStock: undefined
  QuickShot: undefined
  QuickMount: {item: ItemType}
  EditAutocomplete: undefined
  EditCustomLabels: undefined
  Statistics: undefined
  GenerateQRCodes: {collection: CollectionType, label: string}
}

export interface Tag {
  db_id: number
  label: string
  color: string
  active: boolean
}

export interface AccessoryMount{
    db_id: number
    id: string
    accessoryId: string
    accessoryType: CollectionType
    parentGunId: string
    parentGunType: CollectionType
    parentAccessoryId: string
    parentAccessoryType: CollectionType
    parentPartId: string
    parentPartType: CollectionType
}

export interface PartMount{
    db_id: number
    id: string
    partId: string
    partType: CollectionType
    parentGunId: string
    parentGunType: CollectionType
    parentPartId: string
    parentPartType: CollectionType
}

export type ListPrinter = null | "gunCollection" | "gunCollectionArt5" | "gunCollectionHybrid" | "ammoCollection" | "custom"

export interface CustomLabel{
  name: string
  pageFormat: string
  pageWidth: number
  pageHeight: number
  unit: string
  marginTop: number
  marginLeft: number
  labelWidth: number
  labelHeight: number
  horizontalPitch: number
  verticalPitch: number
  columns: number
  rows: number
  radius: number
}

export type weightUnitNames = "gr" | "oz" | "lb" | "mg" | "g" | "kg"
export type distUnitNames = "mm" | "cm" | "in"