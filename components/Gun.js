import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Modal, ScrollView, Alert } from 'react-native';
import { Button, Appbar, Icon } from 'react-native-paper';
import { gunDataTemplate } from "../lib/gunDataTemplate"
import * as SecureStore from "expo-secure-store"
import { useState} from "react"
import EditGun from "./EditGun"
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE } from '../configs';


export default function Gun({setSeeGunOpen, gun}){

    const [editGunOpen, setEditGunOpen] = useState(false)
    const [currentGun, setCurrentGun] = useState(gun)

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flex: 1,
            flexWrap: "wrap",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
            alignContent: "flex-start",
            gap: 5,
            padding: 5,
        },
        imageContainer: {
            width: "100%",
            aspectRatio: currentGun.images && currentGun.images.length == 1 ? "21/10" : "18/10",
            flexDirection: "column",
            flex: 1,
            marginRight: 5
        },
        data: {
            flex: 1,
            height: "100%",
            width: "100%",
            marginTop: 10
        },
    })

    async function deleteItem(gun){
        let result = await SecureStore.getItemAsync(GUN_DATABASE);
        const editedResult = result ? JSON.parse(result) : []
        const filteredResult = editedResult.filter(item => item.id != gun.id)
        await SecureStore.setItemAsync(GUN_DATABASE, JSON.stringify(filteredResult));
        setSeeGunOpen(false)
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

    return(
        <View style={{width: "100%", height: "100%"}}>
            
            <Appbar.Header style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => setSeeGunOpen(false)} />
                <Appbar.Content title={`${currentGun.Hersteller} ${currentGun.Modellbezeichnung}`} />
                <Appbar.Action icon="pencil" onPress={() => setEditGunOpen(true)} />
            </Appbar.Header>
        
            <SafeAreaView style={styles.container}>   
                <ScrollView style={{width: "100%"}}>
                    <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10"}}>
                        {Array.from(Array(5).keys()).map((_, index) =>{
                            if(currentGun.images && index <= currentGun.images.length-1){
                                return(
                                    <View style={styles.imageContainer} key={`slides_${index}`}>
                                        <ImageViewer selectedImage={currentGun.images && currentGun.images.length != 0 ? currentGun.images[index] : null} />
                                    </View>
                                )
                            }
                        })}
                    </ScrollView>
                    <View style={styles.data}>
                        {gunDataTemplate.map(item=>{
                            return(
                                <View key={item} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item}:`}</Text>
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: "black", borderBottomWidth: 0.2}}>{currentGun[item]}</Text>
                                </View>
                            )
                        })}
                    </View>
                    
                    <Modal visible={editGunOpen}>
                        <EditGun setEditGunOpen={setEditGunOpen} gun={currentGun} setCurrentGun={setCurrentGun} />
                    </Modal>
                    
                    <View style={{width: "100%", display: "flex", flex: 1, flexDirection: "row", justifyContent:"center"}}>
                        <Button mode="contained" style={{width: "20%", backgroundColor: "red", marginTop: 20}} onPress={()=>invokeAlert(currentGun)}>
                            <Icon source="delete" color='white' size={20}/>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

