import { StyleSheet, View, ScrollView, Alert} from 'react-native';
import { Appbar, SegmentedButtons, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useState } from 'react';
import * as SecureStore from "expo-secure-store"
import { gunDataTemplate, gunRemarks } from "../lib/gunDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE } from '../configs';
import { GunType } from '../interfaces';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { editGunTitle, imageDeleteAlert, toastMessages, unsavedChangesAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import NewChipArea from './NewChipArea';


export default function EditGun(){

    const { currentGun, setCurrentGun } = useGunStore()

    const [selectedImage, setSelectedImage] = useState<string[]>(currentGun.images && currentGun.images.length != 0 ? currentGun.images : [])
    const [granted, setGranted] = useState<boolean>(false)
    const [gunData, setGunData] = useState<GunType>(currentGun)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean | null>(null)

    const { language } = usePreferenceStore()
    const { setEditGunOpen } = useViewStore()

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  function invokeAlert(){
    Alert.alert(unsavedChangesAlert.title[language], unsavedChangesAlert.subtitle[language], [
        {
            text: unsavedChangesAlert.yes[language],
            onPress: setEditGunOpen
        },
        {
            text: unsavedChangesAlert.no[language],
            style: "cancel"
        }
    ])
    }


  function deleteImagePrompt(index:number){
    Alert.alert(imageDeleteAlert.title[language], ``, [
        {
            text: imageDeleteAlert.yes[language],
            onPress: () => deleteImage(index)
        },
        {
            text: imageDeleteAlert.no[language],
            style: "cancel"
        }
    ])
    }

    async function save(value: GunType) {
        console.log(value)
        await SecureStore.setItemAsync(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        console.log(`Saved item ${JSON.stringify(value)} with key ${GUN_DATABASE}_${value.id}`)
        setCurrentGun({...value, images:selectedImage})
        setSaveState(true)
        setSnackbarText(`${value.manufacturer ? value.manufacturer : ""} ${value.model} ${toastMessages.changed[language]}`)
        onToggleSnackBar()
      }

    function deleteImage(indx:number){
        const currentImages: string[] = selectedImage
        currentImages.splice(indx, 1)
        setSelectedImage(currentImages)
        setGunData({...gunData, images: currentImages})
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
            setSaveState(false)
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
            const newImage = selectedImage

            if(newImage && newImage.length != 0){
                newImage.splice(indx, 1, result.assets[0].uri)
                setSelectedImage(newImage)
                setGunData({...gunData, images:newImage})
            } else {
                setSelectedImage([result.assets[0].uri])
                if(gunData.images.length !== 0){
                    setGunData({...gunData, images:[...gunData.images, result.assets[0].uri]})
                } else {
                    setGunData({...gunData, images: [result.assets[0].uri]})
                }
            }
            setSaveState(false)
        }
    }   

    return(
        <View style={{width: "100%", height: "100%"}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => {saveState == true ? setEditGunOpen() : saveState === false ? invokeAlert() : setEditGunOpen()}} />
                <Appbar.Content title={editGunTitle[language]} />
                <Appbar.Action icon="floppy" onPress={() => save({...gunData, lastModifiedAt: new Date()})} color={saveState  == true ? "green" : saveState == false ? "red" : "black"}/>
            </Appbar>
        
            <SafeAreaView style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10"}}>
                            {Array.from(Array(5).keys()).map((_, index) =>{
                                return(
                                    <View style={styles.imageContainer} key={`slide_${index}`}>
                                        <ImageViewer isLightBox={false} selectedImage={selectedImage[index] != undefined ? selectedImage[index] : null} />
                                        <View style={{
                                            position: "absolute",
                                            bottom: 10,
                                            display: "flex",
                                            width: "100%",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <SegmentedButtons
                                                value={""}
                                                onValueChange={()=>console.log("")}
                                                style={{
                                                    width: "75%"
                                                }}
                                                buttons={[
                                                    {
                                                        value: 'camera',
                                                        icon: "camera",
                                                        style: styles.button,
                                                        onPress: ()=>pickCameraAsync(index)
                                                        
                                                    },
                                                    {
                                                        value: 'gallery',
                                                        icon: 'image-multiple-outline',
                                                        style: styles.button,
                                                        onPress: ()=>pickImageAsync(index)
                                                    },
                                                    {   value: 'delete', 
                                                        icon: 'delete',
                                                        style: styles.buttonDelete,
                                                        uncheckedColor: "red",
                                                        onPress: ()=>deleteImagePrompt(index),
                                                        disabled: selectedImage[index] ? false : true
                                                    },
                                                ]}
                                            />
                                        </View>
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
                         <NewCheckboxArea data={"status"} gunData={gunData} setGunData={setGunData}/>
                        <NewTextArea data={gunRemarks[language]} gunData={gunData} setGunData={setGunData}/>
                       
                    </View>
                </ScrollView>
            </SafeAreaView>
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
        marginRight: 5,
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    buttonDelete: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
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