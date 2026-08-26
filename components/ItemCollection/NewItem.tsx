import { StyleSheet, View, ScrollView, Alert, Platform, KeyboardAvoidingView, ColorValue, Dimensions } from 'react-native';
import { Appbar, Button, Dialog, IconButton, Text } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useRef, useState } from 'react';
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';
import ImageViewer from "components/ImageViewer"
import { ItemType, ItemTypeWithDbId } from 'lib/interfaces';
import { generateGradient, imageHandling, itemDataValidation } from 'functions/utils';
import NewTextArea from 'components/NewTextArea';
import NewCheckboxArea from 'components/NewCheckboxArea';
import { usePreferenceStore } from 'stores/usePreferenceStore';
import NewChipArea from 'components/NewChipArea';
import { File, Directory, Paths } from 'expo-file-system';
import * as schema from "db/schema"
import { db } from "db/client"
import { caliberPickerTriggerFields, codeTriggerFields, colorPickerTriggerFields, datePickerTriggerFields, defaultViewPadding, fieldsForAutocomplete, intervalPickerTriggerFields, mountedOnTriggerFields, nonFreeTextFields } from 'configs/configs';
import NewText_DatePicker from 'components/NewText_DatePicker';
import NewText_ColorPicker from 'components/NewText_ColorPicker';
import NewText_CaliberPicker from 'components/NewText_CaliberPicker';
import NewText_IntervalPicker from 'components/NewText_IntervalPicker';
import NewText_Text from 'components/NewText_Text';
import { useItemStore } from 'stores/useItemStore';
import { determineDataTemplate, determineEmptyObject, determineNewItemTitle, determineRemarkDataTemplate } from 'functions/determinators';
import { useViewStore } from 'stores/useViewStore';
import NewText_MountedOnPicker from 'components/NewText_MountedOnPicker';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { useTextStore } from 'stores/useTextStore';
import NewText_CodeScanner from 'components/NewText_CodeScanner';
import { imageDeleteAlert, unsavedChangesAlert, validationFailedAlert } from 'lib/Text/text_alerts';
import { toastMessages } from 'lib/Text/text_toastMessages';
import { eq, asc, inArray } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';


