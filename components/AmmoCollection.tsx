import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, FAB, Menu, Switch, Text, Tooltip, Searchbar } from 'react-native-paper';
import { PREFERENCES, defaultGridGap, defaultViewPadding } from '../configs';
import { AmmoType, MenuVisibility, SortingTypes } from '../interfaces';
import { getIcon, doSortBy } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import { search, sorting, tooltips } from '../lib/textTemplates';
import AmmoCard from './AmmoCard';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export default function AmmoCollection({navigation}){

  // TODO: Zustand SortIcon, Zustand SortOrder @ usePreferenceStore
  // Todo: Stricter typing ("stringA" | "stringB" instead of just string)

  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});
  const [sortAscending, setSortAscending] = useState<boolean>(true)
  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { displayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, theme, sortAmmoIcon, setSortAmmoIcon } = usePreferenceStore()
  const { mainMenuOpen } = useViewStore()
  const { ammoCollection, setAmmoCollection } = useAmmoStore()
  const { ammo_tags } = useTagStore()
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false);
  const [ammoList, setAmmoList] = useState<AmmoType[]>(ammoCollection)
  const [boxes, setBoxes] = useState<string[]>([])
  
  async function handleSortBy(type:SortingTypes){
    setSortAmmoIcon(getIcon(type))
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
      setAmmoList(ammoCollection)
      return
    }

    if(boxes.length !== 0){
      const ammoWithTags = ammoCollection.filter(ammo => {
        if(ammo.tags !== undefined) {
          return ammo.tags.some(tag => boxes.includes(tag));
        }
        
        return false;
      })

     setAmmoList(ammoWithTags)
    }

    if(boxes.length === 0){
      setAmmoList(ammoCollection)
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
            anchor={ammo_tags.length === 0 ? <Tooltip title={tooltips.tagFilter[language]}><Appbar.Action icon="filter" disabled={ammo_tags.length === 0 ? true : false} onPress={() =>{handleMenu("filterBy", true)}} /></Tooltip> : <Appbar.Action icon="filter" disabled={ammo_tags.length === 0 ? true : false} onPress={() =>{handleMenu("filterBy", true)}} />}
            anchorPosition='bottom'
          >
            <View style={{padding: defaultViewPadding}}>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                <Text>Filter:</Text>
                <Switch value={isFilterOn} onValueChange={()=>handleFilterSwitch()} />
              </View>
                {ammo_tags.map((tag, index)=>{
                  return <Checkbox.Item key={`filter_${tag}_${index}`} label={tag.label} status={boxes.includes(tag.label) ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)}/>
                })}
              </View>
            </Menu>
            <Appbar.Action icon={displayAmmoAsGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={sortAmmoIcon} onPress={() => handleMenu("sortBy", true)} />}
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
      {displayAmmoAsGrid ? 
        <FlatList 
          numColumns={2} 
          initialNumToRender={10} 
          contentContainerStyle={{gap: defaultGridGap}}
          columnWrapperStyle={{gap: defaultGridGap}} 
          key={`ammoCollectionGrid`} 
          style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
          data={searchQuery !== "" ? ammoList.filter(item => item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || item.designation.toLowerCase().includes(searchQuery.toLowerCase())) : ammoList} 
          renderItem={({item, index}) => <AmmoCard ammo={item} />}                     
          keyExtractor={ammo=>ammo.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
      :
        <FlatList 
          numColumns={1} 
          initialNumToRender={10} 
          contentContainerStyle={{gap: defaultGridGap}}
          key={`ammoCollectionList`} 
          style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
          data={searchQuery !== "" ? ammoList.filter(item => item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || item.designation.toLowerCase().includes(searchQuery.toLowerCase())) : ammoList} 
          renderItem={({item, index}) => <AmmoCard ammo={item} />}      
          keyExtractor={gun=>gun.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
      }
      <Animated.View style={[{position: "absolute", bottom: 0, right: 0, margin: 16, width: 56, height: 56, backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center"}, ammoCollection.length === 0 ? pulsate : null]}>
        <FAB
          icon="plus"
          onPress={()=>navigation.navigate("NewAmmo")}
          disabled={mainMenuOpen ? true : false}
          style={{width: 56, height: 56}}
        />
      </Animated.View>
    </View>
  )
}

