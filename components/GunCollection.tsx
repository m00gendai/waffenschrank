import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Appbar, Card, FAB, Menu, Modal, Portal, Switch, useTheme, Text, Tooltip, Banner, Searchbar, IconButton, TextInput, List, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AMMO_DATABASE, GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS, dateLocales, defaultGridGap, defaultViewPadding } from '../configs';
import { GunType, MenuVisibility, SortingTypes, AmmoType, CaliberArray } from '../interfaces';
import * as SecureStore from "expo-secure-store"
import { getIcon, doSortBy } from '../utils';
import NewGun from './NewGun';
import Gun from './Gun';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import GunCard from './GunCard';
import { gunQuickShot, search, sorting, tooltips } from '../lib/textTemplates';
import Animated, { FadeIn, FadeOut, LightSpeedOutRight, SlideInDown, SlideInLeft, SlideInUp, SlideOutDown, SlideOutRight, SlideOutUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAmmoStore } from '../stores/useAmmoStore';

export default function GunCollection(){

  // TODO: Zustand SortIcon, Zustand SortOrder @ usePreferenceStore
  // TODO: Zustand menuVisibility @ useViewStore
  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortAscending, setSortAscending] = useState<boolean>(true)
  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [shotVisible, setShotVisible] = useState<boolean>(false)
  const [shotCountNonStock, setShotCountNonStock] = useState<string>("")
  const [shotCountFromStock, setShotCountFromStock] = useState<string[]>([])

  const { dbImport, displayAsGrid, setDisplayAsGrid, toggleDisplayAsGrid, sortBy, setSortBy, language, setSortGunIcon, sortGunIcon } = usePreferenceStore()
  const { mainMenuOpen, setMainMenuOpen, newGunOpen, setNewGunOpen, editGunOpen, setEditGunOpen, seeGunOpen, setSeeGunOpen } = useViewStore()
  const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()
  const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()
  const { tags, setTags, overWriteTags } = useTagStore()
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);

  const onToggleSwitch = () => setIsFilterOn(!isFilterOn);

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: "wrap",
      flexDirection: "row",
      gap: defaultGridGap,
      padding: defaultViewPadding,
      marginBottom: 75
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    flagButton:{
      fontSize: 20
    }
  });        

        async function handleSortBy(type: SortingTypes){
            setSortGunIcon(getIcon(type))
            setSortBy(type)
            const sortedGuns = doSortBy(type, sortAscending, gunCollection) as GunType[]
            setGunCollection(sortedGuns)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"sortBy": type} : {...JSON.parse(preferences), "sortBy":type} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }

          function handleMenu(category: string, status: boolean){
            setMenuVisibility({...menuVisibility, [category]: status})
          }

          async function handleSortOrder(){
            setSortAscending(!sortAscending)
            const sortedGuns = doSortBy(sortBy, !sortAscending, gunCollection) as GunType[] // called with !sortAscending due to the useState having still the old value
            setGunCollection(sortedGuns)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"sortOrder": !sortAscending} : {...JSON.parse(preferences), "sortOrder":!sortAscending} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }
        
          async function handleDisplaySwitch(){
            toggleDisplayAsGrid()
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"displayAsGrid": !displayAsGrid} : {...JSON.parse(preferences), "displayAsGrid": !displayAsGrid} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          } 

function sortCheckboxes(list:{label: string, status: boolean}[]){
  return list.sort((a:{label: string, status: boolean}, b:{label: string, status: boolean}) =>{
    const x = a.label
    const y = b.label
    return x > y ? 1 : x < y ? -1 : 0
  })
}

function sortTags(list:{label: string, status: boolean}[]){

  const removeDuplicates = (arr:{label:string,status:boolean}[]) => {
    const map = new Map();
    arr.forEach(item => {
        if (!map.has(item.label)) {
            map.set(item.label, item);
        }
    });
    return Array.from(map.values());
};

const uniqueObjects = removeDuplicates(list);

  return uniqueObjects.sort((a:{label: string, status: boolean}, b:{label: string, status: boolean}) =>{
    const x = a.label
    const y = b.label
    return x > y ? 1 : x < y ? -1 : 0
  })
}

async function handleFilterPress(tag:{label:string, status:boolean}){

  const preferences:string = await AsyncStorage.getItem(TAGS)

  const index = tags.findIndex(tagItem => tagItem.label === tag.label)

  tags[index].status = !tags[index].status
  overWriteTags(tags)

            const newPreferences:{[key:string] : string} = preferences == null ? {"tags": tags} : {...JSON.parse(preferences), "tags":tags} 
            await AsyncStorage.setItem(TAGS, JSON.stringify(newPreferences))
 
}

