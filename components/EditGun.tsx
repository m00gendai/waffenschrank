import { StyleSheet, View, ScrollView, Alert} from 'react-native';
import { Appbar, FAB, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store"
import { gunDataTemplate } from "../lib/gunDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE } from '../configs';
import { GunType } from '../interfaces';

interface Props{
    setEditGunOpen: React.Dispatch<React.SetStateAction<boolean>>
    gun: GunType
    setCurrentGun: React.Dispatch<React.SetStateAction<GunType>>
}


export default function EditGun({setEditGunOpen, gun, setCurrentGun}: Props){

    const [selectedImage, setSelectedImage] = useState<string[]>(gun.images && gun.images.length != 0 ? gun.images : [])
    const [granted, setGranted] = useState<boolean>(false)
    const [gunData, setGunData] = useState<GunType>(gun)
    const [visible, setVisible] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("")
    const [saveState, setSaveState] = useState<boolean>(false)

    useEffect(()=>{
        setSaveState(false)
    },[gunData])

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  function invokeAlert(){
    Alert.alert(`Es hat nicht gespeicherte Änderungen`, `Wirklich zurück?`, [
        {
            text: "Ja",
            onPress: () => setEditGunOpen(false)
        },
        {
            text: "Nein",
            style: "cancel"
        }
    ])
}

    async function save(value: GunType) {
        await SecureStore.setItemAsync(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        console.log(`Saved item ${JSON.stringify(value)} with key ${GUN_DATABASE}_${value.id}`)
        setCurrentGun({...value, images:selectedImage})
        setSaveState(true)
        setSnackbarText(`${value.Hersteller} ${value.Modellbezeichnung} geändert`)
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
            const newImage = selectedImage

            if(newImage && newImage.length != 0){
                newImage.splice(indx, 1, result.assets[0].uri)
                setSelectedImage(newImage)
                setGunData({...gunData, images:newImage})
            } else {
                setSelectedImage([result.assets[0].uri])
                setGunData({...gunData, images:[...gunData.images, result.assets[0].uri]})
            }
        }
    }   

    return(
        <View style={{width: "100%", height: "100%"}}>
            
            <Appbar style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => {saveState ? setEditGunOpen(false) : invokeAlert()}} />
                <Appbar.Content title={`Waffe bearbeiten`} />
                <Appbar.Action icon="floppy" onPress={() => save({...gunData, lastModifiedAt: new Date()})} color={saveState ? "green" : "red"}/>
            </Appbar>
        
            <SafeAreaView style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10"}}>
                            {Array.from(Array(5).keys()).map((_, index) =>{
                                return(
                                    <View style={styles.imageContainer} key={`slide_${index}`}>
                                        <ImageViewer isLightBox={false} selectedImage={selectedImage[index] != undefined ? selectedImage[index] : null} />
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
                                    id={data}
                                    key={data}
                                    style={{
                                        display: "flex",
                                        flexWrap: "nowrap",
                                        flexDirection: "row",
                                        width: "100%",
                                        gap: 5,
                                        
                                }}>
                                    <NewText data={data} gunData={gunData} setGunData={setGunData}/>
                                </View>
                            )
                        })}
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