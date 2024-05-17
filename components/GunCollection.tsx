import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Appbar, Card, FAB, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GUN_DATABASE, KEY_DATABASE, PREFERENCES, defaultGridGap, defaultViewPadding } from '../configs';
import { GunType, MenuVisibility } from '../interfaces';
import * as SecureStore from "expo-secure-store"
import { getIcon, doSortBy } from '../utils';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import NewGun from './NewGun';
import Gun from './Gun';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';

export default function GunCollection(){

  // TODO: Zustand SortIcon, Zustand SortOrder @ usePreferenceStore
  // TODO: Zustand menuVisibility @ useViewStore
  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortIcon, setSortIcon] = useState<string>("alphabetical-variant")
  const [sortAscending, setSortAscending] = useState<boolean>(true)

  const { dbImport, displayAsGrid, setDisplayAsGrid, toggleDisplayAsGrid, sortBy, setSortBy } = usePreferenceStore()
  const { mainMenuOpen, setMainMenuOpen, newGunOpen, setNewGunOpen, editGunOpen, setEditGunOpen, seeGunOpen, setSeeGunOpen } = useViewStore()
  const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()

    async function getKeys(){
        const keys:string = await AsyncStorage.getItem(KEY_DATABASE)
        if(keys == null){
          return []
        }
        return JSON.parse(keys)
      }
      
    useEffect(()=>{
        async function getGuns(){
          const keys:string[] = await getKeys()
          const guns:GunType[] = await Promise.all(keys.map(async key =>{
            const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
            return JSON.parse(item)
          }))
          const preferences:string = await AsyncStorage.getItem(PREFERENCES)
          const isPreferences = preferences === null ? null : JSON.parse(preferences)

          const sortedGuns = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy, isPreferences == null? true : isPreferences.sortOrder === null ? true : isPreferences.sortOrder, guns)
          setGunCollection(sortedGuns)
        }
        getGuns()
      },[newGunOpen, seeGunOpen, dbImport])

useEffect(()=>{
  async function getPreferences(){
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const isPreferences = preferences === null ? null : JSON.parse(preferences)
    setDisplayAsGrid(isPreferences === null ? true : isPreferences.displayAsGrid === null ? true : isPreferences.displayAsGrid)
    setSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)
    setSortIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)))
  }
  getPreferences()
},[])

        function handleGunCardPress(gun){
          setCurrentGun(gun)
          setSeeGunOpen()
        }

        async function handleSortBy(type: "alphabetical" | "chronological" | "caliber"){
            setSortIcon(getIcon(type))
            setSortBy(type)
            const sortedGuns = doSortBy(type, sortAscending, gunCollection) 
            setGunCollection(sortedGuns)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"sortBy": type} : {...JSON.parse(preferences), "sortBy":type} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }

          function handleMenu(category: string, status: boolean){
            setMenuVisibility({...menuVisibility, [category]: status})
          }

          async function handleSortOrder(){
            setSortAscending(!sortAscending)
            const sortedGuns = doSortBy(sortBy, !sortAscending, gunCollection) // called with !sortAscending due to the useState having still the old value
            setGunCollection(sortedGuns)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"sortOrder": !sortAscending} : {...JSON.parse(preferences), "sortOrder":!sortAscending} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }
        
          async function handleDisplaySwitch(){
            toggleDisplayAsGrid()
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"displayAsGrid": !displayAsGrid} : {...JSON.parse(preferences), "displayAsGrid": !displayAsGrid} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }

    return(
        <SafeAreaView 
        style={{
          width: "100%", 
          height: "100%", 
          flex: 1
        }}
      >

        <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          {/*<Appbar.Action icon="filter" onPress={() =>{}} />*/}
          <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
            <Appbar.Action icon={"menu"} onPress={setMainMenuOpen} />
          </View>
          <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <Appbar.Action icon={displayAsGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={sortIcon} onPress={() => handleMenu("sortBy", true)} />}
              anchorPosition='bottom'
            >
              <Menu.Item onPress={() => handleSortBy("alphabetical")} title="Alphabetisch" leadingIcon={getIcon("alphabetical")}/>
              <Menu.Item onPress={() => handleSortBy("chronological")} title="Chronologisch" leadingIcon={getIcon("chronological")}/>
              <Menu.Item onPress={() => {}} title="Kaliber" leadingIcon={getIcon("caliber")}/>
            </Menu>
            <Appbar.Action icon={sortAscending ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
          </View>
        </Appbar>

        <ScrollView 
          style={{
            width: "100%", 
            height: "100%", 
            flexDirection: "column", 
            flexWrap: "wrap"
          }}
        >
          <View 
            style={styles.container}
          >
            {gunCollection.length != 0 ? gunCollection.map(gun =>{
              return (
                <TouchableNativeFeedback 
                  key={gun.id} 
                  onPress={()=>handleGunCardPress(gun)}
                >
                  <Card 
                    style={{
                      width: (Dimensions.get("window").width / (displayAsGrid ? 2 : 1)) - (defaultGridGap + (defaultViewPadding/2)),
                    }}
                  >
                    <Card.Title title={`${gun.manufacturer && gun.manufacturer.length != 0 ? gun.manufacturer : ""} ${gun.model}`} subtitle={gun.serial && gun.serial.length != 0 ? gun.serial : " "} subtitleVariant='bodySmall' titleVariant='titleSmall' titleNumberOfLines={2} />
                    {displayAsGrid ? 
                    <Card.Cover 
                      source={gun.images && gun.images.length != 0 ? { uri: gun.images[0] } : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
                      style={{
                        height: 100
                      }}
                    /> 
                    : 
                    null}
                  </Card>
                </TouchableNativeFeedback>
              )
            }) : null }
          </View>
        </ScrollView>
        {newGunOpen ? 
      <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
        <SafeAreaView>
          <NewGun />
        </SafeAreaView>
      </Animated.View> 
      : 
      null}
        
      {seeGunOpen ? 
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
        <SafeAreaView>
          <Gun />
        </SafeAreaView>
      </Animated.View>
      :
      null}
         {!seeGunOpen && !newGunOpen && !mainMenuOpen? 
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={setNewGunOpen}
        disabled={mainMenuOpen ? true : false}
      /> 
      : 
      null}
        
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: "wrap",
      flexDirection: "row",
      gap: defaultGridGap,
      padding: defaultViewPadding
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    flagButton:{
      fontSize: 20
    }
  });