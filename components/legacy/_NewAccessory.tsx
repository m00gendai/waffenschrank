import { StyleSheet, View, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
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
import { GunType, GunTypeWithDbId } from '../interfaces';
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
import * as schema from "../db/schema"
import { db } from "../db/client"
import { accessoryDataTemplate_optics, accessoryRemarks_optics } from '../lib/accessoryDataTemplate';


export default function NewAccesory({navigation}){

    const { language, theme, generalSettings } = usePreferenceStore()
    const { setNewGunOpen, setSeeGunOpen } = useViewStore()
    const { setCurrentGun, gunCollection, setGunCollection, currentGun } = useGunStore()

    const [selectedImage, setSelectedImage] = useState<string[]>(currentGun ? currentGun.images : [])
    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [granted, setGranted] = useState<boolean>(false)
    const [accData, setAccData] = useState<any>(null) // TODO amend for cloning
    const [dataCompare, setDataCompare] = useState<any>(null) // TODO amend for cloning
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
            for(const key in accData){
                if(accData[key] !== dataCompare[key]){
                    setSaveState(false)
                    if(dataCompare[key] === null && accData[key].length === 0){
                        setSaveState(null)
                    }
                }
                if(!(key in dataCompare) && accData[key] !== ""){
                    setSaveState(false)
                }
                if(!(key in dataCompare) && accData[key] === ""){
                    setSaveState(null)
                }
                if(!(key in dataCompare) && accData[key] !== undefined && accData[key].length === 0){
                    setSaveState(null)
                }
            }
        }
      },[accData])

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

    async function save(value:any) {
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
        
    console.log(value)
    const {db_id, ...idless} = value
        await db.insert(schema.opticsCollection).values(idless)
        console.log(`Saved item ${JSON.stringify(idless)} with key ${GUN_DATABASE}_${value.id}`)
        setSaveState(true)
        setSnackbarText(`${value.manufacturer ? value.manufacturer : ""} ${value.model} ${toastMessages.saved[language]}`)
        onToggleSnackBar()
        setNewGunOpen()
        //setCurrentGun({...accData, id: value.id})
        setSeeGunOpen()
        navigation.navigate("Gun")
    }

    function saveImages(fileName:string, indx: number){
        const newImage = selectedImage;
            if (newImage.length !== 0) {
                const newArr = newImage.toSpliced(indx, 1, fileName);
                setSelectedImage(newArr);
                console.log(newArr.join(","))
                setAccData({ ...accData, images: newArr});
            } else {
                setSelectedImage([fileName]);
                if (accData && accData.images.length !== 0) {
                    setAccData({ ...accData, images: [...accData.images, fileName]});
                } else {
                    console.log(fileName)
                    setAccData({ ...accData, images: [fileName]});
                }
            }
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

            saveImages(fileName, indx)
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

            saveImages(fileName, indx)
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
        <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.goBack()} />
                <Appbar.Content title={"NEW ACCESSORY"} />
                <Appbar.Action icon="floppy" onPress={() => save({...accData, db_id: null, id: uuidv4(), images:selectedImage, createdAt: new Date().getTime(), lastModifiedAt: new Date().getTime()})} color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"} />
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
                        <NewChipArea data={"status"} gunData={accData} setGunData={setAccData}/>
                        {accessoryDataTemplate_optics.map(data=>{
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
                                    
                                    <NewText data={data.name} gunData={accData} setGunData={setAccData} label={data[language]}/>
                                </View>
                            )
                        })}
                        <NewTextArea data={accessoryRemarks_optics.name} gunData={accData} setGunData={setAccData}/>
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