import { create } from "zustand"
import { CollectionItems, ItemTypes, ScreenNames } from "../interfaces"

interface ViewStore {
    mainMenuOpen: boolean
    setMainMenuOpen: () => void
    lightBoxOpen: boolean
    setLightBoxOpen: () => void
    toastVisible: boolean
    setToastVisible: (data: boolean) => void
    dbModalVisible: boolean
    setDbModalVisible: () => void
    imageResizeVisible: boolean
    toggleImageResizeVisible: () => void
    loginGuardVisible: boolean
    toggleLoginGuardVisible: () => void
    importCSVVisible: boolean
    toggleImportCSVVisible: () => void
    importModalVisible: boolean
    toggleImportModalVisible: () => void
    ammoSearchVisible: boolean
    toggleAmmoSearchVisible: () => void
    searchQueryAmmoCollection: string
    setSearchQueryAmmoCollection: (data: string) => void
    hideBottomSheet: boolean
    toggleHideBottomSheet: () => void
    setHideBottomSheet: (status: boolean) => void
    currentCollectionScreen: ScreenNames
    setCurrentCollectionScreen: (screen: ScreenNames) => void
  }

  export const useViewStore = create<ViewStore>((set) => ({
    mainMenuOpen: false,
    setMainMenuOpen: () => set((state) => ({ mainMenuOpen: !state.mainMenuOpen })),
    hideBottomSheet: false,
    toggleHideBottomSheet: () => set((state) => ({hideBottomSheet: !state.hideBottomSheet})),
    setHideBottomSheet: (status: boolean) => set((state) => ({hideBottomSheet: status})),
    lightBoxOpen: false,
    setLightBoxOpen: () => set((state) => ({lightBoxOpen: !state.lightBoxOpen})),
    toastVisible: false,
    setToastVisible: (data: boolean) => set((state) => ({toastVisible: data})),
    dbModalVisible: false,
    setDbModalVisible: () => set((state) => ({dbModalVisible: !state.dbModalVisible})),
    imageResizeVisible: false,
    toggleImageResizeVisible: () => set((state) => ({imageResizeVisible: !state.imageResizeVisible})),
    loginGuardVisible: false,
    toggleLoginGuardVisible: () => set((state) => ({loginGuardVisible: !state.loginGuardVisible})),
    importCSVVisible: false,
    toggleImportCSVVisible: () => set((state) => ({importCSVVisible: !state.importCSVVisible})),
    importModalVisible: false,
    toggleImportModalVisible: () => set((state) => ({importModalVisible: !state.importModalVisible})),
    ammoSearchVisible: false,
    toggleAmmoSearchVisible: () => set((state) => ({ammoSearchVisible: !state.ammoSearchVisible})),
    searchQueryAmmoCollection: "",
    setSearchQueryAmmoCollection: (data: string) => set((state) => ({searchQueryAmmoCollection: data})),
    currentCollectionScreen: "GunCollection",
    setCurrentCollectionScreen: (screen: ScreenNames) => set((state) => ({currentCollectionScreen: screen}))
  }))