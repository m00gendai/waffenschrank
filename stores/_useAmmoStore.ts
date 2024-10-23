import { create } from "zustand"
import { AmmoType } from "../interfaces"

interface AmmoStore {
    ammoCollection: AmmoType[]
    setAmmoCollection: (ammunitions:AmmoType[]) => void
    currentAmmo: AmmoType | null
    setCurrentAmmo: (ammunition: AmmoType) => void
  }

  export const useAmmoStore = create<AmmoStore>((set) => ({
    ammoCollection: [],
    setAmmoCollection: (ammunitions:AmmoType[]) => set((state) => ({ammoCollection: ammunitions})),
    currentAmmo: null,
    setCurrentAmmo: (ammunition: AmmoType) => set((state) => ({currentAmmo: ammunition}))
  }))