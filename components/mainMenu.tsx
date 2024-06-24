import { Alert, ScrollView, TouchableNativeFeedback, View, Linking, Image } from "react-native"
import Animated, { LightSpeedInLeft, LightSpeedOutLeft } from "react-native-reanimated"
import { useViewStore } from "../stores/useViewStore"
import { ActivityIndicator, Button, Dialog, Divider, Icon, List, Modal, Portal, SegmentedButtons, Snackbar, Switch, Text } from "react-native-paper"
import { aboutText, aboutThanks, databaseImportAlert, databaseOperations, generalSettingsLabels, preferenceTitles, resizeImageAlert, toastMessages } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AMMO_DATABASE, A_KEY_DATABASE, A_TAGS, GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS, defaultViewPadding, languageSelection } from "../configs"
import { colorThemes } from "../lib/colorThemes"
import { useState } from "react"
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { AmmoType, GunType, Languages } from "../interfaces"
import * as SecureStore from "expo-secure-store"
import { useGunStore } from "../stores/useGunStore"
import { SafeAreaView } from "react-native-safe-area-context"
import { printAmmoCollection, printAmmoGallery, printGunCollection, printGunCollectionArt5, printGunGallery } from "../functions/printToPDF"
import { useAmmoStore } from "../stores/useAmmoStore"
import { useTagStore } from "../stores/useTagStore"
import * as Application from 'expo-application';
import { manipulateAsync } from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import {Picker} from '@react-native-picker/picker';
import Papa from 'papaparse';
import { ammoDataTemplate, ammoRemarks } from "../lib/ammoDataTemplate"
import { exampleAmmoEmpty } from "../lib/examples"
import { v4 as uuidv4 } from 'uuid';


