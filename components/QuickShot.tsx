import { ScrollView, View } from "react-native";
import { Button, Dialog, HelperText, IconButton, List, Text, TextInput } from "react-native-paper";
import { usePreferenceStore } from "../stores/usePreferenceStore";
import { dateLocales, defaultViewPadding } from "../configs";
import { AMMO_DATABASE, GUN_DATABASE } from "../configs_DB"
import { gunQuickShot } from "../lib/textTemplates";
import { useGunStore } from "../stores/useGunStore";
import { useAmmoStore } from "../stores/useAmmoStore";
import { useState } from "react";
import { AmmoType, GunType } from "../interfaces";
import * as SecureStore from "expo-secure-store"

export default function QuickShot({navigation}){

    const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, sortAmmoIcon, setSortAmmoIcon } = usePreferenceStore()
    const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()
    const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()
    const [shotCountFromStock, setShotCountFromStock] = useState<string[]>([])
    const [shotCountNonStock, setShotCountNonStock] = useState<string>("")
    const [seeInfo, toggleSeeInfo] = useState<boolean>(false)

    async function save(value: GunType) {
        await SecureStore.setItemAsync(`${GUN_DATABASE}_${value.id}`, JSON.stringify(value)) // Save the gun
        console.log(`Saved item ${JSON.stringify(value)} with key ${GUN_DATABASE}_${value.id}`)
        setCurrentGun(value)
        const currentObj:GunType = gunCollection.find(({id}) => id === value.id)
        const index:number = gunCollection.indexOf(currentObj)
        const newCollection:GunType[] = gunCollection.toSpliced(index, 1, value)
        setGunCollection(newCollection)
      }

      async function saveNewStock(ammo:AmmoType){
        const date:Date = new Date()

        await SecureStore.setItemAsync(`${AMMO_DATABASE}_${ammo.id}`, JSON.stringify({...ammo, lastTopUpAt: ammo.currentStock === ammo.previousStock ? ammo.lastTopUpAt : date.toLocaleDateString(dateLocales.de)})) // Save the ammo
            console.log(`Updated item ${JSON.stringify(ammo)} with key ${AMMO_DATABASE}_${ammo.id}`)
            
    

    }

    function handleShotCount(){
        const date:Date = new Date()
        const mapped:number[] = Object.entries(shotCountFromStock).map(item => item[1] === "" ? 0 : Number(item[1]))
        const currentShotCount:number = currentGun.shotCount === undefined ? 0 : currentGun.shotCount === null ? 0 : Number(currentGun.shotCount)
        const total: number = Number(shotCountNonStock) + mapped.reduce((acc, curr) => acc+Number(curr),0) + currentShotCount
        const newGun:GunType = {...currentGun, shotCount: `${total}`, lastShotAt: date.toLocaleDateString(dateLocales.de)}
        save(newGun)
        if (shotCountFromStock.length !== 0) {
          const updatedAmmoCollection = [...ammoCollection];
        
          ammoCollection.forEach(ammo => {
            currentGun.caliber.forEach((caliber, index) => {
              if (ammo.caliber === caliber) {
                const stock:number[] = Object.entries(shotCountFromStock)
                .filter(([key]) => key === ammo.id)
                .map(([key, value]) => Number(value));
                const newStock = ammo.currentStock - Number(stock.length === 0 ? 0 : stock[0]);
                const newAmmo = { ...ammo, currentStock: newStock, previousStock: ammo.currentStock };
                saveNewStock(newAmmo)
                const itemIndex = updatedAmmoCollection.findIndex(({ id }) => id === ammo.id);
                if (itemIndex !== -1) {
                  updatedAmmoCollection[itemIndex] = newAmmo;
                }
              }
            });
          });
        
          setAmmoCollection(updatedAmmoCollection);
        }
        setShotCountNonStock("")
        setShotCountFromStock([])
        navigation.goBack()
      }
      
      const handleInputChange = (ammoId:string, index:number, value:string) => {
        const newValue = value.replace(/[^0-9]/g, '');
        setShotCountFromStock(prevState => ({
          ...prevState,
          [`${ammoId}`]: newValue
        }));
      };
      
      function handleErrorMessage(ammo:AmmoType, val:string){
       return (ammo.currentStock === undefined ? 0 : ammo.currentStock === null ? 0 : ammo.currentStock) < Number(val)
      }
    
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
                    <List.Accordion title={gunQuickShot.updateFromStock[language]} titleStyle={{color: theme.colors.onBackground}}>
                    <View style={{width: "100%", padding: defaultViewPadding, display: "flex", alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap"}}>
                      {ammoCollection.map(ammo =>{
                        return currentGun.caliber.map((caliber, index) =>{
                          if(ammo.caliber === caliber){
                            const key = `${ammo.id}`;
                            const val = shotCountFromStock[key] || '';
                            return (
                              <View key={ammo.id} style={{width: "100%", marginTop: defaultViewPadding, marginBottom: defaultViewPadding}}>
                                <Text>{ammo.caliber}</Text>
                                <TextInput 
                                  label={`${ammo.manufacturer ? ammo.manufacturer : ""} ${ammo.designation}`}
                                  value={val}
                                  onChangeText={val => handleInputChange(ammo.id, index, val)}
                                  returnKeyType='done'
                        returnKeyLabel='OK'
                                />
                                {handleErrorMessage(ammo, val) ? <HelperText type="error" visible={handleErrorMessage(ammo, val)}>
                                  {ammo.currentStock === null ? gunQuickShot.errorNoAmountDefined[language] : ammo.currentStock === undefined ? gunQuickShot.errorNoAmountDefined[language] : gunQuickShot.errorAmountTooLow[language].replace("{{AMOUNT}}", ammo.currentStock)}
                                </HelperText> : null}
                              </View>
                            )
                          }
                        })
                      })}
                    </View>
                    </List.Accordion> : null}
                  <List.Accordion title={gunQuickShot.updateNonStock[language]} titleStyle={{color: theme.colors.onBackground}}>
                    <View style={{width: "100%", padding: defaultViewPadding}}>
                      <TextInput
                        value={shotCountNonStock}
                        onChangeText={shotCountNonStock => setShotCountNonStock(shotCountNonStock.replace(/[^0-9]/g, ''))}
                        label={gunQuickShot.updateNonStockInput[language]}
                        returnKeyType='done'
                        returnKeyLabel='OK'
                      ></TextInput>
                    </View>
                    </List.Accordion>
                    </ScrollView>
                            </List.Section>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                      <IconButton mode="contained" onPress={()=>handleShotCount()} icon={"check"} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
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