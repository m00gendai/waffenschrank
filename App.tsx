import { StyleSheet, View, Modal, Dimensions, ScrollView, TouchableNativeFeedback, Text } from 'react-native';
import { PaperProvider, Card, FAB, Appbar, Menu, Button, IconButton, Icon, SegmentedButtons, Surface } from 'react-native-paper';
import NewGun from "./components/NewGun"
import Gun from "./components/Gun"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"
import {PREFERENCES, defaultGridGap, defaultViewPadding} from "./configs"
import { GUN_DATABASE, KEY_DATABASE } from './configs';
import 'react-native-gesture-handler';
import React from 'react';
import { GunType, MenuVisibility } from "./interfaces"
import { getIcon, sortBy } from './utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LightSpeedInLeft, LightSpeedInRight, LightSpeedOutLeft, SlideInDown, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { preferenceTitles } from './textTemplates';

async function getKeys(){
  const keys:string = await AsyncStorage.getItem(KEY_DATABASE)
  if(keys == null){
    return []
  }
  return JSON.parse(keys)
}

export default function App() {

  const [gunCollection, setGunCollection] = useState<GunType[]>([])
  const [newGunOpen, setNewGunOpen] = useState<boolean>(false)
  const [seeGunOpen, setSeeGunOpen] = useState<boolean>(false)
  const [currentGun, setCurrentGun] = useState<GunType>(null)
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortIcon, setSortIcon] = useState<string>("alphabetical-variant")
  const [sortAscending, setSortAscending] = useState<boolean>(true)
  const [sortType, setSortType] = useState<string>("alphabetical")
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [displayGrid, setDisplayGrid] = useState<boolean>(true)
  const [language, setLanguage] = useState<string>("de")

  const date: Date = new Date()
  const currentYear:number = date.getFullYear()

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

async function handleSortBy(type: string){
    setSortIcon(getIcon(type))
    setSortType(type)
    const sortedGuns = sortBy(type, sortAscending, gunCollection) 
    setGunCollection(sortedGuns)
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"sortBy": type} : {...JSON.parse(preferences), "sortBy":type} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  }

async function handleSortOrder(){
  setSortAscending(!sortAscending)
  const sortedGuns = sortBy(sortType, !sortAscending, gunCollection) // called with !sortAscending due to the useState having still the old value
  setGunCollection(sortedGuns)
  const preferences:string = await AsyncStorage.getItem(PREFERENCES)
  const newPreferences:{[key:string] : string} = preferences == null ? {"sortOrder": !sortAscending} : {...JSON.parse(preferences), "sortOrder":!sortAscending} 
  await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
}

useEffect(()=>{
  async function getPreferences(){
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const isPreferences = preferences === null ? null : JSON.parse(preferences)
    setLanguage(isPreferences === null ? "de" : isPreferences.language === null ? "de" : isPreferences.language)
    setDisplayGrid(isPreferences === null ? true : isPreferences.display === null ? true : isPreferences.display)
    setSortType(isPreferences == null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)
    setSortIcon(getIcon(isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy))
    setSortAscending(isPreferences === null ? true : isPreferences.sortOrder === null ? true : isPreferences.sortOrder)
  }
  getPreferences()
},[])

useEffect(()=>{
  async function getGuns(){
    const keys:string[] = await getKeys()
    const guns:GunType[] = await Promise.all(keys.map(async key =>{
      const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
      return JSON.parse(item)
    }))
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const isPreferences = preferences === null ? null : JSON.parse(preferences)
    const sortedGuns = sortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy, isPreferences == null? true : isPreferences.sortOrder === null ? true : isPreferences.sortOrder, guns)
    setGunCollection(sortedGuns)
  }
  getGuns()
},[newGunOpen, seeGunOpen])

  function handleGunCardPress(gun){
    setCurrentGun(gun)
    setSeeGunOpen(true)
  }

async function handleLanguageSwitch(lng:string){
  setLanguage(lng)
  const preferences:string = await AsyncStorage.getItem(PREFERENCES)
  const newPreferences:{[key:string] : string} = preferences == null ? {"language": lng} : {...JSON.parse(preferences), "language":lng} 
  await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
}

async function handleDisplaySwitch(){
  setDisplayGrid(!displayGrid)
  const preferences:string = await AsyncStorage.getItem(PREFERENCES)
  const newPreferences:{[key:string] : string} = preferences == null ? {"display": !displayGrid} : {...JSON.parse(preferences), "display":!displayGrid} 
  await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
}
  
  return (
    <PaperProvider>
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
            <Appbar.Action icon={"menu"} onPress={() => setMenuOpen(!menuOpen)} />
          </View>
          <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <Appbar.Action icon={displayGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
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
                      width: (Dimensions.get("window").width / (displayGrid ? 2 : 1)) - (defaultGridGap + (defaultViewPadding/2)),
                    }}
                  >
                    <Card.Title title={`${gun.manufacturer && gun.manufacturer.length != 0 ? gun.manufacturer : ""} ${gun.model}`} subtitle={gun.serial && gun.serial.length != 0 ? gun.serial : " "} subtitleVariant='bodySmall' titleVariant='titleSmall' titleNumberOfLines={2} />
                    {displayGrid ? 
                    <Card.Cover 
                      source={gun.images && gun.images.length != 0 ? { uri: gun.images[0] } : require(`./assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
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
      </SafeAreaView>
      
      {newGunOpen ? 
      <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
        <SafeAreaView>
          <NewGun setNewGunOpen={setNewGunOpen} lang={language}/>
        </SafeAreaView>
      </Animated.View> 
      : 
      null}
        
      {seeGunOpen ? 
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
        <SafeAreaView>
          <Gun setSeeGunOpen={setSeeGunOpen} gun={currentGun} lang={language} />
        </SafeAreaView>
      </Animated.View>
      :
      null}

      {menuOpen ? 
      <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedOutLeft} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
        <SafeAreaView>
          <View style={{width: "80%", height: "100%", backgroundColor: "white"}}>
            <TouchableNativeFeedback onPress={()=>setMenuOpen(!menuOpen)}>
              <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20}}>
                <Icon source="arrow-left" size={20} color='black'/>
              </View>
            </TouchableNativeFeedback>
            <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
              <View style={{width: "100%", flex: 10}}>
                <ScrollView>
                  <View style={{padding: 10}}>
                  <Text>HELLO IS THIS THE KRUSTY KRAB?</Text>
                  <Text>NO THIS IS MENU!</Text>
                  </View>
                  <Surface elevation={4} style={{marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "white"}}>
                    <Text style={{marginBottom: 10}}>{preferenceTitles.language[language]}</Text>
                  <SegmentedButtons
                    value={language}
                    onValueChange={handleLanguageSwitch}

                    buttons={[
                      {
                        value: 'de',
                        label: `🇩🇪`,
                      },
                      {
                        value: 'en',
                        label: '🇬🇧',
                      },
                      { 
                        value: 'fr', 
                        label: '🇫🇷' 
                      },
                    ]}
                  />
                  </Surface>
                  
                </ScrollView>
              </View>
              <View style={{width: "100%", flex: 2, padding: 10}}>
                <Text>Version Pre-Alpha</Text>
                <Text>{`© ${currentYear === 2024 ? currentYear : `2024 - ${currentYear}`} Marcel Weber`} </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View> 
      : 
      null}
      
      {!seeGunOpen && !newGunOpen ? 
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setNewGunOpen(true)}
        disabled={menuOpen ? true : false}
      /> 
      : 
      null}
      
    </PaperProvider>
  );
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
