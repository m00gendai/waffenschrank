import { Image, StyleSheet } from 'react-native';


export default function ImageViewer({selectedImage}){
    return(
        <Image resizeMode="cover" style={styles.image} source={{uri: selectedImage}} />
    ) 
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
    },
})