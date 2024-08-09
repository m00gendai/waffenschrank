import { create } from "zustand"
import { AmmoType, DBOperations, GunType } from "../interfaces"
import { exampleAmmoEmpty, exampleGunEmpty } from "../lib/examples"
import { doSortBy } from "../utils"

interface ImportExportStore {
    CSVHeader: string[]
    setCSVHeader: (data:string[]) => void
    CSVBody: string[][]
    setCSVBody: (data:string[][]) => void
    importProgress: number
    setImportProgress: (num: number) => void
    resetImportProgress: (num: number) => void
    importSize: number
    setImportSize: (num: number) => void
    resetImportSize: (num: number) => void
    mapCSVAmmo: AmmoType
    setMapCSVAmmo: (data: AmmoType) => void
    mapCSVGun: GunType
    setMapCSVGun: (data: GunType) => void
    dbCollectionType: DBOperations | ""
    setDbCollectionType: (data: string) => void
  }

  export const useImportExportStore = create<ImportExportStore>((set) => ({
    CSVHeader: [],
    setCSVHeader: (data: string[]) => set((state) => ({ CSVHeader: data })),
    CSVBody: [[]],
    setCSVBody: (data: string[][]) => set((state) => ({ CSVBody: data })),
    importProgress: 0,
    setImportProgress: (num: number) => set((state) => ({importProgress: state.importProgress + num})),
    resetImportProgress: (num: number) => set((state) => ({importProgress: num})),
    importSize: 0,
    setImportSize: (num: number) => set((state) => ({importSize: num})),
    resetImportSize: (num: number) => set((state) => ({importSize: num})),
    mapCSVAmmo: exampleAmmoEmpty,
    setMapCSVAmmo: (data: AmmoType) => set((state => ({mapCSVAmmo: data}))),
    mapCSVGun: exampleGunEmpty,
    setMapCSVGun: (data: GunType) => set((state => ({mapCSVGun: data}))),
    dbCollectionType: "",
    setDbCollectionType: (data: DBOperations | "") => set((state) => ({dbCollectionType: data}))
  }))