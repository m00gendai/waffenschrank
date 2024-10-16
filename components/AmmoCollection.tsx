import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { Appbar, FAB, Menu, Switch, Text, Tooltip, Searchbar } from 'react-native-paper';
import { defaultBottomBarHeight, defaultGridGap, defaultSearchBarHeight, defaultViewPadding } from '../configs';
import { PREFERENCES } from "../configs_DB"
import { AmmoType, MenuVisibility, SortingTypes } from '../interfaces';
import { getIcon } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useAmmoStore } from '../stores/useAmmoStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { search, sorting, tooltips } from '../lib/textTemplates';
import AmmoCard from './AmmoCard';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import * as schema from "../db/schema"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import {db} from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, inArray } from 'drizzle-orm';
import FilterMenu from './FilterMenu';

export default function AmmoCollection({navigation, route}){


  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});

  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { displayAmmoAsGrid, toggleDisplayAmmoAsGrid, sortAmmoBy, setSortAmmoBy, language, sortAmmoIcon, setSortAmmoIcon, sortAmmoAscending, toggleSortAmmoAscending, ammoFilterOn } = usePreferenceStore()
  const { mainMenuOpen, } = useViewStore()
  const { setCurrentAmmo } = useAmmoStore()


  const { data: ammoData } = useLiveQuery(
    db.select()
    .from(schema.ammoCollection)
    .where(
      and(
        or(
          like(schema.ammoCollection.designation, `%${searchQuery}%`),
          like(schema.ammoCollection.manufacturer, `%${searchQuery}%`)
        ),
      )
    )
    .orderBy(
      sortAmmoAscending ?
        sortAmmoBy === "alphabetical" ?
          asc((sql`COALESCE(NULLIF(${schema.ammoCollection.manufacturer}, ""), ${schema.ammoCollection.designation})`))
          : (sql`
            CASE
              WHEN NULLIF(${schema.ammoCollection[sortAmmoBy]}, "") IS NULL THEN NULL
              ELSE strftime('%s', ${schema.ammoCollection[sortAmmoBy]})
            END ASC NULLS LAST`)
        :
        sortAmmoBy === "alphabetical" ?
          desc((sql`COALESCE(NULLIF(${schema.ammoCollection.manufacturer}, ""), ${schema.ammoCollection.designation})`))
          : (sql`
            CASE
                WHEN NULLIF(${schema.ammoCollection[sortAmmoBy]}, "") IS NULL THEN NULL
                ELSE strftime('%s', ${schema.ammoCollection[sortAmmoBy]})
              END DESC NULLS LAST`)
    ),
    [searchQuery, sortAmmoAscending, sortAmmoBy]
  )

  const { data: tagData } = useLiveQuery(
    db.select()
    .from(schema.ammoTags)
  )
console.log(ammoData)
  console.log(tagData)
  
  async function handleSortBy(type:SortingTypes){
    setSortAmmoIcon(getIcon(type))
    setSortAmmoBy(type)
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"sortAmmoBy": type} : {...JSON.parse(preferences), "sortAmmoBy":type} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  }

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

  async function handleSortOrder(){
    toggleSortAmmoAscending()
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"sortOrderAmmo": !sortAmmoAscending} : {...JSON.parse(preferences), "sortOrderAmmo": !sortAmmoAscending} 
    await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
  }
        
  async function handleDisplaySwitch(){
    toggleDisplayAmmoAsGrid()
    const preferences:string = await AsyncStorage.getItem(PREFERENCES)
    const newPreferences:{[key:string] : string} = preferences == null ? {"displayAmmoAsGrid": !displayAmmoAsGrid} : {...JSON.parse(preferences), "displayAmmoAsGrid": !displayAmmoAsGrid} 
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
    setCurrentAmmo(null)
    navigation.navigate("NewAmmo")
  }

  return(
    <View style={{flex: 1}}>
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
            <FilterMenu collection='ammoCollection'/>
          </Menu>
            <Appbar.Action icon={displayAmmoAsGrid ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={sortAmmoIcon} onPress={() => handleMenu("sortBy", true)} />}
              anchorPosition='bottom'
            >
              <Menu.Item onPress={() => handleSortBy("alphabetical")} title={`${sorting.alphabetic[language]}`} leadingIcon={getIcon("alphabetical")}/>
              <Menu.Item onPress={() => handleSortBy("createdAt")} title={`${sorting.lastAdded[language]}`} leadingIcon={getIcon("createdAt")}/>
              <Menu.Item onPress={() => handleSortBy("lastModifiedAt")} title={`${sorting.lastModified[language]}`} leadingIcon={getIcon("lastModifiedAt")}/>
            </Menu>
          <Appbar.Action icon={sortAmmoAscending ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
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
           /*@ts-expect-error*/
          data={ammoData.filter(ammo => ammoFilterOn ? tagData.filter(tag => tag.active).every(tag => ammo.tags?.includes(tag.label)) : ammo)} 
           /*@ts-expect-error*/
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
           /*@ts-expect-error*/
           data={ammoData.filter(ammo => ammoFilterOn ? tagData.filter(tag => tag.active).every(tag => ammo.tags?.includes(tag.label)) : ammo)} 
           /*@ts-expect-error*/
          renderItem={({item, index}) => <AmmoCard ammo={item} />}        
          keyExtractor={gun=>gun.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
      }
     
      <Animated.View style={[{position: "absolute", bottom: defaultBottomBarHeight+defaultViewPadding, right: 0, margin: 16, width: 56, height: 56, backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center"}, ammoData.length === 0 ? pulsate : null]}>
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

