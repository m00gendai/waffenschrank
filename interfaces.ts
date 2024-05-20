export interface GunType{
  id: string
  manufacturer?: string | null
  model: string
  manufacturingDate?: string | null
  originCountry?: string | null
  gunType?: string | null
  functionType?: string | null
  caliber?: string | null
  serial?: string | null
  permit?: string | null
  acquisitionDate?: string | null
  mainColor?: string | null
  remarks? : string | null
  images: string[]
  createdAt: Date
  lastModifiedAt: Date
  status?: GunTypeStatus
  tags: string[]
}

export interface GunTypeStatus{
  secondHand: boolean
  exFullAuto: boolean
  highCapacityMagazine: boolean
  short: boolean
  serviceRifle: boolean
  loanerGun: boolean
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