import { StyleSheet, View, ScrollView, Alert} from 'react-native';
import { Appbar, SegmentedButtons, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useState } from 'react';
import * as SecureStore from "expo-secure-store"
import { ammoDataTemplate, ammoRemarks } from "../lib/ammoDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import ImageViewer from "./ImageViewer"
import { AMMO_DATABASE } from '../configs';
import { AmmoType } from '../interfaces';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { editGunTitle, imageDeleteAlert, toastMessages, unsavedChangesAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import NewChipArea from './NewChipArea';


export default function EditAmmo(){

    const { currentAmmo, setCurrentAmmo } = useAmmoStore()

    const [selectedImage, setSelectedImage] = useState<string[]>(currentAmmo.images && currentAmmo.images.length !== 0 ? currentAmmo.images : [])
    const [granted, setGranted] = useState<boolean>(false)
    const [ammoData, setAmmoData] = useState<AmmoType>(currentAmmo)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean | null>(null)

    const { language, theme } = usePreferenceStore()
    const { setEditAmmoOpen } = useViewStore()

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  function invokeAlert(){
    Alert.alert(unsavedChangesAlert.title[language], unsavedChangesAlert.subtitle[language], [
        {
            text: unsavedChangesAlert.yes[language],
            onPress: setEditAmmoOpen
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

    async function save(value: AmmoType) {
        await SecureStore.setItemAsync(`${AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the ammo
        setCurrentAmmo({...value, images:selectedImage})
        setSaveState(true)
        setSnackbarText(`${value.designation} ${value.manufacturer ? value.manufacturer : ""} ${toastMessages.changed[language]}`)
        onToggleSnackBar()
      }

    function deleteImage(indx:number){
        const currentImages: string[] = selectedImage
        currentImages.splice(indx, 1)
        setSelectedImage(currentImages)
        setAmmoData({...ammoData, images: currentImages})
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
                setAmmoData({...ammoData, images:newImage})
            } else {
                setSelectedImage([result.assets[0].uri])
                setAmmoData({...ammoData, images:[result.assets[0].uri]})
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
            console.log(ammoData)
            if(newImage && newImage.length != 0){
                newImage.splice(indx, 1, result.assets[0].uri)
                setSelectedImage(newImage)
                setAmmoData({...ammoData, images:newImage})
            } else {
                setSelectedImage([result.assets[0].uri])
                if(ammoData.images.length !== 0){
                    setAmmoData({...ammoData, images:[...ammoData.images, result.assets[0].uri]})
                } else {
                    setAmmoData({...ammoData, images: [result.assets[0].uri]})
                }
            }
            setSaveState(false)
        }
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
            backgroundColor: theme.colors.primaryContainer
        },
        buttonDelete: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.primaryContainer
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

    return(
        <View style={{width: "100%", height: "100%", backgroundColor: theme.colors.background}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => {saveState == true ? setEditAmmoOpen() : saveState === false ? invokeAlert() : setEditAmmoOpen()}} />
                <Appbar.Content title={editGunTitle[language]} />
                <Appbar.Action icon="floppy" onPress={() => save({...ammoData, lastModifiedAt: new Date()})} color={saveState  == true ? "green" : saveState == false ? theme.colors.error : theme.colors.onBackground}/>
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
                                                onValueChange={()=>console.log("i cant leave this function empty so heres a console log")}
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