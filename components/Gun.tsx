import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Modal, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Button, Appbar, Icon } from 'react-native-paper';
import { gunDataTemplate } from "../lib/gunDataTemplate"
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
                    <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10"}}>
                        {Array.from(Array(5).keys()).map((_, index) =>{
                            if(currentGun.images && index <= currentGun.images.length-1){
                                return(
                                    <TouchableNativeFeedback key={`slides_${index}`} onPress={()=>showModal(index)}>
                                        <View style={styles.imageContainer} >
                                         <ImageViewer isLightBox={false} selectedImage={currentGun.images[index] != undefined ? currentGun.images[index] : "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fwaffenschrank-f4802a1e-6ed2-48c0-a27f-996c6c9ffbfe/ImagePicker/d58c87b7-3ff9-483d-87b4-e2a44a27bd8f.jpeg"} /> 
                                        </View>
                                    </TouchableNativeFeedback>
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
                    
                    <Modal visible={lightBox} transparent>
                        <View style={{width: "100%", height: "100%", padding: 0, flex: 1, flexDirection: "column", flexWrap: "wrap"}}>
                            <View style={{width: "100%", flexDirection: "row", justifyContent:"flex-end", padding: 10, backgroundColor: "black", flex: 1}}>
                                <TouchableOpacity onPress={hideModal}>
                                    <Text style={{color: "white", fontSize: 20}}>X</Text>
                                </TouchableOpacity>
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

