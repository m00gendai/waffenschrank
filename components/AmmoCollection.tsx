import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { Appbar, FAB, Menu, Switch, Text, Tooltip, Searchbar } from 'react-native-paper';
import { defaultBottomBarHeight, defaultGridGap, defaultSearchBarHeight, defaultViewPadding } from '../configs';
import { PREFERENCES } from "../configs_DB"
import { AmmoType, MenuVisibility, SortingTypes_Ammo } from '../interfaces';
import { getIcon } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useItemStore } from '../stores/useItemStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { search, sorting, tooltips } from '../lib/textTemplates';
import ItemCard from './ItemCard';
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
  const { language, ammoFilterOn } = usePreferenceStore()
  const { mainMenuOpen, setHideBottomSheet, hideBottomSheet} = useViewStore()
  const { setCurrentItem, currentItem } = useItemStore()
  const [sortBy, setSortBy] = useState<SortingTypes_Ammo>("lastModifiedAt")

  const { data: settingsData } = useLiveQuery(
    db.select().from(schema.settings)
  )

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
      settingsData[0]?.sortOrder_Ammo === "asc"
       ? sortBy === "alphabetical" ?
          asc((sql`COALESCE(NULLIF(${schema.ammoCollection.manufacturer}, ""), ${schema.ammoCollection.designation})`))
          : (sql`
            CASE
              WHEN NULLIF(${schema.ammoCollection[sortBy]}, "") IS NULL THEN NULL
              ELSE strftime('%s', ${schema.ammoCollection[sortBy]})
            END ASC NULLS LAST`)
        :
        sortBy === "alphabetical" ?
          desc((sql`COALESCE(NULLIF(${schema.ammoCollection.manufacturer}, ""), ${schema.ammoCollection.designation})`))
          : (sql`
            CASE
                WHEN NULLIF(${schema.ammoCollection[sortBy]}, "") IS NULL THEN NULL
                ELSE strftime('%s', ${schema.ammoCollection[sortBy]})
              END DESC NULLS LAST`)
    ),
    [searchQuery, settingsData[0]?.sortOrder_Ammo, sortBy]
  )

  const { data: tagData } = useLiveQuery(
    db.select()
    .from(schema.ammoTags)
  )
  
  async function handleSortBy(type:SortingTypes_Ammo){
    setSortBy(type)
    await db.update(schema.settings).set({sortBy_Ammo: type})
  }

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

  async function handleSortOrder(){
    const settings = await db.select().from(schema.settings)
    const sortOrder = settings[0]?.sortOrder_Ammo || "asc"
    await db.update(schema.settings).set({sortOrder_Ammo: sortOrder === "asc" ? "desc" : "asc"})
  }
        
  async function handleDisplaySwitch(){
    const settings = await db.select().from(schema.settings)
    const displayStyle = settings[0]?.displayMode_Ammo || "grid"
    await db.update(schema.settings).set({displayMode_Ammo: displayStyle === "grid" ? "list" : "grid"})
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
    setCurrentItem(null)
    setHideBottomSheet(true)
    handleNavigation()
  }

  function handleNavigation(){
    navigation.navigate("NewItem", { itemType: "Ammo" });
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
            <FilterMenu collection='AmmoCollection'/>
          </Menu>
            <Appbar.Action icon={settingsData[0]?.displayMode_Ammo === "grid" ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
            <Menu
              visible={menuVisibility.sortBy}
              onDismiss={()=>handleMenu("sortBy", false)}
              anchor={<Appbar.Action icon={getIcon(sortBy)} onPress={() => handleMenu("sortBy", true)} />}
              anchorPosition='bottom'
            >
              <Menu.Item onPress={() => handleSortBy("alphabetical")} title={`${sorting.alphabetic[language]}`} leadingIcon={getIcon("alphabetical")}/>
              <Menu.Item onPress={() => handleSortBy("createdAt")} title={`${sorting.lastAdded[language]}`} leadingIcon={getIcon("createdAt")}/>
              <Menu.Item onPress={() => handleSortBy("lastModifiedAt")} title={`${sorting.lastModified[language]}`} leadingIcon={getIcon("lastModifiedAt")}/>
            </Menu>
          <Appbar.Action icon={settingsData[0]?.sortOrder_Ammo === "asc"  ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
        </View>
      </Appbar>
      <Animated.View style={[{paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding}, animatedStyle]}>{searchBannerVisible ? <Searchbar placeholder={search[language]} onChangeText={setSearchQuery} value={searchQuery} /> : null}</Animated.View>
      {settingsData[0]?.displayMode_Ammo === "grid" ? 
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
          renderItem={({item, index}) => <ItemCard item={item} itemType="Ammo" />}                     
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
          renderItem={({item, index}) => <ItemCard item={item} itemType="Ammo" />}        
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

