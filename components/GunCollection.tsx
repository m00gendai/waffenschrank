import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Appbar, Card, FAB, Menu, Modal, Portal, Switch, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GUN_DATABASE, KEY_DATABASE, PREFERENCES, TAGS, defaultGridGap, defaultViewPadding } from '../configs';
import { GunType, MenuVisibility } from '../interfaces';
import * as SecureStore from "expo-secure-store"
import { getIcon, doSortBy } from '../utils';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import NewGun from './NewGun';
import Gun from './Gun';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import GunCard from './GunCard';

export default function GunCollection(){

  // TODO: Zustand SortIcon, Zustand SortOrder @ usePreferenceStore
  // TODO: Zustand menuVisibility @ useViewStore
  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortIcon, setSortIcon] = useState<string>("alphabetical-variant")
  const [sortAscending, setSortAscending] = useState<boolean>(true)

  const { dbImport, displayAsGrid, setDisplayAsGrid, toggleDisplayAsGrid, sortBy, setSortBy } = usePreferenceStore()
  const { mainMenuOpen, setMainMenuOpen, newGunOpen, setNewGunOpen, editGunOpen, setEditGunOpen, seeGunOpen, setSeeGunOpen } = useViewStore()
  const { gunCollection, setGunCollection, currentGun, setCurrentGun } = useGunStore()
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
  
    async function getKeys(){
        const keys:string = await AsyncStorage.getItem(KEY_DATABASE)
        if(keys == null){
          return []
        }
        return JSON.parse(keys)
      }
      
    useEffect(()=>{
        async function getGuns(){
          const keys:string[] = await getKeys()
          const guns:GunType[] = await Promise.all(keys.map(async key =>{
            const item:string = await SecureStore.getItemAsync(`${GUN_DATABASE}_${key}`)
            return JSON.parse(item)
          }))
          const preferences:string = await AsyncStorage.getItem(PREFERENCES)
          const isPreferences = preferences === null ? null : JSON.parse(preferences)

          const sortedGuns = doSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy, isPreferences == null? true : isPreferences.sortOrder === null ? true : isPreferences.sortOrder, guns) as GunType[]
          setGunCollection(sortedGuns)
        }
        getGuns()
      },[dbImport])

useEffect(()=>{
  async function getPreferences(){
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const isPreferences = preferences === null ? null : JSON.parse(preferences)

    const tagList: string = await AsyncStorage.getItem(TAGS)

    const isTagList:{label: string, status: boolean}[] = tagList === null ? null : JSON.parse(tagList)
   
    setDisplayAsGrid(isPreferences === null ? true : isPreferences.displayAsGrid === null ? true : isPreferences.displayAsGrid)
    setSortBy(isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)
    setSortIcon(getIcon((isPreferences === null ? "alphabetical" : isPreferences.sortBy === null ? "alphabetical" : isPreferences.sortBy)))

    if(isTagList !== null && isTagList !== undefined){
      Object.values(isTagList).map(tag =>{

      setTags(tag)
    }) 
  }
  
  }
  getPreferences()
},[])

        

        async function handleSortBy(type: "alphabetical" | "chronological" | "caliber"){
            setSortIcon(getIcon(type))
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
              const gunList = gunCollection.filter(gun => activeTags.some(tag => gun.tags?.includes(tag.label)))

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
          <Menu
            visible={menuVisibility.filterBy}
            onDismiss={()=>handleMenu("filterBy", false)}
            anchor={<Appbar.Action icon="filter" onPress={() =>{handleMenu("filterBy", true)}} />}
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
            {gunCollection.length != 0 && !isFilterOn ? gunCollection.map(gun =>{
              return(
                <GunCard key={gun.id} gun={gun}/>
              )
            }) 
            :
            gunCollection.length !== 0 && isFilterOn ? gunList.map(gun =>{
              

                
                  return <GunCard key={gun.id} gun={gun}/>
                
              
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

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={setNewGunOpen}
        disabled={mainMenuOpen ? true : false}
      /> 
        
      </SafeAreaView>
    )
}

