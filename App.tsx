import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from "react"
import { AMMO_DATABASE, A_KEY_DATABASE, A_TAGS, GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS } from "./configs"
import 'react-native-gesture-handler';
import React from 'react';
import { usePreferenceStore } from './stores/usePreferenceStore';
import { useViewStore } from './stores/useViewStore';
import GunCollection from './components/GunCollection';
import MainMenu from './components/MainMenu';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { tabBarLabels } from './lib/textTemplates';
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


SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean>(false);

  const { ammoDbImport, dbImport, switchLanguage, theme, switchTheme, language, generalSettings, setGeneralSettings, setDisplayAsGrid, setDisplayAmmoAsGrid, setSortBy, setSortAmmoBy, setSortAmmoIcon, setSortGunIcon } = usePreferenceStore();
  const { mainMenuOpen } = useViewStore()
  const { setAmmoCollection } = useAmmoStore()
  const { setGunCollection } = useGunStore()
  const { setAmmoTags, setTags } = useTagStore()

  useEffect(() => {
    async function prepare() {
      try {
       console.log("try: so hard")
       const preferences:string = await AsyncStorage.getItem(PREFERENCES)
        const isPreferences = preferences === null ? null : JSON.parse(preferences)
        if(isPreferences !== null && isPreferences.generalSettings.loginGuard !== null && isPreferences.generalSettings.loginGuard !== undefined && isPreferences.generalSettings.loginGuard === true){
          const success = await LocalAuthentication.authenticateAsync()
          if(success.success){
            setAppIsReady(true);
          } else{
            return
          }
        } else {
          setAppIsReady(true)
        }
      } catch (e) {
        console.log("catch: got so far")
        console.warn(e);
      } finally {
        console.log("finally: doesnt even matter")
        
        
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
      const preferences:string = await AsyncStorage.getItem(PREFERENCES)
      const isPreferences = preferences === null ? null : JSON.parse(preferences)
      
      /* GENERAL SETTINGS AND PREFERENCES */
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

      /* AMMO PREFERENCES */
      const ammo_tagList: string = await AsyncStorage.getItem(A_TAGS)
      const isAmmoTagList:{label: string, status: boolean}[] = ammo_tagList === null ? null : JSON.parse(ammo_tagList)
      setDisplayAmmoAsGrid(isPreferences === null ? true : isPreferences.displayAmmoAsGrid === null ? true : isPreferences.displayAmmoAsGrid)
      setSortAmmoBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === undefined ? "alphabetical" : isPreferences.sortAmmoBy)
      setSortAmmoIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === null ? "alphabetical" : isPreferences.sortAmmoBy)))
      if(isAmmoTagList !== null && isAmmoTagList !== undefined){
        Object.values(isAmmoTagList).map(tag =>{
          setAmmoTags(tag)
        }) 
      }

      /* GUN PREFERENCE */
      const gun_tagList: string = await AsyncStorage.getItem(TAGS) 
      const isGunTagList:{label: string, status: boolean}[] = gun_tagList === null ? null : JSON.parse(gun_tagList)
      setDisplayAsGrid(isPreferences === null ? true : isPreferences.displayAsGrid === null ? true : isPreferences.displayAsGrid)
      setSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === undefined ? "alphabetical" : isPreferences.sortBy)
      setSortGunIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)))
      if(isGunTagList !== null && isGunTagList !== undefined){
        Object.values(isGunTagList).map(tag =>{
          setTags(tag)
        }) 
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
      const keys:string[] = await getKeys("ammo")
      const ammunitions:AmmoType[] = await Promise.all(keys.map(async key =>{
        const item:string = await SecureStore.getItemAsync(`${AMMO_DATABASE}_${key}`)
        return JSON.parse(item)
      }))
      const preferences:string = await AsyncStorage.getItem(PREFERENCES)
      const isPreferences = preferences === null ? null : JSON.parse(preferences)
      const filteredAmmunition = ammunitions.filter(item => item !== null) // null check if there are key corpses
      if(filteredAmmunition.length === 0){
        setAmmoCollection([])
      }
      if(filteredAmmunition.length !== 0){
        const sortedAmmo = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === undefined ? "alphabetical" : isPreferences.sortAmmoBy, isPreferences == null? true : isPreferences.sortAmmoOrder === undefined ? true : isPreferences.sortOrder, filteredAmmunition) as AmmoType[]
        setAmmoCollection(sortedAmmo)
      }
    }
    getAmmo()
  },[ammoDbImport])

  useEffect(()=>{
    async function getGuns(){
      const keys:string[] = await getKeys("guns")
      const guns:GunType[] = await Promise.all(keys.map(async key =>{
        const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
        return JSON.parse(item)
      }))
      const preferences:string = await AsyncStorage.getItem(PREFERENCES)
      const isPreferences = preferences === null ? null : JSON.parse(preferences)
      const filteredGuns = guns.filter(item => item !== null) // null check if there are key corpses
      if(filteredGuns.length === 0){
        setGunCollection([])
      } 
      if(filteredGuns.length !== 0) {
        const sortedGuns = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === undefined ? "alphabetical" : isPreferences.sortBy, isPreferences == null? true : isPreferences.sortOrder === undefined ? true : isPreferences.sortOrder, filteredGuns) as GunType[]
        setGunCollection(sortedGuns)
      }
    }
    getGuns()
  },[dbImport])

  const currentTheme = {...theme, roundness : 5}
  
  const Tab = createBottomTabNavigator<StackParamList>();
  const Stack = createStackNavigator<StackParamList>()

  function Home(){
    return(
      <Tab.Navigator 
        screenOptions={{
          headerShown: false
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            style={{padding: 0, margin: 0,}}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (event.defaultPrevented) {
                preventDefault();
              } else {
              navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }
              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              /*@ts-expect-error*/
              const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.title; 
              return label;
            }}
          />
        )}
      >
        <Tab.Screen
          name="GunCollection"
          component={GunCollection}
          options={{
            tabBarLabel: tabBarLabels.gunCollection[language],
            tabBarIcon: ({ color, size }) => {
              return <Icon name="pistol" size={size} color={color} style={{padding: 0, margin: 0}} />;
            },
          }}
        />
        <Tab.Screen
          name="AmmoCollection"
          component={AmmoCollection}
          options={{
            tabBarLabel: tabBarLabels.ammoCollection[language],
            tabBarIcon: ({ color, size }) => {
              return <Icon name="bullet" size={size} color={color} style={{padding: 0, margin: 0}} />;
            },
          }}
        />
    </Tab.Navigator>
    )
  }

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
                name="Home"
                component={Home}
                options={{headerShown: false}}
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

