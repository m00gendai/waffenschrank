import { StyleSheet, Text, View, Modal, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Button, Appbar, Icon, Chip } from 'react-native-paper';
import { ammoDataTemplate, ammoRemarks } from "../lib/ammoDataTemplate"
import * as SecureStore from "expo-secure-store"
import { useState} from "react"
import EditGun from "./EditGun"
import ImageViewer from "./ImageViewer"
import { AMMO_DATABASE, A_KEY_DATABASE } from '../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import { ammoDeleteAlert } from '../lib/textTemplates';
import { printSingleGun } from '../functions/printToPDF';


export default function Ammo(){

    const [lightBoxIndex, setLightBoxIndex] = useState<number>(0)

    const { setSeeAmmoOpen, editAmmoOpen, setEditAmmoOpen, lightBoxOpen, setLightBoxOpen } = useViewStore()
    const { language } = usePreferenceStore()
    const { currentAmmo, setCurrentAmmo } = useAmmoStore()

    const showModal = (index:number) => {
        setLightBoxOpen()
        setLightBoxIndex(index)
    }

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
            aspectRatio: currentAmmo.images && currentAmmo.images.length == 1 ? "21/10" : "18/10",
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

    async function deleteItem(ammo){
        // Deletes ammo in gun database
        await SecureStore.deleteItemAsync(`${AMMO_DATABASE}_${ammo.id}`)

        // retrieves ammo ids from key database and removes the to be deleted id
        const keys:string = await AsyncStorage.getItem(A_KEY_DATABASE)
        const keyArray: string[] = JSON.parse(keys)
        const newKeys: string[] = keyArray.filter(key => key != ammo.id)
        AsyncStorage.setItem(A_KEY_DATABASE, JSON.stringify(newKeys))
        setSeeAmmoOpen()
    }
    
    function invokeAlert(ammo){
        Alert.alert(`${ammo.designation} ${ammoDeleteAlert.title[language]}`, ammoDeleteAlert.subtitle[language], [
            {
                text: ammoDeleteAlert.yes[language],
                onPress: () => deleteItem(ammo)
            },
            {
                text: ammoDeleteAlert.no[language],
                style: "cancel"
            }
        ])
    }

    return(
        <View style={{width: "100%", height: "100%", backgroundColor: "white"}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => setSeeAmmoOpen()} />
                <Appbar.Content title={`${currentAmmo.designation} ${currentAmmo.manufacturer}`} />
               {/* <Appbar.Action icon="printer" onPress={()=>printSingleGun(currentGun, language)} /> */}
                <Appbar.Action icon="pencil" onPress={setEditAmmoOpen} />
            </Appbar>
        
            <View style={styles.container}>   
                <ScrollView style={{width: "100%"}}>
                    <View style={{backgroundColor: "transparent"}}>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10", marginTop: 10, marginBottom: 10}}>
                            {Array.from(Array(5).keys()).map((_, index) =>{
                            
                                if(currentAmmo.images && index <= currentAmmo.images.length-1){
                                    return(
                                        <TouchableNativeFeedback key={`slides_${index}`} onPress={()=>showModal(index)}>
                                            <View style={styles.imageContainer} >
                                            <ImageViewer placeholder='ammo' isLightBox={false} selectedImage={currentAmmo.images[index]} /> 
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                }      
                                if(!currentAmmo.images || currentAmmo.images.length === 0){
                                    return(
                                        <TouchableNativeFeedback key={`slides_${index}`}>
                                            <View style={styles.imageContainer} >
                                            <ImageViewer placeholder="ammo" isLightBox={false} selectedImage={null} /> 
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                }                   
                            })}
                        </ScrollView>
                    </View>
                    <View style={styles.data}>
                        <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", marginBottom: 10}}>
                            {currentAmmo.tags?.map((tag, index) =>{
                                return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                            })}
                        </View>
                        {ammoDataTemplate.map((item, index)=>{
                            return(
                                <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: "black", borderBottomWidth: 0.2}}>{currentAmmo[item.name]}</Text>
                                </View>
                            )
                        })}
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{ammoRemarks[language]}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: "black", borderBottomWidth: 0.2}}>{currentAmmo.remarks}</Text>
                        </View>
                    </View>
                    
                    <Modal visible={editAmmoOpen}>
                        <EditGun />
                    </Modal>
                    
                    <Modal visible={lightBoxOpen} transparent>
                        <View style={{width: "100%", height: "100%", padding: 0, flex: 1, flexDirection: "column", flexWrap: "wrap"}}>
                            <View style={{width: "100%", flexDirection: "row", justifyContent:"flex-end", alignItems: "center", alignContent: "center", backgroundColor: "black", flex: 2}}>
                                <View style={{backgroundColor: "black", padding: 0}}>
                                    <TouchableOpacity onPress={setLightBoxOpen} style={{padding: 10}}>
                                        <Icon source="close-circle-outline" size={25} color='white'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                          {lightBoxOpen ? <ImageViewer isLightBox={true} selectedImage={currentAmmo.images[lightBoxIndex]}/> : null}
                        </View>
                    </Modal>                    
                    
                    <View style={{width: "100%", display: "flex", flex: 1, flexDirection: "row", justifyContent:"center"}}>
                        <Button mode="contained" style={{width: "20%", backgroundColor: "red", marginTop: 20}} onPress={()=>invokeAlert(currentAmmo)}>
                            <Icon source="delete" color='white' size={20}/>
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

