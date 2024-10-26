import { Dimensions, Pressable, ScrollView, TouchableNativeFeedback, View } from 'react-native';
import { AmmoType, CollectionItems, GunType, ItemTypes, StackParamList } from '../interfaces';
import { Badge, Button, Card, Dialog, Icon, IconButton, Menu, Modal, Portal, RadioButton, Text, TouchableRipple } from 'react-native-paper';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { dateLocales, defaultGridGap, defaultViewPadding } from '../configs';
import { useItemStore } from '../stores/useItemStore';
import { useNavigation } from '@react-navigation/native';
import { useViewStore } from '../stores/useViewStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkDate, getDeleteDialogTitle, getSchema, setCardSubtitle, setCardTitle } from '../utils';
import { useState } from 'react';
import { gunDeleteAlert, longPressActions, modalTexts } from '../lib/textTemplates';
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import * as schema from "../db/schema"
import * as FileSystem from 'expo-file-system';
import { db } from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql } from 'drizzle-orm';
import ModalContainer from './ModalContainer';

interface Props{
    item: CollectionItems
    itemType: ItemTypes
}

export default function ItemCard({item, itemType}:Props){

    const { displayAsGrid, language, theme, generalSettings, caliberDisplayNameList } = usePreferenceStore()
    const { currentItem, setCurrentItem } = useItemStore()  
    const { setHideBottomSheet } = useViewStore()

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

    const [longVisible, setLongVisible] = useState<boolean>(false)
    const [dialogVisible, toggleDialogVisible] = useState<boolean>(false)
    const [cardButtonMenu, toggleCardButtonMenu] = useState<boolean>(false)
    const [showMountedModal, setShowMountedModal] = useState<boolean>(false)
    const [mountedOn, setMountedOn] = useState<string>(null)
    const [mountType, setMountType] = useState<ItemTypes>(null)

    const databaseEntry = getSchema(itemType)

    const { data : AccessoryData_Optic } = useLiveQuery(
        db.select().from(schema.opticsCollection).where(eq(schema.opticsCollection.currentlyMountedOn, item.id))
    )
    const { data : AccessoryData_Silencer } = useLiveQuery(
        db.select().from(schema.silencerCollection).where(eq(schema.silencerCollection.currentlyMountedOn, item.id))
    )
    const { data : gunData } = useLiveQuery(
        db.select().from(schema.gunCollection)
    )

    function getShortCaliberName(item){
        if(itemType === "Ammo"){
            if(!generalSettings.caliberDisplayName){
                return item.caliber
            }
            const match = caliberDisplayNameList.find(obj => obj.name === item.caliber)
            return match ? match.displayName : item.caliber;
        }
    }

    function handleCardPress(item){
        setHideBottomSheet(true)
        setCurrentItem(item)
        switch (itemType) {
            case "Gun":
              navigation.navigate("Item", {itemType: "Gun"});
              break;
            case "Ammo":
                navigation.navigate("Item", {itemType: "Ammo"});
              break;
            case "Accessory_Optic":
                navigation.navigate("Item", {itemType: "Accessory_Optic"});
              break;
            case "Accessory_Magazine":
                navigation.navigate("Item", {itemType: "Accessory_Magazine"});
              break;
            case "Accessory_Silencer":
                navigation.navigate("Item", {itemType: "Accessory_Silencer"});
              break;
            case "Accessory_Misc":
                navigation.navigate("Item", {itemType: "Accessory_Misc"});
              break;
            default:
              console.error("Unknown item type");
          }
      }

      function handleCardButtonPress(){
        toggleCardButtonMenu(!cardButtonMenu)
        setCurrentItem(item)
      }


      function handleStockButtonPress(ammo:AmmoType){
        setCurrentItem(ammo)
        navigation.navigate("QuickStock")
    }  

      function meloveyoulongtime(){
        setLongVisible(true)
        setCurrentItem(item)
      }

      function handleClone(){
        setLongVisible(false)
        toggleCardButtonMenu(false)
        navigation.navigate("NewItem", {itemType: itemType})
        setHideBottomSheet(true)
      }

      function handleMenuDelete(){
        toggleDialogVisible(true)
        toggleCardButtonMenu(!cardButtonMenu)
      }

      async function deleteItem(){
        await db.delete(databaseEntry).where(eq(databaseEntry.id, currentItem.id));
        toggleDialogVisible(false)
        setLongVisible(false)
    }

    async function markAsCleaned(){
        await db.update(schema.gunCollection).set({ lastCleanedAt: new Date().getTime() }).where(eq(schema.gunCollection.id, item.id));
    }

    async function markBatteryChanged(){
        await db.update(schema.opticsCollection).set({ lastBatteryChange: new Date().getTime() }).where(eq(schema.opticsCollection.id, item.id));
    }

    function handleMountOn(item: ItemTypes){
        setShowMountedModal(true)
        toggleCardButtonMenu(false)
        setMountType(item)
    }

    async function handleMountedOnConfirm(){
        if(mountType === "Accessory_Optic"){
            await db.update(schema.opticsCollection).set({currentlyMountedOn: mountedOn}).where(eq(schema.opticsCollection.id, item.id));
        }
        if(mountType === "Accessory_Silencer"){
            await db.update(schema.silencerCollection).set({currentlyMountedOn: mountedOn}).where(eq(schema.silencerCollection.id, item.id));
        }
        setShowMountedModal(false)
    }

    function handleMountedOnCancel(){
        setShowMountedModal(false)
    }

    function handleSetMountedOn(value){
        setMountedOn(value)
    }

    function handleQuickShot(){
        toggleCardButtonMenu(false)
        navigation.navigate("QuickShot")
    }

    function handleQuickStock(){
        toggleCardButtonMenu(false)
        handleStockButtonPress(item as AmmoType)
    }

    return(
        <>
        <TouchableNativeFeedback 
                key={item.id} 
                onPress={()=>handleCardPress(item)}
                onLongPress={()=>meloveyoulongtime()}
              >
        <Card 
            style={{
                width: (Dimensions.get("window").width / (displayAsGrid ? Dimensions.get("window").width > Dimensions.get("window").height ? 4 : 2 : 1)) - (defaultGridGap + (displayAsGrid ? defaultViewPadding/2 : defaultViewPadding)),
            }}
        >
            <Card.Title
                titleStyle={{
                width: displayAsGrid ? "100%" : generalSettings.displayImagesInListViewGun ? "55%" : "80%",
                color: checkDate(item) ? theme.colors.error : theme.colors.onSurfaceVariant
                }}
                subtitleStyle={{
                width: displayAsGrid ? "100%" : generalSettings.displayImagesInListViewGun ? "55%" : "80%",
                color: theme.colors.onSurfaceVariant
                }}
                title={setCardTitle(item, itemType)}
                subtitle={setCardSubtitle(item, itemType, itemType === "Ammo" ? getShortCaliberName(item) : null)} 
                subtitleVariant='bodySmall' 
                titleVariant='titleSmall' 
                titleNumberOfLines={2} 
                subtitleNumberOfLines={2}
            />
            {displayAsGrid ? 
            <Menu
            visible={cardButtonMenu}
            onDismiss={()=>toggleCardButtonMenu(!cardButtonMenu)}
            anchor={<View>
                <Card.Cover 
                    source={item.images && item.images.length != 0 ? { uri: `${FileSystem.documentDirectory}${item.images[0].split("/").pop()}`} : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
                    style={{
                        height: 100
                    }}
                /> 
                {itemType === "Ammo" ?
                 <TouchableRipple onPress={() => handleCardButtonPress()} style={{borderRadius: 0, position: "absolute", right: 1, bottom: 1}}>
                    <Badge
                        style={{
                            backgroundColor: item.currentStock !== null && item.currentStock !== undefined && item.criticalStock ? Number(item.currentStock.toString()) <= Number(item.criticalStock.toString()) ? theme.colors.errorContainer : theme.colors.surfaceVariant : theme.colors.surfaceVariant,
                            color: item.currentStock !== null && item.currentStock !== undefined && item.criticalStock ? Number(item.currentStock.toString()) <= Number(item.criticalStock.toString()) ? theme.colors.onErrorContainer : theme.colors.primary : theme.colors.primary,
                            aspectRatio: "1/1",
                            fontSize: 10,
                            margin: 6,
                            elevation: 4,
                        }}
                        size={40}
                    >
                        {item.currentStock !== null && item.currentStock !== undefined && item.currentStock.toString() !== "" ? new Intl.NumberFormat(dateLocales[language]).format(item.currentStock) : "- - -" }
                    </Badge>
                </TouchableRipple> : null}
                        {itemType ==="Ammo" ? null : <IconButton 
                            mode="contained" 
                            icon={"dots-vertical"} 
                            iconColor={theme.colors.onPrimary}
                            onPress={()=>handleCardButtonPress()} 
                            style={{
                                position: "absolute", 
                                bottom: 1, 
                                right: 1,
                                backgroundColor: theme.colors.primary
                            }} 
                            />}
                    
            </View>}
                    anchorPosition='bottom'
                    style={{
                        marginTop: 16
                    }}
                >
                    {itemType === "Gun" ? <Menu.Item onPress={() => handleQuickShot()} title="QuickShot" /> : null} 
                    {itemType === "Gun" ? <Menu.Item onPress={() => markAsCleaned()} title={longPressActions.markCleaned[language]} /> : null}
                    {itemType === "Ammo" ? <Menu.Item onPress={()=> handleQuickStock()} title="QuickStock" /> : null}
                    {itemType === "Accessory_Optic" ? <Menu.Item onPress={() => markBatteryChanged()} title={longPressActions.batteryChange[language]} /> : null}
                    {itemType === "Accessory_Optic" ? <Menu.Item onPress={() => handleMountOn("Accessory_Optic")} title={longPressActions.mountOn[language]} /> : null}
                    {itemType === "Accessory_Silencer" ? <Menu.Item onPress={() => handleMountOn("Accessory_Silencer")} title={longPressActions.mountOn[language]} /> : null}
                    <Menu.Item onPress={() => handleClone()} title={longPressActions.clone[language]} />
                    <Menu.Item onPress={() => handleMenuDelete()} title={longPressActions.delete[language]} titleStyle={{color: theme.colors.error}}/>
                </Menu>
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
                {generalSettings.displayImagesInListViewGun ? 
                    <View>
                        <Card.Cover 
                            source={item.images && item.images.length != 0 ? { uri: `${FileSystem.documentDirectory}${item.images[0].split("/").pop()}` } : require(`../assets//775788_several different realistic rifles and pistols on _xl-1024-v1-0.png`)} 
                            style={{
                                height: "75%",
                                aspectRatio: "4/3"
                            }}
                        />
                        {itemType === "Gun" ? 
                        <View style={{width: "100%", height: 20, position: "absolute", left: 0, bottom: 1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            {AccessoryData_Optic.length !== 0 ? 
                                <IconButton 
                                    size={16}
                                    mode="contained" 
                                    icon={"toslink"} 
                                    onPress={()=>console.log("")} 
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        width: 20,
                                        height: 20,
                                    }} 
                                    iconColor={theme.colors.onPrimary}
                                /> : null
                            }
                            {AccessoryData_Silencer.length !== 0 ? 
                                <IconButton 
                                    size={16}
                                    mode="contained" 
                                    icon={"volume-off"} 
                                    onPress={()=>console.log("")} 
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        width: 20,
                                        height: 20,
                                    }} 
                                    iconColor={theme.colors.onPrimary}
                                /> : null
                            }
                        </View> : null}
                    </View> : null}
                <Menu
                    visible={cardButtonMenu}
                    onDismiss={()=>toggleCardButtonMenu(!cardButtonMenu)}
                    anchor={
                itemType === "Ammo" ?
                 <TouchableRipple onPress={() => handleCardButtonPress()} style={{borderRadius: 0}}>
                    <Badge
                        style={{
                            backgroundColor: item.currentStock !== null && item.currentStock !== undefined && item.criticalStock ? Number(item.currentStock.toString()) <= Number(item.criticalStock.toString()) ? theme.colors.errorContainer : theme.colors.surfaceVariant : theme.colors.surfaceVariant,
                            color: item.currentStock !== null && item.currentStock !== undefined && item.criticalStock ? Number(item.currentStock.toString()) <= Number(item.criticalStock.toString()) ? theme.colors.onErrorContainer : theme.colors.primary : theme.colors.primary,
                            aspectRatio: "1/1",
                            fontSize: 10,
                            margin: 6,
                            elevation: 4,
                            marginLeft: 10,
                            marginRight: 10
                        }}
                        size={50}
                    >
                        {item.currentStock !== null && item.currentStock !== undefined && item.currentStock.toString() !== "" ? new Intl.NumberFormat(dateLocales[language]).format(item.currentStock) : "- - -" }
                    </Badge>
                </TouchableRipple> :
            <IconButton 
                    mode="contained" 
                    icon={"dots-vertical"} 
                    size={32}
                    style={{
                        marginLeft: 10,
                        marginRight: 10
                    }}
                    onPress={()=>handleCardButtonPress()} 
                />
            }
                anchorPosition='bottom'
            style={{marginTop: 16}}>
                {itemType === "Gun" ? <Menu.Item onPress={() => navigation.navigate("QuickShot")} title="QuickShot" /> : null} 
                {itemType === "Gun" ? <Menu.Item onPress={() => markAsCleaned()} title={longPressActions.markCleaned[language]} /> : null}
                {itemType === "Ammo" ? <Menu.Item onPress={()=> handleQuickStock()} title="QuickStock" /> : null}
                {itemType === "Accessory_Optic" ? <Menu.Item onPress={() => markBatteryChanged()} title={longPressActions.batteryChange[language]} /> : null}
                {itemType === "Accessory_Optic" ? <Menu.Item onPress={() => handleMountOn("Accessory_Optic")} title={longPressActions.mountOn[language]} /> : null}
                {itemType === "Accessory_Silencer" ? <Menu.Item onPress={() => handleMountOn("Accessory_Silencer")} title={longPressActions.mountOn[language]} /> : null}
                <Menu.Item onPress={() => handleClone()} title={longPressActions.clone[language]} />
                <Menu.Item onPress={() => handleMenuDelete()} title={longPressActions.delete[language]} titleStyle={{color: theme.colors.error}}/>
              </Menu>
                 
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
                            {`${getDeleteDialogTitle(item, itemType, language)}`}
                            </Dialog.Title>
                            <Dialog.Content>
                                <Text>{`${gunDeleteAlert.subtitle[language]}`}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>deleteItem()} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{gunDeleteAlert.yes[language]}</Button>
                                <Button onPress={()=>toggleDialogVisible(!dialogVisible)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{gunDeleteAlert.no[language]}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>   

        {/* MOUNTED ON */}
            <ModalContainer
                title={modalTexts.mountedOn.title[language]}
                subtitle={modalTexts.mountedOn.text[language]}
                visible={showMountedModal}
                setVisible={setShowMountedModal}
                content={<View style={{width: "100%", display: "flex", padding: defaultViewPadding}}>
                    <ScrollView>
                        <RadioButton.Group onValueChange={value => handleSetMountedOn(value)} value={mountedOn}>
                            <RadioButton.Item key={`mountedOn_none}`} label={`-`} value={"-"} />
                            {gunData.map((gun, index)=>{
                                return (
                                    <RadioButton.Item key={`mountedOn_${index}`} label={`${gun.manufacturer} ${gun.model}\n${gun.serial}`} value={gun.id} status={gun.id === item.currentlyMountedOn ? "checked" : "unchecked"}/>
                                )
                            })}
                        </RadioButton.Group>
                    </ScrollView>
                </View>}
                buttonACK={<IconButton icon="check" onPress={() => handleMountedOnConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
                buttonCNL={<IconButton icon="cancel" onPress={() => handleMountedOnCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />}
                buttonDEL={null}
            />   

        </>
    )
}