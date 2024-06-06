import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';
import { Appbar, Card, FAB, IconButton, Menu, Switch, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AMMO_DATABASE, A_KEY_DATABASE, PREFERENCES, A_TAGS, defaultGridGap, defaultViewPadding, dateLocales } from '../configs';
import { AmmoType, MenuVisibility } from '../interfaces';
import * as SecureStore from "expo-secure-store"
import { getIcon, doSortBy } from '../utils';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import newAmmo from './NewAmmo';
import NewAmmo from './NewAmmo';
import Ammo from './Ammo';
import { ammoQuickUpdate } from '../lib/textTemplates';

export default function AmmoCollection(){

  // TODO: Zustand SortIcon, Zustand SortOrder @ usePreferenceStore
  // TODO: Zustand menuVisibility @ useViewStore
  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortIcon, setSortIcon] = useState<string>("alphabetical-variant")
  const [sortAscending, setSortAscending] = useState<boolean>(true)
  const [stockVisible, setStockVisible] = useState<boolean>(false)
  const [stockChange, setStockChange] = useState<"dec" | "inc" | "">("")
  const [stockValue, setStockValue] = useState<number>(0)
  const [input, setInput] = useState<string>("")
  const [error, displayError] = useState<boolean>(false)

  const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language } = usePreferenceStore()
  const { mainMenuOpen, setMainMenuOpen, newAmmoOpen, setNewAmmoOpen, editAmmoOpen, setEditAmmoOpen, seeAmmoOpen, setSeeAmmoOpen } = useViewStore()
  const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()
  const { ammo_tags, setAmmoTags, overWriteAmmoTags } = useTagStore()
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
      padding: defaultViewPadding
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
  
    async function getKeys(){
        const keys:string = await AsyncStorage.getItem(A_KEY_DATABASE)
        if(keys == null){
          return []
        }
        return JSON.parse(keys)
      }
      
    useEffect(()=>{
        async function getAmmo(){
          const keys:string[] = await getKeys()
          const ammunitions:AmmoType[] = await Promise.all(keys.map(async key =>{
            const item:string = await SecureStore.getItemAsync(`${AMMO_DATABASE}_${key}`)
            return JSON.parse(item)
          }))
          const preferences:string = await AsyncStorage.getItem(PREFERENCES)
          const isPreferences = preferences === null ? null : JSON.parse(preferences)

          const sortedAmmo = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === null ? "alphabetical" : isPreferences.sortAmmoBy, isPreferences == null? true : isPreferences.sortAmmoOrder === null ? true : isPreferences.sortOrder, ammunitions) as AmmoType[]
          setAmmoCollection(sortedAmmo)
        }
        getAmmo()
      },[newAmmoOpen, seeAmmoOpen, ammoDbImport, stockValue])

useEffect(()=>{
  async function getPreferences(){
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const isPreferences = preferences === null ? null : JSON.parse(preferences)

    const tagList: string = await AsyncStorage.getItem(A_TAGS)

    const isTagList:{label: string, status: boolean}[] = tagList === null ? null : JSON.parse(tagList)
   
    setDisplayAmmoAsGrid(isPreferences === null ? true : isPreferences.displayAmmoAsGrid === null ? true : isPreferences.displayAmmoAsGrid)
    setSortAmmoBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === null ? "alphabetical" : isPreferences.sortAmmoBy)
    setSortIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === null ? "alphabetical" : isPreferences.sortAmmoBy)))

    if(isTagList !== null && isTagList !== undefined){
      Object.values(isTagList).map(tag =>{

      setAmmoTags(tag)
    }) 
  }
  
  }
  getPreferences()
},[])

        function handleAmmoCardPress(ammo){
          setCurrentAmmo(ammo)
          setSeeAmmoOpen()
        }

        async function handleSortBy(type: "alphabetical" | "chronological" | "caliber"){
            setSortIcon(getIcon(type))
            setSortAmmoBy(type)
            const sortedAmmo = doSortBy(type, sortAscending, ammoCollection) as AmmoType[] 
            setAmmoCollection(sortedAmmo)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"sortAmmoBy": type} : {...JSON.parse(preferences), "sortAmmoBy":type} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }

          function handleMenu(category: string, status: boolean){
            setMenuVisibility({...menuVisibility, [category]: status})
          }

          async function handleSortOrder(){
            setSortAscending(!sortAscending)
            const sortedAmmo = doSortBy(sortAmmoBy, !sortAscending, ammoCollection) as AmmoType[] // called with !sortAscending due to the useState having still the old value
            setAmmoCollection(sortedAmmo)
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"sortOrder": !sortAscending} : {...JSON.parse(preferences), "sortOrder":!sortAscending} 
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
          }
        
          async function handleDisplaySwitch(){
            toggleDisplayAmmoAsGrid()
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            const newPreferences:{[key:string] : string} = preferences == null ? {"displayAmmoAsGrid": !displayAmmoAsGrid} : {...JSON.parse(preferences), "displayAmmoAsGrid": !displayAmmoAsGrid} 
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

  const preferences:string = await AsyncStorage.getItem(A_TAGS)

  const index = ammo_tags.findIndex(tagItem => tagItem.label === tag.label)

  ammo_tags[index].status = !ammo_tags[index].status
  overWriteAmmoTags(ammo_tags)

            const newPreferences:{[key:string] : string} = preferences == null ? {"ammo_tags": ammo_tags} : {...JSON.parse(preferences), "ammo_tags":ammo_tags} 
            await AsyncStorage.setItem(A_TAGS, JSON.stringify(newPreferences))
 
}

