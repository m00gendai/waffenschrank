import { ScrollView, View } from "react-native";
import { Button, Dialog, HelperText, IconButton, List, Text, TextInput } from "react-native-paper";
import { usePreferenceStore } from "../stores/usePreferenceStore";
import { dateLocales, defaultViewPadding } from "../configs";
import { AMMO_DATABASE, GUN_DATABASE } from "../configs_DB"
import { gunQuickShot, shotLabel } from "../lib/textTemplates";
import { useGunStore } from "../stores/useGunStore";
import { useAmmoStore } from "../stores/useAmmoStore";
import { useState } from "react";
import { AmmoType, GunType } from "../interfaces";
import * as SecureStore from "expo-secure-store"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import { db } from "../db/client"
import * as schema from "../db/schema"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, inArray } from 'drizzle-orm';

export default function QuickShot({navigation}){

 

    const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, sortAmmoIcon, setSortAmmoIcon } = usePreferenceStore()
    const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()
    const [shotCountFromStock, setShotCountFromStock] = useState<string[]>([])
    const [shotCountNonStock, setShotCountNonStock] = useState<string>("")
    const [seeInfo, toggleSeeInfo] = useState<boolean>(false)
    const [negativeAmmo, setNegativeAmmo] = useState<boolean>(false)
    const [negativeAmmoId, setNegativeAmmoId] = useState<string>("")

    const { data } = useLiveQuery(
      db.select()
      .from(schema.ammoCollection)
      .where(inArray(schema.ammoCollection.caliber, currentGun.caliber))
    )

      async function saveNewStock(id: string, count:number){
        const date:Date = new Date()
        /*@ts-expect-error*/
        await db.update(schema.ammoCollection).set({currentStock: `${count}`, lastTopUpAt: date.getTime()}).where(eq(schema.ammoCollection.id, id))
        
            
    

    }

    async function handleShotCount(){
        const date:Date = new Date()
        const mapped:number[] = Object.entries(shotCountFromStock).map(item => item[1] === "" ? 0 : Number(item[1]))
        const currentShotCount:number = currentGun.shotCount === undefined ? 0 : currentGun.shotCount === null ? 0 : Number(currentGun.shotCount)
        const total: number = Number(shotCountNonStock) + mapped.reduce((acc, curr) => acc+Number(curr),0) + currentShotCount
        const newGun:GunType = {...currentGun, shotCount: `${total}`, lastShotAt: `${date.getTime()}`}
        /*@ts-expect-error*/
        await db.update(schema.gunCollection).set({shotCount: `${total}`, lastShotAt: date.getTime()}).where(eq(schema.gunCollection.id, currentGun.id))

        if (shotCountFromStock.length !== 0) {
         for (const count of Object.entries(shotCountFromStock)){
          console.log(count)
          const ammo = await db.selectDistinct().from(schema.ammoCollection).where(eq(schema.ammoCollection.id, count[0]))
          console.log(ammo)
          const newStock = parseInt(ammo[0].currentStock) - (count[1] === "" ? 0 : parseInt(count[1]))
          await saveNewStock(ammo[0].id, newStock)
         }
           
          }
        

        
        setShotCountNonStock("")
        setShotCountFromStock([])
        navigation.goBack()
      }

      const handleInputChange = (ammoStock: number, ammoId:string, value:string) => {
        const newValue = value.replace(/[^0-9]/g, '');
        setNegativeAmmo((ammoStock === undefined ? 0 : ammoStock === null ? 0 : Number(ammoStock)) < Number(value))
        setNegativeAmmoId(ammoStock === undefined ? "" : ammoStock === null ? "" : Number(ammoStock) < Number(value) ? ammoId : "")
        setShotCountFromStock(prevState => ({
          ...prevState,
          [`${ammoId}`]: newValue
        }));
      };
      
  

return(
<View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                        <View style={{backgroundColor: theme.colors.background, width: "100%", height: "75%"}}>
                            <List.Section style={{flex: 1}}>
                   <View style={{borderTopLeftRadius: 25, borderTopRightRadius: 25, width: "100%", backgroundColor: theme.colors.background, borderBottomColor: theme.colors.primary, borderBottomWidth: 1, marginBottom: 5}}>
                            <View style={{display: "flex", flexDirection: "row"}}><Text variant="titleLarge" style={{color: theme.colors.primary, padding: defaultViewPadding, flex: 9}}>{`QuickShot`}</Text><IconButton style={{flex: 1}} icon="help-circle-outline" onPress={()=>toggleSeeInfo(true)}/></View>
                        </View>
                  <ScrollView>
                  {currentGun !== null && currentGun.caliber !== undefined && currentGun.caliber !== null && currentGun.caliber.length !== 0 ? 
                    data.length === 0 ? null : <List.Accordion title={gunQuickShot.updateFromStock[language]} titleStyle={{color: theme.colors.onBackground}}>
                    <View style={{width: "100%", padding: defaultViewPadding, display: "flex", alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap"}}>
                      {data.map(ammo =>{
                        if(parseInt(ammo.currentStock) !== 0 && ammo.currentStock !== null && ammo.currentStock !== ""){
                            const key = `${ammo.id}`;
                            const val = shotCountFromStock[key] || '';
                            return (
                              <View key={ammo.id} style={{width: "100%", marginTop: defaultViewPadding, marginBottom: defaultViewPadding}}>
                                <Text>{`${ammo.caliber}\n${ammo.currentStock !== null ? `${ammo.currentStock} ${shotLabel[language]}` : ""}`}</Text>
                                <TextInput 
                                  label={`${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}`}
                                  value={val}
                                  onChangeText={val => handleInputChange(parseInt(ammo.currentStock), ammo.id, val)}
                                  returnKeyType='done'
                                  returnKeyLabel='OK'
                                  inputMode="decimal"
                                />
                                {negativeAmmo && negativeAmmoId === ammo.id ? <HelperText type="error" visible={negativeAmmo}>
                                  {ammo.currentStock === null ? gunQuickShot.errorNoAmountDefined[language] : ammo.currentStock === undefined ? gunQuickShot.errorNoAmountDefined[language] : gunQuickShot.errorAmountTooLow[language].replace("{{AMOUNT}}", ammo.currentStock)}
                                </HelperText> : null}
                              </View>
                            )
                          }
                        })
                      }
                    </View>
                    </List.Accordion> : null}
                  <List.Accordion title={gunQuickShot.updateNonStock[language]} titleStyle={{color: theme.colors.onBackground}}>
                    <View style={{width: "100%", padding: defaultViewPadding}}>
                      <TextInput
                        value={shotCountNonStock}
                        onChangeText={shotCountNonStock => setShotCountNonStock(shotCountNonStock.replace(/[^0-9]/g, ''))}
                        label={gunQuickShot.updateNonStockInput[language]}
                        inputMode="decimal"
                        returnKeyType='done'
                        returnKeyLabel='OK'
                      ></TextInput>
                    </View>
                    </List.Accordion>
                    </ScrollView>
                            </List.Section>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                      <IconButton disabled={negativeAmmo} mode="contained" onPress={()=>handleShotCount()} icon={"check"} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                      <IconButton mode="contained" onPress={()=>navigation.goBack()} icon={"cancel"} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} />
                      </View>
                        </View>
                    </View>
                    <Dialog visible={seeInfo}>
             <Dialog.Content>
               <Text variant="bodyMedium">{`${gunQuickShot.title[language]}`}</Text>
             </Dialog.Content>
             <Dialog.Actions>
          <Button onPress={() => toggleSeeInfo(false)}>OK</Button>
        </Dialog.Actions>
             </Dialog>
                </View>
)
                    }