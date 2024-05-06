import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useState } from 'react';
import * as SecureStore from "expo-secure-store"
import { gunDataTemplate } from "../lib/gunDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';
import ImageViewer from "./ImageViewer"
import { GUN_DATABASE } from '../configs';


export default function NewGun({setNewGunOpen}){

    const [selectedImage, setSelectedImage] = useState(null)
    const [granted, setGranted] = useState(false)
    const [gunData, setGunData] = useState({})
    
    async function save(key, value) {
        let result = await SecureStore.getItemAsync(key);
        const editedResult = result ? JSON.parse(result) : []
        editedResult.push(value)
        await SecureStore.setItemAsync(key, JSON.stringify(editedResult));
    }
    
    const pickImageAsync = async (indx) =>{
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(!permission){
            setGranted(false)
            return
        } else {
            setGranted(true)
        }

        let result = await ImagePicker.launchImageLibraryAsync({
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
                setGunData({...gunData, images:result.assets[0].uri})
            }
        }
    }   

    const pickCameraAsync = async (indx) =>{
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(!permission){
            setGranted(false)
            return
        } else {
            setGranted(true)
        }

        let result = await ImagePicker.launchCameraAsync({
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
                setGunData({...gunData, images:result.assets[0].uri})
            }
        }
    }   

    return(
        <View style={{width: "100%", height: "100%"}}>
            
            <Appbar.Header style={{width: "100%"}}>
                <Appbar.BackAction  onPress={() => setNewGunOpen(false)} />
                <Appbar.Content title={`Neue Waffe`} />
                <Appbar.Action icon="floppy" onPress={() => save(GUN_DATABASE, {...gunData, id: uuidv4(), images:selectedImage})} />
            </Appbar.Header>

            <SafeAreaView style={styles.container}>
                <ScrollView style={{width: "100%"}}>
                    <View>
                        <ScrollView horizontal style={{width:"100%", aspectRatio: "21/10"}}>  
                            {Array.from(Array(5).keys()).map((_, index) =>{
                                return(
                                    <View style={styles.imageContainer} key={`slide_${index}`}>
                                        <ImageViewer selectedImage={selectedImage && selectedImage.length > 0 ? selectedImage[index] : null} />
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