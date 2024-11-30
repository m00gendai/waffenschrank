import { ScrollView, TouchableNativeFeedback, View, Image, Platform, Dimensions } from "react-native"
import Animated, { LightSpeedInLeft, LightSpeedOutLeft } from "react-native-reanimated"
import { useViewStore } from "../stores/useViewStore"
import { ActivityIndicator, Button, Dialog, Divider, Icon, IconButton, List, Modal, Portal, Snackbar, Switch, Text, Tooltip } from "react-native-paper"
import { aboutText, aboutThanks, aboutThanksPersons, databaseImportAlert, databaseOperations, generalSettingsLabels, iosWarningText, loginGuardAlert, preferenceTitles, resizeImageAlert, statisticItems, toastMessages, tooltips } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { dateLocales, defaultViewPadding, languageSelection } from "../configs"
import { AMMO_DATABASE, A_KEY_DATABASE, A_TAGS, GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS } from "../configs_DB"
import { colorThemes } from "../lib/colorThemes"
import { useEffect, useState } from "react"
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { AmmoType, DBOperations, GunType, GunTypeStatus, Languages } from "../interfaces"
import * as SecureStore from "expo-secure-store"
import { SafeAreaView } from "react-native-safe-area-context"
import { printAmmoCollection, printAmmoGallery, printGunCollection, printGunCollectionArt5, printGunGallery } from "../functions/printToPDF"
import { useTagStore } from "../stores/useTagStore"
import * as Application from 'expo-application';
import { manipulateAsync } from "expo-image-manipulator"
import Papa from 'papaparse';
import { mainMenu_ammunitionDatabase, mainMenu_gunDatabase } from "../lib/Text/mainMenu_ammunitionDatabase"
import { useImportExportStore } from "../stores/useImportExportStore"
import CSVImportModal from "./CSVImportModal"
import { flatten, unflatten } from 'flat'
import { alarm, getImageSize, sanitizeFileName } from "../utils"
import * as SystemUI from "expo-system-ui"
import * as Sharing from 'expo-sharing';
import * as LocalAuthentication from 'expo-local-authentication';
import { Dirs, Util, FileSystem as fs } from 'react-native-file-access';
import { expo, db } from "../db/client"
import * as schema from "../db/schema"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { ImportExport } from "./ImportExport"


