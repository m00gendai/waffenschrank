import { Alert, ScrollView, TouchableNativeFeedback, View } from "react-native"
import Animated, { LightSpeedInLeft, LightSpeedOutLeft } from "react-native-reanimated"
import { useViewStore } from "../stores/useViewStore"
import { ActivityIndicator, Button, Divider, Icon, Modal, SegmentedButtons, Snackbar, Text } from "react-native-paper"
import { databaseImportAlert, databaseOperations, preferenceTitles, toastMessages } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AMMO_DATABASE, A_KEY_DATABASE, GUN_DATABASE, KEY_DATABASE, PREFERENCES } from "../configs"
import { colorThemes } from "../lib/colorThemes"
import { useState } from "react"
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { AmmoType, GunType } from "../interfaces"
import * as SecureStore from "expo-secure-store"
import { useGunStore } from "../stores/useGunStore"
import { SafeAreaView } from "react-native-safe-area-context"
import { printGunCollection } from "../functions/printToPDF"
import { useAmmoStore } from "../stores/useAmmoStore"


export default function mainMenu(){

    const { setMainMenuOpen } = useViewStore()
    const { language, switchLanguage, theme, switchTheme, dbImport, setDbImport, setAmmoDbImport } = usePreferenceStore()
    const { gunCollection } = useGunStore()
    const { ammoCollection } = useAmmoStore()

    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalVisible, setDbModalVisible] = useState<boolean>(false)
    const [dbModalText, setDbModalText] = useState<string>("")

    const onToggleSnackBar = () => setToastVisible(!toastVisible);
    const onDismissSnackBar = () => setToastVisible(false);

    const date: Date = new Date()
    const currentYear:number = date.getFullYear()

    function invokeAlertGun(){
        Alert.alert(databaseImportAlert.title[language], databaseImportAlert.subtitle[language], [
            {
                text: databaseImportAlert.yes[language],
                onPress: () => handleImportGunDb()
            },
            {
                text: databaseImportAlert.no[language],
                style: "cancel"
            }
        ])
    }
    function invokeAlertAmmo(){
        Alert.alert(databaseImportAlert.title[language], databaseImportAlert.subtitle[language], [
            {
                text: databaseImportAlert.yes[language],
                onPress: () => handleImportAmmoDb()
            },
            {
                text: databaseImportAlert.no[language],
                style: "cancel"
            }
        ])
    }

    async function handleThemeSwitch(color:string){
        switchTheme(color)
        const preferences:string = await AsyncStorage.getItem(PREFERENCES)
        const newPreferences:{[key:string] : string} = preferences == null ? {"theme": color} : {...JSON.parse(preferences), "theme":color} 
        await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
    }

    async function handleLanguageSwitch(lng:string){
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
            setDbModalText(databaseOperations.export[language])
            let directoryUri = permissions.directoryUri

            const exportableGunCollection:GunType[] = await Promise.all(gunCollection.map(async gun =>{
                if(gun.images !== null && gun.images.length !== 0){
                    const base64images:string[] = await Promise.all(gun.images?.map(async image =>{
                        const base64string:string = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
                        return base64string
                    }))
                    const exportableGun:GunType = {...gun, images: base64images}
                    return exportableGun
                } else {
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
    }

    async function handleSaveAmmoDb(){
        const fileName = `ammoDB_${new Date().getTime()}.json`
        // ANDROID
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
        if(permissions.granted){
            setDbModalVisible(true)
            setDbModalText(databaseOperations.export[language])
            let directoryUri = permissions.directoryUri

            const exportableAmmoCollection:AmmoType[] = await Promise.all(ammoCollection.map(async ammo =>{
                if(ammo.images !== null && ammo.images.length !== 0){
                    const base64images:string[] = await Promise.all(ammo.images?.map(async image =>{
                        const base64string:string = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
                        return base64string
                    }))
                    const exportableAmmo:AmmoType = {...ammo, images: base64images}
                    return exportableAmmo
                } else {
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
    }
  
    async function handleImportGunDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        setDbModalVisible(true)
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const guns:GunType[] = JSON.parse(content)

        const importableGunCollection:GunType[] = await Promise.all(guns.map(async gun=>{
            if(gun.images !== null && gun.images.length !== 0){
                const base64images:string[] = await Promise.all(gun.images.map(async (image, index) =>{
                    const base64Image = image;
                    const fileUri = FileSystem.documentDirectory + `${gun.manufacturer ? gun.manufacturer : ""}_${gun.model}_image_${index}`;
                    await FileSystem.writeAsStringAsync(fileUri, base64Image, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    return fileUri
                }))
                const importableGun:GunType = {...gun, images: base64images}
                return importableGun
            } else {
                return gun
            }
        }))
        
        const allKeys:string = await AsyncStorage.getItem(KEY_DATABASE) // gets the object that holds all key values
        let newKeys:string[] = []
        
        importableGunCollection.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        setDbModalVisible(false)
        setDbImport(new Date())  
        setSnackbarText(`${JSON.parse(content).length} ${toastMessages.dbImportSuccess[language]}`)
        onToggleSnackBar()
    }

    async function handleImportAmmoDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        setDbModalVisible(true)
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const ammunitions:AmmoType[] = JSON.parse(content)

        const importableAmmoCollection:AmmoType[] = await Promise.all(ammunitions.map(async ammo=>{
            if(ammo.images !== null && ammo.images.length !== 0){
                const base64images:string[] = await Promise.all(ammo.images.map(async (image, index) =>{
                    const base64Image = image;
                    const fileUri = FileSystem.documentDirectory + `${ammo.designation}_image_${index}`;
                    await FileSystem.writeAsStringAsync(fileUri, base64Image, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    return fileUri
                }))
                const importableAmmo:AmmoType = {...ammo, images: base64images}
                return importableAmmo
            } else {
                return ammo
            }
        }))
        
        const allKeys:string = await AsyncStorage.getItem(A_KEY_DATABASE) // gets the object that holds all key values
        let newKeys:string[] = []
        
        importableAmmoCollection.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(A_KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        setDbModalVisible(false)
        setAmmoDbImport(new Date())  
        setSnackbarText(`${JSON.parse(content).length} ${toastMessages.dbImportSuccess[language]}`)
        onToggleSnackBar()
    }

    return(
        <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedOutLeft} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
            <SafeAreaView style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", backgroundColor: theme.colors.background}}>
                <View style={{width: "100%", height: "100%", backgroundColor: theme.colors.background}}>
                    <TouchableNativeFeedback onPress={setMainMenuOpen}>
                        <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20}}>
                            <Icon source="arrow-left" size={20} color={theme.colors.onBackground}/>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
                        <View style={{width: "100%", flex: 10}}>
                            <ScrollView>
                                <View style={{padding: 10}}>
                                    <Text style={{color: theme.colors.onBackground}}>HELLO IS THIS THE KRUSTY KRAB?</Text>
                                    <Text style={{color: theme.colors.onBackground}}>NO THIS IS MENU!</Text>
                                </View>
                                <View style={{marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: theme.colors.background}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onBackground}}>{preferenceTitles.language[language]}</Text>
                                    <SegmentedButtons
                                        value={language}
                                        onValueChange={handleLanguageSwitch}

                                        buttons={[
                                        {
                                            value: 'de',
                                            label: `🇩🇪`,
                                        },
                                        {
                                            value: 'en',
                                            label: '🇬🇧',
                                        },
                                        { 
                                            value: 'fr', 
                                            label: '🇫🇷' 
                                        },
                                        ]}
                                    />
                                </View>
                                <Divider bold/>
                                <View style={{marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: theme.colors.background}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onBackground}}>{preferenceTitles.colors[language]}</Text>
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
                                            )})}
                                    </View>
                                </View>
                                <Divider bold/>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: theme.colors.background}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onBackground}}>{preferenceTitles.db_gun[language]}</Text>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>handleSaveGunDb()} mode="contained">{preferenceTitles.saveDb_gun[language]}</Button>
                                        <Button style={{width: "45%"}} icon="application-import" onPress={()=>invokeAlertGun()} mode="contained">{preferenceTitles.importDb_gun[language]}</Button>
                                    </View>
                                </View>
                                <Divider bold/>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: theme.colors.background}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onBackground}}>{preferenceTitles.db_ammo[language]}</Text>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>handleSaveAmmoDb()} mode="contained">{preferenceTitles.saveDb_ammo[language]}</Button>
                                        <Button style={{width: "45%"}} icon="application-import" onPress={()=>invokeAlertAmmo()} mode="contained">{preferenceTitles.importDb_ammo[language]}</Button>
                                    </View>
                                </View>
                                <Divider bold/>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: theme.colors.background}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onBackground}}>{preferenceTitles.gunList[language]}</Text>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Button style={{width: "45%"}} icon="printer" onPress={()=>printGunCollection(gunCollection, language)} mode="contained">{preferenceTitles.printAllGuns[language]}</Button>
                                        
                                    </View>
                                </View>
                                
                            </ScrollView>
                        </View>
                        <View style={{width: "100%", flex: 2, padding: 10, marginBottom: 10, elevation: 4}}>
                            <Text style={{color: theme.colors.onBackground}} >Version Alpha 2.0.0</Text>
                            <Text style={{color: theme.colors.onBackground}}>{`© ${currentYear === 2024 ? currentYear : `2024 - ${currentYear}`} Marcel Weber`} </Text>
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
            <Modal visible={dbModalVisible}>
                <ActivityIndicator size="large" animating={true} />
                <Text variant="bodyLarge" style={{width: "100%", textAlign: "center", color: theme.colors.onBackground, marginTop: 10, backgroundColor: "rgba(0,0,0,0.5)"}}>{dbModalText}</Text>
            </Modal>
        </Animated.View> 
    )
}