import { StyleSheet, View, Modal, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Button, Appbar, Icon, Checkbox, Chip, Text, Portal, Dialog } from 'react-native-paper';
import { checkBoxes, gunDataTemplate, gunRemarks } from "../lib/gunDataTemplate"
import * as SecureStore from "expo-secure-store"
import { useState} from "react"
import EditGun from "./EditGun"
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE, KEY_DATABASE } from '../configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { gunDeleteAlert } from '../lib/textTemplates';
import { printSingleGun } from '../functions/printToPDF';
import { GunType } from '../interfaces';


export default function Gun(){

    const [lightBoxIndex, setLightBoxIndex] = useState<number>(0)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)

    const { setSeeGunOpen, editGunOpen, setEditGunOpen, lightBoxOpen, setLightBoxOpen } = useViewStore()
    const { language, theme } = usePreferenceStore()
    const { currentGun, setCurrentGun, gunCollection, setGunCollection} = useGunStore()

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
            backgroundColor: theme.colors.background
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
        const index:number = gunCollection.indexOf(gun)
        const newCollection:GunType[] = gunCollection.toSpliced(index, 1)
        setGunCollection(newCollection)
        setSeeGunOpen()
    }

    return(
        <View style={{width: "100%", height: "100%", backgroundColor: theme.colors.background}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => setSeeGunOpen()} />
                <Appbar.Content title={`${currentGun.manufacturer} ${currentGun.model}`} />
                <Appbar.Action icon="printer" onPress={()=>printSingleGun(currentGun, language)} />
                <Appbar.Action icon="pencil" onPress={setEditGunOpen} />
            </Appbar>
        
            <View style={styles.container}>   
                <ScrollView style={{width: "100%"}}>
                    <View style={{backgroundColor: currentGun.mainColor}}>
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
                                        <TouchableNativeFeedback key={`slides_${index}`}>
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
                        <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", marginBottom: 10}}>
                            {currentGun.tags?.map((tag, index) =>{
                                return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                            })}
                        </View>
                        {gunDataTemplate.map((item, index)=>{
                            return(
                                <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>{item.name === "paidPrice" ? `CHF ${currentGun[item.name] ? currentGun[item.name] : ""}` : currentGun[item.name]}</Text>
                                    {item.name === "mainColor" ? 
                                        <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                            <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentGun.mainColor}`, transform:[{translateY: -5}]}}></View>
                                        </View> 
                                    : 
                                    null}
                                </View>
                            )
                        })}
                        <View style={{flex: 1, flexDirection: "column"}} >
                        {checkBoxes.map(checkBox=>{
                            return(
                                <Checkbox.Item key={checkBox.name} label={checkBox[language]} status={currentGun.status && currentGun.status[checkBox.name] ? "checked" : "unchecked"}/>
                            )
                        })}
                        </View>
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{gunRemarks[language]}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>{currentGun.remarks}</Text>
                        </View>
                    </View>
                    
                    <Modal visible={editGunOpen}>
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
                          {lightBoxOpen ? <ImageViewer isLightBox={true} selectedImage={currentGun.images[lightBoxIndex]}/> : null}
                        </View>
                    </Modal>       

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={()=>toggleDialogVisible(!dialogVisible)}>
                            <Dialog.Title>
                            {`${currentGun.model} ${gunDeleteAlert.title[language]}`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text>{`${gunDeleteAlert.subtitle[language]}`}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>deleteItem(currentGun)} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{gunDeleteAlert.yes[language]}</Button>
                                <Button onPress={()=>toggleDialogVisible(!dialogVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{gunDeleteAlert.no[language]}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>                  
                    
                    <View style={{width: "100%", display: "flex", flex: 1, flexDirection: "row", justifyContent:"center"}}>
                        <Button mode="contained" style={{width: "20%", backgroundColor: theme.colors.errorContainer, marginTop: 20}} onPress={()=>toggleDialogVisible(!dialogVisible)}>
                            <Icon source="delete" color={theme.colors.onErrorContainer} size={20}/>
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}