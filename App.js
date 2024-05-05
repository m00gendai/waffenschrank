import { StyleSheet, View, Modal, Dimensions, ScrollView, TouchableNativeFeedback } from 'react-native';
import { PaperProvider, Card, FAB } from 'react-native-paper';
import NewGun from "./components/NewGun"
import Gun from "./components/Gun"
import * as SecureStore from "expo-secure-store"
import { useState } from "react"
import {defaultGridGap, defaultViewPadding} from "./configs"
import { GUN_DATABASE } from './configs';


import { SafeAreaView } from 'react-native-safe-area-context';

function getGuns(){
  const guns = SecureStore.getItem(GUN_DATABASE)
  return guns ? JSON.parse(guns) : []
}


export default function App() {

  const [newGunOpen, setNewGunOpen] = useState(false)
  const [seeGunOpen, setSeeGunOpen] = useState(false)
  const [currentGun, setCurrentGun] = useState(null)

  const guns = getGuns()

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
            {guns ? guns.map(gun =>{
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
            }) : null}
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
