import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { Appbar, Button, Dialog, FAB, Snackbar, Text } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gunDataTemplate, gunRemarks } from "../lib/gunDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE, KEY_DATABASE } from '../configs_DB';
import { GunType } from '../interfaces';
import { gunDataValidation, imageHandling } from '../utils';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { newGunTitle, toastMessages, unsavedChangesAlert, validationFailedAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import NewChipArea from './NewChipArea';
import { useGunStore } from '../stores/useGunStore';
import * as FileSystem from 'expo-file-system';
import { exampleGun, exampleGunEmpty } from '../lib/examples';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function NewGun({navigation}){

    const [selectedImage, setSelectedImage] = useState<string[]>(null)
    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [granted, setGranted] = useState<boolean>(false)
    const [gunData, setGunData] = useState<GunType>(exampleGunEmpty)
    const [gunDataCompare, setGunDataCompare] = useState<GunType>(exampleGunEmpty)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean>(null)
    const [unsavedVisible, toggleUnsavedDialogVisible] = useState<boolean>(false)
    const [exitAction, setExitAction] = useState(null);

    const { language, theme, generalSettings } = usePreferenceStore()
    const { setNewGunOpen, setSeeGunOpen } = useViewStore()
    const { setCurrentGun, gunCollection, setGunCollection } = useGunStore()

    useEffect(()=>{
        if(initCheck){
            setInitCheck(false)
        }
        if(!initCheck){
            setSaveState(null)
            for(const key in gunData){
                if(gunData[key] !== gunDataCompare[key]){
                    setSaveState(false)
                    if(gunDataCompare[key] === null && gunData[key].length === 0){
                        setSaveState(null)
                    }
                }
                if(!(key in gunDataCompare) && gunData[key] !== ""){
                    setSaveState(false)
                }
                if(!(key in gunDataCompare) && gunData[key] === ""){
                    setSaveState(null)
                }
                if(!(key in gunDataCompare) && gunData[key] !== undefined && gunData[key].length === 0){
                    setSaveState(null)
                }
            }
        }
      },[gunData])

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

    async function save(value:GunType) {
        const validationResult:{field: string, error: string}[] = gunDataValidation(value, language)
        if(validationResult.length != 0){
            Alert.alert(validationFailedAlert.title[language], `${validationResult.map(result => `${result.field}: ${result.error}`)}`, [
                {
                    text: validationFailedAlert.no[language],
                    style: "cancel"
                }
            ])
            return
        }
        /* 
            Saving a gun is a two-step process:
            1. Save the key of the gun to the key database
            2. Save the gun object as a separate key/value pair in the gun database
        */

        
            

        const allKeys:string = await AsyncStorage.getItem(KEY_DATABASE) // gets the object that holds all key values
        const newKeys:string[] = allKeys == null ? [value.id] : [...JSON.parse(allKeys), value.id] // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
        await AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        SecureStore.setItem(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        console.log(`Saved item ${JSON.stringify(value)} with key ${GUN_DATABASE}_${value.id}`)
        setSaveState(true)
        setSnackbarText(`${value.manufacturer ? value.manufacturer : ""} ${value.model} ${toastMessages.saved[language]}`)
        onToggleSnackBar()
        setNewGunOpen()
        setCurrentGun({...gunData, id: value.id})
        const newCollection:GunType[] = [...gunCollection, value]
        setGunCollection(newCollection)
        setSeeGunOpen()
        navigation.navigate("Gun")
    }
    
    const pickImageAsync = async (indx:number) =>{
        const permission: ImagePicker.MediaLibraryPermissionResponse = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(!permission){
            setGranted(false)
            return
        } else {
            setGranted(true)
        }

        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        })

        if(!result.canceled){

            // Create a unique file name for the new image
            const newImageUri = result.assets[0].uri
            const manipImage = await imageHandling(result, generalSettings.resizeImages)
            const fileName = newImageUri.split('/').pop();
            const newPath = `${FileSystem.documentDirectory}${fileName}`;
            // Move the image to a permanent directory
            try {
                await FileSystem.moveAsync({
                    from: manipImage.uri,
                    to: newPath,
                });

            const newImage = selectedImage;
            if (newImage && newImage.length !== 0) {
                newImage.splice(indx, 1, newPath);
                setSelectedImage(newImage);
                setGunData({ ...gunData, images: newImage });
            } else {
                setSelectedImage([newPath]);
                if (gunData && gunData.images && gunData.images.length !== 0) {
                    setGunData({ ...gunData, images: [...gunData.images, newPath] });
                } else {
                    setGunData({ ...gunData, images: [newPath] });
                }
            }
        } catch (error) {
            console.error('Error saving image:', error);
        }
    }  
    }  
     
    const pickCameraAsync = async (indx:number) =>{
        const permission: ImagePicker.MediaLibraryPermissionResponse | ImagePicker.CameraPermissionResponse = Platform.OS === "android" ? await ImagePicker.requestMediaLibraryPermissionsAsync() : await ImagePicker.requestCameraPermissionsAsync()

        if(!permission){
            setGranted(false)
            return
        } else {
            setGranted(true)
        }

        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1
        })

        if(!result.canceled){
            // Create a unique file name for the new image
            
        const newImageUri = result.assets[0].uri
        const manipImage = await imageHandling(result, generalSettings.resizeImages)
        const fileName = newImageUri.split('/').pop();
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        // Move the image to a permanent directory
        try {
            await FileSystem.moveAsync({
                from: manipImage.uri,
                to: newPath,
            });

            const newImage = selectedImage;
            if (newImage && newImage.length !== 0) {
                newImage.splice(indx, 1, newPath);
                setSelectedImage(newImage);
                setGunData({ ...gunData, images: newImage });
            } else {
                setSelectedImage([newPath]);
                if (gunData && gunData.images && gunData.images.length !== 0) {
                    setGunData({ ...gunData, images: [...gunData.images, newPath] });
                } else {
                    setGunData({ ...gunData, images: [newPath] });
                }
            }
        } catch (error) {
            console.error('Error saving image:', error);
        }
    }  
} 

useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {

      if (saveState) {
        // If we don't have unsaved changes, then we don't need to do anything
        return;
      }
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Save the action to be triggered later
      setExitAction(e.data.action);

      // Show the dialog
      toggleUnsavedDialogVisible(true);
    });

    return unsubscribe;
  }, [navigation, saveState])

  const handleDiscard = () => {
      toggleUnsavedDialogVisible(false);
      if (exitAction) {
        navigation.dispatch(exitAction);
      }
    };
  
    const handleCancel = () => {
      toggleUnsavedDialogVisible(false);
    };
 

    return(
        <View style={{flex: 1}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.goBack()} />
                <Appbar.Content title={newGunTitle[language]} />
                <Appbar.Action icon="floppy" onPress={() => save({...gunData, id: uuidv4(), images:selectedImage, createdAt: `${new Date()}`, lastModifiedAt: `${new Date()}`})} color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"} />
            </Appbar>

            <View style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "23/10"}}>  
                            {Array.from(Array(5).keys()).map((_, index) =>{
                                return(
                                    <View style={styles.imageContainer} key={`slide_${index}`}>
                                        <ImageViewer isLightBox={false} selectedImage={selectedImage && selectedImage.length > 0 ? selectedImage[index] : null} />
                                        <FAB
                                            icon="camera"
                                            style={styles.fab2}
                                            onPress={()=>pickCameraAsync(index)}
                                        />
                                        <FAB
                                            icon="image-multiple-outline"
                                            style={styles.fab}
                                            onPress={()=>pickImageAsync(index)}
                                        />
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={{
                        height: "100%",
                        width: "100%",
                        
                    }}>
                        <NewChipArea data={"status"} gunData={gunData} setGunData={setGunData}/>
                        {gunDataTemplate.map(data=>{
                            return(
                                <View 
                                    id={data.name}
                                    key={data.name}
                                    style={{
                                        display: "flex",
                                        flexWrap: "nowrap",
                                        flexDirection: "row",
                                        width: "100%",
                                        gap: 5,
                                        
                                }}>
                                    
                                    <NewText data={data.name} gunData={gunData} setGunData={setGunData} label={data[language]}/>
                                </View>
                            )
                        })}
                        <NewCheckboxArea data={"status"} gunData={gunData} setGunData={setGunData} />
                        <NewTextArea data={gunRemarks.name} gunData={gunData} setGunData={setGunData}/>
                    </View>
                </ScrollView>
            </View>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                label: 'OK',
                onPress: () => {
                    onDismissSnackBar()
                },
                }}>
                {snackbarText}
            </Snackbar>

            <Dialog visible={unsavedVisible} onDismiss={()=>toggleUnsavedDialogVisible(!unsavedVisible)}>
                    <Dialog.Title>
                    {`${unsavedChangesAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${unsavedChangesAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleDiscard} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{unsavedChangesAlert.yes[language]}</Button>
                        <Button onPress={handleCancel} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{unsavedChangesAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>


        </View> 
    )
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
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fab2: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    },
  });