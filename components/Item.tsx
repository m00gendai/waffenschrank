import { StyleSheet, View, ScrollView, Alert, TouchableNativeFeedback, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Button, Appbar, Icon, Checkbox, Chip, Text, Portal, Dialog, Modal, IconButton } from 'react-native-paper';
import { checkBoxes } from "../lib/gunDataTemplate"
import { useEffect, useState} from "react"
import ImageViewer from "./ImageViewer"
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useItemStore } from "../stores/useItemStore";
import { cleanIntervals, gunDeleteAlert, iosWarningText } from '../lib/textTemplates';
import { printSingleGun } from '../functions/printToPDF';
import { alarm, checkDate, getDeleteDialogTitle, getEntryTitle, getItemTemplate, getSchema } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import { colord } from "colord";
import { defaultViewPadding } from '../configs';
import { GetColorName } from 'hex-color-to-color-name';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { db } from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql } from 'drizzle-orm';
import { GunType, ItemTypes } from '../interfaces';

export default function Item({navigation, route}){

    const { itemType } = route.params
    const template = getItemTemplate(itemType)
    const remarks = getItemTemplate(itemType)

    const [lightBoxIndex, setLightBoxIndex] = useState<number>(0)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)

    const { lightBoxOpen, setLightBoxOpen, setHideBottomSheet } = useViewStore()
    const { language, theme, generalSettings, caliberDisplayNameList } = usePreferenceStore()
    const { currentItem, setCurrentItem } = useItemStore()

    const [iosWarning, toggleiosWarning] = useState<boolean>(false)

    const databaseEntry = getSchema(itemType)

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

    async function deleteItem(){
        await db.delete(databaseEntry).where(eq(databaseEntry.id, currentItem.id));
        toggleDialogVisible(false)
        if(itemType === "Gun"){
            navigation.navigate("GunCollection")
        }
        if(itemType === "Ammo"){
            navigation.navigate("AmmoCollection")
        }
        if(itemType === "Accessory_Optic"){
            navigation.navigate("AccessoryCollection_Optics")
        }
        if(itemType === "Accessory_Magazine"){
            navigation.navigate("AccessoryCollection_Magazines")
        }
        if(itemType === "Accessory_Silencer"){
            navigation.navigate("AccessoryCollection_Silencers")
        }
        if(itemType === "Accessory_Misc"){
            navigation.navigate("AccessoryCollection_Misc")
        }
    }

    function handleIosPrint(){
        toggleiosWarning(true)
    }

    function handlePrintPress(){
        toggleiosWarning(false)
        try{
            if(itemType === "Gun"){
                printSingleGun(currentItem as GunType, language, generalSettings.caliberDisplayName, caliberDisplayNameList)
            }
            
        }catch(e){
            alarm(`Print Single ${itemType} Error`, e)
        }
    }

    async function handleShareImage(img:string){
        await Sharing.shareAsync(img.includes(FileSystem.documentDirectory) ? img: `${FileSystem.documentDirectory}${img}`)
    }

    function handleBackAction(){    
        setHideBottomSheet(false)
        if (itemType === "Gun") {
            navigation.navigate("GunCollection")
            
        } 
        if (itemType === "Ammo"){
            navigation.navigate("AmmoCollection")
        
        }
        if(itemType === "Accessory_Optic"){
            navigation.navigate("AccessoryCollection_Optics")
        }
        if(itemType === "Accessory_Magazine"){
            navigation.navigate("AccessoryCollection_Magazines")
        }
        if(itemType === "Accessory_Silencer"){
            navigation.navigate("AccessoryCollection_Silencers")
        }
        if(itemType === "Accessory_Misc"){
            navigation.navigate("AccessoryCollection_Misc")
        }
    }


useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {

        setHideBottomSheet(false)
        return
    });

    return unsubscribe;
})

    function handleEditAction(){
        if(itemType === "Gun"){
            navigation.navigate("EditItem", {itemType: "Gun"})
        }
        if(itemType === "Ammo"){
            navigation.navigate("EditItem", {itemType: "Ammo"})
        }
        if(itemType === "Accessory_Optic"){
            navigation.navigate("EditItem", {itemType: "Accessory_Optic"})
        }
        if(itemType === "Accessory_Magazine"){
            navigation.navigate("EditItem", {itemType: "Accessory_Magazine"})
        }
        if(itemType === "Accessory_Silencer"){
            navigation.navigate("EditItem", {itemType: "Accessory_Silencer"})
        }
        if(itemType === "Accessory_Misc"){
            navigation.navigate("EditItem", {itemType: "Accessory_Misc"})
        }
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
                <Appbar.BackAction  onPress={() => handleBackAction()} />
                <Appbar.Content title={getEntryTitle(itemType, currentItem)} />
                <Appbar.Action icon="printer" onPress={()=>Platform.OS === "ios" ? handleIosPrint() : handlePrintPress()} />
                <Appbar.Action icon="pencil" onPress={()=>handleEditAction()} />
            </Appbar>
        
            <View style={styles.container}>   
                <ScrollView style={{width: "100%"}}>
                    {"mainColor" in currentItem ? <LinearGradient 
                        start={{x: 0.0, y:0.0}} 
                        end={{x: 1.0, y: 1.0}} 
                        colors={
                            [currentItem.mainColor ? 
                            currentItem.mainColor : 
                            theme.colors.background, 
                            `${colord(currentItem.mainColor ? 
                            currentItem.mainColor : 
                                theme.colors.background).isDark() ? 
                                    colord(currentItem.mainColor ? 
                                    currentItem.mainColor : 
                                    theme.colors.background).lighten(currentItem.mainColor ? 0.2: 0).toHex() :
                                colord(currentItem.mainColor ? 
                                    currentItem.mainColor : 
                                    theme.colors.background).darken(currentItem.mainColor ? 0.2: 0).toHex()}`, 
                            currentItem.mainColor ? currentItem.mainColor : theme.colors.background]}>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10",}}>
                            {Array.from(Array(5).keys()).map((_, index) =>{
                            
                                if(currentItem.images && index <= currentItem.images.length-1){
                                    return(
                                        <TouchableNativeFeedback key={`slides_${index}`} onPress={()=>showModal(index)}>
                                            <View style={styles.imageContainer} >
                                            <ImageViewer isLightBox={false} selectedImage={currentItem.images[index]} /> 
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                }      
                                if(!currentItem.images || currentItem.images.length === 0){
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
                        </LinearGradient> : null}
                    <View style={styles.data}>
                        <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", marginBottom: 10}}>
                            {currentItem.tags?.map((tag, index) =>{
                                return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                            })}
                        </View>
                        {template.map((item, index)=>{
                            if(!generalSettings.emptyFields){
                                return(
                                    <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                        <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                        {Array.isArray(currentItem[item.name]) ?
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                            {currentItem[item.name] 
                                                ? item.name === "caliber" 
                                                    ? generalSettings.caliberDisplayName 
                                                        ? getShortCaliberName(currentItem.caliber).join("\n") 
                                                        : currentItem.caliber.join("\n")
                                                    : currentItem[item.name]
                                                : ""}
                                        </Text>
                                        :
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                            {item.name === "mainColor" ?  
                                                currentItem.mainColor ? GetColorName(`${checkColor(currentItem.mainColor).split("#")[1]}`) : "" 
                                            : item.name === "paidPrice" ? `CHF ${currentItem[item.name] ? currentItem[item.name] :  ""}` 
                                            : item.name === "marketValue" ? `CHF ${currentItem[item.name] ? currentItem[item.name] : ""}` 
                                            : item.name === "cleanInterval" && currentItem[item.name] !== undefined ? cleanIntervals[currentItem[item.name]] !== undefined ? cleanIntervals[currentItem[item.name]][language] : ""
                                            : currentItem[item.name]}</Text>
                                        }
                                        {item.name === "lastCleanedAt" && checkDate(currentItem) ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <IconButton icon="spray-bottle" iconColor={theme.colors.error} /><IconButton icon="toothbrush" iconColor={theme.colors.error} />
                                            </View> 
                                        : 
                                        null}
                                        {item.name === "mainColor" ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentItem.mainColor}`, transform:[{translateY: -5}]}}>
                                                </View>
                                            </View> 
                                        : 
                                        null}
                                    </View>
                                )
                            } else if(currentItem[item.name] !== null && currentItem[item.name] !== undefined && currentItem[item.name] !== "" && currentItem[item.name].length !== 0){
                            return(
                                <View key={`${item.name}`} style={{flex: 1, flexDirection: "column"}} >
                                    <Text style={{width: "100%", fontSize: 12,}}>{`${item[language]}:`}</Text>
                                    {Array.isArray(currentItem[item.name]) ?
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                       {currentItem[item.name] 
                                        ? item.name === "caliber" 
                                            ? generalSettings.caliberDisplayName 
                                                ? getShortCaliberName(currentItem.caliber).join("\n") 
                                                : currentItem.caliber.join("\n")
                                            : currentItem[item.name]
                                        : ""}
                                    </Text>
                                    :
                                    <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                        {item.name === "mainColor" ?  currentItem.mainColor ? GetColorName(`${checkColor(currentItem.mainColor).split("#")[1]}`) : ""
                                        : item.name === "paidPrice" ? `CHF ${currentItem[item.name] ? currentItem[item.name] : ""}` 
                                        : item.name === "marketValue" ? `CHF ${currentItem[item.name] ? currentItem[item.name] : ""}` 
                                        : item.name === "cleanInterval" && currentItem[item.name] !== undefined ? cleanIntervals[currentItem[item.name]] !== undefined ? cleanIntervals[currentItem[item.name]][language] : ""
                                        : currentItem[item.name]}</Text>
                                    }
                                    {item.name === "lastCleanedAt" && checkDate(currentItem) ? 
                                        <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                            <IconButton icon="spray-bottle" iconColor={theme.colors.error} /><IconButton icon="toothbrush" iconColor={theme.colors.error} />
                                        </View> 
                                    : 
                                    null}
                                    {item.name === "mainColor" ? 
                                        <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                            <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentItem.mainColor}`, transform:[{translateY: -5}]}}></View>
                                        </View> 
                                    : 
                                    null}
                                </View>
                            )
                                }
                        })}
                        {itemType === "Gun"? <View style={{flex: 1, flexDirection: "column"}} >
                        {checkBoxes.map(checkBox=>{
                            return(
                                <Checkbox.Item mode="android" key={checkBox.name} label={checkBox[language]} status={currentItem[checkBox.name] ? "checked" : "unchecked"}/>
                            )
                        })}
                        </View> : null}
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{remarks[language]}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>{currentItem.remarks}</Text>
                        </View>
                    </View>
                    
                    <Portal>
                        <Modal visible={lightBoxOpen} onDismiss={setLightBoxOpen}>
                            <View style={{width: "100%", height: "100%", padding: 0, display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: "green"}}>
                                <View style={{padding: 0, margin: 0, position: "absolute", top: defaultViewPadding, right: defaultViewPadding, left: defaultViewPadding, zIndex: 999, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                    <Pressable onPress={()=>handleShareImage(currentItem.images[lightBoxIndex])}><Icon source="share-variant" size={40} color={theme.colors.inverseSurface}/></Pressable>
                                    <Pressable onPress={setLightBoxOpen} ><Icon source="close-thick" size={40} color={theme.colors.inverseSurface}/></Pressable>
                                </View>
                                {lightBoxOpen ? <ImageViewer isLightBox={true} selectedImage={currentItem.images[lightBoxIndex]}/> : null}
                            </View>
                        </Modal>    
                    </Portal>   

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={()=>toggleDialogVisible(!dialogVisible)}>
                            <Dialog.Title>
                            {`${getDeleteDialogTitle(currentItem, itemType, language)}`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text>{`${gunDeleteAlert.subtitle[language]}`}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>deleteItem()} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{gunDeleteAlert.yes[language]}</Button>
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