export default function MainMenu({navigation}){

    const { data: settingsData } = useLiveQuery(
        db.select().from(schema.settings)
    )

    const { data: gunCollection } = useLiveQuery(
        db.select().from(schema.gunCollection)
    )

    const { data: ammoCollection } = useLiveQuery(
        db.select().from(schema.ammoCollection)
    )

    const { setMainMenuOpen, toastVisible, setToastVisible, dbModalVisible, setDbModalVisible, imageResizeVisible, toggleImageResizeVisible, loginGuardVisible, toggleLoginGuardVisible, importCSVVisible, toggleImportCSVVisible, importModalVisible, toggleImportModalVisible } = useViewStore()
    const { language, switchLanguage, theme, switchTheme, caliberDisplayNameList } = usePreferenceStore()

    const { overWriteAmmoTags, overWriteTags} = useTagStore()
    const { setCSVHeader, setCSVBody, importProgress, setImportProgress, resetImportProgress, importSize, setImportSize, resetImportSize, setDbCollectionType } = useImportExportStore()

    const [snackbarText, setSnackbarText] = useState<string>("")
    const [dbModalText, setDbModalText] = useState<string>("")
    const [dbOperation, setDbOperation] = useState<DBOperations | "">("")

    const [iosWarning, toggleiosWarning] = useState<boolean>(false)
    const [printerSrc, setPrinterSrc] = useState<null | "gunCollection" | "gunCollectionArt5" | "ammoCollection">(null)

    const onToggleSnackBar = () => setToastVisible(true);
    const onDismissSnackBar = () => {
        setToastVisible(false);
        resetImportProgress(0)
        resetImportSize(0)
    }

    const date: Date = new Date()
    const currentYear:number = date.getFullYear()

    async function handleThemeSwitch(color:string){
        switchTheme(color)
        SystemUI.setBackgroundColorAsync(colorThemes[color].background)
        await db.update(schema.settings).set({theme: {name: color, colors: colorThemes[color]}})
    }

    async function handleLanguageSwitch(lng:Languages){
        switchLanguage(lng)
        await db.update(schema.settings).set({language: lng})
    }


    async function handleSwitchesAlert(setting:string){
        if(setting === "resizeImages"){
            toggleImageResizeVisible()        
        }
        if(setting === "loginGuard"){
            const compatible = await LocalAuthentication.hasHardwareAsync();
            console.log(`compatible: ${compatible}`)
            const isEnrolled = await LocalAuthentication.isEnrolledAsync()
            console.log(`isEnrolled: ${isEnrolled}`)
            const getEnrolledLevel = await LocalAuthentication.getEnrolledLevelAsync()
            console.log(`getEnrolledLevel: ${getEnrolledLevel}`)
            if(!compatible){
                toggleLoginGuardVisible()
            }
            if(!isEnrolled){
                toggleLoginGuardVisible()
            }
            if(compatible && isEnrolled){
                handleSwitches("loginGuard")
            }
        }
    }

    async function handleSwitches(setting: string){
        const settings = await db.select().from(schema.settings)
        const currentSettingStatus: boolean = settings[0][`generalSettings_${setting}`]
        await db.update(schema.settings).set({[`generalSettings_${setting}`]: !currentSettingStatus})
        }
        

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

    function getStatistics(type){

        switch(type){
            case "guns":
                return gunCollection.length
            case "gunPrice":
                return gunCollection.reduce((acc, curr) => {
                    return acc + (curr.paidPrice !== undefined ? Number(curr.paidPrice) : 0);
                }, 0)
            case "gunValue":
                return gunCollection.reduce((acc, curr) => {
                    return acc + (curr.marketValue !== undefined ? Number(curr.marketValue) : 0);
                }, 0)
            case "ammo":
                return ammoCollection.length
            case "totalStock":
                return ammoCollection.reduce((acc, curr) => {
                    return acc + (curr.currentStock !== undefined ? Number(curr.currentStock) : 0);
                }, 0)
        }
    }

    async function handleIOSprints(printer: "gunCollection" | "gunCollectionArt5" | "ammoCollection"){
        setPrinterSrc(printer)
        toggleiosWarning(true)
    }

    async function handlePrints(printer: null | "gunCollection" | "gunCollectionArt5" | "ammoCollection"){
        if(printer === null){
            return
        }
        toggleiosWarning(false)
        console.log(printer)
        console.log("Im printing tables!")
        switch(printer){
            case "gunCollection":
                try{
                    console.log("Im printing gun collection!")
                await printGunCollection(language, generalSettings.caliberDisplayName, caliberDisplayNameList);
                return
                } catch(e){
                    alarm("printGunCollection Error", e)
                }
            case "gunCollectionArt5":
                try{
                    console.log("Im printing gun collection art 5!")
                   await printGunCollectionArt5(language, generalSettings.caliberDisplayName, caliberDisplayNameList);
                    return
                } catch(e){
                    alarm("printGunCollectioNArt5 Error", e)
                }
            case "ammoCollection":
                try{
                    console.log("Im printing ammo collection!")
                   await printAmmoCollection(language, generalSettings.caliberDisplayName, caliberDisplayNameList);
                    return
                } catch(e){
                    alarm("printAmmoCollection Error", e)
                }
                
        }
    }
    

    return(
        
           <View style={{height: "100%", width: Dimensions.get("window").width > Dimensions.get("window").height ? "60%" : "100%"}}>
                <View style={{width: "100%", height: "100%"}}>
                    <TouchableNativeFeedback onPress={()=>navigation.goBack()}>
                        <View style={{width: "100%", height: 50, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingLeft: 20, backgroundColor: theme.colors.primary}}>
                            <Icon source="arrow-left" size={20} color={theme.colors.onPrimary}/>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={{padding: 0, display: "flex", height: "100%", flexDirection: "column", flexWrap: "wrap"}}>
                        <View style={{width: "100%", flex: 15}}>
                            <ScrollView>
                                <View style={{padding: defaultViewPadding, backgroundColor: theme.colors.primary}}>
                                    <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onPrimary}}>{preferenceTitles.language[language]}</Text>
                                    <View style={{display: "flex", flexDirection: "row", gap: 0, flexWrap: "wrap", justifyContent: "center"}}>
                                        {languageSelection.map(langSelect =>{
                                            return <Button style={{borderRadius: 0, marginRight: -1, marginBottom: -1}} key={langSelect.code} buttonColor={language === langSelect.code ? theme.colors.primaryContainer : theme.colors.background} onPress={()=>handleLanguageSwitch(langSelect.code)} mode="outlined">{langSelect.flag}</Button>
                                        })}
                                    </View>
                                </View>
                                <Divider style={{height: 2, backgroundColor: theme.colors.primary}} />
                                <List.Accordion left={props => <><List.Icon {...props} icon="palette" /><List.Icon {...props} icon="brush" /></>} title={preferenceTitles.colors[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
                                            {Object.entries(colorThemes).map(colorTheme =>{
                                                return(    
                                                    <TouchableNativeFeedback onPress={()=>handleThemeSwitch(colorTheme[0])} key={colorTheme[0]}>
                                                        <View style={{elevation: 4, backgroundColor: colorTheme[1].background, borderColor: theme.name === colorTheme[0] ? colorTheme[1].primary : colorTheme[1].primaryContainer, borderWidth: theme.name === colorTheme[0] ? 5 : 0, paddingTop: 5, paddingBottom: 5, paddingLeft:2, paddingRight:2, width: "45%", height: 50, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginTop: 10, marginBottom: 10, borderRadius: 30}}>
                                                        
                                                            <View style={{height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colorTheme[1].primaryContainer, borderBottomLeftRadius: 50, borderTopLeftRadius: 50}}>
                                                                <Text style={{color:colorTheme[1].onPrimaryContainer, fontSize: 10}}>A</Text>
                                                            </View>
                                                            <View style={{height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colorTheme[1].surfaceVariant}}>
                                                                <Text style={{color:colorTheme[1].onSurfaceVariant, fontSize: 10}}>B</Text>
                                                            </View>
                                                            <View style={{height: "100%", width: "30%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colorTheme[1].primary, borderBottomRightRadius: 50, borderTopRightRadius: 50}}>
                                                                <Text style={{color:colorTheme[1].onPrimary, fontSize: 10}}>C</Text>
                                                            </View>

                                                        </View>
                                                    </TouchableNativeFeedback>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="database-outline" /><List.Icon {...props} icon="pistol" /></>} title={preferenceTitles.db_gun[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.saveArsenalDB[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_gun_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.shareArsenalDB[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_gun_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.saveArsenalCSV[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.shareArsenalCSV[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.importArsenalDB[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_gun_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.importCustomCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_custom_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_gunDatabase.importArsenalCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_gun_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>                                        
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="database-outline" /><List.Icon {...props} icon="bullet" /></>} title={preferenceTitles.db_ammo[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.saveArsenalDB[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_ammo_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.shareArsenalDB[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_ammo_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.saveArsenalCSV[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="floppy" onPress={()=>handleDbOperation("save_arsenal_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.shareArsenalCSV[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="content-save-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="share-variant" onPress={()=>handleDbOperation("share_arsenal_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.importArsenalDB[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_ammo_db")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.importCustomCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_custom_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{mainMenu_ammunitionDatabase.importArsenalCSV[language]}</Text>
                                                <IconButton icon="application-import" onPress={()=>handleDbImport("import_arsenal_ammo_csv")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                            </View>            
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="printer" /><List.Icon {...props} icon="pistol" /></>} title={preferenceTitles.gunList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{preferenceTitles.printAllGuns[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="table-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="table-large" onPress={()=>Platform.OS === "ios" ? handleIOSprints("gunCollection") : handlePrints("gunCollection")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>   
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{preferenceTitles.printArt5[language]}</Text>
                                                {gunCollection.length === 0 ?<Tooltip title={tooltips.noGunsAddedYet[language]}><IconButton icon="table-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="table-large" onPress={()=>Platform.OS === "ios" ? handleIOSprints("gunCollectionArt5") : handlePrints("gunCollectionArt5")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>   
                                            {/*<Button style={{width: "45%"}} icon="badge-account-outline" onPress={()=>printGunGallery(gunCollection, language)} mode="contained">{preferenceTitles.printGallery[language]}</Button>*/}

                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="printer" /><List.Icon {...props} icon="bullet" /></>} title={preferenceTitles.ammoList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                                <Text style={{width: "80%"}}>{preferenceTitles.printAllAmmo[language]}</Text>
                                                {ammoCollection.length === 0 ?<Tooltip title={tooltips.noAmmoAddedYet[language]}><IconButton icon="table-off" mode="contained" disabled /></Tooltip>
                                                :
                                                <IconButton icon="table-large" onPress={()=>Platform.OS === "ios" ? handleIOSprints("ammoCollection") : handlePrints("ammoCollection")} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>}
                                            </View>   
                                           {/* <Button style={{width: "45%"}} icon="badge-account-outline" onPress={()=>printAmmoGallery(ammoCollection, language)} mode="contained">{preferenceTitles.printGallery[language]}</Button> */}
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="cog-outline" /><List.Icon {...props} icon="tune" /></>} title={preferenceTitles.generalSettings[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                                            {/*<View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.displayImagesInListViewGun[language]}</Text>
                                                <Switch style={{flex: 3}} value={settingsData[0]..displayImagesInListViewGun} onValueChange={()=>handleSwitches("displayImagesInListViewGun")} />
                                        </View>*/}
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.emptyFields[language]}</Text>
                                                <Switch style={{flex: 3}} value={settingsData[0]?.generalSettings_hideEmptyFields || false} onValueChange={()=>handleSwitches("hideEmptyFields")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.caliberDisplayName[language]}</Text>
                                                <Switch style={{flex: 3}} value={settingsData[0]?.generalSettings_caliberDisplayName || false} onValueChange={()=>handleSwitches("caliberDisplayName")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.resizeImages[language]}</Text>
                                                <Switch style={{flex: 3}} value={settingsData[0]?.generalSettings_resizeImages || true} onValueChange={()=>settingsData[0].generalSettings_resizeImages ? handleSwitchesAlert("resizeImages") : handleSwitches("resizeImages")} />
                                            </View>
                                            <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                            <View style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%"}}>
                                                <Text style={{flex: 7}}>{generalSettingsLabels.loginGuard[language]}</Text>
                                                <Switch style={{flex: 3}} value={settingsData[0]?.generalSettings_loginGuard || false} onValueChange={()=>handleSwitchesAlert("loginGuard")} />
                                            </View>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="chart-box-outline" /><List.Icon {...props} icon="chart-arc" /></>} title={preferenceTitles.statistics[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.gunCount[language]}`}</Text><Text>{`${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("guns"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.gunPrice[language]}`}</Text><Text>{`CHF ${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("gunPrice"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.gunValue[language]}`}</Text><Text>{`CHF ${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("gunValue"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.ammoCount[language]}`}</Text><Text>{`${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("ammo"))}`}</Text></View>
                                    <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                    <View style={{paddingTop: defaultViewPadding, paddingBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{`${statisticItems.roundCount[language]}`}</Text><Text>{`${new Intl.NumberFormat(dateLocales[language]).format(getStatistics("totalStock"))}`}</Text></View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion left={props => <><List.Icon {...props} icon="application-brackets-outline" /><List.Icon {...props} icon="cellphone-information" /></>} title={preferenceTitles.about[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                                    <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                                        <Text>{aboutText[language]}</Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                        <Text style={{color: theme.colors.onBackground}} >{`Version ${Application.nativeApplicationVersion}`}</Text>
                                        <Text style={{color: theme.colors.onBackground}} >{`© ${currentYear === 2024 ? currentYear : `2024 - ${currentYear}`} Marcel Weber`} </Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                        <Text style={{color: theme.colors.onBackground}} >{aboutThanks[language]}</Text>
                                        <Text>{`- ${aboutThanksPersons.michelle[language]}`}</Text>
                                        <Text>{`- ${aboutThanksPersons.jonas[language]}`}</Text>
                                        <Text>{`- ${aboutThanksPersons.waffenforum[language]}`}</Text>
                                        <Text>{`- ${aboutThanksPersons.others[language]}`}</Text>
                                        <Divider style={{marginTop: 5, marginBottom: 5, width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} />
                                        <Text>Splash & Icon: Designed by dgim-studio / Freepik</Text>
                                    </View>
                                </List.Accordion>
                            </ScrollView>
                        </View>
                        <View style={{width: "100%", flex: 1, padding: 0, marginTop: 10, marginBottom: 10, elevation: 4, backgroundColor: theme.colors.primary}}>
                        </View>
                    </View>
                </View>
           
            <Snackbar
            visible={toastVisible}
                onDismiss={onDismissSnackBar}
                action={{
                label: 'OK',
                onPress: () => {
                    onDismissSnackBar()
                },
                }}>
                {snackbarText}
            </Snackbar>

            <Dialog visible={importModalVisible} onDismiss={()=>toggleImportModalVisible()}>
                    <Dialog.Title>
                    {`${databaseImportAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${databaseImportAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handleDbOperation(dbOperation)} icon="application-import" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{databaseImportAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImportModalVisible()} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{databaseImportAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={imageResizeVisible} onDismiss={()=>toggleImageResizeVisible()}>
                    <Dialog.Title>
                    {`${resizeImageAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${resizeImageAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>{
                            handleSwitches("resizeImages");
                            toggleImageResizeVisible();
                        }} icon="check" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{resizeImageAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleImageResizeVisible()} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{resizeImageAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={loginGuardVisible} onDismiss={()=>toggleLoginGuardVisible()}>
                    <Dialog.Title>
                    {`${loginGuardAlert.title[language]}`}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{`${loginGuardAlert.subtitle[language]}`}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>toggleLoginGuardVisible()} icon="emoticon-frown-outline" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{loginGuardAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

            <Portal>
               {importCSVVisible ? <CSVImportModal /> : null} 
            </Portal>

            <Modal visible={dbModalVisible}>
                <ActivityIndicator size="large" animating={true} />
                <Text variant="bodyLarge" style={{width: "100%", textAlign: "center", color: theme.colors.onBackground, marginTop: 10, backgroundColor: theme.colors.background}}>{`${dbModalText}: ${importProgress}/${importSize}`}</Text>
            </Modal>

            <Dialog visible={iosWarning} onDismiss={()=>toggleiosWarning(false)}>
                    <Dialog.Title>
                    {iosWarningText.title[language]}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{iosWarningText.text[language]}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handlePrints(printerSrc)} icon="heart" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{iosWarningText.ok[language]}</Button>
                        <Button onPress={()=>toggleiosWarning(false)} icon="heart-broken" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{iosWarningText.cancel[language]}</Button>
                    </Dialog.Actions>
                </Dialog>

                <Portal>
                    <Modal visible={true}>
                    <ImportExport />
                </Modal>
                </Portal>

            </View>
    )
}