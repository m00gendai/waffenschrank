import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { Appbar, FAB, Menu, Switch, Text, Tooltip, Searchbar, Button, Icon } from 'react-native-paper';
import { defaultBottomBarHeight, defaultGridGap, defaultSearchBarHeight, defaultViewPadding } from '../configs';
import { PREFERENCES } from "../configs_DB"
import { GunType, MenuVisibility, SortingTypes_Accessory_Misc } from '../interfaces';
import { getIcon, getSortAlternateValue } from '../utils';
import { useViewStore } from '../stores/useViewStore';
import { useItemStore } from '../stores/useItemStore';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import ItemCard from './ItemCard';
import { search, sorting, tooltips } from '../lib/textTemplates';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import * as schema from "../db/schema"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import {db} from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, inArray } from 'drizzle-orm';
import FilterMenu from './FilterMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccessoryCollection_misc({navigation, route}){


  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({sortBy: false, filterBy: false});

  const [searchBannerVisible, toggleSearchBannerVisible] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { language, theme, accMiscFilterOn } = usePreferenceStore()
  const { mainMenuOpen, setHideBottomSheet } = useViewStore()
  const { setCurrentItem } = useItemStore()
  const [sortBy, setSortBy] = useState<SortingTypes_Accessory_Misc>("alphabetical")

  const { data: settingsData } = useLiveQuery(
    db.select().from(schema.settings)
  )

  const { data: miscData } = useLiveQuery(
    db.select()
    .from(schema.accMiscCollection)
    .where(
      and(
        or(
          like(schema.accMiscCollection.designation, `%${searchQuery}%`),
          like(schema.accMiscCollection.manufacturer, `%${searchQuery}%`)
        ),
      )
    )
    .orderBy(
      settingsData[0]?.sortOrder_Accessory_Misc === "asc" ?
        sortBy === "alphabetical" ?
          asc((sql`COALESCE(NULLIF(${schema.accMiscCollection.manufacturer}, ""), ${schema.accMiscCollection.designation})`))
          : (sql`
            CASE
              WHEN NULLIF(${schema.accMiscCollection[sortBy]}, "") IS NULL THEN NULL
              ELSE strftime('%s', ${schema.accMiscCollection[sortBy]})
            END ASC NULLS LAST`)
        :
        sortBy === "alphabetical" ?
          desc((sql`COALESCE(NULLIF(${schema.accMiscCollection.manufacturer}, ""), ${schema.accMiscCollection.designation})`))
          : (sql`
            CASE
                WHEN NULLIF(${schema.accMiscCollection[sortBy]}, "") IS NULL THEN NULL
                ELSE strftime('%s', ${schema.accMiscCollection[sortBy]})
              END DESC NULLS LAST`)
    ),
    [searchQuery, settingsData[0]?.sortOrder_Accessory_Misc, sortBy]
  )

  const { data: tagData } = useLiveQuery(
    db.select()
    .from(schema.accMiscTags)
  )

  async function handleSortBy(type: SortingTypes_Accessory_Misc){
    setSortBy(type)
    await db.update(schema.settings).set({sortBy_Accessory_Misc: type})
  }

  function handleMenu(category: string, status: boolean){
    setMenuVisibility({...menuVisibility, [category]: status})
  }

  async function handleSortOrder(){
    const settings = await db.select().from(schema.settings)
    const sortOrder = settings[0]?.sortOrder_Accessory_Misc || "asc"
    await db.update(schema.settings).set({sortOrder_Accessory_Misc: sortOrder === "asc" ? "desc" : "asc"})
  }
        
  async function handleDisplaySwitch(){
    const settings = await db.select().from(schema.settings)
    const displayStyle = settings[0]?.displayMode_Accessory_Misc || "grid"
    await db.update(schema.settings).set({displayMode_Accessory_Misc: displayStyle === "grid" ? "list" : "grid"})
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
      navigation.navigate("NewItem", {itemType: "Accessory_Misc"})
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
            <FilterMenu collection='AccessoryCollection_Magazines'/>
          </Menu>
          <Appbar.Action icon={settingsData[0]?.displayMode_Accessory_Misc === "grid" ? "view-grid" : "format-list-bulleted-type"} onPress={handleDisplaySwitch} />
          <Menu
            visible={menuVisibility.sortBy}
            onDismiss={()=>handleMenu("sortBy", false)}
            anchor={<Appbar.Action icon={getIcon(sortBy)} onPress={() => handleMenu("sortBy", true)} />}
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
          <Appbar.Action icon={settingsData[0]?.sortOrder_Accessory_Misc === "asc"  ? "arrow-up" : "arrow-down"} onPress={() => handleSortOrder()} />
        </View>
      </Appbar>
      <Animated.View style={[{paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding}, animatedStyle]}>{searchBannerVisible ? <Searchbar placeholder={search[language]} onChangeText={setSearchQuery} value={searchQuery} /> : null}</Animated.View>
      {settingsData[0]?.displayMode_Accessory_Misc === "grid" ? 
        Dimensions.get("window").width > Dimensions.get("window").height ?
        <FlatList 
          numColumns={4} 
          initialNumToRender={10} 
          contentContainerStyle={{gap: defaultGridGap}}
          columnWrapperStyle={{gap: defaultGridGap}} 
          key={`gunCollectionGrid4`} 
          style={{height: "100%", width: "100%", paddingTop: defaultViewPadding, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: 50}} 
           /*@ts-expect-error*/
           data={miscData.filter(gun => accMiscFilterOn ? tagData.filter(tag => tag.active).every(tag => gun.tags?.includes(tag.label)) : gun)} 
           /*@ts-expect-error*/
          renderItem={({item, index}) => <ItemCard item={item} itemType="Accessory_Misc" />}                     
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
           data={miscData.filter(gun => accMiscFilterOn ? tagData.filter(tag => tag.active).every(tag => gun.tags?.includes(tag.label)) : gun)} 
           /*@ts-expect-error*/
          renderItem={({item, index}) => <ItemCard item={item} itemType="Accessory_Misc" />}                     
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
          data={miscData.filter(gun => accMiscFilterOn ? tagData.filter(tag => tag.active).every(tag => gun.tags?.includes(tag.label)) : gun)} 
          /*@ts-expect-error*/
          renderItem={({item, index}) => <ItemCard item={item} itemType="Accessory_Misc" />}      
          keyExtractor={gun=>gun.id} 
          ListFooterComponent={<View style={{width: "100%", height: 100}}></View>}
          ListEmptyComponent={null}
        />
      }
     
      <Animated.View style={[{position: "absolute", bottom: defaultBottomBarHeight+defaultViewPadding, right: 0, margin: 16, width: 56, height: 56, backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center"}, miscData.length === 0 ? pulsate : null]}>
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
