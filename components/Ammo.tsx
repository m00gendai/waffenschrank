import { StyleSheet, View, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Button, Appbar, Icon, Chip, Text, Dialog, Portal, Modal} from 'react-native-paper';
import { ammoDataTemplate, ammoRemarks } from "../lib/ammoDataTemplate"
import * as SecureStore from "expo-secure-store"
import { useState} from "react"
import EditAmmo from "./EditAmmo"
import ImageViewer from "./ImageViewer"
import { AMMO_DATABASE, A_KEY_DATABASE } from '../configs_DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import { ammoDeleteAlert, iosWarningText } from '../lib/textTemplates';
import { printSingleAmmo, printSingleGun } from '../functions/printToPDF';
import { AmmoType } from '../interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';
import { defaultViewPadding } from '../configs';
import { alarm } from '../utils';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';


export default function Ammo({navigation}){

    const [lightBoxIndex, setLightBoxIndex] = useState<number>(0)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)

    const { setSeeAmmoOpen, editAmmoOpen, setEditAmmoOpen, lightBoxOpen, setLightBoxOpen } = useViewStore()
    const { language, theme, generalSettings, caliberDisplayNameList } = usePreferenceStore()
    const { currentAmmo, setCurrentAmmo, ammoCollection, setAmmoCollection } = useAmmoStore()

    const [iosWarning, toggleiosWarning] = useState<boolean>(false)

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
            aspectRatio: "21/10",
            flexDirection: "row",
            flex: 1,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center"
        },
        data: {
            flex: 1,
            height: "100%",
            width: "100%",
            marginTop: 10
        },
    })

    async function deleteItem(ammo:AmmoType){
        // Deletes ammo in gun database
        await SecureStore.deleteItemAsync(`${AMMO_DATABASE}_${ammo.id}`)

        // retrieves ammo ids from key database and removes the to be deleted id
        const keys:string = await AsyncStorage.getItem(A_KEY_DATABASE)
        const keyArray: string[] = JSON.parse(keys)
        const newKeys: string[] = keyArray.filter(key => key != ammo.id)
        AsyncStorage.setItem(A_KEY_DATABASE, JSON.stringify(newKeys))
        const index:number = ammoCollection.indexOf(ammo)
        const newCollection:AmmoType[] = ammoCollection.toSpliced(index, 1)
        setAmmoCollection(newCollection)
        toggleDialogVisible(false)
        navigation.navigate("AmmoCollection")
    }

    function handleIosPrint(){
        toggleiosWarning(true)
    }

    function handlePrintPress(){
        toggleiosWarning(false)
        try{
            printSingleAmmo(currentAmmo, language, generalSettings.caliberDisplayName, caliberDisplayNameList)
        }catch(e){
            alarm("Print Single Ammo Error", e)
        }
    }

    async function handleShareImage(img:string){
        console.log(img)
        await Sharing.shareAsync(img.includes(FileSystem.documentDirectory) ? img: `${FileSystem.documentDirectory}${img}`)
    }

    function getShortCaliberName(caliber:string){
        const match = caliberDisplayNameList.find(obj => obj.name === caliber)
        // If a match is found, return the displayName, else return the original item
        return match ? match.displayName : caliber;
    }

    return(
        <View style={{flex: 1}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.navigate("AmmoCollection")} />
                <Appbar.Content title={`${currentAmmo.designation} ${currentAmmo.manufacturer !== undefined? currentAmmo.manufacturer : ""}`} />
                <Appbar.Action icon="printer" onPress={()=>Platform.OS === "ios" ? handleIosPrint() : handlePrintPress()} />
                <Appbar.Action icon="pencil" onPress={()=>navigation.navigate("EditAmmo")} />
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
                            if(!generalSettings.emptyFields){
                                return(
                                    <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                        <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                        {currentAmmo[item.name] 
                                                ? item.name === "caliber" 
                                                    ? generalSettings.caliberDisplayName 
                                                        ? getShortCaliberName(currentAmmo.caliber)
                                                        : currentAmmo.caliber
                                                    : currentAmmo[item.name]
                                                : ""}
                                        </Text>
                                    </View>
                                )
                            } else if(currentAmmo[item.name] !== null && currentAmmo[item.name] !== undefined && currentAmmo[item.name] !== "" && currentAmmo[item.name].length !== 0){
                            return(
                                <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                    {currentAmmo[item.name] 
                                                ? item.name === "caliber" 
                                                    ? generalSettings.caliberDisplayName 
                                                        ? getShortCaliberName(currentAmmo.caliber)
                                                        : currentAmmo.caliber
                                                    : currentAmmo[item.name]
                                                : ""}
                                    </Text>
                                </View>
                            )
                            }
                        })}
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{ammoRemarks[language]}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>{currentAmmo.remarks}</Text>
                        </View>
                    </View>
                    
                    <Portal>
                        <Modal visible={lightBoxOpen} onDismiss={setLightBoxOpen}>
                            <View style={{width: "100%", height: "100%", padding: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: "green"}}>
                            <View style={{padding: 0, margin: 0, position: "absolute", top: defaultViewPadding, right: defaultViewPadding, left: defaultViewPadding, zIndex: 999, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                    <Pressable onPress={()=>handleShareImage(currentAmmo.images[lightBoxIndex])}><Icon source="share-variant" size={40} color={theme.colors.inverseSurface}/></Pressable>
                                    <Pressable onPress={setLightBoxOpen} ><Icon source="close-thick" size={40} color={theme.colors.inverseSurface}/></Pressable>
                                </View>
                                {lightBoxOpen ? <ImageViewer isLightBox={true} selectedImage={currentAmmo.images[lightBoxIndex]}/> : null}
                            </View>
                        </Modal>    
                    </Portal>   

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={()=>toggleDialogVisible(!dialogVisible)}>
                            <Dialog.Title>
                            {`${currentAmmo.designation} ${ammoDeleteAlert.title[language]}`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text>{`${ammoDeleteAlert.subtitle[language]}`}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>deleteItem(currentAmmo)} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{ammoDeleteAlert.yes[language]}</Button>
                                <Button onPress={()=>toggleDialogVisible(!dialogVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{ammoDeleteAlert.no[language]}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>               
                    
                    <View style={{width: "100%", display: "flex", flex: 1, flexDirection: "row", justifyContent:"center"}}>
                        <Button mode="contained" style={{width: "20%", backgroundColor: theme.colors.errorContainer, marginTop: 20}} onPress={()=>toggleDialogVisible(!dialogVisible)}>
                            <Icon source="delete" size={20} color={theme.colors.onErrorContainer}/>
                        </Button>
                    </View>
                </ScrollView>
            </View>
            
            <Dialog visible={iosWarning} onDismiss={()=>toggleiosWarning(false)}>
                    <Dialog.Title>
                    {iosWarningText.title[language]}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{iosWarningText.text[language]}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handlePrintPress()} icon="heart" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{iosWarningText.ok[language]}</Button>
                        <Button onPress={()=>toggleiosWarning(false)} icon="heart-broken" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{iosWarningText.cancel[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

        </View>
    )
}