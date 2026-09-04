import { ScrollView, TouchableNativeFeedback, View, Dimensions, Image } from "react-native"
import { useViewStore } from "stores/useViewStore"
import { Icon } from "react-native-paper"
import { usePreferenceStore } from "stores/usePreferenceStore"
import { useEffect } from "react"
import Statistics from "./Statistics/Statistics"
import About from "./About"
import Settings from "./Settings/Settings"
import DatabaseOperations from "./DatabaseOperations"
import Lists from "./Lists"
import LanguageSelection from "./LanguageSelection"
import EditData from "./EditData/EditData"
import VersionHistory from "./VersionHistory/VersionHistory"
import QRCodes from "./QRCodes/QRCodes"
import { defaultViewPadding } from "configs/configs"
import { determineCountryImage } from "functions/determinators"

export default function MainMenu({navigation}){

    const { setMainMenuOpen, setHideBottomSheet } = useViewStore()
    const { theme, country } = usePreferenceStore()
   
    useEffect(()=>{
        const trigger = navigation.addListener("focus", function(){
            setMainMenuOpen()
        })
        return trigger
    },[navigation])

    useEffect(()=>{
        const trigger = navigation.addListener("blur", function(){
            setMainMenuOpen()
        })
        return trigger
    },[navigation])

    function handleCloseMenu(){
        setHideBottomSheet(false)
        navigation.goBack()
    }

    return(
        <View style={{height: "100%", width: Dimensions.get("window").width > Dimensions.get("window").height ? "60%" : "100%"}}>
            <View style={{width: "100%", height: "100%"}}>
                <View style={{backgroundColor: theme.colors.primary}}>
                    <View 
                        pointerEvents="none" 
                        style={{
                            height: "100%", 
                            width: "100%", 
                            backgroundColor: "transparent", 
                            position: "absolute", 
                            top: 0,
                            left: 0,
                            zIndex: 0,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <Image 
                            source={determineCountryImage(country)} 
                            style={{
                                width: "50%", 
                                height: "150%", 
                                resizeMode: "contain", 
                                backgroundColor: "transparent",
                                tintColor: theme.colors.primaryContainer,
                                marginRight: defaultViewPadding
                            }}
                        />
                    </View>
                    <TouchableNativeFeedback onPress={()=>handleCloseMenu()}>
                        <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20}}>
                            <Icon source="arrow-left" size={20} color={theme.colors.onPrimary}/>
                        </View>
                    </TouchableNativeFeedback>

                    <LanguageSelection />
                    
                    
                </View>
                <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
                    <View style={{width: "100%", flex: 15}}>
                        <ScrollView>
                                
                            

                            <DatabaseOperations />

                            <Lists />

                            <Settings />

                            <EditData />

                            <QRCodes />

                            <Statistics />

                            <About />

                            <VersionHistory />

                        </ScrollView>
                    </View>
                    <View style={{width: "100%", flex: 1, padding: 0, marginTop: 10, marginBottom: 10, elevation: 4, backgroundColor: theme.colors.primary}}>
                    </View>
                </View>
            </View>           
        </View>
    )
}