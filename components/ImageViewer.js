import { Image, StyleSheet, View } from 'react-native';
import { useState } from "react"
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withTiming
  } from 'react-native-reanimated';


export default function ImageViewer({selectedImage, isLightBox}){

    const END_POSITION = 200;

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const onLeft = useSharedValue(true);
    const onUp = useSharedValue(true);
    const positionX = useSharedValue(0)
    const positionY = useSharedValue(0)
    const barrierX = useSharedValue(0)
    const barrierY = useSharedValue(0)
    const [containerWidth, setContainerWidth] = useState(0)
  
    const pinchGesture = Gesture.Pinch()
      .onUpdate((e) => {
        runOnJS(scale.value = savedScale.value * e.scale > 1 ? savedScale.value * e.scale : 1)
      })
      .onEnd(() => {
        runOnJS(savedScale.value = scale.value)
      });

    const panGesture = Gesture.Pan().runOnJS(true)
    .onChange((e) => {
        console.log(`X : ${Math.ceil(positionX.value)}`)
        console.log(`Y : ${Math.ceil(positionY.value)}`)
        console.log(`S : ${Math.ceil(scale.value)}`)
        console.log(`V : ${(Math.ceil(scale.value*100)/2)}`)
        console.log(e.velocityY)
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
  

    const composed = Gesture.Simultaneous(pinchGesture,panGesture)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value}, {translateX: positionX.value }, {translateY: positionY.value }],
      }));

      function getContainerSize(layout){
        console.log(layout)
        setContainerWidth(layout.width)
      }


    return(
        <View style={{width: "100%", height: "100%", backgroundColor: "black", flex: 29, alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "hidden"}}>
        {isLightBox ?
            <View style={styles.container}>
                <GestureHandlerRootView style={styles.imageContainer2} onLayout={(e)=>getContainerSize(e.nativeEvent.layout)}>
                    <GestureDetector gesture={composed} style={styles.gesture}>
                        <Animated.View style={[animatedStyle]} >
                            <Image resizeMode={isLightBox ? "contain" : "cover"} style={styles.image} source={{uri: selectedImage}} />
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>
        :
            <Image resizeMode={isLightBox ? "contain" : "cover"} style={styles.image} source={{uri: selectedImage}} />
        }
        </View>
        
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