import { Dimensions, Pressable, TouchableNativeFeedback, View } from 'react-native';
import { GunType, StackParamList } from '../interfaces';
import { Button, Card, Dialog, Icon, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { defaultGridGap, defaultViewPadding } from '../configs';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkDate } from '../utils';
import { useState } from 'react';
import { GUN_DATABASE, KEY_DATABASE } from '../configs_DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store"
import { gunDeleteAlert, longPressActions } from '../lib/textTemplates';
import * as FileSystem from 'expo-file-system';
import { db } from "../db/client"
import * as schema from "../db/schema"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql } from 'drizzle-orm';

interface Props{
    gun: GunType
}

export default function GunCard({gun}:Props){

    const { ammoDbImport, displayAsGrid, setDisplayAsGrid, toggleDisplayAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, generalSettings } = usePreferenceStore()
    const { mainMenuOpen, setMainMenuOpen, newGunOpen, setNewGunOpen, editGunOpen, setEditGunOpen, seeGunOpen, setSeeGunOpen } = useViewStore()
    const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()  
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

    const [longVisible, setLongVisible] = useState<boolean>(false)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)

    function handleGunCardPress(gun){
        setCurrentGun(gun)
        navigation.navigate("Gun")
      }

      function handleShotButtonPress(gun){
        setCurrentGun(gun)
        navigation.navigate("QuickShot")
      }

      function meloveyoulongtime(){
        console.log("TWO DOLLA")
        setLongVisible(true)
        setCurrentGun(gun)
      }

      function handleClone(){
        setLongVisible(false)
        navigation.navigate("NewGun")
        
      }

      async function deleteItem(gun:GunType){
        await db.delete(schema.gunCollection).where(eq(schema.gunCollection.id, currentGun.id));
        toggleDialogVisible(false)
        setLongVisible(false)
    }

    return(
        <>
        <TouchableNativeFeedback 
                key={gun.id} 
                onPress={()=>handleGunCardPress(gun)}
                onLongPress={()=>meloveyoulongtime()}
              >
        <Card 
            style={{
                width: (Dimensions.get("window").width / (displayAsGrid ? Dimensions.get("window").width > Dimensions.get("window").height ? 4 : 2 : 1)) - (defaultGridGap + (displayAsGrid ? defaultViewPadding/2 : defaultViewPadding)),
            }}
        >
            <Card.Title
                titleStyle={{
                width: displayAsGrid ? "100%" : generalSettings.displayImagesInListViewGun ? "60%" : "80%",
                color: checkDate(gun) ? theme.colors.error : theme.colors.onSurfaceVariant
                }}
                subtitleStyle={{
                width: displayAsGrid ? "100%" : generalSettings.displayImagesInListViewGun ? "60%" : "80%",
                color: theme.colors.onSurfaceVariant
                }}
                title={`${gun.manufacturer && gun.manufacturer.length != 0 ? `${gun.manufacturer}` : ""}${gun.manufacturer && gun.manufacturer.length != 0 ? ` ` : ""}${gun.model}`}
                subtitle={gun.serial && gun.serial.length != 0 ? gun.serial : " "} 
                subtitleVariant='bodySmall' 
                titleVariant='titleSmall' 
                titleNumberOfLines={2} 
                subtitleNumberOfLines={2}
            />
            {displayAsGrid ? 
            <>
                <Card.Cover 
                    source={gun.images && gun.images.length != 0 ? { uri: `${FileSystem.documentDirectory}${gun.images[0].split("/").pop()}`} : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
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
                {generalSettings.displayImagesInListViewGun ? <Card.Cover 
                    source={gun.images && gun.images.length != 0 ? { uri: `${FileSystem.documentDirectory}${gun.images[0].split("/").pop()}` } : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
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
                            {`${gun.model === null ? "" : gun.model === undefined ? "" : gun.model} ${gunDeleteAlert.title[language]}`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text>{`${gunDeleteAlert.subtitle[language]}`}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>deleteItem(currentGun)} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{gunDeleteAlert.yes[language]}</Button>
                                <Button onPress={()=>toggleDialogVisible(!dialogVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{gunDeleteAlert.no[language]}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>      

        </>
    )
}