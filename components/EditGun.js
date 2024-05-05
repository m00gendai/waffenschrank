import { Image, StyleSheet, Text, TouchableNativeFeedback, View, ScrollView, Platform} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useState, useEffect } from 'react';
import * as SecureStore from "expo-secure-store"
import { gunDataTemplate } from "../lib/gunDataTemplate"
import NewText from "./NewText"
import "react-native-get-random-values"
import { v4 as uuidv4 } from 'uuid';

async function save(key, value) {
    let result = await SecureStore.getItemAsync(key);
    const nerw = result ? JSON.parse(result) : []
    const index = nerw.findIndex(item =>{
        if(value.id === item.id){
            return true
        }
        return false
     })
    await SecureStore.setItemAsync(key, JSON.stringify(nerw));
    
  }


export default function EditGun({setEditGunOpen, gun}){

    const [selectedImage, setSelectedImage] = useState(null)
    const [granted, setGranted] = useState(false)
    const [gunData, setGunData] = useState(gun)
    
  
    const pickImageAsync = async () =>{

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(permission){
            setGranted(true)
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        })
        if(!result.canceled && granted){
            setSelectedImage(result.assets[0].uri)
        }
    }   

    return(
        <SafeAreaView style={styles.container}>
            <Button mode="contained" onPress={()=>setEditGunOpen(false)}>X</Button>
            <Text style={{
                width: "100%",
                fontSize: 30
            }}>{gun.Modellbezeichnung}</Text>
            <TouchableNativeFeedback onPress={pickImageAsync}>
            <View style={styles.imageContainer} >
                <Image source={selectedImage ? {uri: selectedImage} : null} style={styles.image} />
                
            </View>
            </TouchableNativeFeedback>
            <ScrollView style={{
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
                     
                    
            </ScrollView>
            <Button icon="floppy" mode="contained" onPress={() => save("gunx", gunData)}></Button>
        </SafeAreaView>

        
    )
}

const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      flexWrap: "wrap",
      flexDirection: "column",
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-start",
      alignContent: "flex-start",
      gap: 5,
      padding: 5,
    },
    imageContainer: {
        display: "flex",
        width: "60%",
        aspectRatio: "1/1",
        backgroundColor: "red",
        flexDirection: "column"
    },
    image: {
        width: "100%",
        height: "100%",
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
  });