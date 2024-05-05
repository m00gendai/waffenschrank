import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Modal, Dimensions, ScrollView, TouchableNativeFeedback, Alert } from 'react-native';
import { PaperProvider, Button, Card } from 'react-native-paper';
import * as SecureStore from "expo-secure-store"

async function deleteItem(gun){
    let result = await SecureStore.getItemAsync("gunx");
    const nerw = result ? JSON.parse(result) : []
    const nerx = nerw.filter(item => item.id != gun.id)
    await SecureStore.setItemAsync("gunx", JSON.stringify(nerx));
}

function invokeAlert(gun){
    Alert.alert(`${gun.Modellbezeichnung} löschen?`, "Die Waffe wird unwiderruflich gelöscht", [
        {
            text: "Ja",
            onPress: () => deleteItem(gun)
        },
        {
            text: "Nein",
            style: "cancel"
        }
    ])
}

export default function Gun({setSeeGunOpen, gun}){

    return(
        <SafeAreaView style={styles.container}>
            <Button mode="contained" onPress={()=>setSeeGunOpen(false)}>X</Button>
            <Text>{gun.Modellbezeichnung}</Text>
            <Button mode="contained" onPress={()=>invokeAlert(gun)}>Del</Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      flexWrap: "wrap",
      flexDirection: "column",
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-start",
      alignContent: "flex-start",
      gap: 5,
      padding: 5,
    },
})