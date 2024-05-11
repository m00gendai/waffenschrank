import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Modal, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Button, Appbar, Icon, Checkbox } from 'react-native-paper';
import { checkBoxes, gunDataTemplate } from "../lib/gunDataTemplate"
import * as SecureStore from "expo-secure-store"
import { useState} from "react"
import EditGun from "./EditGun"
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE, KEY_DATABASE } from '../configs';
import { GunType } from '../interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props{
    setSeeGunOpen: React.Dispatch<React.SetStateAction<boolean>>
    gun: GunType
}


export default function Gun({setSeeGunOpen, gun}:Props){

    const [editGunOpen, setEditGunOpen] = useState<boolean>(false)
    const [currentGun, setCurrentGun] = useState<GunType>(gun)
    const [lightBox, setLightBox] = useState<boolean>(false);
    const [lightBoxIndex, setLightBoxIndex] = useState<number>(0)

    const showModal = (index) => {
        setLightBox(true)
        setLightBoxIndex(index)
    }

    const hideModal = () => setLightBox(false);

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
        // Deletes gun in gun database
        await SecureStore.deleteItemAsync(`${GUN_DATABASE}_${gun.id}`)

        // retrieves gun ids from key database and removes the to be deleted id
        const keys:string = await AsyncStorage.getItem(KEY_DATABASE)
        const keyArray: string[] = JSON.parse(keys)
        const newKeys: string[] = keyArray.filter(key => key != gun.id)
        AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys))
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
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => setSeeGunOpen(false)} />
                <Appbar.Content title={`${currentGun.Hersteller} ${currentGun.Modellbezeichnung}`} />
                <Appbar.Action icon="pencil" onPress={() => setEditGunOpen(true)} />
            </Appbar>
        
            <SafeAreaView style={styles.container}>   
                <ScrollView style={{width: "100%"}}>
                    <View style={{backgroundColor: currentGun.Hauptfarbe}}>
                    <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10", marginTop: 10, marginBottom: 10}}>
                        {Array.from(Array(5).keys()).map((_, index) =>{
                        
                            if(currentGun.images && index <= currentGun.images.length-1){
                                return(
                                    <TouchableNativeFeedback key={`slides_${index}`} onPress={()=>showModal(index)}>
                                        <View style={styles.imageContainer} >
                                         <ImageViewer isLightBox={false} selectedImage={currentGun.images[index]} /> 
                                        </View>
                                    </TouchableNativeFeedback>
                                )
                            }      
                            if(!currentGun.images || currentGun.images.length === 0){
                                return(
                                    <TouchableNativeFeedback key={`slides_${index}`} onPress={()=>showModal(index)}>
                                        <View style={styles.imageContainer} >
                                         <ImageViewer isLightBox={false} selectedImage={null} /> 
                                        </View>
                                    </TouchableNativeFeedback>
                                )
                            }                   
                        })}
                    </ScrollView>
                    </View>
                    <View style={styles.data}>
                        {gunDataTemplate.map(item=>{
                            return(
                                <View key={item} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item}:`}</Text>
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: "black", borderBottomWidth: 0.2}}>{currentGun[item]}</Text>
                                </View>
                            )
                        })}
                        <View style={{flex: 1, flexDirection: "column"}} >
                        {checkBoxes.map(checkBox=>{
                            return(
                                <Checkbox.Item key={checkBox} label={checkBox} status={gun.Status && gun.Status[checkBox] ? "checked" : "unchecked"}/>
                            )
                        })}
                        </View>
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{`Bemerkungen`}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: "black", borderBottomWidth: 0.2}}>{currentGun[`Bemerkungen`]}</Text>
                        </View>
                    </View>
                    
                    <Modal visible={editGunOpen}>
                        <EditGun setEditGunOpen={setEditGunOpen} gun={currentGun} setCurrentGun={setCurrentGun} />
                    </Modal>
                    
                    <Modal visible={lightBox} transparent>
                        <View style={{width: "100%", height: "100%", padding: 0, flex: 1, flexDirection: "column", flexWrap: "wrap"}}>
                            <View style={{width: "100%", flexDirection: "row", justifyContent:"flex-end", alignItems: "center", alignContent: "center", backgroundColor: "black", flex: 2}}>
                                <View style={{backgroundColor: "black", padding: 0}}>
                                    <TouchableOpacity onPress={hideModal} style={{padding: 10}}>
                                        <Icon source="close-circle-outline" size={25} color='white'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                          {lightBox ? <ImageViewer isLightBox={true} selectedImage={currentGun.images[lightBoxIndex]}/> : null}
                        </View>
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

