import { create } from "zustand"
import { GunType, AmmoType, CollectionItems } from "../interfaces"

interface ItemStore {
    currentItem: CollectionItems | null
    setCurrentItem: (item: CollectionItems | null) => void
  }

  export const useItemStore = create<ItemStore>((set) => ({
    currentItem: null,
    setCurrentItem: (item: CollectionItems | null) => set((state) => ({currentItem: item}))
  }))