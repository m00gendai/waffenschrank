import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';
import { AmmoType } from '../interfaces';
import { Card, IconButton } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { defaultGridGap, defaultViewPadding } from '../configs';
import { ammoDataTemplate } from '../lib/ammoDataTemplate';
import { useAmmoStore } from '../stores/useAmmoStore';
import { useViewStore } from '../stores/useViewStore';

interface Props{
    ammo: AmmoType
    stockVisible: boolean
    setStockVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AmmoCard({ammo, stockVisible, setStockVisible}:Props){

    const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme } = usePreferenceStore()
    const { mainMenuOpen, setMainMenuOpen, newAmmoOpen, setNewAmmoOpen, editAmmoOpen, setEditAmmoOpen, seeAmmoOpen, setSeeAmmoOpen } = useViewStore()
    const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()

    function handleStockButtonPress(ammo:AmmoType){
        setCurrentAmmo(ammo)
        setStockVisible(!stockVisible)
    }       

    function handleAmmoCardPress(ammo: AmmoType){
        setCurrentAmmo(ammo)
        setSeeAmmoOpen()
      }
    
    return(
        <TouchableNativeFeedback 
                key={ammo.id} 
                onPress={()=>handleAmmoCardPress(ammo)}
              >
        <Card 
            style={{
                width: (Dimensions.get("window").width / (displayAmmoAsGrid ? 2 : 1)) - (defaultGridGap + (defaultViewPadding/2)),

            }}
        >
            <Card.Title
                titleStyle={{
                width: displayAmmoAsGrid ? "100%" : "50%",
                color: ammo.currentStock && ammo.criticalStock ? parseFloat(ammo.currentStock.toString()) <= parseFloat(ammo.criticalStock.toString()) ? theme.colors.error : theme.colors.onSurfaceVariant : theme.colors.onSurfaceVariant,
                }}
                subtitleStyle={{
                width: displayAmmoAsGrid ? "100%" : "50%",
                color: ammo.currentStock && ammo.criticalStock ? parseFloat(ammo.currentStock.toString()) <= parseFloat(ammo.criticalStock.toString()) ? theme.colors.error : theme.colors.onSurfaceVariant : theme.colors.onSurfaceVariant,
                }}
                title={`${ammo.designation}`} 
                subtitle={ammo.manufacturer && ammo.manufacturer.length != 0 ? `${ammo.manufacturer}\n${ammo.currentStock ? `${ammoDataTemplate[5][language]}: ${ammo.currentStock}` : ""}` : " "} 
                subtitleVariant='bodySmall' 
                titleVariant='titleSmall' 
                titleNumberOfLines={2} 
                subtitleNumberOfLines={2}
            />
            {displayAmmoAsGrid ? 
            <>
                <Card.Cover 
                    source={ammo.images && ammo.images.length != 0 ? { uri: ammo.images[0] } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
                    style={{
                        height: 100
                    }}
                /> 
                <IconButton 
                    mode="contained" 
                    icon={"plus-minus-variant"} 
                    onPress={()=>handleStockButtonPress(ammo)} 
                    style={{
                        position: "absolute", 
                        bottom: 1, 
                        right: 1
                    }} 
                /> 
            </>
            : 
            null}
            {displayAmmoAsGrid ? 
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
                <Card.Cover 
                    source={ammo.images && ammo.images.length != 0 ? { uri: ammo.images[0] } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
                    style={{
                        height: "75%",
                        aspectRatio: "4/3"
                    }}
                /> 
                <IconButton 
                    mode="contained" 
                    icon={"plus-minus-variant"} 
                    onPress={()=>handleStockButtonPress(ammo)} 
                /> 
            </View>}
        </Card>
        </TouchableNativeFeedback>
    )
}