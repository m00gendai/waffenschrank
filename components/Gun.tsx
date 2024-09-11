import { StyleSheet, View, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Button, Appbar, Icon, Checkbox, Chip, Text, Portal, Dialog, Modal, IconButton } from 'react-native-paper';
import { checkBoxes, gunDataTemplate, gunRemarks } from "../lib/gunDataTemplate"
import * as SecureStore from "expo-secure-store"
import { useState} from "react"
import EditGun from "./EditGun"
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE, KEY_DATABASE } from '../configs_DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { cleanIntervals, gunDeleteAlert, iosWarningText } from '../lib/textTemplates';
import { printSingleGun } from '../functions/printToPDF';
import { GunType } from '../interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';
import { alarm, checkDate } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import { colord } from "colord";
import { defaultViewPadding } from '../configs';
import { GetColorName } from 'hex-color-to-color-name';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function Gun({navigation}){

    const [lightBoxIndex, setLightBoxIndex] = useState<number>(0)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)

    const { setSeeGunOpen, editGunOpen, setEditGunOpen, lightBoxOpen, setLightBoxOpen } = useViewStore()
    const { language, theme, generalSettings, caliberDisplayNameList } = usePreferenceStore()
    const { currentGun, setCurrentGun, gunCollection, setGunCollection} = useGunStore()

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
            backgroundColor: theme.colors.background
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

    async function deleteItem(gun:GunType){
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
        toggleDialogVisible(false)
        navigation.navigate("GunCollection")
    }

    function handleIosPrint(){
        toggleiosWarning(true)
    }

    function handlePrintPress(){
        toggleiosWarning(false)
        try{
            printSingleGun(currentGun, language, generalSettings.caliberDisplayName, caliberDisplayNameList)
        }catch(e){
            alarm("Print Single Gun Error", e)
        }
    }

    async function handleShareImage(img:string){
        console.log(img)
        await Sharing.shareAsync(img.includes(FileSystem.documentDirectory) ? img: `${FileSystem.documentDirectory}${img}`)
    }

    function checkColor(color:string){
        if(color.length === 9){
            return color.substring(0,8)
        }
        return color
    }

    function getShortCaliberName(calibers:string[]){
        const outputArray = calibers.map(item => {
            // Find an object where displayName matches the item
            const match = caliberDisplayNameList.find(obj => obj.name === item)
            // If a match is found, return the displayName, else return the original item
            return match ? match.displayName : item;
        });
        return outputArray
    }

    return(
        <View style={{flex: 1}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.navigate("GunCollection")} />
                <Appbar.Content title={`${currentGun.manufacturer !== undefined? currentGun.manufacturer : ""} ${currentGun.model}`} />
                <Appbar.Action icon="printer" onPress={()=>Platform.OS === "ios" ? handleIosPrint() : handlePrintPress()} />
                <Appbar.Action icon="pencil" onPress={()=>navigation.navigate("EditGun")} />
            </Appbar>
        
            <View style={styles.container}>   
                <ScrollView style={{width: "100%"}}>
                    <LinearGradient start={{x: 0.0, y:0.0}} end={{x: 1.0, y: 1.0}} colors={[currentGun.mainColor ? currentGun.mainColor : theme.colors.background, `${colord(currentGun.mainColor ? currentGun.mainColor : theme.colors.background).isDark() ? colord(currentGun.mainColor ? currentGun.mainColor : theme.colors.background).lighten(currentGun.mainColor ? 0.2: 0).toHex() : colord(currentGun.mainColor ? currentGun.mainColor : theme.colors.background).darken(currentGun.mainColor ? 0.2: 0).toHex()}`, currentGun.mainColor ? currentGun.mainColor : theme.colors.background]}>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10",}}>
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
                        </LinearGradient>
                    <View style={styles.data}>
                        <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", marginBottom: 10}}>
                            {currentGun.tags?.map((tag, index) =>{
                                return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                            })}
                        </View>
                        {gunDataTemplate.map((item, index)=>{
                            if(!generalSettings.emptyFields){
                                return(
                                    <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                        <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                        {Array.isArray(currentGun[item.name]) ?
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                            {currentGun[item.name] 
                                                ? item.name === "caliber" 
                                                    ? generalSettings.caliberDisplayName 
                                                        ? getShortCaliberName(currentGun.caliber).join("\n") 
                                                        : currentGun.caliber.join("\n")
                                                    : currentGun[item.name]
                                                : ""}
                                        </Text>
                                        :
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                            {item.name === "mainColor" ?  
                                                currentGun.mainColor ? GetColorName(`${checkColor(currentGun.mainColor).split("#")[1]}`) : "" 
                                            : item.name === "paidPrice" ? `CHF ${currentGun[item.name] ? currentGun[item.name] :  ""}` 
                                            : item.name === "marketValue" ? `CHF ${currentGun[item.name] ? currentGun[item.name] : ""}` 
                                            : item.name === "cleanInterval" && cleanIntervals[currentGun[item.name]] !== undefined ? cleanIntervals[currentGun[item.name]][language]
                                            : currentGun[item.name]}</Text>
                                        }
                                        {item.name === "lastCleanedAt" && checkDate(currentGun) ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <IconButton icon="spray-bottle" iconColor={theme.colors.error} /><IconButton icon="toothbrush" iconColor={theme.colors.error} />
                                            </View> 
                                        : 
                                        null}
                                        {item.name === "mainColor" ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentGun.mainColor}`, transform:[{translateY: -5}]}}>
                                                </View>
                                            </View> 
                                        : 
                                        null}
                                    </View>
                                )
                            } else if(currentGun[item.name] !== null && currentGun[item.name] !== undefined && currentGun[item.name] !== "" && currentGun[item.name].length !== 0){
                            return(
                                <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                    {Array.isArray(currentGun[item.name]) ?
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                       {currentGun[item.name] 
                                        ? item.name === "caliber" 
                                            ? generalSettings.caliberDisplayName 
                                                ? getShortCaliberName(currentGun.caliber).join("\n") 
                                                : currentGun.caliber.join("\n")
                                            : currentGun[item.name]
                                        : ""}
                                    </Text>
                                    :
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                        {item.name === "mainColor" ?  currentGun.mainColor ? GetColorName(`${checkColor(currentGun.mainColor).split("#")[1]}`) : ""
                                        : item.name === "paidPrice" ? `CHF ${currentGun[item.name] ? currentGun[item.name] : ""}` 
                                        : item.name === "marketValue" ? `CHF ${currentGun[item.name] ? currentGun[item.name] : ""}` 
                                        : item.name === "cleanInterval" && currentGun[item.name] !== undefined ? cleanIntervals[currentGun[item.name]] !== undefined ? cleanIntervals[currentGun[item.name]][language] : ""
                                        : currentGun[item.name]}</Text>
                                    }
                                    {item.name === "lastCleanedAt" && checkDate(currentGun) ? 
                                        <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                            <IconButton icon="spray-bottle" iconColor={theme.colors.error} /><IconButton icon="toothbrush" iconColor={theme.colors.error} />
                                        </View> 
                                    : 
                                    null}
                                    {item.name === "mainColor" ? 
                                        <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                            <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentGun.mainColor}`, transform:[{translateY: -5}]}}></View>
                                        </View> 
                                    : 
                                    null}
                                </View>
                            )
                                }
                        })}
                        <View style={{flex: 1, flexDirection: "column"}} >
                        {checkBoxes.map(checkBox=>{
                            return(
                                <Checkbox.Item mode="android" key={checkBox.name} label={checkBox[language]} status={currentGun.status && currentGun.status[checkBox.name] ? "checked" : "unchecked"}/>
                            )
                        })}
                        </View>
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{gunRemarks[language]}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>{currentGun.remarks}</Text>
                        </View>
                    </View>
                    
                    <Portal>
                        <Modal visible={lightBoxOpen} onDismiss={setLightBoxOpen}>
                            <View style={{width: "100%", height: "100%", padding: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: "green"}}>
                                <View style={{padding: 0, margin: 0, position: "absolute", top: defaultViewPadding, right: defaultViewPadding, left: defaultViewPadding, zIndex: 999, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                    <Pressable onPress={()=>handleShareImage(currentGun.images[lightBoxIndex])}><Icon source="share-variant" size={40} color={theme.colors.inverseSurface}/></Pressable>
                                    <Pressable onPress={setLightBoxOpen} ><Icon source="close-thick" size={40} color={theme.colors.inverseSurface}/></Pressable>
                                </View>
                                {lightBoxOpen ? <ImageViewer isLightBox={true} selectedImage={currentGun.images[lightBoxIndex]}/> : null}
                            </View>
                        </Modal>    
                    </Portal>   

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