import { create } from "zustand"

interface TagStore {
    tags: {label: string, status: boolean}[]
    setTags: (tag: {label: string, status: boolean}) => void
    overWriteTags: (tags:{label:string, status:boolean}[]) => void
  }

  export const useTagStore = create<TagStore>((set) => ({
    tags: [],
    setTags: (tag: {label: string, status: boolean}) => set((state) => ({tags: [...state.tags, tag]})),
    overWriteTags: (tags: {label: string, status:boolean}[]) => set((state)=>({tags: tags}))
  }))