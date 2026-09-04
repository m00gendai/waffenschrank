import { IconButton, PaperProvider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from "react"
import { AMMO_DATABASE, A_KEY_DATABASE, GUN_DATABASE, KEY_DATABASE, PREFERENCES } from "./configs/configs_DB"
import 'react-native-gesture-handler';
import React from 'react';
import { usePreferenceStore } from './stores/usePreferenceStore';
import { useViewStore } from './stores/useViewStore';
import MainMenu from './components/MainMenu/MainMenu';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AmmoType, GunType, StackParamList } from './lib/interfaces';
import * as SecureStore from "expo-secure-store"
import { alarm, getIcon } from './functions/utils';
import { useAmmoStore } from './stores/useAmmoStore';
import { useTagStore } from './stores/useTagStore';
import { useGunStore } from './stores/useGunStore';
import { DefaultTheme } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import QuickStock from './components/QuickStock';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import QuickShot from './components/QuickShot';
import * as SplashScreen from 'expo-splash-screen';
import * as LocalAuthentication from 'expo-local-authentication';
import { Dimensions, View } from 'react-native';
import { calibers } from './lib/caliberData';
import * as schema from "./db/schema"
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import { checkBoxes } from './lib/DataTemplates/gunDataTemplate';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import BottomSheet, { BottomSheetFooter, BottomSheetHandleProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomBar from './components/BottomBars/BottomBar';
import { defaultBottomBarHeight, defaultBottomBarTextHeight, defaultViewPadding, legacyDatePickerTriggerFields, screenNameParamsAll } from './configs/configs';
import ItemCollection from 'components/ItemCollection/ItemCollection';
import Item from 'components/ItemCollection/Item';
import NewItem from 'components/ItemCollection/NewItem';
import EditItem from 'components/ItemCollection/EditItem';
import { useItemStore } from 'stores/useItemStore';
import QuickMount from 'components/QuickMount';
import AlohaSnackbar from 'components/AlohaSnackbar';
import { eq } from 'drizzle-orm';
import checkLegacyGunData from 'functions/legacy/checkLegacyGunData';
import checkLegacyAmmoData from 'functions/legacy/checkLegacyAmmoData';
import migrateLegacyDateAndCaliberFields from 'functions/legacy/migrateLegacyDateAndCaliberFields';
import { snapshot } from 'node:test';
import EditAutocomplete from 'components/MainMenu/EditData/EditAutoComplete';
import EditCustomLabels from 'components/MainMenu/EditData/EdiCustomLabels';
import Statistics from 'components/MainMenu/Statistics/Statistics';
import GenerateQRCodes from 'components/MainMenu/QRCodes/GenerateQRCodes';
import { AppDb } from 'db/client';
import * as SQLite from 'expo-sqlite';

SplashScreen.preventAutoHideAsync();

export default function AppContent({ db, expo }: { db: AppDb; expo: SQLite.SQLiteDatabase }) {
  const { success, error } = useMigrations(db, migrations);
  
  if(error){
    console.error("Database Migration Error:")
    console.error(error)
    alarm("Database Migration Error", `Error Name: ${error.name} --- Error Cause: ${error.cause} --- Error Message: ${error.message} --- Error Stack: ${error.stack}`)
  }

  useDrizzleStudio(expo)


  // Only on appIsReady is the splash screen deactivated

  const [appIsReady, setAppIsReady] = useState<boolean>(false);


  // This is some React Reanimated stuff

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });


  // Zustand Store declarations

  const { 
    switchLanguage, 
    theme, 
    switchTheme, 
    switchCountry,
    generalSettings,
    setGeneralSettings, 
    preferredUnits,
    setPreferredUnits,
    displaySettings,
    setDisplaySettings,
    sortBy,
    setSortBy,
    setCaliberDisplayNameList,
    setHasCheckedForLegacyAmmoData,
    setHasCheckedForLegacyGunData,
    setHasConvertedLegacyAmmoCaliberFieldToStringArray,
    setHasConvertedLegacyDateFieldsToUnixTimeStamp,
    setHasSeenReviewRequest
  } = usePreferenceStore();
  const { mainMenuOpen, hideBottomSheet, setOnboardingVisible } = useViewStore()
  const { currentCollection, setCurrentCollection } = useItemStore()

