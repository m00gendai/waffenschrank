import { StyleSheet, View, Modal, Dimensions, ScrollView, TouchableNativeFeedback } from 'react-native';
import { PaperProvider, Card, FAB } from 'react-native-paper';
import NewGun from "./components/NewGun"
import Gun from "./components/Gun"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"
import {defaultGridGap, defaultViewPadding} from "./configs"
import { GUN_DATABASE, KEY_DATABASE } from './configs';
import 'react-native-gesture-handler';
import React from 'react';
import { GunType } from "./interfaces"


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

useEffect(()=>{
  async function getGuns(){
    const keys:string[] = await getKeys()
    const guns:GunType[] = await Promise.all(keys.map(async key =>{
      const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
      return JSON.parse(item)
    }))
    setGunCollection(guns)
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
                      aspectRatio:"1/1"
                    }}
                  >
                    <Card.Title title={`${gun.Hersteller} ${gun.Modellbezeichnung}`} />
                    <Card.Cover style={{width: "100%", height: "70%"}} resizeMode="cover" source={{ uri: gun.images && gun.images.length != 0 ? gun.images[0] : null }} /> 
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
