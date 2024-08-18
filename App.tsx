import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from "react"
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
import { doSortBy, getIcon } from './utils';
import { useAmmoStore } from './stores/useAmmoStore';
import { useTagStore } from './stores/useTagStore';
import { useGunStore } from './stores/useGunStore';
import { DefaultTheme } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import NewAmmo from './components/NewAmmo';
import NewGun from './components/NewGun';
import Gun from './components/Gun';
import Ammo from './components/Ammo';
import QuickStock from './components/QuickStock';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickShot from './components/QuickShot';
import EditGun from './components/EditGun';
import EditAmmo from './components/EditAmmo';
import * as SplashScreen from 'expo-splash-screen';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';


SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const { ammoDbImport, dbImport, switchLanguage, theme, switchTheme, language, generalSettings, setGeneralSettings, setDisplayAsGrid, setDisplayAmmoAsGrid, setSortBy, setSortAmmoBy, setSortAmmoIcon, setSortGunIcon, setSortGunsAscending, setSortAmmoAscending, firstOpen, setFirstOpen } = usePreferenceStore();
  const { mainMenuOpen } = useViewStore()
  const { setAmmoCollection } = useAmmoStore()
  const { setGunCollection } = useGunStore()
  const { setAmmoTags, setTags } = useTagStore()
  const [gunsLoaded, setGunsLoaded] = useState(false)

  function alarm(title: string, error:string){
    Alert.alert(`${title}`, `${error}`, [
      {
        text: 'OK',
        onPress: () => {return},
      },
    ])
  }

  useEffect(() => {
    async function prepare() {
      try {
        console.log("try: so hard")
        const preferences:string = await AsyncStorage.getItem(PREFERENCES)
        const isPreferences = preferences === null ? null : JSON.parse(preferences)
        console.log("isPreferences null")
        if(isPreferences === null){
          setAppIsReady(true)
          return
        }
        console.log("isPreferences.generalSettings null")
        if(isPreferences.generalSettings === null || isPreferences.generalSettings === undefined){ 
          setAppIsReady(true)
          return
        }
        console.log("isPreferences.generalsettings.loginGuard null || false")
        if(isPreferences.generalSettings.loginGuard !== null && isPreferences.generalSettings.loginGuard !== undefined && isPreferences.generalSettings.loginGuard === true){
          const success = await LocalAuthentication.authenticateAsync()
          console.log(success)
          if(success.success){
            setAppIsReady(true);
          } else{
            throw new Error(`Local Authentification failed: ${success} | ${isPreferences.generalSettings.loginGuard}`);
          }
        } else {
          console.log("false")
          setAppIsReady(true)
          return
        }
      } catch (e) {
        console.log("catch: got so far")
        console.log(e);
        alarm("Initialisation error", e)
      } 
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      
    }
  }, [appIsReady]);
  
  useEffect(()=>{
    async function getPreferences(){
      let preferences:string
      try{
        preferences = await AsyncStorage.getItem(PREFERENCES)
      } catch(e){
        alarm("Preference DB Error", e)
      }
      let isPreferences
      try{
       isPreferences = preferences === null ? null : JSON.parse(preferences)
      } catch(e){
        alarm("Preference Parse Error", e)
      }
      
      /* GENERAL SETTINGS AND PREFERENCES */
      try{
      switchLanguage(isPreferences === null ? "de" : isPreferences.language === undefined ? "de" : isPreferences.language)
      switchTheme(isPreferences === null ? "default" : isPreferences.theme === undefined ? "default" : isPreferences.theme)
      setGeneralSettings(isPreferences === null ? {
        displayImagesInListViewAmmo: true, 
        displayImagesInListViewGun: true,
        resizeImages: true,
      } : isPreferences.generalSettings === undefined ? {
        displayImagesInListViewAmmo: true, 
        displayImagesInListViewGun: true,
        resizeImages: true,
      } : isPreferences.generalSettings)
    } catch(e){
      alarm("General Preferences Error", e)
    }

      /* AMMO PREFERENCES */
      try{
      const ammo_tagList: string = await AsyncStorage.getItem(A_TAGS)
      const isAmmoTagList:{label: string, status: boolean}[] = ammo_tagList === null ? null : JSON.parse(ammo_tagList)
      setDisplayAmmoAsGrid(isPreferences === null ? true : isPreferences.displayAmmoAsGrid === null ? true : isPreferences.displayAmmoAsGrid)
      setSortAmmoBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === undefined ? "alphabetical" : isPreferences.sortAmmoBy)
      setSortAmmoIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === null ? "alphabetical" : isPreferences.sortAmmoBy)))
      setSortAmmoAscending(isPreferences === null ? true : isPreferences.sortOrderAmmo === null ? true : isPreferences.sortOrderAmmo)
      if(isAmmoTagList !== null && isAmmoTagList !== undefined){
        Object.values(isAmmoTagList).map(tag =>{
          setAmmoTags(tag)
        }) 
      }
    } catch(e){
      alarm("Ammo Preferences Error", e)
    }
      /* GUN PREFERENCE */
      try{
      const gun_tagList: string = await AsyncStorage.getItem(TAGS) 
      const isGunTagList:{label: string, status: boolean}[] = gun_tagList === null ? null : JSON.parse(gun_tagList)
      setDisplayAsGrid(isPreferences === null ? true : isPreferences.displayAsGrid === null ? true : isPreferences.displayAsGrid)
      setSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === undefined ? "alphabetical" : isPreferences.sortBy)
      setSortGunIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)))
      setSortGunsAscending(isPreferences === null ? true : isPreferences.sortOrderGuns === null ? true : isPreferences.sortOrderGuns)
      if(isGunTagList !== null && isGunTagList !== undefined){
        Object.values(isGunTagList).map(tag =>{
          setTags(tag)
        }) 
      }
    } catch(e){
      alarm("Gun Preferences Error", e)
    }
    }
    getPreferences()
  },[])

  async function getKeys(data: "guns" | "ammo"){
    const keys:string = await AsyncStorage.getItem(data === "guns" ? KEY_DATABASE : A_KEY_DATABASE)
    if(keys == null){
      return []
    }
    return JSON.parse(keys)
  }

  useEffect(()=>{
    async function getAmmo(){
      let keys:string[]
      try{
      keys = await getKeys("ammo")
      } catch(e){
        alarm("Ammo Key Error", e)
      }


      let ammunitions:AmmoType[]
      try{
        ammunitions = await Promise.all(keys.map(async key =>{
        const item:string = await SecureStore.getItemAsync(`${AMMO_DATABASE}_${key}`)
        return JSON.parse(item)
      }))

      if(ammunitions.length !== keys.length){
        throw(`Key/Ammo DB Discrepancy: Found ${keys.length} keys and ${ammunitions.length} ammunitions`)
      }
    } catch(e){
      alarm("Ammo DB Error", e)
    }

      try{
      const preferences:string = await AsyncStorage.getItem(PREFERENCES)
      const isPreferences = preferences === null ? null : JSON.parse(preferences)
      const filteredAmmunition = ammunitions.filter(item => item !== null) // null check if there are key corpses
      if(ammunitions.length !== 0 && ammunitions.every(item => item ===null)){
        throw(`Ammo DB Null Exception: Found ${keys.length} keys and ${ammunitions.length} null items`)
      }

      if(filteredAmmunition.length === 0){
        setAmmoCollection([])
      }
      if(filteredAmmunition.length !== 0){
        const sortedAmmo = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === undefined ? "alphabetical" : isPreferences.sortAmmoBy, isPreferences == null? true : isPreferences.sortOrderAmmo === null ? true : isPreferences.sortOrderAmmo, filteredAmmunition) as AmmoType[]
        setAmmoCollection(sortedAmmo)
      }
    } catch(e){
      alarm("Ammo Preference Error", e)
    }
    }
    getAmmo()
  },[ammoDbImport])

  useEffect(()=>{
    async function getGuns(){
      let keys: string[]
      try{
      keys = await getKeys("guns")
    }  catch(e){
      alarm("Gun Key Error", e)
    }


    let guns:GunType[]
    try{
      guns = await Promise.all(keys.map(async key =>{
        const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
        return JSON.parse(item)
      }))
      if(guns.length !== keys.length){
        throw(`Key/Gun DB Discrepancy: Found ${keys.length} keys and ${guns.length} guns`)
      }
    } catch(e){
      alarm("Gun DB Error", e)
    }

    try{
      const preferences:string = await AsyncStorage.getItem(PREFERENCES)
      const isPreferences = preferences === null ? null : JSON.parse(preferences)
      const filteredGuns = guns.filter(item => item !== null) // null check if there are key corpses
      if(guns.length !== 0 && guns.every(item => item ===null)){
        throw(`Gun DB Null Exception: Found ${keys.length} keys and ${guns.length} null items`)
      }

      if(filteredGuns.length === 0){
        setGunCollection([])
      } 
      if(filteredGuns.length !== 0) {
        const sortedGuns = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === undefined ? "alphabetical" : isPreferences.sortBy, isPreferences == null? true : isPreferences.sortOrderGuns === null ? true : isPreferences.sortOrderGuns, filteredGuns) as GunType[]
        setGunCollection(sortedGuns)
      }
    } catch(e){
      alarm("Gun Preference Error", e)
    }
   }
    getGuns()
    setGunsLoaded(true)
  },[dbImport])

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
                name="NewAmmo"
                component={NewAmmo}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="NewGun"
                component={NewGun}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="Gun"
                component={Gun}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid}} 
              />

              <Stack.Screen
              name="Ammo"
              component={Ammo}
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid}} 
            />

            <Stack.Screen
              name="EditGun"
              component={EditGun}
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
            />

            <Stack.Screen
              name="EditAmmo"
              component={EditAmmo}
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
              options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: "horizontal-inverted"}} 
            />

          </Stack.Navigator>
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  )
}

