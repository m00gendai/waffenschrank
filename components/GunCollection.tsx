import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
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
import Animated, { FadeIn, FadeOut, Keyframe, LightSpeedOutRight, SlideInDown, SlideInLeft, SlideInUp, SlideOutDown, SlideOutRight, SlideOutUp, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { useAmmoStore } from '../stores/useAmmoStore';

export default function GunCollection({navigation}){

  // TODO: Zustand SortIcon, Zustand SortOrder @ usePreferenceStore
  // TODO: Zustand menuVisibility @ useViewStore
  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortAscending, setSortAscending] = useState<boolean>(true)
  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  

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

              



const fabWidth = useSharedValue(1);

fabWidth.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true);

const pulsate = useAnimatedStyle(() => {
  return {
    transform: [{ scale: fabWidth.value }]
  };
});
    return(
        <View style={{flex: 1}}>

        <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
         
           <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
            <Appbar.Action icon={"menu"} onPress={()=>navigation.navigate("MainMenu")} />
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


              {displayAsGrid ? 
                <FlatList 
                  numColumns={2} 
                  initialNumToRender={10} 
                  contentContainerStyle={{gap: defaultGridGap}}
                  columnWrapperStyle={{gap: defaultGridGap}} 
                  key={`gunCollectionGrid`} 
                  style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
                  data={searchQuery !== "" ? gunCollection.filter(item => item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || item.model.toLowerCase().includes(searchQuery.toLowerCase())) : gunCollection} 
                  renderItem={({item, index}) => <GunCard gun={item} />}                     
                  keyExtractor={gun=>gun.id} 
                  ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
                  ListEmptyComponent={null}
                />
              :
                <FlatList 
                  numColumns={1} 
                  initialNumToRender={10} 
                  contentContainerStyle={{gap: defaultGridGap}}
                  key={`gunCollectionList`} 
                  style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
                  data={searchQuery !== "" ? gunCollection.filter(item => item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || item.model.toLowerCase().includes(searchQuery.toLowerCase())) : gunCollection} 
                  renderItem={({item, index}) => <GunCard gun={item} />}      
                  keyExtractor={gun=>gun.id} 
                  ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
                  ListEmptyComponent={null}
                />
}
      



      <Animated.View style={[{position: "absolute", bottom: 0, right: 0, margin: 16, width: 56, height: 56, backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center"}, gunCollection.length === 0 ? pulsate : null]}>
      <FAB
        icon="plus"
        onPress={()=>navigation.navigate("NewGun")}
        disabled={mainMenuOpen ? true : false}
        style={{width: 56, height: 56}}
      /></Animated.View>
        
      </View>
    )
}

