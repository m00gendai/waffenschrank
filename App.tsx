import { PaperProvider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from "react"
import { AMMO_DATABASE, A_KEY_DATABASE, A_TAGS, GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS } from "./configs_DB"
import 'react-native-gesture-handler';
import React from 'react';
import { usePreferenceStore } from './stores/usePreferenceStore';
import { useViewStore } from './stores/useViewStore';
import GunCollection from './components/GunCollection';
import MainMenu from './components/MainMenu';
import { NavigationContainer } from '@react-navigation/native';
import AmmoCollection from './components/AmmoCollection';
import { StatusBar } from 'expo-status-bar';
import { AmmoType, GunType, StackParamList } from './interfaces';
import * as SecureStore from "expo-secure-store"
import { alarm, getIcon } from './utils'
import { useTagStore } from './stores/useTagStore';
import { useItemStore } from './stores/useItemStore';
import { DefaultTheme } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Item from "./components/Item"
import QuickStock from './components/QuickStock';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickShot from './components/QuickShot';
import * as SplashScreen from 'expo-splash-screen';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Dimensions } from 'react-native';
import { calibers } from './lib/caliberData';
import { expo, db } from "./db/client"
import * as schema from "./db/schema"
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import { checkBoxes } from './lib/gunDataTemplate';
import BottomSheet, { BottomSheetHandleProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomBar from './components/BottomBar';
import { defaultBottomBarHeight, defaultBottomBarTextHeight, defaultViewPadding } from './configs';
import AccessoryCollection_optics from './components/AccessoryCollection_optics';
import EditItem from './components/EditItem';
import NewItem from './components/NewItem';
import AccessoryCollection_magazines from './components/AccessoryCollection_magazines';
import AccessoryCollection_misc from './components/AccessoryCollection_misc';
import AccessoryCollection_silencers from './components/AccessoryCollection_silencers';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  console.log(`migration error: ${error}`)
  useDrizzleStudio(expo)

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const { 
    setCaliberDisplayNameList,
    language, 
    switchLanguage,
    theme,
    switchTheme

  } = usePreferenceStore();

  const { mainMenuOpen, hideBottomSheet } = useViewStore()

  async function getKeys(data: "guns" | "ammo"){
    const keys:string = await AsyncStorage.getItem(data === "guns" ? KEY_DATABASE : A_KEY_DATABASE)
    if(keys == null){
      return []
    }
    return JSON.parse(keys)
  }

  async function checkLegacyGunData(){
    let keys:string[]
    try{
      keys = await getKeys("guns")
    } catch(e){
      alarm("Legacy Gun Key Error", e)
    }
    console.log(`legacy gun keys: ${keys}`)
    if(keys.length === 0){
      return
    }
    let guns:GunType[]
    try{
      guns = await Promise.all(keys.map(async key =>{
        const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
        return JSON.parse(item)
      }))
    } catch(e){
      alarm("Legacy Gun DB Error", e)
    }
    console.log(`legacy guns: ${guns}`)
    if(guns.length !== 0){
      await Promise.all(guns.map(async gun =>{
        if(gun !== null){
          await Promise.all(checkBoxes.map(checkbox =>{
            gun[checkbox.name] = gun !== undefined && gun !== null && gun.status !== undefined && gun.status !== null ? gun.status[checkbox.name] : false
          }))
          gun.createdAt = gun !== undefined && gun !== null && isNaN(gun.createdAt) ? new Date(gun.createdAt).getTime() : gun.createdAt
          gun.lastModifiedAt = gun !== undefined && gun !== null && isNaN(gun.lastModifiedAt) ? new Date(gun.lastModifiedAt).getTime() : gun.lastModifiedAt
          await db.insert(schema.gunCollection).values(gun)
          if(gun.tags !== undefined && gun.tags !== null && gun.tags.length !== 0){
            await Promise.all(gun.tags.map(async tag =>{
              await db.insert(schema.gunTags).values({label: tag}).onConflictDoNothing()
            }))
          }
        }
      }))
      await Promise.all(keys.map(async key =>{
        await SecureStore.deleteItemAsync(`${GUN_DATABASE}_${key}`)
      }))
      await AsyncStorage.removeItem(KEY_DATABASE)
    }
  }
  async function checkLegacyAmmoData(){
    let keys:string[]
    try{
      keys = await getKeys("ammo")
    } catch(e){
      alarm("Legacy Ammo Key Error", e)
    }
    console.log(`legacy ammo keys: ${keys}`)
    if(keys.length === 0){
      return
    }
    let ammunition:AmmoType[]
    try{
      ammunition = await Promise.all(keys.map(async key =>{
        const item:string = await SecureStore.getItemAsync(`${AMMO_DATABASE}_${key}`)
        return JSON.parse(item)
      }))
    } catch(e){
      alarm("Legacy Ammo DB Error", e)
    }
    if(ammunition.length !== 0){
      await Promise.all(ammunition.map(async ammo =>{
        await db.insert(schema.ammoCollection).values(ammo)
      }))
      await Promise.all(keys.map(async key =>{
        await SecureStore.deleteItemAsync(`${AMMO_DATABASE}_${key}`)
      }))
      await AsyncStorage.removeItem(A_KEY_DATABASE)
    }
  }
  
  useEffect(() => {
    async function prepare() {
      try {
        if(success){
          const settings = await db.select().from(schema.settings)
          console.log("try: so hard")

          if(settings.length === 0){
            await db.insert(schema.settings).values({sortBy_Guns: "alphabetical"})
            console.log("checking legacy gun data")
            await checkLegacyGunData()
            console.log("checking legacy ammo data")
            await checkLegacyAmmoData()
            console.log(`legacy success: ${success}`)
            // TODO: Legacy settings
            if(success){
              setAppIsReady(true)
            }
            return
          } else {
            if(settings[0].generalSettings_loginGuard === true){
              console.log("Du kommst hier net rein")
              const authSuccess = await LocalAuthentication.authenticateAsync()
              if(authSuccess.success){
                setAppIsReady(true)
              } else{
                throw new Error(`Local Authentification failed: ${JSON.stringify(authSuccess)} | ${settings[0].generalSettings_loginGuard}`);
              }
            } else {
              if(success){
                setAppIsReady(true)
              }
            }
          }
        }
      } catch (e) {
        console.log("catch: got so far")
        console.log(`got so far error: ${e}`);
        alarm("Initialisation error", e)
      } 
    }
    prepare();
  }, [success]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      
    }
  }, [appIsReady]);

  const currentTheme = {...theme, roundness : 5}

  const Stack = createStackNavigator<StackParamList>()

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background
    }
  }
  
  if (!appIsReady) {
    return null;
  }


  return (
    <GestureHandlerRootView>
    <NavigationContainer theme={navTheme}>
      <PaperProvider theme={currentTheme}>
        <StatusBar backgroundColor={mainMenuOpen ? theme.colors.primary : theme.colors.background} style={theme.name.includes("dark") ? "light" : "dark"} />
          <SafeAreaView 
            onLayout={onLayoutRootView}
            style={{
              width: "100%", 
              height: "100%", 
              flex: 1,
              backgroundColor: theme.colors.background
            }}
          >
            <Stack.Navigator>

              <Stack.Screen
                name="GunCollection"
                component={GunCollection}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
              />

              <Stack.Screen
                name="AmmoCollection"
                component={AmmoCollection}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
              />

              <Stack.Screen
                name="AccessoryCollection_Optics"
                component={AccessoryCollection_optics}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
              />

              <Stack.Screen
                name="AccessoryCollection_Magazines"
                component={AccessoryCollection_magazines}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
              />

              <Stack.Screen
                name="AccessoryCollection_Misc"
                component={AccessoryCollection_misc}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
              />

              <Stack.Screen
                name="AccessoryCollection_Silencers"
                component={AccessoryCollection_silencers}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
              />

              <Stack.Screen
                name="NewItem"
                component={NewItem}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="Item"
                component={Item}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid}} 
              />

            <Stack.Screen
              name="EditItem"
              component={EditItem}
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
            />

            <Stack.Screen
              name="QuickStock"
              component={QuickStock}
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, gestureDirection: "vertical-inverted", presentation: "transparentModal"}} 
            />

            <Stack.Screen
              name="QuickShot"
              component={QuickShot}
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, gestureDirection: "vertical-inverted", presentation: "transparentModal"}} 
            />

            <Stack.Screen
              name="MainMenu"
              component={MainMenu}
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: "horizontal-inverted", presentation: "transparentModal", cardStyle: { backgroundColor: Dimensions.get("window").width > Dimensions.get("window").height ? "transparent" : theme.colors.background}}} 
            />

          </Stack.Navigator>
          {mainMenuOpen ? null : hideBottomSheet ? null : <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
            snapPoints={[
              defaultBottomBarHeight, 
              (defaultBottomBarHeight*3)+(defaultBottomBarTextHeight*2) + (defaultViewPadding*3)
            ]}
            handleComponent={null}
            backgroundStyle={{backgroundColor: theme.colors.background}}
            maxDynamicContentSize={(defaultBottomBarHeight*3)+(defaultBottomBarTextHeight*2) + (defaultViewPadding*3)}
      >
        <BottomSheetView 
       
        >
          <BottomBar />
        </BottomSheetView>
      </BottomSheet>}
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
    </GestureHandlerRootView>
  )
}

