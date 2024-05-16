import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Appbar, FAB, Snackbar } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gunDataTemplate, gunRemarks } from "../lib/gunDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE, KEY_DATABASE } from '../configs';
import { GunType } from '../interfaces';
import { gunDataValidation } from '../utils';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { newGunTitle, toastMessages, unsavedChangesAlert, validationFailedAlert } from '../textTemplates';
import { usePreferenceStore } from '../usePreferenceStore';

interface Props{
    setNewGunOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default function NewGun({setNewGunOpen}){

    const [selectedImage, setSelectedImage] = useState<string[]>(null)
    const [granted, setGranted] = useState<boolean>(false)
    const [gunData, setGunData] = useState<GunType>(null)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean>(false)

    const { language } = usePreferenceStore()


    useEffect(()=>{
        setSaveState(false)
    },[gunData])

    function invokeAlert(){
        Alert.alert(unsavedChangesAlert.title[language], unsavedChangesAlert.subtitle[language], [
            {
                text: unsavedChangesAlert.yes[language],
                onPress: () => setNewGunOpen(false)
            },
            {
                text: unsavedChangesAlert.no[language],
                style: "cancel"
            }
        ])
    }

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
        console.log(allKeys)
        const newKeys:string[] = allKeys == null ? [value.id] : [...JSON.parse(allKeys), value.id] // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
        await AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object

        SecureStore.setItem(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        console.log(`Saved item ${JSON.stringify(value)} with key ${GUN_DATABASE}_${value.id}`)
        setSaveState(true)
        setSnackbarText(`${value.manufacturer ? value.manufacturer : ""} ${value.model} ${toastMessages.saved[language]}`)
        onToggleSnackBar()
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
            const newImage:string[] = selectedImage
            if(newImage && newImage.length != 0){
                newImage.splice(indx, 1, result.assets[0].uri)
                setSelectedImage(newImage)
                setGunData({...gunData, images:newImage})
            } else {
                setSelectedImage([result.assets[0].uri])
                setGunData({...gunData, images:[result.assets[0].uri]})
            }
        }
    }   

    const pickCameraAsync = async (indx:number) =>{
        const permission: ImagePicker.MediaLibraryPermissionResponse = await ImagePicker.requestMediaLibraryPermissionsAsync()

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
            const newImage:string[] = selectedImage

            if(newImage && newImage.length != 0){
                newImage.splice(indx, 1, result.assets[0].uri)
                setSelectedImage(newImage)
                setGunData({...gunData, images:newImage})
            } else {
                setSelectedImage([result.assets[0].uri])
                setGunData({...gunData, images:[result.assets[0].uri]})
            }
        }
    }   

    return(
        <View style={{width: "100%", height: "100%", backgroundColor: "white"}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => {saveState ? setNewGunOpen(false) : invokeAlert()}} />
                <Appbar.Content title={newGunTitle[language]} />
                <Appbar.Action icon="floppy" onPress={() => save({...gunData, id: uuidv4(), images:selectedImage, createdAt: new Date(), lastModifiedAt: new Date()})} color={saveState ? "green" : "red"} />
            </Appbar>

            <View style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10"}}>  
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
                        <NewTextArea data={gunRemarks[language]} gunData={gunData} setGunData={setGunData}/>
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
        aspectRatio: "18/10",
        flexDirection: "column",
        flex: 1,
        marginRight: 5
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