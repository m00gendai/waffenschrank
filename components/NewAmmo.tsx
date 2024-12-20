import { StyleSheet, View, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Dialog, FAB, Snackbar, Text } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ammoDataTemplate, ammoRemarks } from "../lib/ammoDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';
import ImageViewer from "./ImageViewer"
import { AMMO_DATABASE, A_KEY_DATABASE } from '../configs_DB';
import { AmmoType } from '../interfaces';
import { ammoDataValidation, imageHandling } from '../utils';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { newAmmoTitle, toastMessages, unsavedChangesAlert, validationFailedAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import NewChipArea from './NewChipArea';
import { useAmmoStore } from '../stores/useAmmoStore';
import * as FileSystem from 'expo-file-system';
import { exampleAmmoEmpty } from '../lib/examples';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';


export default function NewAmmo({navigation}){

    const { language, theme, generalSettings } = usePreferenceStore()
    const { setNewAmmoOpen, setSeeAmmoOpen } = useViewStore()
    const { setCurrentAmmo, currentAmmo, ammoCollection, setAmmoCollection } = useAmmoStore()

    const [selectedImage, setSelectedImage] = useState<string[]>(currentAmmo ? currentAmmo.images : null)
    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [granted, setGranted] = useState<boolean>(false)
    const [ammoData, setAmmoData] = useState<AmmoType>(currentAmmo ? currentAmmo : exampleAmmoEmpty)
    const [ammoDataCompare, setAmmoDataCompare] = useState<AmmoType>(currentAmmo ? currentAmmo : exampleAmmoEmpty)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean>(null)
    const [unsavedVisible, toggleUnsavedDialogVisible] = useState<boolean>(false)
    const [exitAction, setExitAction] = useState(null);

    

    useEffect(()=>{
        if(initCheck){
            setInitCheck(false)
        }
        if(!initCheck){
            setSaveState(null)
            for(const key in ammoData){
                if(ammoData[key] !== ammoDataCompare[key]){
                    setSaveState(false)
                    if(ammoDataCompare[key] === null && ammoData[key].length === 0){
                        setSaveState(null)
                    }
                }
                if(!(key in ammoDataCompare) && ammoData[key] !== ""){
                    setSaveState(false)
                }
                if(!(key in ammoDataCompare) && ammoData[key] === ""){
                    setSaveState(null)
                }
                if(!(key in ammoDataCompare) && ammoData[key] !== undefined && ammoData[key].length === 0){
                    setSaveState(null)
                }
            }
        }
      },[ammoData])

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

    async function save(value:AmmoType) {
        const validationResult:{field: string, error: string}[] = ammoDataValidation(value, language)
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
            Saving ammo is a two-step process:
            1. Save the key of the ammo to the key database
            2. Save the ammo object as a separate key/value pair in the ammo database
        */

        
            

        const allKeys:string = await AsyncStorage.getItem(A_KEY_DATABASE) // gets the object that holds all key values
        const newKeys:string[] = allKeys == null ? [value.id] : [...JSON.parse(allKeys), value.id] // if its the first ammo to be saved, create an array with the id of the ammo. Otherwise, merge the key into the existing array
        await AsyncStorage.setItem(A_KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        SecureStore.setItem(`${AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the ammo
        console.log(`Saved item ${JSON.stringify(value)} with key ${AMMO_DATABASE}_${value.id}`)
        setSaveState(true)
        setSnackbarText(`${value.designation} ${value.manufacturer ? value.manufacturer : ""} ${toastMessages.saved[language]}`)
        onToggleSnackBar()
        setNewAmmoOpen()
        setCurrentAmmo({...ammoData, id: value.id})
        const newCollection:AmmoType[] = [...ammoCollection, value]
        setAmmoCollection(newCollection)
        setSeeAmmoOpen()
        navigation.navigate("Ammo")
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
                newImage.splice(indx, 1, fileName);
                setSelectedImage(newImage);
                setAmmoData({ ...ammoData, images: newImage });
            } else {
                setSelectedImage([fileName]);
                if (ammoData && ammoData.images && ammoData.images.length !== 0) {
                    setAmmoData({ ...ammoData, images: [...ammoData.images, fileName] });
                } else {
                    setAmmoData({ ...ammoData, images: [fileName] });
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
                newImage.splice(indx, 1, fileName);
                setSelectedImage(newImage);
                setAmmoData({ ...ammoData, images: newImage });
            } else {
                setSelectedImage([fileName]);
                if (ammoData && ammoData.images && ammoData.images.length !== 0) {
                    setAmmoData({ ...ammoData, images: [...ammoData.images, fileName] });
                } else {
                    setAmmoData({ ...ammoData, images: [fileName] });
                }
            }
        } catch (error) {
            console.error('Error saving image:', error);
        }
    }  
    }   

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flex: 1,
            flexWrap: "wrap",
            flexDirection: "column",
    
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
        <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>

            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.goBack()} />
                <Appbar.Content title={newAmmoTitle[language]} />
                <Appbar.Action icon="floppy" onPress={() => save({...ammoData, id: uuidv4(), images:selectedImage, createdAt: `${new Date()}`, lastModifiedAt: `${new Date()}`})} color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"} />
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
                        <NewChipArea data={"status"} ammoData={ammoData} setAmmoData={setAmmoData}/>
                        {ammoDataTemplate.map(data=>{
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
                                    
                                    <NewText data={data.name} ammoData={ammoData} setAmmoData={setAmmoData} label={data[language]}/>
                                </View>
                            )
                        })}
                        <NewTextArea data={ammoRemarks.name} ammoData={ammoData} setAmmoData={setAmmoData}/>
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

        </KeyboardAvoidingView>
    )
}