const activeTags = ammo_tags.filter(tag => tag.status === true)
           const sortedTags = sortTags(ammo_tags)
              const ammoList = ammoCollection.filter(ammo => activeTags.some(tag => ammo.tags?.includes(tag.label)))

function handleStockButtonPress(ammo:AmmoType){
    setCurrentAmmo(ammo)
    setStockVisible(!stockVisible)
}
           
async function saveNewStock(ammo:AmmoType){
    const date:Date = new Date()
    if(stockChange !== ""){
    const currentValue:number = ammo.currentStock
    const increase:number = parseInt(input)
    const total:number = stockChange === "inc" ? currentValue + increase : currentValue - increase

    await SecureStore.setItemAsync(`${AMMO_DATABASE}_${ammo.id}`, JSON.stringify({...ammo, previousStock: currentValue, currentStock:total, lastTopUpAt: date.toLocaleDateString(dateLocales.de)})) // Save the ammo
        console.log(`Updated item ${JSON.stringify(ammo)} with key ${AMMO_DATABASE}_${ammo.id}`)
        setCurrentAmmo({...ammo, currentStock:parseInt(input)})
        setStockValue(parseInt(input))
        setInput("")
        setStockChange("")
        setStockVisible(!stockVisible)
        displayError(false)
    }
    else {
        displayError(true)
    }
}

    return(
        <SafeAreaView 
        style={{
          width: "100%", 
          height: "100%", 
          flex: 1
        }}
      >

        <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
         
           <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
            <Appbar.Action icon={"menu"} onPress={setMainMenuOpen} />
          </View>
          <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
          <Menu
            visible={menuVisibility.filterBy}
            onDismiss={()=>handleMenu("filterBy", false)}
            anchor={<Appbar.Action icon="filter" onPress={() =>{handleMenu("filterBy", true)}} />}
            anchorPosition='bottom'
            >
            <View style={{padding: 5}}>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                <Text>Filter:</Text>
                <Switch value={isFilterOn} onValueChange={onToggleSwitch} />
              </View>
            
              {sortedTags.map((tag, index)=>{
        
                return <Checkbox.Item key={`filter_${tag}_${index}`} label={tag.label} status={tag.status ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)}/>
              })}
              </View>
            </Menu>
            <Appbar.Action icon={displayAmmoAsGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={sortIcon} onPress={() => handleMenu("sortBy", true)} />}
              anchorPosition='bottom'
            >
              <Menu.Item onPress={() => handleSortBy("alphabetical")} title="Alphabetisch" leadingIcon={getIcon("alphabetical")}/>
              <Menu.Item onPress={() => handleSortBy("chronological")} title="Chronologisch" leadingIcon={getIcon("chronological")}/>
             {/* <Menu.Item onPress={() => {}} title="Kaliber" leadingIcon={getIcon("caliber")}/> */}
            </Menu>
            <Appbar.Action icon={sortAscending ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
          </View>
        </Appbar>

        <ScrollView 
          contentContainerStyle={{
            width: "100%", 
            height: "100%", 
            flexDirection: "column", 
            flexWrap: "wrap"
          }}
        >
          <View 
            style={styles.container}
          >
            {ammoCollection.length != 0 && !isFilterOn ? ammoCollection.map(ammo =>{
              return(
                <TouchableNativeFeedback 
                  key={ammo.id} 
                  onPress={()=>handleAmmoCardPress(ammo)}
                >
                  <Card 
                    style={{
                      width: (Dimensions.get("window").width / (displayAmmoAsGrid ? 2 : 1)) - (defaultGridGap + (defaultViewPadding/2)),
                    }}
                  >
                    <Card.Title titleStyle={ammo.currentStock && ammo.criticalStock ? {color: parseFloat(ammo.currentStock.toString()) <= parseFloat(ammo.criticalStock.toString()) ? "red" : "black"} : {}} title={`${ammo.designation} ${ammo.currentStock ? `(${ammo.currentStock})` : ""}`} subtitle={ammo.manufacturer && ammo.manufacturer.length != 0 ? ammo.manufacturer : " "} subtitleVariant='bodySmall' titleVariant='titleSmall' titleNumberOfLines={2} />
                    {displayAmmoAsGrid ? 
                    <Card.Cover 
                      source={ammo.images && ammo.images.length != 0 ? { uri: ammo.images[0] } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
                      style={{
                        height: 100
                      }}
                    /> 
                    : 
                    null}
                    <IconButton icon={"plus-minus-variant"} onPress={()=>handleStockButtonPress(ammo)} /> 
                  </Card>
                </TouchableNativeFeedback>
              )
            }) 
            :
            ammoCollection.length !== 0 && isFilterOn ? ammoList.map(ammo =>{
              

                
                  return <TouchableNativeFeedback 
                  key={ammo.id} 
                  onPress={()=>handleAmmoCardPress(ammo)}
                >
                  <Card 
                    style={{
                      width: (Dimensions.get("window").width / (displayAmmoAsGrid ? 2 : 1)) - (defaultGridGap + (defaultViewPadding/2)),
                    }}
                  >
                    <Card.Title titleStyle={ammo.currentStock && ammo.criticalStock ? {color: parseFloat(ammo.currentStock.toString()) <= parseFloat(ammo.criticalStock.toString()) ? "red" : "black"} : {}} title={`${ammo.designation} ${ammo.currentStock ? `(${ammo.currentStock})` : ""}`} subtitle={ammo.manufacturer && ammo.manufacturer.length != 0 ? ammo.manufacturer : " "} subtitleVariant='bodySmall' titleVariant='titleSmall' titleNumberOfLines={2} />
                    {displayAmmoAsGrid ? 
                    <Card.Cover 
                      source={ammo.images && ammo.images.length != 0 ? { uri: ammo.images[0] } : require(`../assets//540940_several different realistic bullets and ammunition_xl-1024-v1-0.png`)} 
                      style={{
                        height: 100
                      }}
                    /> 
                    : 
                    null}
                  </Card>
                </TouchableNativeFeedback>
                
              
            })
              
            :
            null}
          </View>
        </ScrollView>
        {newAmmoOpen ? 
      <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}}>
        <SafeAreaView>
          <NewAmmo />
        </SafeAreaView>
      </Animated.View> 
      : 
      null}
        
      {seeAmmoOpen ? 
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}}>
        <SafeAreaView>
          <Ammo />
        </SafeAreaView>
      </Animated.View>
      :
      null}

