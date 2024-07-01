import { create } from "zustand"
import { AmmoType, DBOperations } from "../interfaces"
import { exampleAmmoEmpty } from "../lib/examples"
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
    mapCSV: AmmoType
    setMapCSV: (data: AmmoType) => void
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
    mapCSV: exampleAmmoEmpty,
    setMapCSV: (data: AmmoType) => set((state => ({mapCSV: data}))),
    dbCollectionType: "",
    setDbCollectionType: (data: DBOperations | "") => set((state) => ({dbCollectionType: data}))
  }))