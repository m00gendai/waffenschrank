import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { Appbar, FAB, Menu, Switch, Text, Tooltip, Searchbar, Button, Icon } from 'react-native-paper';
import { defaultBottomBarHeight, defaultGridGap, defaultViewPadding } from '../configs';
import { PREFERENCES } from "../configs_DB"
import { GunType, MenuVisibility, SortingTypes } from '../interfaces';
import { getIcon, doSortBy } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import GunCard from './GunCard';
import { search, sorting, tooltips } from '../lib/textTemplates';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import BottomBar from './BottomBar';

export default function GunCollection({navigation, route}){

  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});

  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { displayAsGrid, toggleDisplayAsGrid, sortBy, setSortBy, language, setSortGunIcon, sortGunIcon, sortGunsAscending, toggleSortGunsAscending, theme } = usePreferenceStore()
  const { mainMenuOpen } = useViewStore()
  const { gunCollection, setGunCollection, currentGun } = useGunStore()
  const { tags } = useTagStore()
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);
  const [gunList, setGunList] = useState<GunType[]>(gunCollection)
  const [boxes, setBoxes] = useState<string[]>([])

  useEffect(()=>{
    setGunList(isFilterOn ? gunList : gunCollection)
  ,[]})

  useEffect(()=>{
    const sortedGuns = doSortBy(sortBy, sortGunsAscending, gunCollection) as GunType[]
    setGunCollection(sortedGuns)
  
  },[gunCollection])
  
  async function handleSortBy(type: SortingTypes){
    setSortGunIcon(getIcon(type))
    setSortBy(type)
    const sortedGuns = doSortBy(type, sortGunsAscending, gunCollection) as GunType[]
    setGunCollection(sortedGuns)
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"sortBy": type} : {...JSON.parse(preferences), "sortBy":type} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  }

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

  async function handleSortOrder(){
    toggleSortGunsAscending()
    const sortedGuns = doSortBy(sortBy, !sortGunsAscending, gunCollection) as GunType[]
    setGunCollection(sortedGuns)
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"sortOrderGuns": !sortGunsAscending} : {...JSON.parse(preferences), "sortOrderGuns": !sortGunsAscending} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  }
        
  async function handleDisplaySwitch(){
    toggleDisplayAsGrid()
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"displayAsGrid": !displayAsGrid} : {...JSON.parse(preferences), "displayAsGrid": !displayAsGrid} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  } 

  function handleFilterSwitch(){
    setIsFilterOn(!isFilterOn)
    handleFiltering()
  }

  function handleFilterPress(tag:{label:string, status:boolean}){
    const indx = boxes.findIndex(item => item === tag.label)
    let newBoxes:string[] = []

    if(!boxes.includes(tag.label)){
      newBoxes = [...boxes, tag.label]
    }
    if(boxes.includes(tag.label)){
      newBoxes = boxes.toSpliced(indx, 1)
    }

    setBoxes(newBoxes)
    handleFiltering()
  }

  function handleFiltering(){
    if(!isFilterOn){
      setGunList(gunCollection)
      return
    }

    if(boxes.length !== 0){
      const gunsWithTags = gunCollection.filter(gun => {
        if(gun.tags !== undefined) {
          return gun.tags.some(tag => boxes.includes(tag));
        }
        
        return false;
      })
     setGunList(gunsWithTags)
    }

    if(boxes.length === 0){
      setGunList(gunCollection)
    }
  }

  useEffect(()=>{
    handleFiltering()
  },[boxes, isFilterOn])

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
    <View style={{flex: 1, backgroundColor: "transparent"}}>
      <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
          <Appbar.Action icon={"menu"} onPress={()=>navigation.navigate("MainMenu")} />
        </View>
        <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
          <Appbar.Action icon="magnify" onPress={()=>handleSearch()}/>
          <Appbar.Action icon="filter" disabled={tags.length === 0 ? true : false} onPress={() =>{handleMenu("filterBy", true)}} />
          <Menu
            visible={menuVisibility.filterBy}
            onDismiss={()=>handleMenu("filterBy", false)}
            anchor={{x:Dimensions.get("window").width/6, y: 75}}
            anchorPosition='bottom'
            style={{width: Dimensions.get("window").width/1.5}}
          >
            <View style={{flex: 1, padding: defaultViewPadding}}>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                <Text>Filter:</Text>
                <Switch value={isFilterOn} onValueChange={()=>handleFilterSwitch()} />
              </View>
              <View>
              {tags.map((tag, index)=>{
                return <Checkbox.Item mode="android" key={`filter_${tag}_${index}`} label={tag.label} status={boxes.includes(tag.label) ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)} />
              })}
              </View>
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
            <Menu.Item onPress={() => handleSortBy("paidPrice")} title={`${sorting.paidPrice[language]}`} leadingIcon={getIcon("paidPrice")}/>
            <Menu.Item onPress={() => handleSortBy("marketValue")} title={`${sorting.marketValue[language]}`} leadingIcon={getIcon("marketValue")}/>
            <Menu.Item onPress={() => handleSortBy("acquisitionDate")} title={`${sorting.acquisitionDate[language]}`} leadingIcon={getIcon("acquisitionDate")}/>
            <Menu.Item onPress={() => handleSortBy("lastAdded")} title={`${sorting.lastAdded[language]}`} leadingIcon={getIcon("lastAdded")}/>
            <Menu.Item onPress={() => handleSortBy("lastModified")} title={`${sorting.lastModified[language]}`} leadingIcon={getIcon("lastModified")}/>
          </Menu>
          <Appbar.Action icon={sortGunsAscending ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
        </View>
      </Appbar>
      <Animated.View style={[{paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding}, animatedStyle]}>{searchBannerVisible ? <Searchbar placeholder={search[language]} onChangeText={setSearchQuery} value={searchQuery} /> : null}</Animated.View>
      {displayAsGrid ? 
        Dimensions.get("window").width > Dimensions.get("window").height ?
        <FlatList 
          numColumns={4} 
          initialNumToRender={10} 
          contentContainerStyle={{gap: defaultGridGap}}
          columnWrapperStyle={{gap: defaultGridGap}} 
          key={`gunCollectionGrid4`} 
          style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
          data={searchQuery !== "" ? gunList.filter(item => item.manufacturer && item.manufacturer.toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) || item.model && item.model.toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) || (Array.isArray(item.caliber) ? item.caliber.join(", ").toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) : "")) : gunList}
          renderItem={({item, index}) => <GunCard gun={item} />}                     
          keyExtractor={gun=>gun.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
        :
        <FlatList 
          numColumns={2} 
          initialNumToRender={10} 
          contentContainerStyle={{gap: defaultGridGap}}
          columnWrapperStyle={{gap: defaultGridGap}} 
          key={`gunCollectionGrid2`} 
          style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
          data={searchQuery !== "" ? gunList.filter(item => item.manufacturer && item.manufacturer.toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) || item.model && item.model.toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) || (Array.isArray(item.caliber) ? item.caliber.join(", ").toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) : "")) : gunList}
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
          data={searchQuery !== "" ? gunList.filter(item => item.manufacturer && item.manufacturer.toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) || item.model && item.model.toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) || (Array.isArray(item.caliber) ? item.caliber.join(", ").toLowerCase().replaceAll(".", "").replaceAll(" ", "").includes(searchQuery.toLowerCase()) : "")) : gunList} 
          renderItem={({item, index}) => <GunCard gun={item} />}      
          keyExtractor={gun=>gun.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
      }
      <BottomBar screen={route.name}/>
      <Animated.View style={[{position: "absolute", bottom: defaultBottomBarHeight+defaultViewPadding, right: 0, margin: 16, width: 56, height: 56, backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center"}, gunCollection.length === 0 ? pulsate : null]}>
        <FAB
          icon="plus"
          onPress={()=>navigation.navigate("NewGun")}
          disabled={mainMenuOpen ? true : false}
          style={{width: 56, height: 56}}
        />
      </Animated.View>
    </View>
  )
}