const activeTags = tags.filter(tag => tag.status === true)
const sortedTags = sortTags(tags)
const gunList = activeTags.length !== 0  ? gunCollection.filter(gun => activeTags.some(tag => gun.tags?.includes(tag.label))) : gunCollection

              function handleSearch(){
                !searchBannerVisible ? startAnimation() : endAnimation()
                if(searchBannerVisible){
                  setSearchQuery("")
                }
              setTimeout(function(){
                toggleSearchBannerVisible(!searchBannerVisible)
              }, searchBannerVisible ? 400 : 50)
              }
              
              const height = useSharedValue(0);
              
              const animatedStyle = useAnimatedStyle(() => {
                return {
                  height: height.value,
                };
              });
              
              const startAnimation = () => {
                height.value = withTiming(56, { duration: 500 }); // 500 ms duration
              };
              
              const endAnimation = () => {
                height.value = withTiming(0, { duration: 500 }); // 500 ms duration
              };

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
  setShotVisible(false)
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
        <SafeAreaView 
        style={{
          width: "100%", 
          height: "100%", 
          flex: 1,
          backgroundColor: theme.colors.background
        }}
      >

        <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
         
           <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
            <Appbar.Action icon={"menu"} onPress={setMainMenuOpen} />
          </View>
          <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <Appbar.Action icon="magnify" onPress={()=>handleSearch()}/>
          <Menu
            visible={menuVisibility.filterBy}
            onDismiss={()=>handleMenu("filterBy", false)}
            anchor={sortedTags.length === 0 ? <Tooltip title={tooltips.tagFilter[language]}><Appbar.Action icon="filter" disabled={sortedTags.length === 0 ? true : false} onPress={() =>{handleMenu("filterBy", true)}} /></Tooltip> : <Appbar.Action icon="filter" disabled={sortedTags.length === 0 ? true : false} onPress={() =>{handleMenu("filterBy", true)}} />}
            anchorPosition='bottom'
            >
            <View style={{padding: defaultViewPadding}}>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                <Text>Filter:</Text>
                <Switch value={isFilterOn} onValueChange={onToggleSwitch} />
              </View>
            
              {sortedTags.map((tag, index)=>{
        
                return <Checkbox.Item key={`filter_${tag}_${index}`} label={tag.label} status={tag.status ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)}/>
              })}
              </View>
            </Menu>
            <Appbar.Action icon={displayAsGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={sortGunIcon} onPress={() => handleMenu("sortBy", true)} />}
              anchorPosition='bottom'
            >
             <Menu.Item onPress={() => handleSortBy("alphabetical")} title={`${sorting.alphabetic[language]}`} leadingIcon={getIcon("alphabetical")}/>
              <Menu.Item onPress={() => handleSortBy("lastAdded")} title={`${sorting.lastAdded[language]}`} leadingIcon={getIcon("lastAdded")}/>
              <Menu.Item onPress={() => handleSortBy("lastModified")} title={`${sorting.lastModified[language]}`} leadingIcon={getIcon("lastModified")}/>
            </Menu>
            <Appbar.Action icon={sortAscending ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
          </View>
        </Appbar>
        <Animated.View style={[{paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding}, animatedStyle]}>{searchBannerVisible ? <Searchbar placeholder={search[language]} onChangeText={setSearchQuery} value={searchQuery} /> : null}</Animated.View>
        <ScrollView 
          style={{
            width: "100%", 
            height: "100%", 
            flexDirection: "column", 
            flexWrap: "wrap"
          }}
        >
          <View 
            style={styles.container}
          >
            {gunCollection.length !== 0 && !isFilterOn ? gunCollection.map(gun =>{
              return(
                searchQuery !== "" ? gun.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || gun.model.toLowerCase().includes(searchQuery.toLowerCase()) ? <GunCard key={gun.id} gun={gun} shotVisible={shotVisible} setShotVisible={setShotVisible}/> : null : <GunCard key={gun.id} gun={gun} shotVisible={shotVisible} setShotVisible={setShotVisible}/>
              )
            }) 
            :
            gunCollection.length !== 0 && isFilterOn ? gunList.map(gun =>{
              return (
                searchQuery !== "" ? gun.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || gun.model.toLowerCase().includes(searchQuery.toLowerCase()) ? <GunCard key={gun.id} gun={gun} shotVisible={shotVisible} setShotVisible={setShotVisible}/> : null : <GunCard key={gun.id} gun={gun} shotVisible={shotVisible} setShotVisible={setShotVisible}/>
              )
            })
            :
            null}
          </View>
        </ScrollView>

        <Portal>
          <Modal visible={newGunOpen} contentContainerStyle={{height: "100%"}} onDismiss={setNewGunOpen}>
            <NewGun />
          </Modal>
        </Portal>        

      <Portal>
        <Modal visible={seeGunOpen} contentContainerStyle={{height: "100%"}} onDismiss={setSeeGunOpen}>
          <Gun />
        </Modal>
      </Portal>

      <Portal>
      <Modal visible={shotVisible} >
      <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                        <View style={{backgroundColor: theme.colors.background, width: "100%", height: "75%"}}>
                            <List.Section style={{flex: 1}}>
                  <View style={{padding: defaultViewPadding}}>
                      <Text variant="titleMedium" style={{color: theme.colors.primary}}>{`${gunQuickShot.title[language]}`}</Text>
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
                      ></TextInput>
                    </View>
                    </List.Accordion>
                    </ScrollView>
                            </List.Section>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                      <IconButton mode="contained" onPress={()=>handleShotCount()} icon={"check"} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                      <IconButton mode="contained" onPress={()=>setShotVisible(false)} icon={"cancel"} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} />
                      </View>
                        </View>
                    </View>
                </View>
      </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={setNewGunOpen}
        disabled={mainMenuOpen ? true : false}
      /> 
        
      </SafeAreaView>
    )
}

