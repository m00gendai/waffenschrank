import { StyleSheet, View, Modal, Dimensions, ScrollView, TouchableNativeFeedback } from 'react-native';
import { PaperProvider, Card, FAB, Appbar, Menu } from 'react-native-paper';
import NewGun from "./components/NewGun"
import Gun from "./components/Gun"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"
import {defaultGridGap, defaultViewPadding} from "./configs"
import { GUN_DATABASE, KEY_DATABASE } from './configs';
import 'react-native-gesture-handler';
import React from 'react';
import { GunType, MenuVisibility } from "./interfaces"
import { getIcon, sortBy } from './utils';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

  function handleSortBy(type: string){
    setSortIcon(getIcon(type))
    setSortType(type)
    const sortedGuns = sortBy(type, sortAscending, gunCollection) 
    setGunCollection(sortedGuns)
  }

function handleSortOrder(){
  setSortAscending(!sortAscending)
  const sortedGuns = sortBy(sortType, !sortAscending, gunCollection) // called with !sortAscending due to the useState having still the old value
  setGunCollection(sortedGuns)
}

useEffect(()=>{
  async function getGuns(){
    const keys:string[] = await getKeys()
    const guns:GunType[] = await Promise.all(keys.map(async key =>{
      const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
      return JSON.parse(item)
    }))
    const sortedGuns = sortBy(sortType, sortAscending, guns)
    setGunCollection(sortedGuns)
  }
  getGuns()
},[newGunOpen, seeGunOpen])

  function handleGunCardPress(gun){
    setCurrentGun(gun)
    setSeeGunOpen(true)
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

        <Appbar style={{width: "100%"}}>
          {/*<Appbar.Action icon="filter" onPress={() =>{}} />*/}
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
                      width: (Dimensions.get("window").width / 2) - (defaultGridGap + (defaultViewPadding/2)),
                    }}
                  >
                    <Card.Title title={`${gun.Hersteller && gun.Hersteller.length != 0 ? gun.Hersteller : ""} ${gun.Modellbezeichnung}`} subtitle={gun.Seriennummer && gun.Seriennummer.length != 0 ? gun.Seriennummer : " "} subtitleVariant='bodySmall' titleVariant='titleSmall' titleNumberOfLines={2} />
                    <Card.Cover 
                      source={gun.images && gun.images.length != 0 ? { uri: gun.images[0] } : require(`./assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
                      style={{
                        height: 100
                      }}
                    /> 
                  </Card>
                </TouchableNativeFeedback>
              )
            }) : null }
          </View>
        </ScrollView>
      </SafeAreaView>
      
      <Modal visible={newGunOpen}>
        <NewGun setNewGunOpen={setNewGunOpen} />
      </Modal>
      
      <Modal visible={seeGunOpen}>
        <Gun setSeeGunOpen={setSeeGunOpen} gun={currentGun} />
      </Modal>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setNewGunOpen(true)}
      />
      
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
});
