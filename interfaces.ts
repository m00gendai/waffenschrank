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
  status?: {key: boolean}
}

export interface MenuVisibility{
  sortBy: boolean
  filterBy: boolean
}