{stockVisible ? 
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}}>
        <SafeAreaView>
          <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"}}>
            <View style={{width: "85%", display: "flex", flexDirection: "column", backgroundColor: "white"}}>
            <View style={{width: "100%", display: "flex", flexDirection: "row"}}>
                <Text>{ammoQuickUpdate.title[language]}</Text>
            </View>
                <View style={{width: "100%", display: "flex", flexDirection: "row"}}>
                    <IconButton icon="plus" style={{backgroundColor: stockChange === "inc" ? "green" : "transparent"}} onPress={()=>setStockChange("inc")}/>
                    <IconButton icon="minus" style={{backgroundColor: stockChange === "dec" ? "green" : "transparent"}} onPress={()=>setStockChange("dec")} />
                    <TextInput style={{flex: 1}} keyboardType={"number-pad"} value={input} onChangeText={input => setInput(input.replace(/[^0-9]/g, ''))} inputMode='decimal'/>
                    <IconButton icon="floppy" onPress={()=>saveNewStock(currentAmmo)}/>
                    <IconButton icon="cancel" onPress={()=>setStockVisible(false)}/>
                </View>
                {error ? <View style={{width: "100%", display: "flex", flexDirection: "row"}}>
                <Text style={{color: "red"}}>{ammoQuickUpdate.error[language]}</Text>
            </View> : null}
            </View>
        </View>
        </SafeAreaView>
      </Animated.View>
      :
      null}


         {!seeAmmoOpen && !newAmmoOpen && !mainMenuOpen? 
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={setNewAmmoOpen}
        disabled={mainMenuOpen ? true : false}
      /> 
      : 
      null}
        
      </SafeAreaView>
    )
}

