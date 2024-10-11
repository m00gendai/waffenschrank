import { ScrollView, TouchableNativeFeedback, View, Image, Platform, Dimensions } from "react-native"
import Animated, { LightSpeedInLeft, LightSpeedOutLeft } from "react-native-reanimated"
import { useViewStore } from "../stores/useViewStore"
import { ActivityIndicator, Button, Dialog, Divider, Icon, IconButton, List, Modal, Portal, Snackbar, Switch, Text, Tooltip } from "react-native-paper"
import { aboutText, aboutThanks, aboutThanksPersons, databaseImportAlert, databaseOperations, generalSettingsLabels, iosWarningText, loginGuardAlert, preferenceTitles, resizeImageAlert, statisticItems, toastMessages, tooltips } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { dateLocales, defaultViewPadding, languageSelection } from "../configs"
import { AMMO_DATABASE, A_KEY_DATABASE, A_TAGS, GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS } from "../configs_DB"
import { colorThemes } from "../lib/colorThemes"
import { useEffect, useState } from "react"
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { AmmoType, DBOperations, GunType, GunTypeStatus, Languages } from "../interfaces"
import * as SecureStore from "expo-secure-store"
import { useGunStore } from "../stores/useGunStore"
import { SafeAreaView } from "react-native-safe-area-context"
import { printAmmoCollection, printAmmoGallery, printGunCollection, printGunCollectionArt5, printGunGallery } from "../functions/printToPDF"
import { useAmmoStore } from "../stores/useAmmoStore"
import { useTagStore } from "../stores/useTagStore"
import * as Application from 'expo-application';
import { manipulateAsync } from "expo-image-manipulator"
import Papa from 'papaparse';
import { mainMenu_ammunitionDatabase, mainMenu_gunDatabase } from "../lib/Text/mainMenu_ammunitionDatabase"
import { useImportExportStore } from "../stores/useImportExportStore"
import CSVImportModal from "./CSVImportModal"
import { flatten, unflatten } from 'flat'
import { alarm, getImageSize, sanitizeFileName } from "../utils"
import * as SystemUI from "expo-system-ui"
import * as Sharing from 'expo-sharing';
import * as LocalAuthentication from 'expo-local-authentication';
import { Dirs, Util, FileSystem as fs } from 'react-native-file-access';
import { expo, db } from "../db/client"
import * as schema from "../db/schema"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"


