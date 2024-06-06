import { create } from "zustand"

interface TagStore {
    tags: {label: string, status: boolean}[]
    setTags: (tag: {label: string, status: boolean}) => void
    overWriteTags: (tags:{label:string, status:boolean}[]) => void
    ammo_tags: {label: string, status: boolean}[]
    setAmmoTags: (ammo_tag: {label: string, status: boolean}) => void
    overWriteAmmoTags: (ammo_tags:{label:string, status:boolean}[]) => void
  }

  export const useTagStore = create<TagStore>((set) => ({
    tags: [],
    setTags: (tag: {label: string, status: boolean}) => set((state) => ({tags: [...state.tags, tag]})),
    overWriteTags: (tags: {label: string, status:boolean}[]) => set((state)=>({tags: tags})),
    ammo_tags: [],
    setAmmoTags: (ammo_tag: {label: string, status: boolean}) => set((state) => ({ammo_tags: [...state.ammo_tags, ammo_tag]})),
    overWriteAmmoTags: (ammo_tags: {label: string, status:boolean}[]) => set((state)=>({ammo_tags: ammo_tags}))
  }))