export default function NewItem({navigation}){
    
    const { language, theme, generalSettings, country } = usePreferenceStore()
    const { currentItem, setCurrentItem, currentCollection, setCurrentCollection } = useItemStore()
    const { setHideBottomSheet, setAlohaSnackbarVisible } = useViewStore()
    const { setAlohaSnackbarText } = useTextStore()

    const [uniqueId, setUniqueId] = useState(uuidv4())
    const [selectedImage, setSelectedImage] = useState<string[]>(currentItem ? currentItem.images : null)
    const [initCheck, setInitCheck] = useState<boolean>(true)
    const [granted, setGranted] = useState<boolean>(false)
    const [itemData, setItemData] = useState<ItemType>(currentItem ? {...currentItem, id: uniqueId} : {...determineEmptyObject(currentCollection), id: uniqueId})
    const [itemDataCompare, setItemDataCompare] = useState<ItemType>(currentItem ? {...currentItem, id: uniqueId} : determineEmptyObject(currentCollection))
    const [saveState, setSaveState] = useState<boolean>(null)
    const [unsavedVisible, toggleUnsavedDialogVisible] = useState<boolean>(false)
    const [imageDialogVisible, toggleImageDialogVisible] = useState<boolean>(false)
    const [deleteImageIndex, setDeleteImageIndex] = useState<number>(0)
    const [exitAction, setExitAction] = useState(null);

    const carouselRef = useRef<ICarouselInstance>(null)
    const progress = useSharedValue<number>(0)

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

    const { data: allAutocompleteData } = useLiveQuery(
    db.select()
    .from(schema.autocomplete)
    .where(inArray(schema.autocomplete.field, fieldsForAutocomplete))
)

    async function save(value:ItemTypeWithDbId) {
        const validationResult:{field: string, error: string}[] = itemDataValidation(currentCollection, value, language)
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
        
        try{
            await db.insert(schema[currentCollection]).values(idless)
        } catch(e){
            console.error(e)
        }
        
        if(currentCollection.startsWith("accessoryCollection_")){
            await db.insert(schema.accessoryCollection).values({
                id: idless.id,
                type: currentCollection
            })
        }
        if(currentCollection.startsWith("partCollection_")){
            await db.insert(schema.partCollection).values({
                id: idless.id,
                type: currentCollection
            })
        }

        for (const [key, value] of Object.entries(idless)) {
            if(!fieldsForAutocomplete.includes(key)){
                continue
            }

            if(typeof value !== "string"){
                continue
            }
            if(value.trim().length === 0){
                continue
            }

            await db.insert(schema.autocomplete).values({
                id: uuidv4(),
                label: value,
                field: key
            }).onConflictDoNothing();
        }

        setSaveState(true)
        setAlohaSnackbarText(`${"manufacturer" in value && value.manufacturer ? value.manufacturer : ""} ${"model" in value ? value.model : "designation" in value ?  value.designation : value.title} ${toastMessages.saved[language]}`)
        setAlohaSnackbarVisible(true)
        setCurrentItem({...itemData, id: value.id})
        navigation.navigate("item")
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
            quality: 0.8,
            base64: false,
            exif: false,
        })

        if(!result.canceled){

            const manipImage = await imageHandling(result, generalSettings.resizeImages)
           
            const file = new File(manipImage.uri)
            const destination = new Directory(Paths.document)

            try {
                file.move(destination)
            
                const fileName = manipImage.uri.split('/').pop()
                const permanentUri = `${Paths.document.uri}${fileName}`

                const newImage = selectedImage;
                if (newImage && newImage.length !== 0) {
                    const newImages = [...selectedImage]
                    newImages.splice(indx, 1, permanentUri)
                    setSelectedImage(newImages)
                    setItemData({ ...itemData, images: newImages })
                } else {
                    setSelectedImage([permanentUri]);
                    if (itemData && itemData.images && itemData.images.length !== 0) {
                        setItemData({ ...itemData, images: [...itemData.images, permanentUri] });
                    } else {
                        setItemData({ ...itemData, images: [permanentUri] });
                    }
                }
            } catch (error) {
                console.error('Error saving image:', error);
            } finally{
                try {
                    const imageManipulatorCache = new Directory(`${Paths.cache.uri}ImageManipulator/`)
                    const imagePickerCache = new Directory(`${Paths.cache.uri}ImagePicker/`)
                    console.log(`Cache Size Image Manipulator pre clear: ${imageManipulatorCache.size}`)
                    console.log(`Cache Size Image Picker pre clear: ${imagePickerCache.size}`)
                    if(imageManipulatorCache.exists){
                        imageManipulatorCache.delete()
                        console.info("Cleared Image Manipulator Cache")
                    } 
                    if(imagePickerCache.exists){
                        imagePickerCache.delete()
                        console.info("Cleared Image Picker Cache")
                    }
                    console.log(`Cache Size Image Manipulator post clear: ${imageManipulatorCache.size}`)
                    console.log(`Cache Size Image Picker pre post: ${imagePickerCache.size}`)
                } catch (cacheError) {
                    console.warn("Failed to clear image cache:", cacheError)
                }
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
            quality: 0.8,
            base64: false,
            exif: false,
        })

        if(!result.canceled){

            const manipImage = await imageHandling(result, generalSettings.resizeImages)
            
            const file = new File(manipImage.uri)
            const destination = new Directory(Paths.document)
   
            try {
                file.move(destination)

                const fileName = manipImage.uri.split('/').pop()
                const permanentUri = `${Paths.document.uri}${fileName}`

                const newImage = selectedImage;
                if (newImage && newImage.length !== 0) {
                    const newImages = [...selectedImage]
                    newImages.splice(indx, 1, permanentUri)
                    setSelectedImage(newImages)
                    setItemData({ ...itemData, images: newImages })
                } else {
                    setSelectedImage([permanentUri]);
                    if (itemData && itemData.images && itemData.images.length !== 0) {
                        setItemData({ ...itemData, images: [...itemData.images, permanentUri] });
                    } else {
                        setItemData({ ...itemData, images: [permanentUri] });
                    }
                }
            } catch (error) {
                console.error('Error saving image:', error);
            } finally {
                try {
                    const imageManipulatorCache = new Directory(`${Paths.cache.uri}ImageManipulator/`)
                    const imagePickerCache = new Directory(`${Paths.cache.uri}ImagePicker/`)
                    console.log(`Cache Size Image Manipulator pre clear: ${imageManipulatorCache.size}`)
                    console.log(`Cache Size Image Picker pre clear: ${imagePickerCache.size}`)
                    if(imageManipulatorCache.exists){
                        imageManipulatorCache.delete()
                        console.info("Cleared Image Manipulator Cache")
                    } 
                    if(imagePickerCache.exists){
                        imagePickerCache.delete()
                        console.info("Cleared Image Picker Cache")
                    }
                    console.log(`Cache Size Image Manipulator post clear: ${imageManipulatorCache.size}`)
                    console.log(`Cache Size Image Picker pre post: ${imagePickerCache.size}`)
                } catch (cacheError) {
                    console.warn("Failed to clear image cache:", cacheError)
                }
            }  
        }  
    } 

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if(saveState === null){
                setHideBottomSheet(false)
                return
            }
            if (saveState) {
                setHideBottomSheet(false)
                return
            }
      
            e.preventDefault()

            setExitAction(e.data.action)

            toggleUnsavedDialogVisible(true)
        });

        return unsubscribe;

    }, [navigation, saveState])

    const handleDiscard = () => {
        toggleUnsavedDialogVisible(false);
        if (exitAction) {
            setHideBottomSheet(false)
            navigation.dispatch(exitAction);
        }
    };
  
    const handleCancel = () => {
        toggleUnsavedDialogVisible(false);
    };
    
    function deleteImagePrompt(index:number){
        setDeleteImageIndex(index)
        toggleImageDialogVisible(true)
    }

    function deleteImage(indx:number){
        const currentImages: string[] = [...selectedImage]
        currentImages.splice(indx, 1)
        setSelectedImage(currentImages)
        setItemData({...itemData, images: currentImages})
        toggleImageDialogVisible(false)
    }
          
    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
        /**
         * Calculate the difference between the current index and the target index
         * to ensure that the carousel scrolls to the nearest index
         */
        count: index - progress.value,
        animated: true,
        })
    }

    function swapItems(arr: string[], from: number, to: number){
        if(to < 0 || to >= arr.length || from > selectedImage.length-1){
            return
        } 
        const copy = [...arr];
        [copy[from], copy[to]] = [copy[to], copy[from]]
        setSelectedImage(copy)
        setItemData({ ...itemData, images: copy })
    }

    function hasCountryPrefix(name: string): boolean {
        return name.length > 3 && name[2] === "_"
    }

    function matchesCountry(name: string, country: string): boolean {
        return name.slice(0, 2).toLowerCase() === country.toLowerCase();
    }
    
    return(
        <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => navigation.goBack()} />
                <Appbar.Content title={determineNewItemTitle(currentCollection)[language]} />
                <Appbar.Action 
                    icon="floppy" 
                    onPress={() => save(
                        {...itemData, 
                            db_id: null, 
                            id:uniqueId, 
                            images:selectedImage, 
                            createdAt: new Date().getTime(), 
                            lastModifiedAt: new Date().getTime()}
                    )} 
                    color={saveState === null ? theme.colors.onBackground : saveState === false ? theme.colors.error : "green"} 
                />
            </Appbar>
            <View style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <LinearGradient 
                        start={{x: 0.0, y:0.0}} end={{x: 1.0, y: 1.0}} 
                        colors={generateGradient(currentItem, theme) as [ColorValue, ColorValue, ...ColorValue[]]}
                    >
                        <View style={{width: "100%", aspectRatio: "21/10"}}>
                            <Carousel
                                loop={false}
                                width={Dimensions.get("screen").width-(defaultViewPadding)}
                                snapEnabled={true}
                                pagingEnabled={true}
                                onProgressChange={progress}
                                data={Array.from(Array(5))}
                                renderItem={({ index }) => 
                                    {
                                        return(
                                            <View key={`slides_${index}`} style={styles.imageContainer} >
                                                <ImageViewer isLightBox={false} selectedImage={selectedImage && selectedImage[index] != undefined ? selectedImage[index] : null} placeholder={currentCollection}/>
                                                <View 
                                                    style={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        width: "75%",
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-end",
                                                        padding: defaultViewPadding
                                                    }}
                                                >
                                                    <IconButton 
                                                        icon="camera" 
                                                        iconColor={theme.colors.onPrimary} 
                                                        style={{backgroundColor: theme.colors.primary}}
                                                        onPress={()=>pickCameraAsync(index)}
                                                    />
                                                    <IconButton 
                                                        icon="image-multiple-outline" 
                                                        iconColor={theme.colors.onPrimary} 
                                                        style={{backgroundColor: theme.colors.primary}}
                                                         onPress={()=>pickImageAsync(index)}
                                                    />
                                                    <IconButton 
                                                        icon="chevron-left" 
                                                        iconColor={theme.colors.onPrimary} 
                                                        style={{backgroundColor: theme.colors.primary}}
                                                            onPress={()=>swapItems(selectedImage, index, index-1)}
                                                            disabled={selectedImage ? index === 0 || index > selectedImage.length-1 : true}
                                                    />
                                                    <IconButton 
                                                        icon="chevron-right" 
                                                        iconColor={theme.colors.onPrimary} 
                                                        style={{backgroundColor: theme.colors.primary}}
                                                            onPress={()=>swapItems(selectedImage, index, index+1)}
                                                            disabled={selectedImage ? index >= selectedImage.length-1 : true}
                                                    />
                                                    <IconButton 
                                                        icon="delete" 
                                                        iconColor={theme.colors.onError} 
                                                        style={{backgroundColor: theme.colors.error}}
                                                        onPress={()=>deleteImagePrompt(index)}
                                                        disabled={selectedImage && selectedImage[index] ? false : true}
                                                    />
                                                </View>
                                            </View>
                                        )
                                    }
                                }
                            />
                        </View>
                        <Pagination.Basic
                            progress={progress}
                            data={Array.from(Array(5))}
                            dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50, height: 5, width: 5 }}
                            containerStyle={{ gap: 5, marginTop: 0, position: "absolute", bottom: 2.5 }}
                            onPress={onPressPagination}
                        />
                    </LinearGradient>
                    <View style={{
                        height: "100%",
                        width: "100%",
                        
                    }}>
                        <NewChipArea data={"status"} itemData={itemData} setItemData={setItemData}/>
                            {determineDataTemplate(currentCollection).map(data=>{
                                const isGenericField = !hasCountryPrefix(data.name)
                                    const isCurrentCountryField = hasCountryPrefix(data.name) && matchesCountry(data.name, country)
                                    const shouldShowField = isGenericField || isCurrentCountryField
                                if(shouldShowField){
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
                                        {datePickerTriggerFields.includes(data.name) ? 
                                            <NewText_DatePicker data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} /> :
                                        colorPickerTriggerFields.includes(data.name) ? 
                                            <NewText_ColorPicker data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} /> :
                                        caliberPickerTriggerFields.includes(data.name) ?
                                            <NewText_CaliberPicker data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} multiCaliber={true} /> :
                                        intervalPickerTriggerFields.includes(data.name) ? 
                                            <NewText_IntervalPicker data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} /> :
                                        mountedOnTriggerFields.includes(data.name) ?
                                            <NewText_MountedOnPicker data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} /> :
                                        codeTriggerFields.includes(data.name) ?
                                            <NewText_CodeScanner data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} /> :
                                            <NewText_Text data={data.name} itemData={itemData} setItemData={setItemData} label={data[language]} autocompleteData={allAutocompleteData?.filter(d => d.field === data.name) ?? []}/>}
                                    </View>
                                )
                            }})}
                            {currentCollection === "gunCollection" ? <NewCheckboxArea itemData={itemData} setItemData={setItemData} /> : null}
                        <NewTextArea data={determineRemarkDataTemplate(currentCollection).name} itemData={itemData} setItemData={setItemData} label={determineRemarkDataTemplate(currentCollection)[language]}/>
                    </View>
                </ScrollView>
            </View>

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

            <Dialog visible={imageDialogVisible} onDismiss={()=>toggleImageDialogVisible(false)}>
                <Dialog.Title>
                    {`${imageDeleteAlert.title[language]}`}
                </Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={()=>deleteImage(deleteImageIndex)} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{imageDeleteAlert.yes[language]}</Button>
                    <Button onPress={()=>toggleImageDialogVisible(false)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{imageDeleteAlert.no[language]}</Button>
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
    }
  });