export default function mainMenu(){

    const { setMainMenuOpen } = useViewStore()
    const { language, switchLanguage, theme, switchTheme, dbImport, setDbImport, setAmmoDbImport, generalSettings, setGeneralSettings } = usePreferenceStore()
    const { gunCollection } = useGunStore()
    const { ammoCollection, setAmmoCollection } = useAmmoStore()
    const {tags, setTags, ammo_tags, setAmmoTags, overWriteAmmoTags, overWriteTags} = useTagStore()

    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalVisible, setDbModalVisible] = useState<boolean>(false)
    const [dbModalText, setDbModalText] = useState<string>("")
    const [importGunDbVisible, toggleImportDunDbVisible] = useState<boolean>(false)
    const [importAmmoDbVisible, toggleImportAmmoDbVisible] = useState<boolean>(false)
    const [imageResizeVisible, toggleImageResizeVisible] = useState<boolean>(false)
    const [importCSVVisible, toggleImportCSVVisible] = useState<boolean>(false)
    const [importProgress, setImportProgress] = useState<number>(0)
    const [importSize, setImportSize] = useState<number>(0)
    const onToggleSnackBar = () => setToastVisible(!toastVisible);
    const onDismissSnackBar = () => setToastVisible(false);

    const [CSVHeader, setCSVHeader] = useState<string[]>([])
    const [CSVBody, setCSVBody] = useState<string[][]>([[]])
    const [mapCSV, setMapCSV] = useState<AmmoType>(exampleAmmoEmpty)

    const date: Date = new Date()
    const currentYear:number = date.getFullYear()

    

    async function handleThemeSwitch(color:string){
        switchTheme(color)
        const preferences:string = await AsyncStorage.getItem(PREFERENCES)
        const newPreferences:{[key:string] : string} = preferences == null ? {"theme": color} : {...JSON.parse(preferences), "theme":color} 
        await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
    }

    async function handleLanguageSwitch(lng:Languages){
        switchLanguage(lng)
        const preferences:string = await AsyncStorage.getItem(PREFERENCES)
        const newPreferences:{[key:string] : string} = preferences == null ? {"language": lng} : {...JSON.parse(preferences), "language":lng} 
        await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
    }

    async function handleSaveGunDb(){
        const fileName = `gunDB_${new Date().getTime()}.json`
        // ANDROID
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
        if(permissions.granted){
            setDbModalVisible(true)
            setImportSize(gunCollection.length)
            setDbModalText(databaseOperations.export[language])
            let directoryUri = permissions.directoryUri

            const exportableGunCollection:GunType[] = await Promise.all(gunCollection.map(async gun =>{
                if(gun.images !== null && gun.images.length !== 0){
                    const base64images:string[] = await Promise.all(gun.images?.map(async image =>{
                        const base64string:string = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
                        return base64string
                    }))
                    const exportableGun:GunType = {...gun, images: base64images}
                    setImportProgress(importProgress => importProgress+1)
                    return exportableGun
                } else {
                    setImportProgress(importProgress => importProgress+1)
                    return gun
                }
            }))
            

            let data = JSON.stringify(exportableGunCollection)
            const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/json")
            await FileSystem.writeAsStringAsync(fileUri, data, {encoding: FileSystem.EncodingType.UTF8})
            setDbModalVisible(false)
        }
    
        /*
        for iOS, use expo-share, Sharing.shareAsync(fileUri, fileNamea)
        */
        
        setSnackbarText(toastMessages.dbSaveSuccess[language])
        onToggleSnackBar()
        setImportProgress(0)
        setImportSize(0)
    }

    async function handleSaveAmmoDb(){
        const fileName = `ammoDB_${new Date().getTime()}.json`
        // ANDROID
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
        if(permissions.granted){
            setDbModalVisible(true)
            setImportSize(ammoCollection.length)
            setDbModalText(databaseOperations.export[language])
            let directoryUri = permissions.directoryUri

            const exportableAmmoCollection:AmmoType[] = await Promise.all(ammoCollection.map(async ammo =>{
                if(ammo.images !== null && ammo.images.length !== 0){
                    const base64images:string[] = await Promise.all(ammo.images?.map(async image =>{
                        const base64string:string = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
                        return base64string
                    }))
                    const exportableAmmo:AmmoType = {...ammo, images: base64images}
                    setImportProgress(importProgress => importProgress+1)
                    return exportableAmmo
                } else {
                    setImportProgress(importProgress => importProgress+1)
                    return ammo
                }
            }))
            

            let data = JSON.stringify(exportableAmmoCollection)
            const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/json")
            await FileSystem.writeAsStringAsync(fileUri, data, {encoding: FileSystem.EncodingType.UTF8})
            setDbModalVisible(false)
        }
    
        /*
        for iOS, use expo-share, Sharing.shareAsync(fileUri, fileNamea)
        */
        
        setSnackbarText(toastMessages.dbSaveSuccess[language])
        onToggleSnackBar()
        setImportProgress(0)
        setImportSize(0)
    }

    function sanitizeFileName(fileName) {
        // Define the forbidden characters for Windows, macOS, and Linux
        const forbiddenCharacters = /[\\/:*?"<>|]/g;
        
        // Replace forbidden characters with an underscore
        let sanitized = fileName.replace(forbiddenCharacters, '_');
        
        // Trim leading and trailing spaces and periods
        sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
        
        return sanitized;
    }

    const getImageSize = (base64ImageUri) => {
        return new Promise((resolve, reject) => {
            Image.getSize(base64ImageUri, (width, height) => {
                if (width && height) {
                    resolve({ width: width, height: height });
                } else {
                    reject({ width: 0, height: 0 });
                }
            });
        });
    };
  
    async function handleImportGunDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        if(!result.assets[0].name.startsWith("gunDB_")){
            setSnackbarText(toastMessages.wrongGunDbSelected[language])
            onToggleSnackBar()
            toggleImportDunDbVisible(false)
            return
        }
        toggleImportDunDbVisible(false)
        
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const guns:GunType[] = JSON.parse(content)
        setImportSize(guns.length)
        setImportProgress(0)
        setDbModalVisible(true)
        const importTags:{label:string, status:boolean}[] = []
        const importableGunCollection:GunType[] = await Promise.all(guns.map(async gun=>{
            if(gun.images !== null && gun.images.length !== 0){
                const base64images:string[] = await Promise.all(gun.images.map(async (image, index) =>{
                    const base64ImageUri = `data:image/jpeg;base64,${image}`;
                    const dimensions = await getImageSize(base64ImageUri) as {width: number, height: number}
                    // Resize the image
                    const resizedImage = dimensions.height !== 0 && dimensions.width !== 0 && generalSettings.resizeImages ? 
                        dimensions.width >= 1000 ? 
                            await manipulateAsync(
                                base64ImageUri,
                                [{ resize: dimensions.width >= 1000 ? {width: 1000} : {height: 1000}}], // Change dimensions as needed
                                { base64: true }
                            ) 
                        : dimensions.height >= 1000 ?
                            await manipulateAsync(
                                base64ImageUri,
                                [{ resize: dimensions.height >= 1000 ? {height: 1000} : {width: 1000}}], // Change dimensions as needed
                                { base64: true }
                            ) 
                        : 
                        await manipulateAsync(
                            base64ImageUri,
                            [{ resize: {width: dimensions.width, height: dimensions.height}}], // Change dimensions as needed
                            { base64: true }
                        ) 
                    : await manipulateAsync(
                        base64ImageUri,
                        [{ resize: {width: dimensions.width, height: dimensions.height}}], // Change dimensions as needed
                        { base64: true }
                    ) 

                    const base64Image = resizedImage.base64;
                    const fileUri = FileSystem.documentDirectory + `${sanitizeFileName(gun.id)}_image_${index}`;
                    await FileSystem.writeAsStringAsync(fileUri, base64Image, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    return fileUri
                }))
                const importableGun:GunType = {...gun, images: base64images}
                if(gun.tags !== undefined && gun.tags.length !== 0){
                    for(const tag of gun.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                setImportProgress(importProgress => importProgress+1)
                return importableGun
            } else {
                if(gun.tags !== undefined && gun.tags.length !== 0){
                    for(const tag in gun.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                setImportProgress(importProgress => importProgress+1)
                return gun
            }
        }))
        overWriteTags(importTags)
        await AsyncStorage.setItem(TAGS, JSON.stringify(importTags)) // Save the key object
        const allKeys:string = await AsyncStorage.getItem(KEY_DATABASE) // gets the object that holds all key values
        let newKeys:string[] = []
        
        importableGunCollection.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        setDbModalVisible(false)
        setImportProgress(0)
        setImportSize(0)
        setDbImport(new Date())  
        setSnackbarText(`${JSON.parse(content).length} ${toastMessages.dbImportSuccess[language]}`)
        onToggleSnackBar()
    }

    async function handleImportAmmoDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        if(!result.assets[0].name.startsWith("ammoDB_")){
            setSnackbarText(toastMessages.wrongAmmoDbSelected[language])
            onToggleSnackBar()
            toggleImportAmmoDbVisible(false)
            return
        }
        toggleImportAmmoDbVisible(false)
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const ammunitions:AmmoType[] = JSON.parse(content)
        setImportSize(ammunitions.length)
        setImportProgress(0)
        setDbModalVisible(true)
        const importTags:{label:string, status:boolean}[] = []
        const importableAmmoCollection:AmmoType[] = await Promise.all(ammunitions.map(async ammo=>{
            if(ammo.images !== null && ammo.images.length !== 0){
                const base64images:string[] = await Promise.all(ammo.images.map(async (image, index) =>{
                    const base64ImageUri = `data:image/jpeg;base64,${image}`;
                    const dimensions = await getImageSize(base64ImageUri) as {width: number, height: number}
                    // Resize the image
                    const resizedImage = dimensions.height !== 0 && dimensions.width !== 0 && generalSettings.resizeImages ? 
                        dimensions.width >= 1000 ? 
                            await manipulateAsync(
                                base64ImageUri,
                                [{ resize: dimensions.width >= 1000 ? {width: 1000} : {height: 1000}}], // Change dimensions as needed
                                { base64: true }
                            ) 
                        : dimensions.height >= 1000 ?
                            await manipulateAsync(
                                base64ImageUri,
                                [{ resize: dimensions.height >= 1000 ? {height: 1000} : {width: 1000}}], // Change dimensions as needed
                                { base64: true }
                            ) 
                        : 
                        await manipulateAsync(
                            base64ImageUri,
                            [{ resize: {width: dimensions.width, height: dimensions.height}}], // Change dimensions as needed
                            { base64: true }
                        ) 
                    : await manipulateAsync(
                        base64ImageUri,
                        [{ resize: {width: dimensions.width, height: dimensions.height}}], // Change dimensions as needed
                        { base64: true }
                    ) 

                    const base64Image = resizedImage.base64;
                    const fileUri = FileSystem.documentDirectory + `${sanitizeFileName(ammo.id)}_image_${index}`;
                    await FileSystem.writeAsStringAsync(fileUri, base64Image, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    return fileUri
                }))
                const importableAmmo:AmmoType = {...ammo, images: base64images}
                if(ammo.tags !== undefined && ammo.tags.length !== 0){
                    for(const tag of ammo.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                setImportProgress(importProgress => importProgress+1)
                return importableAmmo
            } else {
                if(ammo.tags !== undefined && ammo.tags.length !== 0){
                    for(const tag of ammo.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                setImportProgress(importProgress => importProgress+1)
                return ammo
            }
        }))
        overWriteAmmoTags(importTags)
        await AsyncStorage.setItem(A_TAGS, JSON.stringify(importTags)) // Save the key object
        const allKeys:string = await AsyncStorage.getItem(A_KEY_DATABASE) // gets the object that holds all key values
        let newKeys:string[] = []
        
        importableAmmoCollection.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(A_KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        setDbModalVisible(false)
        setImportProgress(0)
        setImportSize(0)
        setAmmoDbImport(new Date())  
        setSnackbarText(`${JSON.parse(content).length} ${toastMessages.dbImportSuccess[language]}`)
        onToggleSnackBar()
    }

    function handleSwitchesAlert(setting:string){
        if(setting === "resizeImages"){
            toggleImageResizeVisible(true)
                
        
        }
    }

    async function handleSwitches(setting: string){
        const newSettings = {...generalSettings, [setting]: !generalSettings[setting]}
            setGeneralSettings(newSettings)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"generalSettings": newSettings} : {...JSON.parse(preferences), "generalSettings": newSettings} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
        }

    async function importCSV(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        if(result.assets[0].mimeType !== "text/comma-separated-values"){
            return
        }
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        toggleImportCSVVisible(true)
        const parsed = Papa.parse(content)
        /*@ts-expect-error*/
        const headerRow:string[] = parsed.data[0]
        /*@ts-expect-error*/
        const bodyRows:string[][] = parsed.data.slice(1)
        setCSVHeader(headerRow)
        setCSVBody(bodyRows)    
    }

    function setImportedCSV(){
        const indexMapCSV = {}
        for(const entry of Object.entries(mapCSV)){
            indexMapCSV[entry[0]] = CSVHeader.indexOf(entry[1])
        }
        const objects = CSVBody.map((items, index)=>{
            const mapped = {}
            for(const entry of Object.entries(indexMapCSV)){
                
                if(entry[0] === "id"){
                    mapped[entry[0]] = uuidv4()  
                } else if(entry[0] === "tags"){
                    mapped[entry[0]] = []
                } else {
                    /*@ts-expect-error*/
                    mapped[entry[0]] = entry[1] === -1 ? "" : items[entry[1]]
                }
                
            }
            return mapped
        })
        setAmmoCollection(objects)
        toggleImportCSVVisible(false)
    }

    return(
        <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedOutLeft} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
            <SafeAreaView style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", backgroundColor: theme.colors.primary}}>
                <View style={{width: "100%", height: "100%", backgroundColor: theme.colors.background}}>
                    <TouchableNativeFeedback onPress={setMainMenuOpen}>
                        <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20, backgroundColor: theme.colors.primary}}>
                            <Icon source="arrow-left" size={20} color={theme.colors.onPrimary}/>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
                        <View style={{width: "100%", flex: 10}}>
                            <ScrollView>
                                <View style={{padding: defaultViewPadding, backgroundColor: theme.colors.primary}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onPrimary}}>{preferenceTitles.language[language]}</Text>
                                    <View style={{display: "flex", flexDirection: "row", gap: 0, flexWrap: "wrap", justifyContent: "center"}}>
                                        {languageSelection.map(langSelect =>{
                                            return <Button style={{borderRadius: 0, marginRight: -1, marginBottom: -1}} key={langSelect.code} buttonColor={language === langSelect.code ? theme.colors.primaryContainer : theme.colors.background} onPress={()=>handleLanguageSwitch(langSelect.code)} mode="outlined">{langSelect.flag}</Button>
                                        })}
                                    </View>
                                </View>
                                <Divider style={{height: 2, backgroundColor: theme.colors.primary}} />
                                <List.Accordion left={props => <><List.Icon {...props} icon="palette" /><List.Icon {...props} icon="brush" /></>} title={preferenceTitles.colors[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
                                            {Object.entries(colorThemes).map(colorTheme =>{
                                                return(    
                                                    <TouchableNativeFeedback onPress={()=>handleThemeSwitch(colorTheme[0])} key={colorTheme[0]}>
                                                        <View style={{elevation: 4, backgroundColor: colorTheme[1].background, borderColor: theme.name === colorTheme[0] ? colorTheme[1].primary : colorTheme[1].primaryContainer, borderWidth: theme.name === colorTheme[0] ? 5 : 0, paddingTop: 5, paddingBottom: 5, paddingLeft:2, paddingRight:2, width: "45%", height: 50, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10, marginBottom: 10, borderRadius: 30}}>
                                                        
                                                            <View style={{height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colorTheme[1].primaryContainer, borderBottomLeftRadius: 50, borderTopLeftRadius: 50}}>
                                                                <Text style={{color:colorTheme[1].onPrimaryContainer, fontSize: 10}}>A</Text>
                                                            </View>
                                                            <View style={{height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colorTheme[1].surfaceVariant}}>
                                                                <Text style={{color:colorTheme[1].onSurfaceVariant, fontSize: 10}}>B</Text>
                                                            </View>
                                                            <View style={{height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colorTheme[1].primary, borderBottomRightRadius: 50, borderTopRightRadius: 50}}>
                                                                <Text style={{color:colorTheme[1].onPrimary, fontSize: 10}}>C</Text>
                                                            </View>

                                                        </View>
                                                    </TouchableNativeFeedback>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="floppy" /><List.Icon {...props} icon="pistol" /></>} title={preferenceTitles.db_gun[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>handleSaveGunDb()} mode="contained">{preferenceTitles.saveDb_gun[language]}</Button>
                                            <Button style={{width: "45%"}} icon="application-import" onPress={()=>toggleImportDunDbVisible(true)} mode="contained">{preferenceTitles.importDb_gun[language]}</Button>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="floppy" /><List.Icon {...props} icon="bullet" /></>} title={preferenceTitles.db_ammo[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>handleSaveAmmoDb()} mode="contained">{preferenceTitles.saveDb_ammo[language]}</Button>
                                            <Button style={{width: "45%"}} icon="application-import" onPress={()=>toggleImportAmmoDbVisible(true)} mode="contained">{preferenceTitles.importDb_ammo[language]}</Button>
                                            <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>importCSV()} mode="contained">{`Import CSV`}</Button>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="printer" /><List.Icon {...props} icon="pistol" /></>} title={preferenceTitles.gunList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <Button style={{width: "45%"}} icon="table-large" onPress={()=>printGunCollection(gunCollection, language)} mode="contained">{preferenceTitles.printAllGuns[language]}</Button>
                                            <Button style={{width: "45%"}} icon="table-large" onPress={()=>printGunCollectionArt5(gunCollection, language)} mode="contained">{preferenceTitles.printArt5[language]}</Button>
                                            {/*<Button style={{width: "45%"}} icon="badge-account-outline" onPress={()=>printGunGallery(gunCollection, language)} mode="contained">{preferenceTitles.printGallery[language]}</Button>*/}

                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="printer" /><List.Icon {...props} icon="bullet" /></>} title={preferenceTitles.ammoList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <Button style={{width: "45%"}} icon="table-large" onPress={()=>printAmmoCollection(ammoCollection, language)} mode="contained">{preferenceTitles.printAllAmmo[language]}</Button>
                                          {/* <Button style={{width: "45%"}} icon="badge-account-outline" onPress={()=>printAmmoGallery(ammoCollection, language)} mode="contained">{preferenceTitles.printGallery[language]}</Button> */}
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="cog-outline" /><List.Icon {...props} icon="tune" /></>} title={preferenceTitles.generalSettings[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.displayImagesInListViewGun[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.displayImagesInListViewGun} onValueChange={()=>handleSwitches("displayImagesInListViewGun")} />
                                            </View>
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.displayImagesInListViewAmmo[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.displayImagesInListViewAmmo} onValueChange={()=>handleSwitches("displayImagesInListViewAmmo")} />
                                            </View>
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.resizeImages[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.resizeImages} onValueChange={()=>generalSettings.resizeImages ? handleSwitchesAlert("resizeImages") : handleSwitches("resizeImages")} />
                                            </View>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="application-brackets-outline" /><List.Icon {...props} icon="cellphone-information" /></>} title={preferenceTitles.about[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <Text>{aboutText[language]}</Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5}}/>
                                        <Text style={{color: theme.colors.onBackground}} >{`Version ${Application.nativeApplicationVersion}`}</Text>
                                        <Text style={{color: theme.colors.onBackground}} >{`© ${currentYear === 2024 ? currentYear : `2024 - ${currentYear}`} Marcel Weber`} </Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5}}/>
                                        <Text style={{color: theme.colors.onBackground}} >{aboutThanks[language]}</Text>
                                        <Text>- Michelle-Fabienne Weber-Meichtry</Text>
                                        <Text>- Jonas Hürlimann</Text>
                                    </View>
                                </List.Accordion>
                            </ScrollView>
                        </View>
                        <View style={{width: "100%", flex: 2, padding: 0, marginTop: 10, marginBottom: 10, elevation: 4, backgroundColor: theme.colors.primary}}>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
            <Snackbar
            visible={toastVisible}
                onDismiss={onDismissSnackBar}
                action={{
                label: 'OK',
                onPress: () => {
                    onDismissSnackBar()
                },
                }}>
                {snackbarText}
            </Snackbar>

            <Dialog visible={importGunDbVisible} onDismiss={()=>toggleImportDunDbVisible(false)}>
                    <Dialog.Title>
                    {`${databaseImportAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${databaseImportAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handleImportGunDb()} icon="application-import" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{databaseImportAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImportDunDbVisible(false)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{databaseImportAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={importAmmoDbVisible} onDismiss={()=>toggleImportAmmoDbVisible(false)}>
                    <Dialog.Title>
                    {`${databaseImportAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${databaseImportAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handleImportAmmoDb()} icon="application-import" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{databaseImportAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImportAmmoDbVisible(false)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{databaseImportAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={imageResizeVisible} onDismiss={()=>toggleImageResizeVisible(false)}>
                    <Dialog.Title>
                    {`${resizeImageAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${resizeImageAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>{
                            handleSwitches("resizeImages");
                            toggleImageResizeVisible(false);
                        }} icon="check" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{resizeImageAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImageResizeVisible(false)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{resizeImageAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

            <Modal visible={dbModalVisible}>
                <ActivityIndicator size="large" animating={true} />
                <Text variant="bodyLarge" style={{width: "100%", textAlign: "center", color: theme.colors.onBackground, marginTop: 10, backgroundColor: theme.colors.background}}>{`${dbModalText}: ${importProgress}/${importSize}`}</Text>
            </Modal>

            <Portal>
                <Modal visible={importCSVVisible}>
                    <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
                        <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                            <View style={{backgroundColor: theme.colors.background, width: "100%"}}>
                                <Text>Import Ammo CSV</Text>
                                <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%"}}>
                                    {ammoDataTemplate.map((ammoItem, ammoIndex)=>{
                                        return(
                                            <View key={`mapperRow_${ammoIndex}`} style={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center"}}>
                                                <Text style={{width: "50%"}}>{ammoItem.de}</Text>
                                                <Picker style={{width: "50%"}} selectedValue={mapCSV[ammoItem.name]} onValueChange={(itemValue, itemIndex) => setMapCSV({...mapCSV, [ammoItem.name]:itemValue})}>
                                                    <Picker.Item label={"-"} value={""}/>
                                                    {CSVHeader.map((item, index) => {
                                                        return(
                                                            <Picker.Item color={theme.colors.onBackground} key={`picker_${index}`} label={item} value={item} />
                                                        )
                                                    })}
                                                </Picker>
                                            </View>
                                        )
                                        })}
                                    <Text>{ammoRemarks.de}</Text>
                                     <Button onPress={()=>setImportedCSV()}>DO IT</Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Portal>

        </Animated.View> 
    )
}