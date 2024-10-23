import { StyleSheet, View, ScrollView, Alert, Platform, KeyboardAvoidingView} from 'react-native';
import { Appbar, Button, Dialog, Icon, SegmentedButtons, Snackbar, Text } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useRef, useState } from 'react';
import NewText from "./NewText"
import "react-native-get-random-values"
import ImageViewer from "./ImageViewer"
import { AmmoType, CollectionItems, CollectionItemsWithId, GunType } from '../interfaces';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { editGunTitle, gunDeleteAlert, imageDeleteAlert, toastMessages, unsavedChangesAlert, validationFailedAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import { useItemStore } from "../stores/useItemStore";
import NewChipArea from './NewChipArea';
import * as FileSystem from 'expo-file-system';
import { ammoDataValidation, getDeleteDialogTitle, getItemTemplate, getItemTemplateRemarks, getSchema, gunDataValidation, imageHandling, setSnackbarTextSave } from '../utils';
import { db } from "../db/client"
import * as schema from "../db/schema"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql } from 'drizzle-orm';

export default function EditItem({route, navigation}){

    const { language, theme, generalSettings } = usePreferenceStore()
    const { setHideBottomSheet } = useViewStore()
    const { currentItem, setCurrentItem } = useItemStore()

    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [selectedImage, setSelectedImage] = useState<string[]>(currentItem.images && currentItem.images.length != 0 ? currentItem.images : [])
    const [granted, setGranted] = useState<boolean>(false)
    const [itemData, setItemData] = useState<CollectionItems>(currentItem)
    const [itemDataCompare, setItemDataCompare] = useState<CollectionItems>(currentItem)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean | null>(null)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)
    const [imageDialogVisible, toggleImageDialogVisible] = useState<boolean>(false)
    const [unsavedVisible, toggleUnsavedDialogVisible] = useState<boolean>(false)
    const [deleteImageIndex, setDeleteImageIndex] = useState<number>(0)
    const [exitAction, setExitAction] = useState(null);
    const aboutToDeleteRef = useRef<boolean>(false);

    const { itemType } = route.params
    const databaseEntry = getSchema(itemType)
    const template = getItemTemplate(itemType)
    const remarks = getItemTemplateRemarks(itemType)

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(()=>{
    if(initCheck){
        setInitCheck(false)
    }
    if(!initCheck){
        setSaveState(null)
        for(const key in itemData){
            if(itemData[key] !== itemDataCompare[key]){
                setSaveState(false)
                if(itemDataCompare[key] === null && itemData[key].length === 0){
                    setSaveState(null)
                }
            }
            if(!(key in itemDataCompare) && itemData[key] !== ""){
                setSaveState(false)
            }
            if(!(key in itemDataCompare) && itemData[key] === ""){
                setSaveState(null)
            }
            if(!(key in itemDataCompare) && itemData[key] !== undefined && itemData[key].length === 0){
                setSaveState(null)
            }
        }
    }
  },[itemData])

    async function save(value: CollectionItems) {
        const validationResult:{field: string, error: string}[] = itemType === "Gun" ? gunDataValidation(value as GunType, language) : ammoDataValidation(value as AmmoType, language)
        if(validationResult.length != 0){
            Alert.alert(validationFailedAlert.title[language], `${validationResult.map(result => `${result.field}: ${result.error}`)}`, [
                {
                    text: validationFailedAlert.no[language],
                    style: "cancel"
                }
            ])
            return
        }
        await db.update(databaseEntry).set(value).where((eq(databaseEntry.id, value.id)))
        console.log(`Saved item ${JSON.stringify(value)}`)
        setCurrentItem({...value, images:selectedImage})
        setSaveState(true)
        setSnackbarText(setSnackbarTextSave(itemType, value, language))
        onToggleSnackBar()
      }

    function deleteImage(indx:number){
        const currentImages: string[] = selectedImage
        currentImages.splice(indx, 1)
        setSelectedImage(currentImages)
        setItemData({...itemData, images: currentImages})
        toggleImageDialogVisible(false)
    }

    function saveImages(fileName:string, indx: number){
        const newImage = selectedImage;
            if (newImage.length !== 0) {
                const newArr = newImage.toSpliced(indx, 1, fileName);
                setSelectedImage(newArr);
                console.log(newArr.join(","))
                setItemData({ ...itemData, images: newArr});
            } else {
                setSelectedImage([fileName]);
                if (itemData && itemData.images.length !== 0) {
                    setItemData({ ...itemData, images: [...itemData.images, fileName]});
                } else {
                    console.log(fileName)
                    setItemData({ ...itemData, images: [fileName]});
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
            backgroundColor: theme.colors.background
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

      useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if(aboutToDeleteRef.current){
            return
        }
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

      function handleDeleteItem(){
        aboutToDeleteRef.current = true;
      deleteItem()
    }


    async function deleteItem(){
        await db.delete(schema.gunCollection).where(eq(schema.gunCollection.id, currentItem.id));
        toggleDialogVisible(false)
        navigation.navigate("GunCollection")
        setHideBottomSheet(false)
        aboutToDeleteRef.current = false
    }

    return(
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.goBack()} />
                <Appbar.Content title={editGunTitle[language]} />
                <Appbar.Action icon="delete" onPress={()=>toggleDialogVisible(!dialogVisible)} color='red'/>
                <Appbar.Action icon="floppy" onPress={() => save({...itemData, lastModifiedAt: new Date().getTime()})} color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"}/>
            </Appbar>
        
            <View style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "23/10"}}>
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
                        <NewChipArea itemType={itemType} data={"status"} itemData={itemData} setItemData={setItemData}/>
                        {template.map(data=>{
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
                                    <NewText itemType={itemType} data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]}/>
                                </View>
                            )
                        })}
                         {itemType === "Gun" ? <NewCheckboxArea gunData={itemData as GunType} setGunData={setItemData}/> : null}
                        <NewTextArea itemType={itemType} data={remarks.name} itemData={itemData} setItemData={setItemData}/>
                        
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
                        <Button onPress={handleDiscard} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{unsavedChangesAlert.yes[language]}</Button>
                        <Button onPress={handleCancel} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{unsavedChangesAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>


                        <Dialog visible={dialogVisible} onDismiss={()=>toggleDialogVisible(!dialogVisible)}>
                            <Dialog.Title>
                            {`${getDeleteDialogTitle(currentItem, itemType, language)}`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text>{`${gunDeleteAlert.subtitle[language]}`}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>handleDeleteItem()} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{gunDeleteAlert.yes[language]}</Button>
                                <Button onPress={()=>toggleDialogVisible(!dialogVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{gunDeleteAlert.no[language]}</Button>
                            </Dialog.Actions>
                        </Dialog>
              
                    
                   
        </KeyboardAvoidingView>
    )
}
