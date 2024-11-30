import { Platform, ScrollView, View } from "react-native";
import { List, Snackbar, Text } from "react-native-paper";
import { usePreferenceStore } from "../stores/usePreferenceStore";
import { useViewStore } from "../stores/useViewStore";
import { useImportExportStore } from "../stores/useImportExportStore";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";
import { AmmoType, DBOperations, GunType } from "../interfaces";
import { databaseOperations, toastMessages } from "../lib/textTemplates";
import * as Sharing from 'expo-sharing';
import { expo, db } from "../db/client"
import * as schema from "../db/schema"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { alarm, sanitizeFileName } from "../utils";
import { Dirs, Util, FileSystem as fs } from 'react-native-file-access';
import { flatten, unflatten } from 'flat'
import Papa from 'papaparse';
import { manipulateAsync } from "expo-image-manipulator";


export function ImportExport(){

    const { data: settingsData } = useLiveQuery(
        db.select().from(schema.settings)
    )

    const { data: gunCollection } = useLiveQuery(
        db.select().from(schema.gunCollection)
    )

    const { data: ammoCollection } = useLiveQuery(
        db.select().from(schema.ammoCollection)
    )

    const { language, switchLanguage, theme, switchTheme, caliberDisplayNameList } = usePreferenceStore()
    const { setMainMenuOpen, toastVisible, setToastVisible, dbModalVisible, setDbModalVisible, imageResizeVisible, toggleImageResizeVisible, loginGuardVisible, toggleLoginGuardVisible, importCSVVisible, toggleImportCSVVisible, importModalVisible, toggleImportModalVisible } = useViewStore()
    const { setCSVHeader, setCSVBody, importProgress, setImportProgress, resetImportProgress, importSize, setImportSize, resetImportSize, setDbCollectionType } = useImportExportStore()

    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalText, setDbModalText] = useState<string>("")
    const [dbOperation, setDbOperation] = useState<DBOperations | "">("")

    const onToggleSnackBar = () => setToastVisible(true);
    const onDismissSnackBar = () => {
        setToastVisible(false);
        resetImportProgress(0)
        resetImportSize(0)
    }


    function dbSaveSuccess(){
        setDbModalVisible()
        setSnackbarText(toastMessages.dbSaveSuccess[language])
        onToggleSnackBar()
        
    }


    function dbImportSuccess(size: number, data: DBOperations){
        setDbModalVisible()
        setSnackbarText(`${size} ${toastMessages.dbImportSuccess[language]}`)
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
                await handleImportGunDb().then((size)=>{
                    dbImportSuccess(size, "import_arsenal_gun_db")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_gun_db", e)
            }
        }
        if(data === "import_arsenal_ammo_db"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await handleImportAmmoDb().then((size)=>{
                    dbImportSuccess(size, "import_arsenal_ammo_db")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_ammo_db", e)
            }
        }
        if(data === "import_arsenal_gun_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importArsenalGunCSV().then((size)=>{
                    dbImportSuccess(size, "import_arsenal_gun_csv")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_gun_csv", e)
            }
        }
        if(data === "import_arsenal_ammo_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importArsenalAmmoCSV().then((size)=>{
                    dbImportSuccess(size, "import_arsenal_ammo_csv")
                })
            }catch(e){
                alarm("DB ops error import_arsenal_ammo_csv", e)
            }
        }
        if(data === "import_custom_gun_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importCSV(data).then((size)=>{
                    dbImportSuccess(size, "import_custom_gun_csv")
                })
            }catch(e){
                alarm("DB ops error import_custom_gun_csv", e)
            }
        }
        if(data === "import_custom_ammo_csv"){
            toggleImportModalVisible()
            setDbModalText(databaseOperations.import[language])
            try{
                await importCSV(data).then((size)=>{
                    dbImportSuccess(size, "import_custom_ammo_csv")
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
        const importTags:{label:string}[] = []
        const importableGunCollection:GunType[] = await Promise.all(guns.map(async gun=>{
            if(gun.images !== null && gun.images.length !== 0){
                const base64images:string[] = await Promise.all(gun.images.map(async (image, index) =>{
                    const base64ImageUri = `data:image/jpeg;base64,${image}`;
                    const dimensions = await getImageSize(base64ImageUri) as {width: number, height: number}
                    // Resize the image
                    const resizedImage = dimensions.height !== 0 && dimensions.width !== 0 && settingsData[0].generalSettings_resizeImages ? 
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
                if(gun.tags !== undefined && gun.tags !== null && gun.tags.length !== 0){
                    for(const tag of gun.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag})
                        }
                    }
                }
                return importableGun
            } else {
                if(gun.tags !== undefined && gun.tags !== null && gun.tags.length !== 0){
                    for(const tag in gun.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag})
                        }
                    }
                }

                return gun
            }
        }))
        await db.delete(schema.gunTags)
        await db.delete(schema.gunCollection)
        await db.insert(schema.gunTags).values(importTags)
        for(const item of importableGunCollection){
            await db.insert(schema.gunCollection).values(item)
            setImportProgress(importProgress + 1)
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        try{
            await fs.unlink(result.assets[0].uri)
        }catch(e){
            alarm("importAmmoDB unlinkTempFile", e)
        }
        return guns.length
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
                    const resizedImage = dimensions.height !== 0 && dimensions.width !== 0 && settingsData[0].generalSettings_resizeImages ? 
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
                if(ammo.tags !== undefined && ammo.tags !== null && ammo.tags.length !== 0){
                    for(const tag of ammo.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                return importableAmmo
            } else {
                if(ammo.tags !== undefined && ammo.tags !== null && ammo.tags.length !== 0){
                    for(const tag of ammo.tags){
                        if(!importTags.some(importTag => importTag.label === tag)){
                            importTags.push({label: tag, status: true})
                        }
                    }
                }
                return ammo
            }
            
        }))
        await db.delete(schema.ammoTags)
        await db.delete(schema.ammoCollection)
        await db.insert(schema.ammoTags).values(importTags)
        for(const item of importableAmmoCollection){
            await db.insert(schema.ammoCollection).values(item)
            setImportProgress(importProgress + 1)
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        try{
            await fs.unlink(result.assets[0].uri)
        }catch(e){
            alarm("importAmmoDB unlinkTempFile", e)
        }
        return ammunitions.length
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
        setImportProgress(0)
        setImportSize(parsed.data.length)
        // The errors are due to GunType expecting string[], but the parsed content is only a string. Maybe a type ImportableGunType[] should be created.
        const unflat:GunType[] = parsed.data.map(item => {
            const unitem:GunType = unflatten(item)
            console.log(unitem)
            /*@ts-expect-error*/
            const filterEmptyImages:string[] = unitem.images === undefined ? [] : unitem.images === null ? [] : unitem.images === "" ? [] : unitem.images.split(",")
            console.log(filterEmptyImages)
            /*@ts-expect-error*/
            const filterEmptyTags:string[] = unitem.tags === undefined ? [] : unitem.tags === null ? [] : unitem.tags === "" ? [] : unitem.tags.split(",")
            console.log(filterEmptyTags)
            /*@ts-expect-error*/
            const multiCal:string[] = unitem.caliber === undefined ? [] : unitem.caliber === null ? [] : unitem.caliber === "" ? [] : unitem.caliber.split(",")
            console.log(multiCal)

            const readyItem:GunType = {...unitem, images: filterEmptyImages, tags: filterEmptyTags, caliber: multiCal}
            return readyItem
        })
        
        await db.delete(schema.gunCollection)
        for(const item of unflat){
            await db.insert(schema.gunCollection).values(item)
            setImportProgress(importProgress + 1)
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        return parsed.data.length

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

async function shareSQLDatabase(){
    const dbPath = `${FileSystem.documentDirectory}SQLite/test_db79.db`;

    const info = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/test_db79.db`);
  if (!info.exists) {
    console.error("Database file does not exist.");
    return;
  }

  try {
    await Sharing.shareAsync(dbPath);
  } catch (error) {
    console.error("Error sharing database file:", error);
  }
}

async function saveSQLDatabase(){
    
    const dbPath = `${FileSystem.documentDirectory}SQLite/test_db79.db`;

    const downloadsPath = `${FileSystem.cacheDirectory}/arsenalDB.db`;

    try {
        fs.cpExternal(dbPath, "arsenalDB.db", "downloads")
      setSnackbarText(`Database copied to Downloads:\n${downloadsPath}`);
    } catch (error) {
     setSnackbarText(`Error copying database: ${error}`);

    }
    onToggleSnackBar()
}

    return(
        <View style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
            <View style={{width: "85%", maxHeight: "85%", backgroundColor: theme.colors.background}}>
                <ScrollView>
                    <List.AccordionGroup>
                        <List.Accordion title="Datenbank speichern" id="1" left={props => <List.Icon {...props} icon="floppy" />}>

                                <List.Item onPress={()=>saveSQLDatabase()} title="Datenbank" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="database" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>
                                <List.Item title="JSON Datei" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="code-json" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>
                                <List.Item title="CSV" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="file-delimited-outline" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>

                        </List.Accordion>
                    </List.AccordionGroup>
                    <List.AccordionGroup>
                        <List.Accordion title="Datenbank importieren" id="2" left={props => <List.Icon {...props} icon="import" />}>
                        
                        <List.Item title="Datenbank" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="database" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>
                                <List.Item title="JSON Datei" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="code-json" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>
                                <List.Item title="CSV" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="file-delimited-outline" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>

                        </List.Accordion>
                        </List.AccordionGroup>
                        <List.AccordionGroup>
                        <List.Accordion title="Datenbank teilen" id="3" left={props => <List.Icon {...props} icon="share-variant" />}>
                           
                                <List.Item onPress={()=>shareSQLDatabase()} title="Datenbank" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="database" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>
                                <List.Item title="JSON Datei" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="code-json" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>
                                <List.Item title="CSV" left={props => <List.Icon {...props} icon="chevron-right" />} right={props => <List.Icon {...props} icon="file-delimited-outline" />} style={{backgroundColor: theme.colors.secondaryContainer}}/>

                        </List.Accordion>
                    </List.AccordionGroup>
                </ScrollView>
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
        </View>
    )
}