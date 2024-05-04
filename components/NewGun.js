import { Image, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker"
import { useState } from 'react';
import { testGun } from "../lib/testGun"

export default function NewGun(){

    const [selectedImage, setSelectedImage] = useState(null)

    const pickImageAsync = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        })
        if(!result.canceled){
            setSelectedImage(result.assets[0].uri)
        }
    }   

    return(
        <SafeAreaView style={styles.container}>
            <Text style={{
                width: "100%",
                fontSize: 30
            }}>K31</Text>
            <TouchableNativeFeedback onPress={pickImageAsync}>
            <View style={styles.imageContainer} >
                <Image source={selectedImage ? {uri: selectedImage} : null} style={styles.image} />
                
            </View>
            </TouchableNativeFeedback>
            <View style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "column",
                width: "100%"
            }}>
                 {testGun.map(data=>{
                        return(
                            <View 
                            id={data.key}
                            style={{
                                display: "flex",
                                flexWrap: "nowrap",
                                flexDirection: "row",
                                width: "100%",
                                gap: 5
                            }}>
                                <Text style={{flex: 1}}>{data.key}</Text>
                                <Text style={{flex: 1}}>{data.value}</Text>
                            </View>
                        )
                    })}
                   
                    
            </View>
        </SafeAreaView>

        
    )
}

const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      flexWrap: "wrap",
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-start",
      alignContent: "flex-start",
      gap: 5,
      padding: 5,
    },
    imageContainer: {
        display: "flex",
        width: "100%",
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