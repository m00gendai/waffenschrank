import { create } from "zustand"

interface ViewStore {
    mainMenuOpen: boolean
    setMainMenuOpen: () => void
    newGunOpen: boolean
    setNewGunOpen: () => void
    seeGunOpen: boolean
    setSeeGunOpen: () => void
    editGunOpen: boolean
    setEditGunOpen: () => void
    newAmmoOpen: boolean
    setNewAmmoOpen: () => void
    seeAmmoOpen: boolean
    setSeeAmmoOpen: () => void
    editAmmoOpen: boolean
    setEditAmmoOpen: () => void
    lightBoxOpen: boolean
    setLightBoxOpen: () => void
    toastVisible: boolean
    setToastVisible: () => void
    dbModalVisible: boolean
    setDbModalVisible: () => void
    imageResizeVisible: boolean
    toggleImageResizeVisible: () => void
    importCSVVisible: boolean
    toggleImportCSVVisible: () => void
    importModalVisible: boolean
    toggleImportModalVisible: () => void
  }

  export const useViewStore = create<ViewStore>((set) => ({
    mainMenuOpen: false,
    setMainMenuOpen: () => set((state) => ({ mainMenuOpen: !state.mainMenuOpen })),
    newGunOpen: false,
    setNewGunOpen: () => set((state) => ({newGunOpen: !state.newGunOpen})),
    seeGunOpen: false,
    setSeeGunOpen: () => set((state) => ({seeGunOpen: !state.seeGunOpen})),
    editGunOpen: false,
    setEditGunOpen: () => set((state) => ({editGunOpen: !state.editGunOpen})),
    newAmmoOpen: false,
    setNewAmmoOpen: () => set((state) => ({newAmmoOpen: !state.newAmmoOpen})),
    seeAmmoOpen: false,
    setSeeAmmoOpen: () => set((state) => ({seeAmmoOpen: !state.seeAmmoOpen})),
    editAmmoOpen: false,
    setEditAmmoOpen: () => set((state) => ({editAmmoOpen: !state.editAmmoOpen})),
    lightBoxOpen: false,
    setLightBoxOpen: () => set((state) => ({lightBoxOpen: !state.lightBoxOpen})),
    toastVisible: false,
    setToastVisible: () => set((state) => ({toastVisible: !state.toastVisible})),
    dbModalVisible: false,
    setDbModalVisible: () => set((state) => ({dbModalVisible: !state.dbModalVisible})),
    imageResizeVisible: false,
    toggleImageResizeVisible: () => set((state) => ({imageResizeVisible: !state.imageResizeVisible})),
    importCSVVisible: false,
    toggleImportCSVVisible: () => set((state) => ({importCSVVisible: !state.importCSVVisible})),
    importModalVisible: false,
    toggleImportModalVisible: () => set((state) => ({importModalVisible: !state.importModalVisible}))
  }))