const { bottom } = useSafeAreaInsets();

  // States and Refs

  const [bottomBarIcon, setBottomBarIcon] = useState<string>("chevron-up")
  const snapStateRef = useRef<number>(null)
  const bottomSheetRef = useRef<BottomSheet>(null);


  // INIT PREPARE FUNCTION - THIS ESSENTAILLY SETS UP THE APP
  
  useEffect(() => {
    async function prepare() {
      if(!success){
        return
      }

      try{
        let isPreferences 
        try{
          console.info("Get Preferences")
          const preferences:string | null = await AsyncStorage.getItem(PREFERENCES)
          isPreferences = preferences ? JSON.parse(preferences) : null;
        } catch(e){
          throw new Error(`Init: Get Preferences: ${e}`)
        }

      try{
        console.info("Preferences Nullcheck:")
        if(isPreferences === null){
          console.info("Preferences are Null")

          console.info("Checking for Legacy Gun Data")
          try{
            await checkLegacyGunData(setHasCheckedForLegacyGunData)
          }catch(e){
            throw new Error(`Init: Get Preferences: Nullcheck: Legacy Gun Data: ${e}`)
          }

          console.info("Checking for Legacy Ammo Data")
          try{
            await checkLegacyAmmoData(setHasCheckedForLegacyAmmoData)
          }catch(e){
            throw new Error(`Init: Get Preferences: Nullcheck: Legacy Ammo Data: ${e}`)
          }

          console.info("Parsing Legacy Date Fields")
          try{
            if(!isPreferences?.hasConvertedLegacyDateFieldsToUnixTimeStamp && !isPreferences?.hasConvertedLegacyAmmoCaliberFieldToStringArray){
              await migrateLegacyDateAndCaliberFields(setHasConvertedLegacyAmmoCaliberFieldToStringArray, setHasConvertedLegacyDateFieldsToUnixTimeStamp)
            }
          }catch(e){
            throw new Error(`Init: Get Preferences: Nullcheck: Legacy Date Fields: ${e}`)
          }

          console.info("Successfully checked for legacy data")
          console.info("Setting App to Ready")

          try{
            isPreferences?.hasBeenOnboarded ? setOnboardingVisible(false) : setOnboardingVisible(true)
          } catch(e){
            alarm("Onboarding Error @onLayoutRootView", `${e}`)
          }
          setAppIsReady(true)
          return
        }
      }catch(e){
        throw new Error(`Init: Get Preferences: Nullcheck: ${e}`)
      }

      try{
        console.info("Preferences Nullcheck: General Settings:")
        if(!isPreferences?.generalSettings){ 
          console.info("Checking for Legacy Gun Data")
          try{
            await checkLegacyGunData(setHasCheckedForLegacyGunData)
          }catch(e){
            throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Legacy Gun Data: ${e}`)
          }

          console.info("Checking for Legacy Ammo Data")
          try{
            await checkLegacyAmmoData(setHasCheckedForLegacyAmmoData)
          }catch(e){
            throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Legacy Ammo Data: ${e}`)
          }
          
          console.info("Parsing Legacy Date Fields")
          try{
            if(!isPreferences?.hasConvertedLegacyDateFieldsToUnixTimeStamp && !isPreferences?.hasConvertedLegacyAmmoCaliberFieldToStringArray){
              await migrateLegacyDateAndCaliberFields(setHasConvertedLegacyAmmoCaliberFieldToStringArray, setHasConvertedLegacyDateFieldsToUnixTimeStamp)
            }
          }catch(e){
            throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Legacy Date Fields: ${e}`)
          }

          console.info("Successfully checked for legacy data")
          console.info("Setting App to Ready")
          try{
            isPreferences?.hasBeenOnboarded ? setOnboardingVisible(false) : setOnboardingVisible(true)
          } catch(e){
            alarm("Onboarding Error @onLayoutRootView", `${e}`)
          }
          setAppIsReady(true)
          return
        }
      }catch(e){
        throw new Error(`Init: Get Preferences: General Settings: ${e}`)
      }

      try{
        console.info("Preferences Nullcheck: General Settings: Login Guard (null or false):")
        if(isPreferences?.generalSettings?.loginGuard){

          const authSuccess = await LocalAuthentication.authenticateAsync()

          if(authSuccess.success){
            console.info("Login Guard active")

            console.info("Checking for Legacy Gun Data")
            try{
              await checkLegacyGunData(setHasCheckedForLegacyGunData)
            }catch(e){
              throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Login Guard Active: Legacy Gun Data: ${e}`)
            }

            console.info("Checking for Legacy Ammo Data")
            try{
              await checkLegacyAmmoData(setHasCheckedForLegacyAmmoData)
            }catch(e){
              throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Login Guard Active: Legacy Ammo Data: ${e}`)
            }

            console.info("Parsing Legacy Date Fields")
            try{
              if(!isPreferences?.hasConvertedLegacyDateFieldsToUnixTimeStamp && !isPreferences?.hasConvertedLegacyAmmoCaliberFieldToStringArray){
              await migrateLegacyDateAndCaliberFields(setHasConvertedLegacyAmmoCaliberFieldToStringArray, setHasConvertedLegacyDateFieldsToUnixTimeStamp)
            }
            }catch(e){
              throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Login Guard Active: Legacy Date Fields: ${e}`)
            }

            console.info("Successfully checked for legacy data")
            console.info("Setting App to Ready")
            try{
            isPreferences?.hasBeenOnboarded ? setOnboardingVisible(false) : setOnboardingVisible(true)
          } catch(e){
            alarm("Onboarding Error @onLayoutRootView", `${e}`)
          }
            setAppIsReady(true)
            return
          } else{
            return
          }  
        } else {
            console.info("Login Guard inactive")
            console.info("Checking for Legacy Gun Data")
            try{
              await checkLegacyGunData(setHasCheckedForLegacyGunData)
            }catch(e){
              throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Login Guard Inactive: Legacy Gun Data: ${e}`)
            }

            console.info("Checking for Legacy Ammo Data")
            try{
              await checkLegacyAmmoData(setHasCheckedForLegacyAmmoData)
            }catch(e){
              throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Login Guard Inactive: Legacy Ammo Data: ${e}`)
            }

            console.info("Parsing Legacy Date Fields")
            try{
              if(!isPreferences?.hasConvertedLegacyDateFieldsToUnixTimeStamp && !isPreferences?.hasConvertedLegacyAmmoCaliberFieldToStringArray){
              await migrateLegacyDateAndCaliberFields(setHasConvertedLegacyAmmoCaliberFieldToStringArray, setHasConvertedLegacyDateFieldsToUnixTimeStamp)
            }
            }catch(e){
              throw new Error(`Init: Get Preferences: Nullcheck: General Settings: Login Guard Inactive: Legacy Date Fields: ${e}`)
            }

            console.info("Successfully checked for legacy data")
            console.info("Setting App to Ready")
            try{
            isPreferences?.hasBeenOnboarded ? setOnboardingVisible(false) : setOnboardingVisible(true)
          } catch(e){
            alarm("Onboarding Error @onLayoutRootView", `${e}`)
          }
            setAppIsReady(true)
            return
          }
        } catch(e){
          throw new Error(`Init: Get Preferences: Login Guard: ${e}`)
        }

      }catch(e){
        console.error(e)
        alarm("Initialisation error", `${e}`);
      }
    }

    prepare();

  }, [success]);


  // This turns off the splash screen when appIsReady returns true

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);


  // This gets the preferences - it runs after the prepare() useEffect  
  
  useEffect(()=>{
    async function getPreferences(){
      let preferences:string | null
      try{
        preferences = await AsyncStorage.getItem(PREFERENCES)
      } catch(e){
        alarm("Preference DB Error", `${e}`)
        return
      }

      let isPreferences
      try{
       isPreferences = preferences === null ? null : JSON.parse(preferences)
      } catch(e){
        alarm("Preference Parse Error", `${e}`)
        return
      }
      
      /* GENERAL SETTINGS AND PREFERENCES */
      try{
        switchLanguage(isPreferences?.language ?? "de")
        switchTheme(isPreferences?.theme ?? "default")
        switchCountry(isPreferences?.country ?? "ch")
        setGeneralSettings({
          ...generalSettings, 
          ...isPreferences?.generalSettings
        });
        setPreferredUnits({
          ...preferredUnits,
          ...isPreferences?.preferredUnits
        })
        setDisplaySettings({
          ...displaySettings,
          ...isPreferences?.displaySettings
        })
        screenNameParamsAll.forEach(screen =>{
          setSortBy(screen, {
            ...sortBy[screen],
            ...isPreferences?.sortBy?.[screen]
          }); 
        })
        
        let shortCalibers:{name: string, displayName?: string}[] = []
        if(isPreferences?.generalSettings?.caliberDisplayName){
          calibers.map(variant =>{
            variant.variants.map(caliber =>{
              if(caliber.displayName !== undefined){
                shortCalibers.push(caliber)
              }
            })
          })
        }
        setCaliberDisplayNameList(shortCalibers)
        if(isPreferences?.generalSettings?.rememberLastScreen){
          if(isPreferences?.currentCollection){
            setCurrentCollection(isPreferences?.currentCollection)
          }
        }
        setHasSeenReviewRequest(isPreferences?.hasSeenReviewRequest ?? false)
      }catch(e){
        alarm("General Preferences Error", `${e}`)
      }
    }

    getPreferences()

  },[])


  // This adds roundness to theme

  const currentTheme = {...theme, roundness : 5}


  // This sets up the navigation stack

  const Stack = createStackNavigator<StackParamList>()


  // This sets up the theme for the NavigationContainer

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background
    }
  }


  // This repeatedly checks for appIsReady
  
  if (!appIsReady) {
    return null;
  }


  // This handles the bottomSheet state - open or closed - across swipes and button presses

  function handleBottomSheetChange(){
    if(snapStateRef.current === 0){
      snapStateRef.current = 1
      setBottomBarIcon("chevron-down")
    } else {
      snapStateRef.current = 0
      setBottomBarIcon("chevron-up")
    }
  }


  // Actual main structure

  return (
    <GestureHandlerRootView>
      <NavigationContainer theme={navTheme}>
        <PaperProvider theme={currentTheme}>
          
          <StatusBar style={theme.name.includes("dark") ? "light" : "dark"} />
          <SafeAreaView 
            onLayout={onLayoutRootView}
            style={{
              width: "100%", 
              height: "100%", 
              flex: 1,
              backgroundColor: theme.colors.background
            }}
            edges={['top', 'bottom']}
          >
            <Stack.Navigator>

              <Stack.Screen
                name="itemCollection"
                component={ItemCollection}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} 
                initialParams={{ collectionType: 'gunCollection' }}
              />

              <Stack.Screen
                name="item"
                component={Item}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid}} 
              />

              <Stack.Screen
                name="newItem"
                component={NewItem}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="editItem"
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
                name="QuickMount"
                component={QuickMount}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, gestureDirection: "vertical-inverted", presentation: "transparentModal"}} 
              />

              <Stack.Screen
                name="MainMenu"
                component={MainMenu}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: "horizontal-inverted", presentation: "transparentModal", cardStyle: { backgroundColor: Dimensions.get("window").width > Dimensions.get("window").height ? "transparent" : theme.colors.background}}} 
              />

              <Stack.Screen
                name="EditAutocomplete"
                component={EditAutocomplete}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="EditCustomLabels"
                component={EditCustomLabels}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="GenerateQRCodes"
                component={GenerateQRCodes}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

              <Stack.Screen
                name="Statistics"
                component={Statistics}
                options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} 
              />

            </Stack.Navigator>
            
            <AlohaSnackbar/>
            
            {mainMenuOpen ? null : hideBottomSheet ? null : 
              <BottomSheet
                ref={bottomSheetRef}
                onChange={()=> handleBottomSheetChange()}
                snapPoints={[
                  defaultBottomBarHeight
                ]}
                handleComponent={null}   
       bottomInset={bottom}

              >
                <BottomSheetView style={{ flex: 1 }}>
                  <BottomBar screen={currentCollection} bottomBarRef={bottomSheetRef} snapStateRef={snapStateRef} bottomBarIcon={bottomBarIcon}/>
                </BottomSheetView>
              </BottomSheet>
            }

          </SafeAreaView>
          
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

