import { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, HelperText, IconButton, Text, TextInput } from "react-native-paper"
import { usePreferenceStore } from "../stores/usePreferenceStore";
import { dateLocales, defaultViewPadding } from "../configs";
import { AMMO_DATABASE } from "../configs_DB"
import { AmmoType } from "../interfaces";
import * as SecureStore from "expo-secure-store"
import { useItemStore } from "../stores/useItemStore";
import { ammoQuickUpdate, gunQuickShot } from "../lib/textTemplates";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../db/client"
import * as schema from "../db/schema"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql } from 'drizzle-orm';

export default function QuickStock({navigation}){

    const [error, displayError] = useState<boolean>(false)
    const [stockChange, setStockChange] = useState<"dec" | "inc" | "">("")
    const [stockValue, setStockValue] = useState<number>(0)
    const [input, setInput] = useState<string>("")
    const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, sortAmmoIcon, setSortAmmoIcon } = usePreferenceStore()
    const { currentItem, setCurrentItem } = useItemStore()
    const [seeInfo, toggleSeeInfo] = useState<boolean>(false)
    const [negativeAmmo, setNegativeAmmo] = useState<boolean>(false)

    async function saveNewStock(ammo:AmmoType){
        const date:Date = new Date()
        if(stockChange !== ""){
          const currentValue:number = ammo.currentStock ? ammo.currentStock : 0
          const increase:number = Number(input)
          const total:number = stockChange === "inc" ? Number(currentValue) + Number(increase) : Number(currentValue) - Number(increase)
          /*@ts-expect-error*/
          await db.update(schema.ammoCollection).set({currentStock: total, lastTopUpAt: date.getTime()}).where(eq(schema.ammoCollection.id, currentItem.id))
         
              console.log(`Updated item ${JSON.stringify(ammo)} with key ${AMMO_DATABASE}_${ammo.id}`)
              setCurrentItem({...ammo, currentStock:parseInt(input)})
              setStockValue(parseInt(input))
              setInput("")
              setStockChange("")
              navigation.goBack()
              displayError(false)
      
        }
        else {
            displayError(true)
        }
    }

    function handleInput(input:string){
      setNegativeAmmo((currentItem.currentStock === undefined ? 0 : currentItem.currentStock === null ? 0 : Number(currentItem.currentStock)) < Number(input))
      setInput(input.replace(/[^0-9]/g, ''))
    }
    
    return(
        <View style={{flex: 1}}>
        <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
            <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                <View style={{backgroundColor: theme.colors.background, width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <View style={{borderTopLeftRadius: 25, borderTopRightRadius: 25, width: "100%", backgroundColor: theme.colors.background, borderBottomColor: theme.colors.primary, borderBottomWidth: 1, marginBottom: 5}}>
                            <View style={{display: "flex", flexDirection: "row"}}><Text variant="titleLarge" style={{color: theme.colors.primary, padding: defaultViewPadding, flex: 9}}>{`QuickStock`}</Text><IconButton style={{flex: 1}} icon="help-circle-outline" onPress={()=>toggleSeeInfo(true)}/></View>
                        </View>
                  <View style={{width: "100%", display: "flex", flexDirection: "row", padding: defaultViewPadding, flexWrap: "wrap"}}>
                    <Text>{`${currentItem.manufacturer} ${currentItem.designation}\n${currentItem.caliber}`}</Text>
                    <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "center",  marginBottom: 10}}>
                      <IconButton mode="contained" icon="plus" selected={stockChange === "inc" ? true : false} onPress={()=>setStockChange("inc")}/>
                      <IconButton mode="contained" icon="minus" selected={stockChange === "dec" ? true : false} onPress={()=>setStockChange("dec")} />
                    </View>
                    <TextInput style={{width: "100%"}} placeholder={ammoQuickUpdate.placeholder[language]} keyboardType={"number-pad"} value={input} onChangeText={input => handleInput(input)} inputMode='decimal' returnKeyType='done'
                        returnKeyLabel='OK'/>
                        {negativeAmmo  && stockChange === "dec" ? <HelperText type="error" visible={negativeAmmo}>
                                  {currentItem.currentStock === null ? gunQuickShot.errorNoAmountDefined[language] : currentItem.currentStock === undefined ? gunQuickShot.errorNoAmountDefined[language] : gunQuickShot.errorAmountTooLow[language].replace("{{AMOUNT}}", currentItem.currentStock)}
                                </HelperText> : null}
                    <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                    <IconButton disabled={negativeAmmo && stockChange === "dec"} mode="contained" icon="check" onPress={() => saveNewStock(currentItem)} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                      <IconButton mode="contained" icon="cancel" onPress={()=>navigation.goBack()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer}/>
                    </View>
                  </View>
                  {error ? 
                  <View style={{width: "100%", display: "flex", flexDirection: "row"}}>
                    <Text style={{color: theme.colors.error}}>{ammoQuickUpdate.error[language]}</Text>
                  </View> 
                  : 
                  null}
                  </View>
              </View>
          </View>
          <Dialog visible={seeInfo}>
             <Dialog.Content>
               <Text variant="bodyMedium">{`${ammoQuickUpdate.title[language]}`}</Text>
             </Dialog.Content>
             <Dialog.Actions>
          <Button onPress={() => toggleSeeInfo(false)}>OK</Button>
        </Dialog.Actions>
             </Dialog>
          </View>
    )
}