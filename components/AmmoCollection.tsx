import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, FAB, IconButton, Menu, Modal, Portal, Switch, TextInput, Text, Tooltip, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AMMO_DATABASE, A_KEY_DATABASE, PREFERENCES, A_TAGS, defaultGridGap, defaultViewPadding, dateLocales } from '../configs';
import { AmmoType, MenuVisibility, SortingTypes } from '../interfaces';
import * as SecureStore from "expo-secure-store"
import { getIcon, doSortBy } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import NewAmmo from './NewAmmo';
import Ammo from './Ammo';
import { ammoQuickUpdate, search, sorting, tooltips } from '../lib/textTemplates';
import AmmoCard from './AmmoCard';
import { colorThemes } from '../lib/colorThemes';
import Animated, { LightSpeedOutRight, SlideInLeft, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { ammoDbImport, displayAmmoAsGrid, setDisplayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme } = usePreferenceStore()
  const { mainMenuOpen, setMainMenuOpen, newAmmoOpen, setNewAmmoOpen, seeAmmoOpen, setSeeAmmoOpen} = useViewStore()
  const { ammoCollection, setAmmoCollection, currentAmmo, setCurrentAmmo } = useAmmoStore()
  const { ammo_tags, setAmmoTags, overWriteAmmoTags } = useTagStore()
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);

  const onToggleSwitch = () => setIsFilterOn(!isFilterOn);

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
          const sortedAmmo = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === undefined ? "alphabetical" : isPreferences.sortAmmoBy, isPreferences == null? true : isPreferences.sortAmmoOrder === undefined ? true : isPreferences.sortOrder, ammunitions) as AmmoType[]
          setAmmoCollection(sortedAmmo)
        }
        getAmmo()
      },[ammoDbImport])

useEffect(()=>{
  async function getPreferences(){
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const isPreferences = preferences === null ? null : JSON.parse(preferences)

    const tagList: string = await AsyncStorage.getItem(A_TAGS)

    const isTagList:{label: string, status: boolean}[] = tagList === null ? null : JSON.parse(tagList)
   
    setDisplayAmmoAsGrid(isPreferences === null ? true : isPreferences.displayAmmoAsGrid === null ? true : isPreferences.displayAmmoAsGrid)
    setSortAmmoBy(isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === undefined ? "alphabetical" : isPreferences.sortAmmoBy)
    setSortIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortAmmoBy === null ? "alphabetical" : isPreferences.sortAmmoBy)))

    if(isTagList !== null && isTagList !== undefined){
      Object.values(isTagList).map(tag =>{

      setAmmoTags(tag)
    }) 
  }
  
  }
  getPreferences()
},[])

        

        async function handleSortBy(type:SortingTypes){
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
const ammoList = activeTags.length !== 0  ? ammoCollection.filter(gun => activeTags.some(tag => gun.tags?.includes(tag.label))) : ammoCollection


           
async function saveNewStock(ammo:AmmoType){
    const date:Date = new Date()
    if(stockChange !== ""){
    const currentValue:number = ammo.currentStock ? ammo.currentStock : 0
    const increase:number = Number(input)
    const total:number = stockChange === "inc" ? Number(currentValue) + Number(increase) : Number(currentValue) - Number(increase)
    await SecureStore.setItemAsync(`${AMMO_DATABASE}_${ammo.id}`, JSON.stringify({...ammo, previousStock: currentValue, currentStock:total, lastTopUpAt: date.toLocaleDateString(dateLocales.de)})) // Save the ammo
        console.log(`Updated item ${JSON.stringify(ammo)} with key ${AMMO_DATABASE}_${ammo.id}`)
        setCurrentAmmo({...ammo, currentStock:parseInt(input)})
        setStockValue(parseInt(input))
        setInput("")
        setStockChange("")
        const currentObj:AmmoType = ammoCollection.find(({id}) => id === ammo.id)
        const index:number = ammoCollection.indexOf(currentObj)
        const newCollection:AmmoType[] = ammoCollection.toSpliced(index, 1, {...ammo, currentStock:total})
        setAmmoCollection(newCollection)
        setStockVisible(!stockVisible)
        displayError(false)

    }
    else {
        displayError(true)
    }
}

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
            <Appbar.Action icon={displayAmmoAsGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={sortIcon} onPress={() => handleMenu("sortBy", true)} />}
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
            flexWrap: "wrap",
            backgroundColor: theme.colors.background
          }}
        >
          <View 
            style={styles.container}
          >
            {ammoCollection.length !== 0 && !isFilterOn ? ammoCollection.map(ammo =>{
              return (
                searchQuery !== "" ? ammo.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || ammo.designation.toLowerCase().includes(searchQuery.toLowerCase()) ? <AmmoCard key={ammo.id} ammo={ammo} stockVisible={stockVisible} setStockVisible={setStockVisible}/> : null : <AmmoCard key={ammo.id} ammo={ammo} stockVisible={stockVisible} setStockVisible={setStockVisible}/>
              )
            }) 
            :
            ammoCollection.length !== 0 && isFilterOn ? ammoList.map(ammo =>{
              return <AmmoCard key={ammo.id} ammo={ammo} stockVisible={stockVisible} setStockVisible={setStockVisible}/>
            })
            :
            null}
          </View>
        </ScrollView>
        
        <Portal>
          <Modal visible={newAmmoOpen} contentContainerStyle={{height: "100%"}} onDismiss={setNewAmmoOpen}>
            <NewAmmo />
          </Modal>
        </Portal>        
        
        <Portal>
          <Modal visible={seeAmmoOpen} contentContainerStyle={{height: "100%"}} onDismiss={setSeeAmmoOpen}>
            <Ammo />
          </Modal>
        </Portal>

        <Portal>
      <Modal visible={stockVisible} >
        <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
            <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                <View style={{backgroundColor: theme.colors.background, width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                  <View style={{padding: defaultViewPadding}}>
                    <Text style={{color: theme.colors.onBackground}}>{ammoQuickUpdate.title[language]}</Text>
                  </View>
                  <View style={{width: "100%", display: "flex", flexDirection: "row", padding: defaultViewPadding, flexWrap: "wrap"}}>
                    <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "center",  marginBottom: 10}}>
                      <IconButton mode="contained" icon="plus" selected={stockChange === "inc" ? true : false} onPress={()=>setStockChange("inc")}/>
                      <IconButton mode="contained" icon="minus" selected={stockChange === "dec" ? true : false} onPress={()=>setStockChange("dec")} />
                    </View>
                    <TextInput style={{width: "100%"}} placeholder={ammoQuickUpdate.placeholder[language]} keyboardType={"number-pad"} value={input} onChangeText={input => setInput(input.replace(/[^0-9]/g, ''))} inputMode='decimal'/>
                    <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                    <IconButton mode="contained" icon="check" onPress={() => saveNewStock(currentAmmo)} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                      <IconButton mode="contained" icon="cancel" onPress={()=>setStockVisible(false)} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer}/>
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
      </Modal>
      </Portal>


      <FAB
        icon="plus"
        style={styles.fab}
        onPress={setNewAmmoOpen}
        disabled={mainMenuOpen ? true : false}
/>
        
      </SafeAreaView>
    )
}

