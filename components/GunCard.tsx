import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';
import { AmmoType, GunType } from '../interfaces';
import { Card, IconButton } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { defaultGridGap, defaultViewPadding } from '../configs';
import { ammoDataTemplate } from '../lib/ammoDataTemplate';
import { useAmmoStore } from '../stores/useAmmoStore';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';

interface Props{
    gun: GunType
    shotVisible: boolean
    setShotVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GunCard({gun, shotVisible, setShotVisible}:Props){

    const { ammoDbImport, displayAsGrid, setDisplayAsGrid, toggleDisplayAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, listImages } = usePreferenceStore()
    const { mainMenuOpen, setMainMenuOpen, newGunOpen, setNewGunOpen, editGunOpen, setEditGunOpen, seeGunOpen, setSeeGunOpen } = useViewStore()
    const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()    

    function handleGunCardPress(gun){
        setCurrentGun(gun)
        setSeeGunOpen()
      }

      function handleShotButtonPress(gun){
        setCurrentGun(gun)
        setShotVisible(true)
      }
    
    return(
        <TouchableNativeFeedback 
                key={gun.id} 
                onPress={()=>handleGunCardPress(gun)}
              >
        <Card 
            style={{
                width: (Dimensions.get("window").width / (displayAsGrid ? 2 : 1)) - (defaultGridGap + (defaultViewPadding/2)),
            }}
        >
            <Card.Title
                titleStyle={{
                width: displayAsGrid ? "100%" : listImages ? "60%" : "80%",
                color: theme.colors.onSurfaceVariant
                }}
                subtitleStyle={{
                width: displayAsGrid ? "100%" : listImages ? "60%" : "80%",
                color: theme.colors.onSurfaceVariant
                }}
                title={`${gun.manufacturer && gun.manufacturer.length != 0 ? gun.manufacturer : ""} ${gun.model}`}
                subtitle={gun.serial && gun.serial.length != 0 ? gun.serial : " "} 
                subtitleVariant='bodySmall' 
                titleVariant='titleSmall' 
                titleNumberOfLines={2} 
                subtitleNumberOfLines={2}
            />
            {displayAsGrid ? 
            <>
                <Card.Cover 
                    source={gun.images && gun.images.length != 0 ? { uri: gun.images[0] } : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
                    style={{
                        height: 100
                    }}
                /> 
                <IconButton 
                    mode="contained" 
                    icon={"bullet"} 
                    onPress={()=>handleShotButtonPress(gun)} 
                    style={{
                        position: "absolute", 
                        bottom: 1, 
                        right: 1,
                        backgroundColor: theme.colors.primary
                    }} 
                    iconColor={theme.colors.onPrimary}
                />
            </>
            : 
            null}
            {displayAsGrid ? 
            null 
            :
            <View 
                style={{
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    bottom: 0, 
                    right: 0, 
                    display: "flex", 
                    justifyContent: "flex-end", 
                    alignItems: "center", 
                    flexDirection: "row"
                }}
            >
                {listImages ? <Card.Cover 
                    source={gun.images && gun.images.length != 0 ? { uri: gun.images[0] } : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
                    style={{
                        height: "75%",
                        aspectRatio: "4/3"
                    }}
                /> : null}
                <IconButton 
                    mode="contained" 
                    icon={"bullet"} 
                    size={32}
                    style={{
                        marginLeft: 10,
                        marginRight: 6
                    }}
                    onPress={()=>handleShotButtonPress(gun)} 
                /> 
            </View>}
        </Card>
        </TouchableNativeFeedback>
    )
}