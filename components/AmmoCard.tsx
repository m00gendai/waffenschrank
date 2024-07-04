import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';
import { AmmoType, StackParamList } from '../interfaces';
import { Avatar, Badge, Button, Card, IconButton, TouchableRipple } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { dateLocales, defaultGridGap, defaultViewPadding } from '../configs';
import { ammoDataTemplate } from '../lib/ammoDataTemplate';
import { useAmmoStore } from '../stores/useAmmoStore';
import { useViewStore } from '../stores/useViewStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props{
    ammo: AmmoType
}

export default function AmmoCard({ammo}:Props){

    const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, generalSettings } = usePreferenceStore()
    const { mainMenuOpen, setMainMenuOpen, newAmmoOpen, setNewAmmoOpen, editAmmoOpen, setEditAmmoOpen, seeAmmoOpen, setSeeAmmoOpen } = useViewStore()
    const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

    function handleStockButtonPress(ammo:AmmoType){
        setCurrentAmmo(ammo)
        navigation.navigate("QuickStock")
    }       

    function handleAmmoCardPress(ammo: AmmoType){
        setCurrentAmmo(ammo)
        navigation.navigate("Ammo")
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
                width: displayAmmoAsGrid ? "100%" : generalSettings.displayImagesInListViewAmmo ? "60%" : "80%",
                color: ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.criticalStock ? Number(ammo.currentStock.toString()) <= Number(ammo.criticalStock.toString()) ? theme.colors.error : theme.colors.onSurfaceVariant : theme.colors.onSurfaceVariant,
                }}
                subtitleStyle={{
                width: displayAmmoAsGrid ? "100%" : generalSettings.displayImagesInListViewAmmo ? "60%" : "80%",
                color: ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.criticalStock ? Number(ammo.currentStock.toString()) <= Number(ammo.criticalStock.toString()) ? theme.colors.error : theme.colors.onSurfaceVariant : theme.colors.onSurfaceVariant,
                }}
                title={`${ammo.designation}`} 
                subtitle={ammo.manufacturer && ammo.manufacturer.length !== 0 ? `${ammo.manufacturer}` : " "} 
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
                <TouchableRipple onPress={() => handleStockButtonPress(ammo)} style={{borderRadius: 0, position: "absolute", bottom: 1, right: 1}}>
                    <Badge
                        style={{
                            backgroundColor: ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.criticalStock ? Number(ammo.currentStock.toString()) <= Number(ammo.criticalStock.toString()) ? theme.colors.errorContainer : theme.colors.primary : theme.colors.primary,
                            color: ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.criticalStock ? Number(ammo.currentStock.toString()) <= Number(ammo.criticalStock.toString()) ? theme.colors.onErrorContainer : theme.colors.onPrimary : theme.colors.onPrimary,
                            aspectRatio: "1/1",
                            fontSize: 10,
                            margin: 6,
                            elevation: 4,
                        }}
                        size={40}
                    >
                        {ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.currentStock.toString() !== "" ? new Intl.NumberFormat(dateLocales[language]).format(ammo.currentStock) : "- - -" }
                    </Badge>
                </TouchableRipple>                
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
                    alignContent: "center",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                }}
            >
                {generalSettings.displayImagesInListViewAmmo ? <Card.Cover 
                    source={ammo.images && ammo.images.length != 0 ? { uri: ammo.images[0] } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
                    style={{
                        height: "75%",
                        aspectRatio: "4/3"
                    }}
                /> : null}
                <TouchableRipple onPress={() => handleStockButtonPress(ammo)} style={{borderRadius: 0}}>
                    <Badge
                        style={{
                            backgroundColor: ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.criticalStock ? Number(ammo.currentStock.toString()) <= Number(ammo.criticalStock.toString()) ? theme.colors.errorContainer : theme.colors.surfaceVariant : theme.colors.surfaceVariant,
                            color: ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.criticalStock ? Number(ammo.currentStock.toString()) <= Number(ammo.criticalStock.toString()) ? theme.colors.onErrorContainer : theme.colors.onSurfaceVariant : theme.colors.onSurfaceVariant,
                            aspectRatio: "1/1",
                            fontSize: 10,
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginLeft: 10,
                            marginRight: 6,
                        }}
                        size={48}
                    >
                        {ammo.currentStock !== null && ammo.currentStock !== undefined && ammo.currentStock.toString() !== "" ? new Intl.NumberFormat(dateLocales[language]).format(ammo.currentStock) : "- - -" }
                    </Badge>
                </TouchableRipple>
    
            </View>}
        </Card>
        </TouchableNativeFeedback>
    )
}