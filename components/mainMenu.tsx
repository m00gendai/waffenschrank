import { Alert, ScrollView, TouchableNativeFeedback, View } from "react-native"
import Animated, { LightSpeedInLeft, LightSpeedOutLeft } from "react-native-reanimated"
import { useViewStore } from "../stores/useViewStore"
import { ActivityIndicator, Button, Divider, Icon, Modal, SegmentedButtons, Snackbar, Text } from "react-native-paper"
import { databaseImportAlert, databaseOperations, preferenceTitles, toastMessages } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GUN_DATABASE, KEY_DATABASE, PREFERENCES } from "../configs"
import { colorThemes } from "../lib/colorThemes"
import { useState } from "react"
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { GunType } from "../interfaces"
import * as SecureStore from "expo-secure-store"
import { useGunStore } from "../stores/useGunStore"
import { SafeAreaView } from "react-native-safe-area-context"
import { printGunCollection } from "../functions/printToPDF"


export default function mainMenu(){

    const { setMainMenuOpen } = useViewStore()
    const { language, switchLanguage, theme, switchTheme, dbImport, setDbImport } = usePreferenceStore()
    const { gunCollection } = useGunStore()

    const [toastVisible, setToastVisible] = useState<boolean>(false)
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalVisible, setDbModalVisible] = useState<boolean>(false)
    const [dbModalText, setDbModalText] = useState<string>("")

    const onToggleSnackBar = () => setToastVisible(!toastVisible);
    const onDismissSnackBar = () => setToastVisible(false);

    const date: Date = new Date()
    const currentYear:number = date.getFullYear()

    function invokeAlert(){
        Alert.alert(databaseImportAlert.title[language], databaseImportAlert.subtitle[language], [
            {
                text: databaseImportAlert.yes[language],
                onPress: () => handleImportDb()
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

    async function handleSaveDb(){
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
  
    async function handleImportDb(){
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

    return(
        <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedOutLeft} style={{position: "absolute", left: 0, width: "100%", height: "100%"}}>
            <SafeAreaView style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", backgroundColor: "white"}}>
                <View style={{width: "100%", height: "100%", backgroundColor: "white"}}>
                    <TouchableNativeFeedback onPress={setMainMenuOpen}>
                        <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20}}>
                            <Icon source="arrow-left" size={20} color='black'/>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
                        <View style={{width: "100%", flex: 10}}>
                            <ScrollView>
                                <View style={{padding: 10}}>
                                    <Text>HELLO IS THIS THE KRUSTY KRAB?</Text>
                                    <Text>NO THIS IS MENU!</Text>
                                </View>
                                <View style={{marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: "white"}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10}}>{preferenceTitles.language[language]}</Text>
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
                                <View style={{marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: "white"}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10}}>{preferenceTitles.colors[language]}</Text>
                                        <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
                                        {Object.entries(colorThemes).map(colorTheme =>{
                                            return(    
                                                <TouchableNativeFeedback onPress={()=>handleThemeSwitch(colorTheme[0])} key={colorTheme[0]}>
                                                    <View style={{borderColor: theme.name === colorTheme[0] ? colorTheme[1].primary : colorTheme[1].primaryContainer, borderWidth: theme.name === colorTheme[0] ? 5 : 1, padding: 5, width: "45%", height: 50, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10, marginBottom: 10, borderRadius: 50}}>
                                                        <View style={{height: "100%", width: "30%", backgroundColor: colorTheme[1].primaryContainer, borderBottomLeftRadius: 50, borderTopLeftRadius: 50}}></View>
                                                        <View style={{height: "100%", width: "30%", backgroundColor: colorTheme[1].secondaryContainer}}></View>
                                                        <View style={{height: "100%", width: "30%", backgroundColor: colorTheme[1].tertiaryContainer, borderBottomRightRadius: 50, borderTopRightRadius: 50}}></View>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            )})}
                                    </View>
                                </View>
                                <Divider bold/>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: "white"}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10}}>{preferenceTitles.db[language]}</Text>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>handleSaveDb()} mode="contained">{preferenceTitles.saveDb[language]}</Button>
                                        <Button style={{width: "45%"}} icon="application-import" onPress={()=>invokeAlert()} mode="contained">{preferenceTitles.importDb[language]}</Button>
                                    </View>
                                </View>
                                <Divider bold/>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: 10, backgroundColor: "white"}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10}}>Print Göns</Text>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Button style={{width: "45%"}} icon="content-save-move" onPress={()=>printGunCollection(gunCollection, language)} mode="contained">Print</Button>
                                        
                                    </View>
                                </View>
                                
                            </ScrollView>
                        </View>
                        <View style={{width: "100%", flex: 2, padding: 10}}>
                            <Text>Version Pre-Alpha</Text>
                            <Text>{`© ${currentYear === 2024 ? currentYear : `2024 - ${currentYear}`} Marcel Weber`} </Text>
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
                <Text variant="bodyLarge" style={{width: "100%", textAlign: "center", color: "white", marginTop: 10, backgroundColor: "rgba(0,0,0,0.5)"}}>{dbModalText}</Text>
            </Modal>
        </Animated.View> 
    )
}