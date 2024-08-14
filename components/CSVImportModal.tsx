import { Checkbox, Divider, IconButton, Modal, Text } from "react-native-paper"
import { useViewStore } from "../stores/useViewStore"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { View, ScrollView } from "react-native"
import { defaultViewPadding } from "../configs"
import { AMMO_DATABASE, A_KEY_DATABASE, GUN_DATABASE, KEY_DATABASE } from "../configs_DB"
import { mainMenu_ammunitionDatabase, mainMenu_gunDatabase } from "../lib/Text/mainMenu_ammunitionDatabase"
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
import ModalContainer from "./ModalContainer"
import { useState } from "react"

export default function CSVImportModal(){

    const { setDbModalVisible, importCSVVisible, toggleImportCSVVisible } = useViewStore()
    const { language, theme } = usePreferenceStore()
    const { CSVHeader, CSVBody, importProgress, setImportProgress, setImportSize, mapCSVAmmo, setMapCSVAmmo, mapCSVGun, setMapCSVGun, dbCollectionType, setDbCollectionType } = useImportExportStore()
    const { setGunCollection } = useGunStore()
    const { setAmmoCollection } = useAmmoStore()

    const [hasHeaders, setHasHeaders] = useState<boolean>(true)

    async function setImportedCSV(){
        if(dbCollectionType === ""){
            return
        }
        toggleImportCSVVisible()
        setImportSize(CSVBody.length)
        const indexMapCSV:{[key: string]: number}= {}
        for(const entry of Object.entries(dbCollectionType === "import_custom_gun_csv" ? mapCSVGun : mapCSVAmmo)){
            indexMapCSV[entry[0]] = CSVHeader.indexOf(entry[1])
        }
        const usedIndexes:number[] = []
        for(const entries of Object.values(indexMapCSV)){
            if(!usedIndexes.includes(entries) && entries !== -1){
                usedIndexes.push(entries)
            }
        }

        const itemsToBeMapped:string[][] = hasHeaders ? [...CSVBody] : [[...CSVHeader], ...CSVBody]

        const objects: (AmmoType | GunType)[] = itemsToBeMapped.map((items, index)=>{
            const mapped:AmmoType | GunType = dbCollectionType === "import_custom_gun_csv" ? {...exampleGunEmpty} : {...exampleAmmoEmpty}

            for(const entry of Object.entries(indexMapCSV)){
                if(entry[0] === "id"){
                    mapped[entry[0]] = uuidv4()  
                } else if(entry[0] === "tags"){
                    mapped[entry[0]] = []
                } else if(entry[0] === "createdAt"){
                    mapped[entry[0]] = entry[1] === -1 ? `${new Date().toISOString()}` : items[entry[1]]
                } else if(entry[0] === "caliber"){
                    mapped[entry[0]] = entry[1] === -1 ? "" : items[entry[1]].split(", ")
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
        setMapCSVAmmo(null)
        setMapCSVGun(null)
    }

    return(
        <ModalContainer visible={importCSVVisible} setVisible={toggleImportCSVVisible}
        title={dbCollectionType === "import_custom_gun_csv" ? mainMenu_gunDatabase.importCSVModalTitle[language] : mainMenu_ammunitionDatabase.importCSVModalTitle[language]}
        subtitle={dbCollectionType === "import_custom_gun_csv" ? mainMenu_gunDatabase.importCSVModalText[language] : mainMenu_ammunitionDatabase.importCSVModalText[language]}
        content={<View><View><Checkbox.Item label={dbCollectionType === "import_custom_gun_csv" ? mainMenu_gunDatabase.importCSVModalCheckbox[language] : mainMenu_ammunitionDatabase.importCSVModalCheckbox[language]} status={hasHeaders ? "checked" : "unchecked"} onPress={()=>setHasHeaders(!hasHeaders)} /></View><ScrollView style={{padding: defaultViewPadding}}>
                
            {dbCollectionType === "import_custom_gun_csv" ? gunDataTemplate.map((gunItem, gunIndex)=>{

                return(
                    <View key={`mapperRow_${gunIndex}`} style={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={{width: "50%"}}>{gunItem.de}</Text>
                        <Picker style={{width: "50%", color: theme.colors.onBackground}} dropdownIconColor={theme.colors.onBackground} selectedValue={mapCSVGun[gunItem.name]} onValueChange={(itemValue, itemIndex) => setMapCSVGun({...mapCSVGun, [gunItem.name]:itemValue})}>
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
            dbCollectionType === "import_custom_ammo_csv" ? ammoDataTemplate.map((ammoItem, ammoIndex)=>{

                return(
                    <View key={`mapperRow_${ammoIndex}`} style={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={{width: "50%"}}>{ammoItem.de}</Text>
                        <Picker style={{width: "50%", color: theme.colors.onBackground}} dropdownIconColor={theme.colors.onBackground} selectedValue={mapCSVAmmo[ammoItem.name]} onValueChange={(itemValue, itemIndex) => setMapCSVAmmo({...mapCSVAmmo, [ammoItem.name]:itemValue})}>
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
            null
            }
            
                </ScrollView></View>}
        buttonACK={<IconButton icon="check" mode="contained" style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary} onPress={()=>setImportedCSV()} />}
        buttonCNL={<IconButton icon="cancel" mode="contained" style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} onPress={()=>toggleImportCSVVisible()} />}
        buttonDEL={null}
        
        />
                  
    )
}