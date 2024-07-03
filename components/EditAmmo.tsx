import { StyleSheet, View, ScrollView, Alert} from 'react-native';
import { Appbar, Button, Dialog, Portal, SegmentedButtons, Snackbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store"
import { ammoDataTemplate, ammoRemarks } from "../lib/ammoDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import ImageViewer from "./ImageViewer"
import { AMMO_DATABASE } from '../configs';
import { AmmoType } from '../interfaces';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { editAmmoTitle, editGunTitle, imageDeleteAlert, toastMessages, unsavedChangesAlert, validationFailedAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import NewChipArea from './NewChipArea';
import * as FileSystem from 'expo-file-system';
import { ammoDataValidation, imageHandling } from '../utils';


export default function EditAmmo({navigation}){

    const { currentAmmo, setCurrentAmmo, ammoCollection, setAmmoCollection } = useAmmoStore()
    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [selectedImage, setSelectedImage] = useState<string[]>(currentAmmo.images && currentAmmo.images.length !== 0 ? currentAmmo.images : [])
    const [granted, setGranted] = useState<boolean>(false)
    const [ammoData, setAmmoData] = useState<AmmoType>(currentAmmo)
    const [ammoDataCompare, setAmmoDataCompare] = useState<AmmoType>(currentAmmo)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean | null>(null)
    const [imageDialogVisible, toggleImageDialogVisible] = useState<boolean>(false)
    const [unsavedVisible, toggleUnsavedDialogVisible] = useState<boolean>(false)
    const [deleteImageIndex, setDeleteImageIndex] = useState<number>(0)

    const { language, theme, generalSettings } = usePreferenceStore()
    const { setEditAmmoOpen } = useViewStore()

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

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
            if(!(key in ammoDataCompare) && ammoData[key].length === 0){
                setSaveState(null)
            }
        }
    }
  },[ammoData])

    async function save(value: AmmoType) {
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
        await SecureStore.setItemAsync(`${AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the ammo
        setCurrentAmmo({...value, images:selectedImage})
        setSaveState(true)
        setSnackbarText(`${value.designation} ${value.manufacturer ? value.manufacturer : ""} ${toastMessages.changed[language]}`)
        onToggleSnackBar()
        const currentObj:AmmoType = ammoCollection.find(({id}) => id === value.id)
        const index:number = ammoCollection.indexOf(currentObj)
        const newCollection:AmmoType[] = ammoCollection.toSpliced(index, 1, value)
        setAmmoCollection(newCollection)
      }

    function deleteImage(indx:number){
        const currentImages: string[] = selectedImage
        currentImages.splice(indx, 1)
        setSelectedImage(currentImages)
        setAmmoData({...ammoData, images: currentImages})
        toggleImageDialogVisible(false)
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
                setAmmoData({ ...ammoData, images: newImage });
            } else {
                setSelectedImage([newPath]);
                if (ammoData && ammoData.images && ammoData.images.length !== 0) {
                    setAmmoData({ ...ammoData, images: [...ammoData.images, newPath] });
                } else {
                    setAmmoData({ ...ammoData, images: [newPath] });
                }
            }
        } catch (error) {
            console.error('Error saving image:', error);
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
                setAmmoData({ ...ammoData, images: newImage });
            } else {
                setSelectedImage([newPath]);
                if (ammoData && ammoData.images && ammoData.images.length !== 0) {
                    setAmmoData({ ...ammoData, images: [...ammoData.images, newPath] });
                } else {
                    setAmmoData({ ...ammoData, images: [newPath] });
                }
            }
        } catch (error) {
            console.error('Error saving image:', error);
        }
    }  
    }   

    function deleteImagePrompt(index:number){
       setDeleteImageIndex(index)
       toggleImageDialogVisible(true)
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
        <View style={{flex: 1}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => {saveState === true ? navigation.goBack() : saveState === false ? toggleUnsavedDialogVisible(true) : navigation.goBack()}} />
                <Appbar.Content title={editAmmoTitle[language]} />
                <Appbar.Action icon="floppy" onPress={() => save({...ammoData, lastModifiedAt: `${new Date()}`})} color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"}/>
            </Appbar>
        
            <View style={styles.container}>
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

            
                <Dialog visible={imageDialogVisible} onDismiss={()=>toggleImageDialogVisible(false)}>
                    <Dialog.Title>
                    {`${imageDeleteAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Actions>
                        <Button onPress={()=>deleteImage(deleteImageIndex)} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{imageDeleteAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImageDialogVisible(false)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{imageDeleteAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>
                   

            
                <Dialog visible={unsavedVisible} onDismiss={()=>toggleUnsavedDialogVisible(!unsavedVisible)}>
                    <Dialog.Title>
                    {`${unsavedChangesAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${unsavedChangesAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={setEditAmmoOpen} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{unsavedChangesAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleUnsavedDialogVisible(!unsavedVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{unsavedChangesAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>
                     

        </View>
    )
}


  