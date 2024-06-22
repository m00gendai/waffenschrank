import { Alert, ScrollView, TouchableNativeFeedback, View, Linking } from "react-native"
import Animated, { LightSpeedInLeft, LightSpeedOutLeft } from "react-native-reanimated"
import { useViewStore } from "../stores/useViewStore"
import { ActivityIndicator, Button, Dialog, Divider, Icon, List, Modal, SegmentedButtons, Snackbar, Switch, Text } from "react-native-paper"
import { aboutText, aboutThanks, databaseImportAlert, databaseOperations, generalSettingsLabels, preferenceTitles, toastMessages } from "../lib/textTemplates"
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
import App from "../App"



export default function mainMenu(){

    const { setMainMenuOpen } = useViewStore()
    const { language, switchLanguage, theme, switchTheme, dbImport, setDbImport, setAmmoDbImport, generalSettings, setGeneralSettings } = usePreferenceStore()
    const { gunCollection } = useGunStore()
    const { ammoCollection } = useAmmoStore()
    const {tags, setTags, ammo_tags, setAmmoTags, overWriteAmmoTags, overWriteTags} = useTagStore()

    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalVisible, setDbModalVisible] = useState<boolean>(false)
    const [dbModalText, setDbModalText] = useState<string>("")
    const [importGunDbVisible, toggleImportDunDbVisible] = useState<boolean>(false)
    const [importAmmoDbVisible, toggleImportAmmoDbVisible] = useState<boolean>(false)
    const [importProgress, setImportProgress] = useState<number>(0)
    const [importSize, setImportSize] = useState<number>(0)
    const onToggleSnackBar = () => setToastVisible(!toastVisible);
    const onDismissSnackBar = () => setToastVisible(false);

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
  
    async function handleImportGunDb(){
        const result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: true})
        if(result.assets === null){
            return
        }
        toggleImportDunDbVisible(false)
        
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const guns:GunType[] = JSON.parse(content)
        setImportSize(guns.length)
        setDbModalVisible(true)
        const importTags:{label:string, status:boolean}[] = []
        const importableGunCollection:GunType[] = await Promise.all(guns.map(async gun=>{
            if(gun.images !== null && gun.images.length !== 0){
                const base64images:string[] = await Promise.all(gun.images.map(async (image, index) =>{
                    const base64Image = image;
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
        toggleImportAmmoDbVisible(false)
        setDbModalText(databaseOperations.import[language])
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const ammunitions:AmmoType[] = JSON.parse(content)
        setImportSize(ammunitions.length)
        setDbModalVisible(true)
        const importTags:{label:string, status:boolean}[] = []
        const importableAmmoCollection:AmmoType[] = await Promise.all(ammunitions.map(async ammo=>{
            if(ammo.images !== null && ammo.images.length !== 0){
                const base64images:string[] = await Promise.all(ammo.images.map(async (image, index) =>{
                    const base64Image = image;
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

    async function handleSwitches(setting: string){
        const newSettings = {...generalSettings, [setting]: !generalSettings[setting]}
            setGeneralSettings(newSettings)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"generalSettings": newSettings} : {...JSON.parse(preferences), "generalSettings": newSettings} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
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

            <Modal visible={dbModalVisible}>
                <ActivityIndicator size="large" animating={true} />
                <Text variant="bodyLarge" style={{width: "100%", textAlign: "center", color: theme.colors.onBackground, marginTop: 10, backgroundColor: theme.colors.background}}>{`${dbModalText}: ${importProgress}/${importSize}`}</Text>
            </Modal>
        </Animated.View> 
    )
}