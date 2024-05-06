import { Image, StyleSheet, View } from 'react-native';
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
    const position = useSharedValue(0)
  
    const pinchGesture = Gesture.Pinch()
      .onUpdate((e) => {
        runOnJS(scale.value = savedScale.value * e.scale > 1 ? savedScale.value * e.scale : 1)
      })
      .onEnd(() => {
        runOnJS(savedScale.value = scale.value)
      });

    const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        if (onLeft.value) {
          position.value = e.translationX;
        } else {
          position.value = END_POSITION + e.translationX;
        }
      })
      .onEnd((e) => {
        if (position.value > END_POSITION / 2) {
          position.value = withTiming(END_POSITION, { duration: 100 });
          onLeft.value = false;
        } else {
          position.value = withTiming(0, { duration: 100 });
          onLeft.value = true;
        }
      });
  

    const composed = Gesture.Simultaneous(pinchGesture,panGesture)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value}, {translateX: position.value }],
      }));


    return(
        <View style={{width: "100%", height: "100%", backgroundColor: "black", flex: 29, alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "hidden"}}>
            {isLightBox ?
            <View style={styles.container}>
            <GestureHandlerRootView style={styles.imageContainer2} >
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