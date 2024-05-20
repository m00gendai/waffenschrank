import { create } from "zustand"
import { GunType } from "../interfaces"

interface GunStore {
    gunCollection: GunType[]
    setGunCollection: (guns:GunType[]) => void
    currentGun: GunType | null
    setCurrentGun: (gun: GunType) => void
  }

  export const useGunStore = create<GunStore>((set) => ({
    gunCollection: [],
    setGunCollection: (guns:GunType[]) => set((state) => ({gunCollection: guns})),
    currentGun: null,
    setCurrentGun: (gun: GunType) => set((state) => ({currentGun: gun}))
  }))