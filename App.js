import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import GunCollection from "./components/GunCollection"
import NewGun from "./components/NewGun"
import * as SecureStore from "expo-secure-store"

function getGuns(){
  const guns = SecureStore.getItem("gunx")
  return guns ? JSON.parse(guns) : {}
}

export default function App() {

  const guns = getGuns()
  return (
    <PaperProvider>
      <View style={styles.container}>
      {
        guns.map(gun =>{
          return <View key={gun.id}>
            {Object.entries(gun).map(a =>{
              return <Text key={`text_${a[0]}_${gun.id}`}>{`${a[0]}: ${a[1]}`}</Text>
            })}
          </View>
        })
      }
    </View>
      <NewGun />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
