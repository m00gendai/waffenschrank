import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { Appbar, FAB, Menu, Switch, Text, Tooltip, Searchbar, Button, Icon } from 'react-native-paper';
import { defaultBottomBarHeight, defaultGridGap, defaultSearchBarHeight, defaultViewPadding } from '../configs';
import { PREFERENCES } from "../configs_DB"
import { GunType, MenuVisibility, SortingTypes } from '../interfaces';
import { getIcon, getSortAlternateValue } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useGunStore } from '../stores/useGunStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { useTagStore } from '../stores/useTagStore';
import { Checkbox } from 'react-native-paper';
import GunCard from './GunCard';
import { search, sorting, tooltips } from '../lib/textTemplates';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import BottomBar from './BottomBar';
import * as schema from "../db/schema"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import {db} from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, inArray } from 'drizzle-orm';
import FilterMenu from './FilterMenu';



export default function GunCollection({navigation, route}){


  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});

  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { displayAsGrid, toggleDisplayAsGrid, sortBy, setSortBy, language, setSortGunIcon, sortGunIcon, sortGunsAscending, toggleSortGunsAscending, theme, gunFilterOn } = usePreferenceStore()
  const { mainMenuOpen } = useViewStore()
  const { setCurrentGun } = useGunStore()

  const { data: gunData } = useLiveQuery(
    db.select()
    .from(schema.gunCollection)
    .where(
      and(
        or(
          like(schema.gunCollection.model, `%${searchQuery}%`),
          like(schema.gunCollection.manufacturer, `%${searchQuery}%`)
        ),
      )
    )
    .orderBy(
      sortGunsAscending ?
        sortBy === "alphabetical" ?
          asc((sql`COALESCE(NULLIF(${schema.gunCollection.manufacturer}, ""), ${schema.gunCollection.model})`))
          : (sql`
            CASE
              WHEN NULLIF(${schema.gunCollection[sortBy]}, "") IS NULL THEN NULL
              ELSE strftime('%s', ${schema.gunCollection[sortBy]})
            END ASC NULLS LAST`)
        :
        sortBy === "alphabetical" ?
          desc((sql`COALESCE(NULLIF(${schema.gunCollection.manufacturer}, ""), ${schema.gunCollection.model})`))
          : (sql`
            CASE
                WHEN NULLIF(${schema.gunCollection[sortBy]}, "") IS NULL THEN NULL
                ELSE strftime('%s', ${schema.gunCollection[sortBy]})
              END DESC NULLS LAST`)
    ),
    [searchQuery, sortGunsAscending, sortBy]
  )

  const { data: tagData } = useLiveQuery(
    db.select()
    .from(schema.gunTags)
  )



  async function handleSortBy(type: SortingTypes){
    setSortGunIcon(getIcon(type))
    setSortBy(type)
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"sortBy": type} : {...JSON.parse(preferences), "sortBy":type} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  }

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

  async function handleSortOrder(){
    toggleSortGunsAscending()
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
    height.value = withTiming(defaultSearchBarHeight, { duration: 500 }); // 500 ms duration
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

  function handleFAB(){
    setCurrentGun(null)
    navigation.navigate("NewGun")
  }

  return(
    <View style={{flex: 1, backgroundColor: "transparent"}}>
      <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
          <Appbar.Action icon={"menu"} onPress={()=>navigation.navigate("MainMenu")} />
        </View>
        <View  style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
          <Appbar.Action icon="magnify" onPress={()=>handleSearch()}/>
          <Appbar.Action icon="filter" disabled={tagData.length === 0 ? true : false} onPress={() =>{handleMenu("filterBy", true)}} />
          <Menu
            visible={menuVisibility.filterBy}
            onDismiss={()=>handleMenu("filterBy", false)}
            anchor={{x:Dimensions.get("window").width/6, y: 75}}
            anchorPosition='bottom'
            style={{width: Dimensions.get("window").width/1.5}}
          >
            <FilterMenu collection='gunCollection'/>
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
            <Menu.Item onPress={() => handleSortBy("createdAt")} title={`${sorting.lastAdded[language]}`} leadingIcon={getIcon("createdAt")}/>
            <Menu.Item onPress={() => handleSortBy("lastModifiedAt")} title={`${sorting.lastModified[language]}`} leadingIcon={getIcon("lastModifiedAt")}/>
            <Menu.Item onPress={() => handleSortBy("lastShotAt")} title={`${sorting.lastShot[language]}`} leadingIcon={getIcon("lastShotAt")}/>
            <Menu.Item onPress={() => handleSortBy("lastCleanedAt")} title={`${sorting.lastCleaned[language]}`} leadingIcon={getIcon("lastCleanedAt")}/>
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
           /*@ts-expect-error*/
           data={gunData.filter(gun => gunFilterOn ? tagData.filter(tag => tag.active).every(tag => gun.tags?.includes(tag.label)) : gun)} 
          /*@ts-expect-error*/
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
           /*@ts-expect-error*/
           data={gunData.filter(gun => gunFilterOn ? tagData.filter(tag => tag.active).every(tag => gun.tags?.includes(tag.label)) : gun)} 
          /*@ts-expect-error*/
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
          /*@ts-expect-error*/
          data={gunData.filter(gun => gunFilterOn ? tagData.filter(tag => tag.active).every(tag => gun.tags?.includes(tag.label)) : gun)} 
          /*@ts-expect-error*/
          renderItem={({item, index}) => <GunCard gun={item} />}      
          keyExtractor={gun=>gun.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
      }
      <BottomBar screen={route.name}/>
      <Animated.View style={[{position: "absolute", bottom: defaultBottomBarHeight+defaultViewPadding, right: 0, margin: 16, width: 56, height: 56, backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center"}, gunData.length === 0 ? pulsate : null]}>
        <FAB
          icon="plus"
          onPress={()=>handleFAB()}
          disabled={mainMenuOpen ? true : false}
          style={{width: 56, height: 56}}
        />
      </Animated.View>
    </View>
  )
}
