import { StyleSheet, View, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Appbar, Button, Dialog, FAB, Snackbar, Text } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import NewText from "./NewText"
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';
import ImageViewer from "./ImageViewer"
import { AmmoType, AmmoTypeWithDbId, CollectionItems, CollectionItemsWithId, GunType, GunTypeWithDbId } from '../interfaces';
import { ammoDataValidation, getItemTemplate, getItemTemplateRemarks, getNewItemTitle, getSchema, gunDataValidation, imageHandling, returnCompareObject, setSnackbarTextSave } from '../utils';
import NewTextArea from './NewTextArea';
import NewCheckboxArea from './NewCheckboxArea';
import { newGunTitle, toastMessages, unsavedChangesAlert, validationFailedAlert } from '../lib/textTemplates';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useViewStore } from '../stores/useViewStore';
import NewChipArea from './NewChipArea';
import { useItemStore } from "../stores/useItemStore";
import * as FileSystem from 'expo-file-system';
import { db } from "../db/client"


export default function NewItem({navigation, route}){

    const { itemType } = route.params
    const databaseEntry = getSchema(itemType)
    const template = getItemTemplate(itemType)
    const remarks = getItemTemplateRemarks(itemType)

    const { language, theme, generalSettings } = usePreferenceStore()
    const { setHideBottomSheet } = useViewStore()
    const { currentItem, setCurrentItem } = useItemStore()
    console.log("currentItem")
console.log(currentItem)
    const [selectedImage, setSelectedImage] = useState<string[]>(currentItem ? currentItem.images : [])
    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [granted, setGranted] = useState<boolean>(false)
    console.log(currentItem ? "yes" : "no")
    const [itemData, setItemData] = useState<CollectionItems>(currentItem ? currentItem: returnCompareObject(itemType))
    console.log("itemData")
    console.log(itemData)
    const [itemDataCompare, setItemDataCompare] = useState<CollectionItems>(currentItem ? currentItem : returnCompareObject(itemType))
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
           /* if(itemData !== null){
                for(const key in itemData){
                    if(itemDataCompare !== undefined && itemData[key] !== itemDataCompare[key]){
                        setSaveState(false)
                        if(itemDataCompare[key] === null && itemData[key].length === 0){
                            setSaveState(null)
                        }
                    }
                    if(itemDataCompare && itemDataCompare[key] !== undefined && itemData && itemData[key] !== ""){
                        setSaveState(false)
                    }
                    if(itemDataCompare && itemDataCompare[key] !== undefined && itemData && itemData[key] === ""){
                        setSaveState(null)
                    }
                    if(itemDataCompare && itemDataCompare[key] !== undefined && itemData && itemData[key] !== undefined && itemData[key].length === 0){
                        setSaveState(null)
                    }
                }
            } */
        }
      },[itemData])

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

    async function save(value:CollectionItemsWithId) {
        const validationResult:{field: string, error: string}[] = itemType === "Gun" ? gunDataValidation(value as GunTypeWithDbId, language) : ammoDataValidation(value as AmmoTypeWithDbId, language)
        if(validationResult.length != 0){
            Alert.alert(validationFailedAlert.title[language], `${validationResult.map(result => `${result.field}: ${result.error}`)}`, [
                {
                    text: validationFailedAlert.no[language],
                    style: "cancel"
                }
            ])
            return
        }
        
        const {db_id, ...idless} = value
        await db.insert(databaseEntry).values(idless)
        console.log(`Saved item ${JSON.stringify(idless)}`)
        setSaveState(true)
        setSnackbarText(setSnackbarTextSave(itemType, value, language))
        onToggleSnackBar()
        setCurrentItem({...itemData, id: value.id})
        setItemData(null)
        navigation.navigate("Item", {itemType: itemType})
    }

    function saveImages(fileName:string, indx: number){
        const newImage = selectedImage;
            if (newImage.length !== 0) {
                const newArr = newImage.toSpliced(indx, 1, fileName);
                setSelectedImage(newArr);
                setItemData({ ...itemData, images: newArr});
            } else {
                setSelectedImage([fileName]);
                if (itemData && itemData.images.length !== 0) {
                    setItemData({ ...itemData, images: [...itemData.images, fileName]});
                } else {
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

useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (saveState === null) {
        setHideBottomSheet(false)
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

      setHideBottomSheet(false)
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
                <Appbar.Content title={getNewItemTitle(itemType, language)} />
                <Appbar.Action icon="floppy" onPress={() => save({...itemData, db_id: null, id: uuidv4(), images:selectedImage, createdAt: new Date().getTime(), lastModifiedAt: new Date().getTime()})} color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"} />
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