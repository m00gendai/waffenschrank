export interface GunType{
  id: string
  Hersteller: string
  Modellbezeichnung: string
  HerstellungsDatum?: string | null
  Waffentyp?: string | null
  Funktionsweise?: string | null
  Kaliber?: string | null
  Seriennummer?: string | null
  Bewilligung?: string | null
  Erwerbsdatum?: string | null
  Hauptfarbe?: string | null
  Bemerkungen? : string | null
  images: string[]
  createdAt: Date
  lastModifiedAt: Date
  Status?: {key: boolean}
}

export interface MenuVisibility{
  sortBy: boolean
  filterBy: boolean
}