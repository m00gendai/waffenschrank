import { Dimensions, TouchableOpacity, View } from "react-native";
import { Card, Icon, IconButton, Text } from "react-native-paper";
import { usePreferenceStore } from "stores/usePreferenceStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { defaultBottomBarHeight, defaultBottomBarTextHeight, defaultViewPadding, screenNameParamsMain } from "configs/configs";
import { Easing, useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useRef } from "react";
import BottomBar_AccessoryCollection from "./BottomBar_AccessoryCollection";
import BottomBar_LiteratureCollection from "./BottomBar_LiteratureCollection";
import { CollectionType, Screens, StackParamList } from "lib/interfaces";
import { useItemStore } from "stores/useItemStore";
import BottomBar_PartCollection from "./BottomBar_PartCollection";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { tabBarLabels } from "lib/Text/text_tabBarLabels";
import BottomBar_ReloadingCollection from "./BottomBar_ReloadingCollection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PREFERENCES } from "configs/configs_DB";
import { determineTabBarLabel } from "functions/determinators";
import { useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";

interface Props{
  screen?: string
  bottomBarRef: React.RefObject<BottomSheetMethods | null>
  snapStateRef: React.RefObject<Number | null>
  bottomBarIcon: string
}

export default function BottomBar({screen, bottomBarRef, snapStateRef, bottomBarIcon}:Props){

  const navigation = useNavigation<StackNavigationProp<StackParamList>>()
  
  const { setCurrentCollection } = useItemStore()
  const { language, theme } = usePreferenceStore()
  
  const ref = useRef<ICarouselInstance>(null);

  const progress = useSharedValue<number>(0);
  
  const data = ["Accessories", "Parts", "Literature", "Reloading"]
  
  const width = Dimensions.get("window").width;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  async function handleNavigation(
    target: Screens,
    params: { collectionType: CollectionType }
  ){
    setCurrentCollection(params.collectionType)
    
    const preferences: string | null = await AsyncStorage.getItem(PREFERENCES)
    const parsedPreferences = preferences ? JSON.parse(preferences) : {}
    
    const newPreferences = {
      ...parsedPreferences,
      currentCollection: params.collectionType
    }

    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
    navigation.navigate(target, params);
  }

    
  const handleToggleBottomSheet = () => {
    // The ref setting are handled by the onChange event of the bottom sheet itself already
    if (!bottomBarRef.current){
        return
    }
    if (snapStateRef.current === 0) {
      bottomBarRef.current.snapToIndex(1); 
      return
    }
    if (snapStateRef.current === 1) {
      bottomBarRef.current.snapToIndex(0); 
      return
    }
  }

    const animationConfigs = useBottomSheetTimingConfigs({
          duration: 350,
          easing: Easing.sin,
      })

    function handleOnPress(collection: CollectionType){
        handleNavigation("itemCollection", {collectionType: collection})
        bottomBarRef.current?.snapToIndex(0, animationConfigs)
    }

  return(
    <View style={{width: "100%", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
      
      <View style={{backgroundColor: theme.colors.inverseOnSurface, width: "100%", height: defaultBottomBarHeight, flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopColor: theme.colors.primary, borderTopWidth: 2, paddingTop: 2}}>
        
        <View style={{width: "100%", position: "absolute", left: 0, top: -30}}>
          <IconButton
            icon={bottomBarIcon}
            size={30}
            style={{alignSelf: "center"}}
            containerColor={theme.colors.primary}
            iconColor={theme.colors.onPrimary}
            contentStyle={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end"}}
            onPress={()=> handleToggleBottomSheet()}
            animated
          />
        </View>
        
        {screenNameParamsMain.map(screenName =>{
          return(
            <TouchableOpacity key={screenName} onPress={()=>handleOnPress(screenName)} style={{ alignItems: 'center' }}>
              <Icon source={screenName === "gunCollection" ? "pistol" : "ammunition"} size={24} color={screen === screenName ? theme.colors.primary : theme.colors.secondary} />
              <Text style={{ color: screen === screenName ? theme.colors.primary : theme.colors.secondary, marginTop: 4 }}>{determineTabBarLabel(screenName)[language]}</Text>
            </TouchableOpacity>
          )
        })}
      
      </View>

      <View style={{flex: 1, backgroundColor: theme.colors.inverseOnSurface, paddingBottom: defaultBottomBarTextHeight*2}}>
        <Carousel
          ref={ref}
          width={width}
          height={400}
          data={data}
          autoFillData={true}
          onProgressChange={progress}
          mode={"parallax"}
          enabled={true}
            onConfigurePanGesture={(gesture) => {
            gesture
              .activeOffsetX([-10, 10])   // activate only on horizontal swipe
              .failOffsetY([-10, 10]);    // fail on vertical swipe
          }}
          renderItem={({ index }) => (
            <Card
              style={{
                flex: 1,
                paddingTop: defaultViewPadding,
                width: width-defaultViewPadding,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
            {index === 0 ? 
              <BottomBar_AccessoryCollection handleNavigation={handleNavigation} bottomBarRef={bottomBarRef} /> :
              index=== 1 ? 
              <BottomBar_PartCollection handleNavigation={handleNavigation} bottomBarRef={bottomBarRef} /> :
              index=== 2 ? 
              <BottomBar_LiteratureCollection handleNavigation={handleNavigation} bottomBarRef={bottomBarRef} /> :
              index=== 3 ? 
              <BottomBar_ReloadingCollection handleNavigation={handleNavigation} bottomBarRef={bottomBarRef} /> :
              null}
            </Card>
          )}
        />

        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{ backgroundColor: theme.colors.secondary, borderRadius: 50 }}
          activeDotStyle={{ backgroundColor: theme.colors.primary, borderRadius: 50 }}
          containerStyle={{ gap: 5, marginTop: 10 }}
          onPress={onPressPagination}
        />
    
      </View>
    </View>
  )
}