export default function MainMenu({navigation}){

    const { data: gunCollection } = useLiveQuery(
        db.select().from(schema.gunCollection)
    )

    const { data: ammoCollection } = useLiveQuery(
        db.select().from(schema.ammoCollection)
    )

    const { setMainMenuOpen, toastVisible, setToastVisible, dbModalVisible, setDbModalVisible, imageResizeVisible, toggleImageResizeVisible, loginGuardVisible, toggleLoginGuardVisible, importCSVVisible, toggleImportCSVVisible, importModalVisible, toggleImportModalVisible } = useViewStore()
    const { language, switchLanguage, theme, switchTheme, setDbImport, setAmmoDbImport, generalSettings, setGeneralSettings, caliberDisplayNameList } = usePreferenceStore()

    const { overWriteAmmoTags, overWriteTags} = useTagStore()
    const { setCSVHeader, setCSVBody, importProgress, setImportProgress, resetImportProgress, importSize, setImportSize, resetImportSize, setDbCollectionType } = useImportExportStore()

    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalText, setDbModalText] = useState<string>("")
    const [dbOperation, setDbOperation] = useState<DBOperations | "">("")

    const [iosWarning, toggleiosWarning] = useState<boolean>(false)
    const [printerSrc, setPrinterSrc] = useState<null | "gunCollection" | "gunCollectionArt5" | "ammoCollection">(null)

    const onToggleSnackBar = () => setToastVisible(true);
    const onDismissSnackBar = () => {
        setToastVisible(false);
        resetImportProgress(0)
        resetImportSize(0)
    }

    const date: Date = new Date()
    const currentYear:number = date.getFullYear()

    async function handleThemeSwitch(color:string){
        switchTheme(color)
        SystemUI.setBackgroundColorAsync(colorThemes[color].background)
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

    function dbSaveSuccess(){
        setDbModalVisible()
        setSnackbarText(toastMessages.dbSaveSuccess[language])
        onToggleSnackBar()
        
    }

    function dbImportSuccess(data: DBOperations){
        setDbModalVisible()
        data === "import_arsenal_gun_db" ? setDbImport(new Date()) : data === "import_arsenal_gun_csv" ? setDbImport(new Date()) : setAmmoDbImport(new Date())
        setSnackbarText(`${importSize} ${toastMessages.dbImportSuccess[language]}`)
        onToggleSnackBar()
    }

    async function handleDbOperation(data: DBOperations | ""){
        setDbModalVisible()
        if(data === "save_arsenal_gun_db"){
            setImportSize(gunCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                if(Platform.OS === "android"){
                    await handleSaveGunDb().then(()=>{
                        dbSaveSuccess()
                    })
                }
                if(Platform.OS === "ios"){
                    await handleShareGunDb().then(async (res)=>{
                        await Sharing.shareAsync(res).then(()=>{
                            dbSaveSuccess()
                        })
                    })
                }
            }catch(e){
                alarm("DB ops error save_arsenal_gun_db", e)
            }
        }
        if(data === "save_arsenal_gun_csv"){
            setImportSize(gunCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                if(Platform.OS === "android"){
                    await exportCSV("save_arsenal_gun_csv").then(()=>{
                        dbSaveSuccess()
                    })
                }
                if(Platform.OS === "ios"){
                    await shareCSV("share_arsenal_gun_csv").then(async (res)=>{
                        await Sharing.shareAsync(res).then(()=>{
                            dbSaveSuccess()
                        })
                    })
                }
            }catch(e){
                alarm("DB ops error save_arsenal_gun_csv", e)
            }
        }
        if(data === "share_arsenal_gun_db"){
            setImportSize(gunCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                await handleShareGunDb().then(async (res)=>{
                    await Sharing.shareAsync(res).then(async ()=>{
                        dbSaveSuccess()
                        try{
                           await fs.unlink(res)
                        }catch(e){
                            alarm("shareGunDb unlinkTempFile", e)
                        }
                    })
                })
            }catch(e){
                alarm("DB ops error share_arsenal_gun_db", e)
            }
        }
        if(data === "share_arsenal_gun_csv"){
            setImportSize(gunCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                await shareCSV("share_arsenal_gun_csv").then(async (res)=>{
                    await Sharing.shareAsync(res).then(async ()=>{
                        dbSaveSuccess()
                        try{
                           await fs.unlink(res)
                        }catch(e){
                            alarm("shareGunCSV unlinkTempFile", e)
                        }
                    })
                })
            }catch(e){
                alarm("DB ops errorshare_arsenal_gun_csv", e)
            }
        }
        if(data === "save_arsenal_ammo_db"){
            setImportSize(ammoCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                if(Platform.OS === "android"){
                    await handleSaveAmmoDb().then(()=>{
                        dbSaveSuccess()
                    })
                }
                if(Platform.OS === "ios"){
                    await handleShareAmmoDb().then(async (res)=>{
                        await Sharing.shareAsync(res).then(()=>{
                            dbSaveSuccess()
                        })
                    })
                }
            }catch(e){
                alarm("DB ops error save_arsenal_ammo_db", e)
            }
        }
        if(data === "save_arsenal_ammo_csv"){
            setImportSize(ammoCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                if(Platform.OS === "android"){
                    await exportCSV("save_arsenal_ammo_csv").then(()=>{
                        dbSaveSuccess()
                    })
                }
                if(Platform.OS === "ios"){
                    await shareCSV("share_arsenal_ammo_csv").then(async (res)=>{
                        await Sharing.shareAsync(res).then(()=>{
                            dbSaveSuccess()
                        })
                    })
                }
            }catch(e){
                alarm("DB ops error save_arsenal_ammo_csv", e)
            }
        }
        if(data === "share_arsenal_ammo_db"){
            setImportSize(ammoCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                await handleShareAmmoDb().then(async (res)=>{
                    console.log(res)
                    await Sharing.shareAsync(res).then(async ()=>{
                        dbSaveSuccess()
                        try{
                           await fs.unlink(res)
                        }catch(e){
                            alarm("shareAmmoDB unlinkTempFile", e)
                        }
                    })
                })
            }catch(e){
                alarm("DB ops error share_arsenal_ammo_db", e)
            }
        }
        if(data === "share_arsenal_ammo_csv"){
            setImportSize(ammoCollection.length)
            setDbModalText(databaseOperations.export[language])
            try{
                await shareCSV("share_arsenal_ammo_csv").then(async (res)=>{
                    await Sharing.shareAsync(res).then(async ()=>{
                        dbSaveSuccess()
                        try{
                           await fs.unlink(res)
                        }catch(e){
                            alarm("shareAmmoCSV unlinkTempFile", e)
                        }
                    })
                })
            }catch(e){
                alarm("DB ops error share_arsenal_ammo_csv", e)
            }
        }
        if(data === "import_arsenal_gun_db"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await handleImportGunDb().then(()=>{
                    dbImportSuccess("import_arsenal_gun_db")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_gun_db", e)
            }
        }
        if(data === "import_arsenal_ammo_db"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await handleImportAmmoDb().then(()=>{
                    dbImportSuccess("import_arsenal_ammo_db")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_ammo_db", e)
            }
        }
        if(data === "import_arsenal_gun_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importArsenalGunCSV().then(()=>{
                    dbImportSuccess("import_arsenal_gun_csv")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_gun_csv", e)
            }
        }
        if(data === "import_arsenal_ammo_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importArsenalAmmoCSV().then(()=>{
                    dbImportSuccess("import_arsenal_ammo_csv")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_ammo_csv", e)
            }
        }
        if(data === "import_custom_gun_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importCSV(data).then(()=>{
                    dbImportSuccess("import_custom_gun_csv")
                })
            }catch(e){
                alarm("DB ops error import_custom_gun_csv", e)
            }
        }
        if(data === "import_custom_ammo_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importCSV(data).then(()=>{
                    dbImportSuccess("import_custom_ammo_csv")
                })
            }catch(e){
                alarm("DB ops error import_custom_ammo_csv", e)
            }
        }
    }

    async function handleDbImport(data:DBOperations | ""){
        setDbOperation(data)
        toggleImportModalVisible()
    }

    async function handleShareGunDb(){
        const fileName = `gunDB_${new Date().getTime()}.json`
        const collectionSize = gunCollection.length-1
        const cache = Dirs.CacheDir
        try{
            await fs.writeFile(`${cache}/${fileName}`, "[")
        }catch(e){
            alarm("shareGunDb createTempFile", e)
        }
        await Promise.all(gunCollection.map(async (gun, index) =>{
            if(gun.images !== null && gun.images.length !== 0){
                const base64images:string[] = await Promise.all(gun.images?.map(async image =>{
                    const base64string:string = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
                    return base64string
                }))
                const exportableGun:GunType = {...gun, images: base64images}
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(exportableGun) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("shareGunDb appendExportableGun", e)
                }
            } else {
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(gun) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("shareGunDb appendGun", e)
                }
            }
        }))
        try{
            await fs.appendFile(`${cache}/${fileName}`, "]")
        } catch(e){
            alarm("shareGunDb finishTempFile", e)
        }
        return `${FileSystem.cacheDirectory}/${fileName}`
    }

    async function handleShareAmmoDb(){
        const fileName = `ammoDB_${new Date().getTime()}.json`
        const collectionSize = ammoCollection.length-1
        const cache = Dirs.CacheDir
        try{
            await fs.writeFile(`${cache}/${fileName}`, "[")
        }catch(e){
            alarm("shareAmmoDb createTempFile", e)
        }
        await Promise.all(ammoCollection.map(async (ammo, index) =>{
            if(ammo.images !== null && ammo.images.length !== 0){
                const base64images:string[] = await Promise.all(ammo.images?.map(async image =>{
                    const base64string:string = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
                    return base64string
                }))
                const exportableAmmo:AmmoType = {...ammo, images: base64images}
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(exportableAmmo) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("shareAmmoDb appendExportableAmmo", e)
                }
            } else {
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(ammo) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("shareAmmoDb appendAmmo", e)
                }
            }
        }))
        try{
            await fs.appendFile(`${cache}/${fileName}`, "]")
        } catch(e){
            alarm("shareAmmoDb finishTempFile", e)
        }
        return `${FileSystem.cacheDirectory}/${fileName}`

    }

    async function shareCSV(data: DBOperations){
        const fileName = `${data === "share_arsenal_gun_csv" ? "gunCSV" : "ammoCSV"}_${new Date().getTime()}.csv`
        const flattened = data === "share_arsenal_gun_csv" ? gunCollection.map(item => {
            return flatten(item, {safe: true})
        }) : ammoCollection.map(item => {
            return flatten(item, {safe: true})
        })
        const csv = Papa.unparse(flattened)
        const fileUri = FileSystem.cacheDirectory + fileName
        await FileSystem.writeAsStringAsync(fileUri, csv, {encoding: FileSystem.EncodingType.UTF8})
        return fileUri
    }

    async function handleSaveGunDb(){
        const fileName = `gunDB_${new Date().getTime()}.json`
        const collectionSize = gunCollection.length-1
        const cache = Dirs.CacheDir
        try{
            await fs.writeFile(`${cache}/${fileName}`, "[")
        }catch(e){
            alarm("saveGunDb createTempFile", e)
        }
        await Promise.all(gunCollection.map(async (gun, index) =>{
            if(gun.images !== null && gun.images.length !== 0){
                const base64images:string[] = await Promise.all(gun.images?.map(async image =>{
                    const base64string:string = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
                    return base64string
                }))
                const exportableGun:GunType = {...gun, images: base64images}
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(exportableGun) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("saveGunDB appendExportableGun", e)
                }
            } else {
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(gun) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("saveGunDB appendGun", e)
                }
            }
        }))
        try{
            await fs.appendFile(`${cache}/${fileName}`, "]")
        } catch(e){
            alarm("saveGunDB finishTempFile", e)
        }
        try{
            await fs.cpExternal(`${cache}/${fileName}`, fileName, "downloads")
            
        } catch(e){
            alarm("saveGunDb moveTempFile", e)
        }
        try{
            await fs.unlink(`${cache}/${fileName}`)
        }catch(e){
            alarm("saveGunDb unlinkTempFile", e)
        }
    }

    async function handleSaveAmmoDb(){
        const fileName = `ammoDB_${new Date().getTime()}.json`
        const collectionSize = ammoCollection.length-1
        const cache = Dirs.CacheDir
        try{
            await fs.writeFile(`${cache}/${fileName}`, "[")
        }catch(e){
            alarm("saveAmmoDb createTempFile", e)
        }
        await Promise.all(ammoCollection.map(async (ammo, index) =>{
            if(ammo.images !== null && ammo.images.length !== 0){
                const base64images:string[] = await Promise.all(ammo.images?.map(async image =>{
                    const base64string:string = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${image.split("/").pop()}`, { encoding: 'base64' });
                    return base64string
                }))
                const exportableAmmo:AmmoType = {...ammo, images: base64images}
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(exportableAmmo) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("saveAmmoDb appendExportableAmmo", e)
                }
            } else {
                setImportProgress(importProgress+1)
                try{
                    await fs.appendFile(`${cache}/${fileName}`, JSON.stringify(ammo) + (collectionSize !== index ? ", " : ""))
                }catch(e){
                    alarm("saveAmmoDb appendAmmo", e)
                }
            }
        }))
        try{
            await fs.appendFile(`${cache}/${fileName}`, "]")
        } catch(e){
            alarm("saveAmmoDb finishTempFile", e)
        }
        try{
            await fs.cpExternal(`${cache}/${fileName}`, fileName, "downloads")
            
        } catch(e){
            alarm("saveAmmoDb moveTempFile", e)
        }
        try{
            await fs.unlink(`${cache}/${fileName}`)
        }catch(e){
            alarm("saveAmmoDb unlinkTempFile", e)
        }
    }

    async function handleImportGunDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        if(!result.assets[0].name.startsWith("gunDB_")){
            setSnackbarText(toastMessages.wrongGunDbSelected[language])
            onToggleSnackBar()
            toggleImportModalVisible()
            return
        }
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const guns:GunType[] = JSON.parse(content)
        setImportSize(guns.length)
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
                    const fileUri = FileSystem.documentDirectory + `${sanitizeFileName(gun.id)}_image_${index}.jpg`;
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
                setImportProgress(importProgress + 1)
                return importableGun
            } else {
                if(gun.tags !== undefined && gun.tags.length !== 0){
                    for(const tag in gun.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                setImportProgress(importProgress+1)
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
        try{
            await fs.unlink(result.assets[0].uri)
        }catch(e){
            alarm("importAmmoDB unlinkTempFile", e)
        }
    }

    async function handleImportAmmoDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        if(!result.assets[0].name.startsWith("ammoDB_")){
            setSnackbarText(toastMessages.wrongAmmoDbSelected[language])
            onToggleSnackBar()
            toggleImportModalVisible()
            return
        }
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const ammunitions:AmmoType[] = JSON.parse(content)
        setImportSize(ammunitions.length)
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
                    const fileUri = FileSystem.documentDirectory + `${sanitizeFileName(ammo.id)}_image_${index}.jpg`;
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
                setImportProgress(importProgress+1)
                return importableAmmo
            } else {
                if(ammo.tags !== undefined && ammo.tags.length !== 0){
                    for(const tag of ammo.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                setImportProgress(importProgress+1)
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
        try{
            await fs.unlink(result.assets[0].uri)
        }catch(e){
            alarm("importAmmoDB unlinkTempFile", e)
        }
    }

    async function handleSwitchesAlert(setting:string){
        if(setting === "resizeImages"){
            toggleImageResizeVisible()        
        }
        if(setting === "loginGuard"){
            const compatible = await LocalAuthentication.hasHardwareAsync();
            console.log(`compatible: ${compatible}`)
            const isEnrolled = await LocalAuthentication.isEnrolledAsync()
            console.log(`isEnrolled: ${isEnrolled}`)
            const getEnrolledLevel = await LocalAuthentication.getEnrolledLevelAsync()
            console.log(`getEnrolledLevel: ${getEnrolledLevel}`)
            if(!compatible){
                toggleLoginGuardVisible()
            }
            if(!isEnrolled){
                toggleLoginGuardVisible()
            }
            if(compatible && isEnrolled){
                handleSwitches("loginGuard")
            }
        }
    }

    async function handleSwitches(setting: string){
        const newSettings = {...generalSettings, [setting]: !generalSettings[setting]}
            setGeneralSettings(newSettings)
            console.log(newSettings)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"generalSettings": newSettings} : {...JSON.parse(preferences), "generalSettings": newSettings} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
        }
        
    async function importCSV(data: DBOperations){
        let result 
        
        try{
            result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }

        if(result.assets[0].mimeType !== "text/comma-separated-values" && result.assets[0].mimeType !== "text/csv"){
            throw("Non CSV file format detected")
        }
    }catch(e){
        alarm("Custom CSV Import Error", e)
        return
    }
    try{
        const content:string = await FileSystem.readAsStringAsync(result.assets[0].uri)
        toggleImportCSVVisible()
        const parsed:Papa.ParseResult<string[]> = Papa.parse(content)
        const headerRow:string[] = parsed.data[0]
        const filteredForEmptyRow:string[][] = parsed.data.filter(item => !(item.length === 1 && item[0] === ""))
        const bodyRows:string[][] = filteredForEmptyRow.toSpliced(0, 1)
        setCSVHeader(headerRow)
        setCSVBody(bodyRows)    
        setDbCollectionType(data)
    }catch(e){
        alarm("Custom CSV Import File Error", e)
    }
    }

    async function exportCSV(data: DBOperations){
        const flattened = data === "save_arsenal_gun_csv" ? gunCollection.map(item => {
            return flatten(item, {safe: true})
        }) : ammoCollection.map(item => {
            return flatten(item, {safe: true})
        })
        const csv = Papa.unparse(flattened)
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
        if(permissions.granted){
            let directoryUri = permissions.directoryUri
            const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, data === "save_arsenal_gun_csv" ? "gunDB.csv" : "ammoDB.csv", "text/csv")
            await FileSystem.writeAsStringAsync(fileUri, csv, {encoding: FileSystem.EncodingType.UTF8})
        }
    }

    async function importArsenalGunCSV(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        const content:string = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const parsed = Papa.parse(content, {header: true})
        // The errors are due to GunType expecting string[], but the parsed content is only a string. Maybe a type ImportableGunType[] should be created.
        const unflat:GunType[] = parsed.data.map(item => {
            const unitem:GunType = unflatten(item)
            /*@ts-expect-error*/
            const filterEmptyImages:string[] = unitem.images.split(",")
            /*@ts-expect-error*/
            const filterEmptyTags:string[] = unitem.tags === undefined ? [] : unitem.tags === "" ? [] : unitem.tags.split(",")
            /*@ts-expect-error*/
            const multiCal:string = unitem.caliber.split(",").join("\n")
            let filterStatus = {exFullAuto: false, fullAuto: false, highCapacityMagazine: false, short: false}
            Object.entries(unitem.status).map(item => {
                filterStatus = {...filterStatus, [item[0]]: item[1] === "" ? false : item[1] === "false" ? false : true}
            })            
            /*@ts-expect-error*/
            const readyItem:GunType = {...unitem, images: filterEmptyImages, tags: filterEmptyTags, status:filterStatus, caliber: multiCal}
            return readyItem
        })
        setGunCollection(unflat)
        let newKeys:string[] = []
        
        unflat.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
    }

    async function importArsenalAmmoCSV(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        const content:string = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const parsed = Papa.parse(content, {header: true})
        // The errors are due to AmmoType expecting string[], but the parsed content is only a string. Maybe a type ImportableAmmoType[] should be created.
        const unflat:AmmoType[] = parsed.data.map(item => {
            const unitem:AmmoType = unflatten(item)
            /*@ts-expect-error*/
            const filterEmptyImages:string[] = unitem.images.split(",")
            /*@ts-expect-error*/
            const filterEmptyTags:string[] = unitem.tags === undefined ? [] : unitem.tags === "" ? [] : unitem.tags.split(",")        
            const readyItem:AmmoType = {...unitem, images: filterEmptyImages, tags: filterEmptyTags}
            return readyItem
        })
        setAmmoCollection(unflat)
        let newKeys:string[] = []
        
        unflat.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(A_KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
    }

    useEffect(()=>{
        const trigger = navigation.addListener("focus", function(){
            setMainMenuOpen()
        })
        return trigger
    },[navigation])

    useEffect(()=>{
        const trigger = navigation.addListener("blur", function(){
            setMainMenuOpen()
        })
        return trigger
    },[navigation])

    function getStatistics(type){

        switch(type){
            case "guns":
                return gunCollection.length
            case "gunPrice":
                return gunCollection.reduce((acc, curr) => {
                    return acc + (curr.paidPrice !== undefined ? Number(curr.paidPrice) : 0);
                }, 0)
            case "gunValue":
                return gunCollection.reduce((acc, curr) => {
                    return acc + (curr.marketValue !== undefined ? Number(curr.marketValue) : 0);
                }, 0)
            case "ammo":
                return ammoCollection.length
            case "totalStock":
                return ammoCollection.reduce((acc, curr) => {
                    return acc + (curr.currentStock !== undefined ? Number(curr.currentStock) : 0);
                }, 0)
        }
    }

    async function handleIOSprints(printer: "gunCollection" | "gunCollectionArt5" | "ammoCollection"){
        setPrinterSrc(printer)
        toggleiosWarning(true)
    }

    async function handlePrints(printer: null | "gunCollection" | "gunCollectionArt5" | "ammoCollection"){
        if(printer === null){
            return
        }
        toggleiosWarning(false)
        console.log(printer)
        console.log("Im printing tables!")
        switch(printer){
            case "gunCollection":
                try{
                    console.log("Im printing gun collection!")
                await printGunCollection(language, generalSettings.caliberDisplayName, caliberDisplayNameList);
                return
                } catch(e){
                    alarm("printGunCollection Error", e)
                }
            case "gunCollectionArt5":
                try{
                    console.log("Im printing gun collection art 5!")
                   await printGunCollectionArt5(language, generalSettings.caliberDisplayName, caliberDisplayNameList);
                    return
                } catch(e){
                    alarm("printGunCollectioNArt5 Error", e)
                }
            case "ammoCollection":
                try{
                    console.log("Im printing ammo collection!")
                   await printAmmoCollection(language, generalSettings.caliberDisplayName, caliberDisplayNameList);
                    return
                } catch(e){
                    alarm("printAmmoCollection Error", e)
                }
                
        }
    }
    

    return(
        
           <View style={{height: "100%", width: Dimensions.get("window").width > Dimensions.get("window").height ? "60%" : "100%"}}>
                <View style={{width: "100%", height: "100%"}}>
                    <TouchableNativeFeedback onPress={()=>navigation.goBack()}>
                        <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20, backgroundColor: theme.colors.primary}}>
                            <Icon source="arrow-left" size={20} color={theme.colors.onPrimary}/>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
                        <View style={{width: "100%", flex: 15}}>
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
                                    <View style={{marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
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
                                <List.Accordion left={props => <><List.Icon {...props} icon="database-outline" /><List.Icon {...props} icon="pistol" /></>} title={preferenceTitles.db_gun[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.saveArsenalDB[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_gun_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.shareArsenalDB[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_gun_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.saveArsenalCSV[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.shareArsenalCSV[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.importArsenalDB[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_gun_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.importCustomCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_custom_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.importArsenalCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>                                        
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="database-outline" /><List.Icon {...props} icon="bullet" /></>} title={preferenceTitles.db_ammo[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.saveArsenalDB[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_ammo_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.shareArsenalDB[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_ammo_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.saveArsenalCSV[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.shareArsenalCSV[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.importArsenalDB[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_ammo_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.importCustomCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_custom_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.importArsenalCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>            
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="printer" /><List.Icon {...props} icon="pistol" /></>} title={preferenceTitles.gunList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{preferenceTitles.printAllGuns[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="table-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="table-large" onPress={()=>Platform.OS === "ios" ? handleIOSprints("gunCollection") : handlePrints("gunCollection")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>   
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{preferenceTitles.printArt5[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="table-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="table-large" onPress={()=>Platform.OS === "ios" ? handleIOSprints("gunCollectionArt5") : handlePrints("gunCollectionArt5")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>   
                                            {/*<Button style={{width: "45%"}} icon="badge-account-outline" onPress={()=>printGunGallery(gunCollection, language)} mode="contained">{preferenceTitles.printGallery[language]}</Button>*/}

                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="printer" /><List.Icon {...props} icon="bullet" /></>} title={preferenceTitles.ammoList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{preferenceTitles.printAllAmmo[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="table-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="table-large" onPress={()=>Platform.OS === "ios" ? handleIOSprints("ammoCollection") : handlePrints("ammoCollection")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>   
                                           {/* <Button style={{width: "45%"}} icon="badge-account-outline" onPress={()=>printAmmoGallery(ammoCollection, language)} mode="contained">{preferenceTitles.printGallery[language]}</Button> */}
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="cog-outline" /><List.Icon {...props} icon="tune" /></>} title={preferenceTitles.generalSettings[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.displayImagesInListViewGun[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.displayImagesInListViewGun} onValueChange={()=>handleSwitches("displayImagesInListViewGun")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.displayImagesInListViewAmmo[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.displayImagesInListViewAmmo} onValueChange={()=>handleSwitches("displayImagesInListViewAmmo")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.emptyFields[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.emptyFields} onValueChange={()=>handleSwitches("emptyFields")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.caliberDisplayName[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.caliberDisplayName} onValueChange={()=>handleSwitches("caliberDisplayName")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.resizeImages[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.resizeImages} onValueChange={()=>generalSettings.resizeImages ? handleSwitchesAlert("resizeImages") : handleSwitches("resizeImages")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.loginGuard[language]}</Text>
                                                <Switch style={{flex: 3}} value={generalSettings.loginGuard} onValueChange={()=>handleSwitchesAlert("loginGuard")} />
                                            </View>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="chart-box-outline" /><List.Icon {...props} icon="chart-arc" /></>} title={preferenceTitles.statistics[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.gunCount[language]}`}</Text><Text>{`${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("guns"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.gunPrice[language]}`}</Text><Text>{`CHF ${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("gunPrice"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.gunValue[language]}`}</Text><Text>{`CHF ${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("gunValue"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.ammoCount[language]}`}</Text><Text>{`${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("ammo"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.roundCount[language]}`}</Text><Text>{`${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("totalStock"))}`}</Text></View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="application-brackets-outline" /><List.Icon {...props} icon="cellphone-information" /></>} title={preferenceTitles.about[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <Text>{aboutText[language]}</Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                        <Text style={{color: theme.colors.onBackground}} >{`Version ${Application.nativeApplicationVersion}`}</Text>
                                        <Text style={{color: theme.colors.onBackground}} >{`© ${currentYear === 2024 ? currentYear : `2024 - ${currentYear}`} Marcel Weber`} </Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                        <Text style={{color: theme.colors.onBackground}} >{aboutThanks[language]}</Text>
                                        <Text>{`- ${aboutThanksPersons.michelle[language]}`}</Text>
                                        <Text>{`- ${aboutThanksPersons.jonas[language]}`}</Text>
                                        <Text>{`- ${aboutThanksPersons.waffenforum[language]}`}</Text>
                                        <Text>{`- ${aboutThanksPersons.others[language]}`}</Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                        <Text>Splash & Icon: Designed by dgim-studio / Freepik</Text>
                                    </View>
                                </List.Accordion>
                            </ScrollView>
                        </View>
                        <View style={{width: "100%", flex: 1, padding: 0, marginTop: 10, marginBottom: 10, elevation: 4, backgroundColor: theme.colors.primary}}>
                        </View>
                    </View>
                </View>
           
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

            <Dialog visible={importModalVisible} onDismiss={()=>toggleImportModalVisible()}>
                    <Dialog.Title>
                    {`${databaseImportAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${databaseImportAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handleDbOperation(dbOperation)} icon="application-import" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{databaseImportAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImportModalVisible()} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{databaseImportAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={imageResizeVisible} onDismiss={()=>toggleImageResizeVisible()}>
                    <Dialog.Title>
                    {`${resizeImageAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${resizeImageAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>{
                            handleSwitches("resizeImages");
                            toggleImageResizeVisible();
                        }} icon="check" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{resizeImageAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImageResizeVisible()} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{resizeImageAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={loginGuardVisible} onDismiss={()=>toggleLoginGuardVisible()}>
                    <Dialog.Title>
                    {`${loginGuardAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${loginGuardAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>toggleLoginGuardVisible()} icon="emoticon-frown-outline" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{loginGuardAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

            <Portal>
               {importCSVVisible ? <CSVImportModal /> : null} 
            </Portal>

            <Modal visible={dbModalVisible}>
                <ActivityIndicator size="large" animating={true} />
                <Text variant="bodyLarge" style={{width: "100%", textAlign: "center", color: theme.colors.onBackground, marginTop: 10, backgroundColor: theme.colors.background}}>{`${dbModalText}: ${importProgress}/${importSize}`}</Text>
            </Modal>

            <Dialog visible={iosWarning} onDismiss={()=>toggleiosWarning(false)}>
                    <Dialog.Title>
                    {iosWarningText.title[language]}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{iosWarningText.text[language]}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handlePrints(printerSrc)} icon="heart" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{iosWarningText.ok[language]}</Button>
                        <Button onPress={()=>toggleiosWarning(false)} icon="heart-broken" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{iosWarningText.cancel[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

            </View>
    )
}