import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View, Pressable } from 'react-native';
import { AmmoType, StackParamList } from '../interfaces';
import { Avatar, Badge, Button, Card, Dialog, Icon, IconButton, Text, Modal, Portal, TouchableRipple } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { dateLocales, defaultGridGap, defaultViewPadding } from '../configs';
import { ammoDataTemplate } from '../lib/ammoDataTemplate';
import { useAmmoStore } from '../stores/useAmmoStore';
import { useViewStore } from '../stores/useViewStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { AMMO_DATABASE, KEY_DATABASE } from '../configs_DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store"
import { ammoDeleteAlert, gunDeleteAlert, longPressActions } from '../lib/textTemplates';
import * as FileSystem from 'expo-file-system';

interface Props{
    ammo: AmmoType
}

export default function AmmoCard({ammo}:Props){

    const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, generalSettings } = usePreferenceStore()
    const { mainMenuOpen, setMainMenuOpen, newAmmoOpen, setNewAmmoOpen, editAmmoOpen, setEditAmmoOpen, seeAmmoOpen, setSeeAmmoOpen } = useViewStore()
    const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

    const [longVisible, setLongVisible] = useState<boolean>(false)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)


    function handleStockButtonPress(ammo:AmmoType){
        setCurrentAmmo(ammo)
        navigation.navigate("QuickStock")
    }       

    function handleAmmoCardPress(ammo: AmmoType){
        setCurrentAmmo(ammo)
        navigation.navigate("Ammo")
      }

      function meloveyoulongtime(){
        console.log("TWO DOLLA")
        setLongVisible(true)
        setCurrentAmmo(ammo)
      }

      function handleClone(){
        setLongVisible(false)
        navigation.navigate("NewAmmo")
        
      }

      async function deleteItem(ammo:AmmoType){
        // Deletes gun in gun database
        await SecureStore.deleteItemAsync(`${AMMO_DATABASE}_${ammo.id}`)

        // retrieves gun ids from key database and removes the to be deleted id
        const keys:string = await AsyncStorage.getItem(KEY_DATABASE)
        const keyArray: string[] = JSON.parse(keys)
        const newKeys: string[] = keyArray.filter(key => key != ammo.id)
        AsyncStorage.setItem(KEY_DATABASE, JSON.stringify(newKeys))
        const index:number = ammoCollection.indexOf(ammo)
        const newCollection:AmmoType[] = ammoCollection.toSpliced(index, 1)
        setAmmoCollection(newCollection)
        toggleDialogVisible(false)
        setLongVisible(false)
    }

    return(
        <>
        <TouchableNativeFeedback 
                key={ammo.id} 
                onPress={()=>handleAmmoCardPress(ammo)}
                onLongPress={()=>meloveyoulongtime()}
              >
        <Card 
            style={{
                width: (Dimensions.get("window").width / (displayAmmoAsGrid ? 2 : 1)) - (defaultGridGap + (displayAmmoAsGrid ? defaultViewPadding/2 : defaultViewPadding)),

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
                title={`${ammo.manufacturer && ammo.manufacturer.length !== 0 ? `${ammo.manufacturer}` : ""}${ammo.manufacturer && ammo.manufacturer.length !== 0 ? ` ` : ""}${ammo.designation}`} 
                subtitle={ammo.caliber && ammo.caliber.length !== 0 ? `${ammo.caliber}` : " "}
                subtitleVariant='bodySmall' 
                titleVariant='titleSmall' 
                titleNumberOfLines={2} 
                subtitleNumberOfLines={2}
            />
            {displayAmmoAsGrid ? 
            <>
                <Card.Cover 
                    source={ammo.images && ammo.images.length != 0 ? { uri: `${FileSystem.documentDirectory}${ammo.images[0].split("/").pop()}` } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
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
                    source={ammo.images && ammo.images.length != 0 ? { uri: `${FileSystem.documentDirectory}${ammo.images[0].split("/").pop()}` } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
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

<Portal>
<Modal visible={longVisible} onDismiss={()=>setLongVisible(false)}>
    <View style={{width: "85%", alignSelf: "center", backgroundColor: theme.colors.background, padding: defaultViewPadding, flexDirection: "row"}}>
    <View style={{width: "100%", display: "flex", height: "100%", flexDirection: "row", justifyContent: "space-around"}}>
    <Pressable onPress={()=>handleClone()} style={{ alignItems: 'center' }}>
        <Icon source="content-duplicate" size={48} />
        <Text style={{marginTop: defaultViewPadding}}>{longPressActions.clone[language]}</Text>
   </Pressable>
   <Pressable onPress={()=>toggleDialogVisible(true)} style={{ alignItems: 'center' }}>
        <Icon source="delete" size={48} color={theme.colors.error}/>
        <Text style={{marginTop: defaultViewPadding, color: theme.colors.error}}>{longPressActions.delete[language]}</Text>
   </Pressable>
   </View>
    </View>
    
</Modal>
</Portal>

<Portal>
                    <Dialog visible={dialogVisible} onDismiss={()=>toggleDialogVisible(!dialogVisible)}>
                        <Dialog.Title>
                        {`${ammo.designation === null ? "" : ammo.designation === undefined ? "" : ammo.designation} ${ammoDeleteAlert.title[language]}`}
                        </Dialog.Title>
                        <Dialog.Content>
                            <Text>{`${ammoDeleteAlert.subtitle[language]}`}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>deleteItem(currentAmmo)} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{gunDeleteAlert.yes[language]}</Button>
                            <Button onPress={()=>toggleDialogVisible(!dialogVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{gunDeleteAlert.no[language]}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>      

    </>
    )
}