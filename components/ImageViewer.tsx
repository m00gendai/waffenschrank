import { Image, StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView, PinchGesture, PanGesture, SimultaneousGesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { defaultViewPadding } from '../configs';
import { IconButton } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';

interface Props{
  selectedImage:string
  isLightBox: boolean
  placeholder?: "gun" | "ammo"
}

export default function ImageViewer({selectedImage, isLightBox, placeholder}:Props){

    const scale = useSharedValue<number>(1);
    const savedScale = useSharedValue<number>(1);
    const positionX = useSharedValue<number>(0)
    const positionY = useSharedValue<number>(0)
    const barrierX = useSharedValue<number>(0)
    const barrierY = useSharedValue<number>(0)

    const { language, theme, generalSettings } = usePreferenceStore()
  
    const pinchGesture: PinchGesture = Gesture.Pinch().runOnJS(true)
      .onUpdate((e) => {
        scale.value = savedScale.value * e.scale > 1 ? savedScale.value * e.scale : 1
      })
      .onEnd(() => {
        savedScale.value = scale.value
      });

    const panGesture: PanGesture = Gesture.Pan().runOnJS(true)
    .onChange((e) => {
        barrierX.value = (scale.value*100)/2
        barrierY.value = (scale.value*100)/2
        // scale 1 = 0 , scale 2 = 100 --- -100 -> scale*100-100 (1*100-100 = 0, 2*100-100 = 100)

        // Proper barrier handling doesnt work consistenly yet but it at least works a bit

        if(e.velocityX > 0 && (positionX.value + e.changeX/scale.value) < barrierX.value){
          positionX.value += (e.changeX / scale.value)
        }
        if(e.velocityX < 0 && (positionX.value + e.changeX/scale.value) > parseFloat(`-${barrierX.value}`)){
          positionX.value += (e.changeX / scale.value)
        }
        
        if(e.velocityY > 0 && (positionY.value + e.changeY/scale.value) < barrierY.value){
          positionY.value += (e.changeY / scale.value)
        } 
        if(e.velocityY < 0 && (positionY.value + e.changeY/scale.value) > parseFloat(`-${barrierY.value}`)){
          positionY.value += (e.changeY / scale.value)
        } 


      
      });
  

    const composed:SimultaneousGesture = Gesture.Simultaneous(pinchGesture,panGesture)
    const animatedStyle = useAnimatedStyle(() => ({
        /*@ts-expect-error*/
        transform: [{ scale: scale.value}, {translateX: positionX.value }, {translateY: positionY.value }],
      }));

    return(
      <>
        {isLightBox ?
          <View style={{width: "100%", height: "100%", padding: defaultViewPadding, backgroundColor: isLightBox ? "black" : "transparent", alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "hidden"}}>
            <View style={styles.container}>
                <GestureHandlerRootView style={styles.imageContainer2} >
                    <GestureDetector gesture={composed}>
                        <Animated.View style={[animatedStyle]} >
                         <Image resizeMode={isLightBox ? "contain" : "cover"} style={styles.image} source={selectedImage ? {uri: selectedImage} : placeholder === "ammo" ? require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`) : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} />
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>
          </View>
        :
        <View style={{height: "100%", aspectRatio: "21/10", padding: defaultViewPadding, backgroundColor: isLightBox ? "black" : "transparent", alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "hidden"}}>
          {selectedImage != null ? <Image resizeMode={isLightBox ? "contain" : "cover"} style={styles.image} source={{uri: selectedImage} } /> 
        :  <Image resizeMode={isLightBox ? "contain" : "cover"} style={styles.image} source={selectedImage ? {uri: selectedImage} : placeholder === "ammo" ? require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`) : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} />
          }</View>}</>
    ) 
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    imageContainer2: {
        width: "100%",
        flex: 1,
        overflow: "hidden"
    },
    gesture: {
        width: "100%",
        height: "50%",
        overflow: "hidden"
    },
   image:{
    width: "100%",
    height: "100%"
   }
})