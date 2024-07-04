import { Divider, IconButton, Modal, Text } from "react-native-paper"
import { useViewStore } from "../stores/useViewStore"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { View, ScrollView } from "react-native"
import { AMMO_DATABASE, A_KEY_DATABASE, GUN_DATABASE, KEY_DATABASE, defaultViewPadding } from "../configs"
import { mainMenu_ammunitionDatabase } from "../lib/Text/mainMenu_ammunitionDatabase"
import { ammoDataTemplate } from "../lib/ammoDataTemplate"
import { Picker } from "@react-native-picker/picker"
import { useImportExportStore } from "../stores/useImportExportStore"
import { AmmoType, GunType } from "../interfaces"
import { exampleAmmoEmpty, exampleGunEmpty } from "../lib/examples"
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from "expo-secure-store"
import { useGunStore } from "../stores/useGunStore"
import { useAmmoStore } from "../stores/useAmmoStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { gunDataTemplate } from "../lib/gunDataTemplate"

export default function CSVImportModal(){

    const { setDbModalVisible, importCSVVisible, toggleImportCSVVisible } = useViewStore()
    const { language, theme } = usePreferenceStore()
    const { CSVHeader, CSVBody, importProgress, setImportProgress, setImportSize, mapCSV, setMapCSV, dbCollectionType, setDbCollectionType } = useImportExportStore()
    const { setGunCollection } = useGunStore()
    const { setAmmoCollection } = useAmmoStore()

    async function setImportedCSV(){
        if(dbCollectionType === ""){
            return
        }
        toggleImportCSVVisible()
        setImportSize(CSVBody.length)
        const indexMapCSV:{[key: string]: number}= {}
        for(const entry of Object.entries(mapCSV)){
            indexMapCSV[entry[0]] = CSVHeader.indexOf(entry[1])
        }
        const usedIndexes:number[] = []
        for(const entries of Object.values(indexMapCSV)){
            if(!usedIndexes.includes(entries) && entries !== -1){
                usedIndexes.push(entries)
            }
        }
        const objects: (AmmoType | GunType)[] = CSVBody.map((items, index)=>{
            const mapped:AmmoType | GunType = dbCollectionType === "import_custom_gun_csv" ? {...exampleGunEmpty} : {...exampleAmmoEmpty}
            for(const entry of Object.entries(indexMapCSV)){
                if(entry[0] === "id"){
                    mapped[entry[0]] = uuidv4()  
                } else if(entry[0] === "tags"){
                    mapped[entry[0]] = []
                } else if(entry[0] === "createdAt"){
                    mapped[entry[0]] = entry[1] === -1 ? `${new Date().toISOString()}` : items[entry[1]]
                } else {
                    mapped[entry[0]] = entry[1] === -1 ? "" : items[entry[1]]
                }
                
            }
            const rmk:string[] = []
            items.map((item, index) =>{
                if(!usedIndexes.includes(index) && item !== ""){
                    rmk.push(`${CSVHeader[index]}: ${item}`)
                }
            })
            mapped.remarks = rmk.join("\n")
            setImportProgress(importProgress+1)
            return mapped
        })
        let newKeys:string[] = []
        
        objects.map(value =>{
            newKeys.push(value.id) // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
            SecureStore.setItem(`${dbCollectionType === "import_custom_gun_csv" ? GUN_DATABASE : AMMO_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        })
    
        await AsyncStorage.setItem(dbCollectionType === "import_custom_gun_csv" ? KEY_DATABASE : A_KEY_DATABASE, JSON.stringify(newKeys)) // Save the key object
        dbCollectionType === "import_custom_gun_csv" ? setGunCollection(objects as GunType[]) : setAmmoCollection(objects as AmmoType[])
        setDbCollectionType("")
    }

    return(
        <Modal visible={importCSVVisible} onDismiss={()=>toggleImportCSVVisible()}>
                    <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", flexWrap: "wrap", backgroundColor: "rgba(0,0,0,0.5)"}}>
                        <View style={{width: "85%", height: "100%", maxHeight: "85%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                            <View style={{backgroundColor: theme.colors.background, width: "100%", flex: 1, padding: defaultViewPadding, display: "flex", flexDirection: "column"}}>
                                <View style={{flex: 3}}>
                                <Text variant="titleSmall" style={{color: theme.colors.primary}}>{dbCollectionType === "import_custom_gun_csv" ? mainMenu_ammunitionDatabase.importCSVModalTitle[language] : mainMenu_ammunitionDatabase.importCSVModalTitle[language]}</Text>
                                <ScrollView>
                                <Text variant="bodySmall">{dbCollectionType === "import_custom_gun_csv" ? mainMenu_ammunitionDatabase.importCSVModalText[language] : mainMenu_ammunitionDatabase.importCSVModalText[language]}</Text>
                                </ScrollView>
                                </View>
                                <View style={{flex: 7, borderColor: theme.colors.primary, borderBottomWidth: 2, borderTopWidth: 2, marginTop: defaultViewPadding, marginBottom: defaultViewPadding}}>
                                <ScrollView>
                
                                    {dbCollectionType === "import_custom_gun_csv" ? gunDataTemplate.map((gunItem, gunIndex)=>{
                                        return(
                                            <View key={`mapperRow_${gunIndex}`} style={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between"}}>
                                                <Text style={{width: "50%"}}>{gunItem.de}</Text>
                                                <Picker style={{width: "50%", color: theme.colors.onBackground}} dropdownIconColor={theme.colors.onBackground} selectedValue={mapCSV[gunItem.name]} onValueChange={(itemValue, itemIndex) => setMapCSV({...mapCSV, [gunItem.name]:itemValue})}>
                                                    <Picker.Item label={"-"} value={""} style={{backgroundColor: theme.colors.background}} color={theme.colors.onBackground}/>
                                                    {CSVHeader.map((item, index) => {
                                                        return(
                                                            <Picker.Item key={`picker_${index}`} label={item} value={item} style={{backgroundColor: theme.colors.background}} color={theme.colors.onBackground}/>
                                                        )
                                                    })}
                                                </Picker>
                                            <Divider style={{width: "100%"}}/>
                                            </View>
                                        )
                                        }) 
                                    :
                                    ammoDataTemplate.map((ammoItem, ammoIndex)=>{
                                        return(
                                            <View key={`mapperRow_${ammoIndex}`} style={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between"}}>
                                                <Text style={{width: "50%"}}>{ammoItem.de}</Text>
                                                <Picker style={{width: "50%", color: theme.colors.onBackground}} dropdownIconColor={theme.colors.onBackground} selectedValue={mapCSV[ammoItem.name]} onValueChange={(itemValue, itemIndex) => setMapCSV({...mapCSV, [ammoItem.name]:itemValue})}>
                                                    <Picker.Item label={"-"} value={""} style={{backgroundColor: theme.colors.background}} color={theme.colors.onBackground}/>
                                                    {CSVHeader.map((item, index) => {
                                                        return(
                                                            <Picker.Item key={`picker_${index}`} label={item} value={item} style={{backgroundColor: theme.colors.background}} color={theme.colors.onBackground}/>
                                                        )
                                                    })}
                                                </Picker>
                                            <Divider style={{width: "100%"}}/>
                                            </View>
                                        )
                                        })
                                    }
                                    
                                        </ScrollView>
                                        </View>
                                        <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                     <IconButton icon="check" mode="contained" onPress={()=>setImportedCSV()} />
                                     <IconButton icon="cancel" mode="contained" style={{backgroundColor: theme.colors.errorContainer}} iconColor={theme.colors.onErrorContainer} onPress={()=>toggleImportCSVVisible()} />
                                     </View>
                                
                            </View>
                        </View>
                    </View>
                </Modal>
    )
}