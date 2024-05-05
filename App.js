import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal, Dimensions, ScrollView } from 'react-native';
import { PaperProvider, Button, Card } from 'react-native-paper';
import GunCollection from "./components/GunCollection"
import NewGun from "./components/NewGun"
import * as SecureStore from "expo-secure-store"
import { useState } from "react"
import {defaultGridGap, defaultViewPadding} from "./configs"

import { SafeAreaView } from 'react-native-safe-area-context';


function getGuns(){
  const guns = SecureStore.getItem("gunx")
  return guns ? JSON.parse(guns) : {}
}

export default function App() {

  const [newGunOpen, setNewGunOpen] = useState(false)

  const guns = getGuns()
  return (
    <PaperProvider>
      <SafeAreaView style={{width: "100%", height: "100%", flex: 1}}>
        <ScrollView style={{width: "100%", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
          <View style={styles.container}>
      {
        guns.map(gun =>{
          return (
            <Card 
              key={gun.id} 
              style={{
                width: (Dimensions.get("window").width / 2) - (defaultGridGap + (defaultViewPadding/2)),
                aspectRatio: "1/1"
              }}>
                <Card.Title title={`${gun.Hersteller} ${gun.Modellbezeichnung}`} />
            </Card>
          )
        })
      }</View>
      </ScrollView>
    </SafeAreaView>
      <Modal visible={newGunOpen}><NewGun setNewGunOpen={setNewGunOpen}/></Modal>
      <Button mode="contained" onPress={()=>setNewGunOpen(true)}>New</Button>
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
});
