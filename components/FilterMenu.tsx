import { View } from "react-native"
import { Text, Switch, Checkbox } from "react-native-paper"
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { defaultViewPadding } from "../configs";
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { db } from "../db/client"
import * as schema from "../db/schema"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, not } from 'drizzle-orm';
import { ScreenNames } from "../interfaces";

interface Props{
    collection: ScreenNames
}

export default function FilterMenu({collection}:Props){

    const { gunFilterOn, toggleGunFilterOn, ammoFilterOn, toggleAmmoFilterOn, opticsFilterOn, toggleOpticsFilterOn, magazinesFilterOn, toggleMagazinesFilterOn } = usePreferenceStore()

    const { data: gunTags } = useLiveQuery(
        db.select()
        .from(schema.gunTags)
    )

    const { data: ammoTags } = useLiveQuery(
      db.select()
      .from(schema.ammoTags)
    )

    const { data: opticsTags } = useLiveQuery(
      db.select()
      .from(schema.opticsTags)
    )

    const { data: magazineTags } = useLiveQuery(
      db.select()
      .from(schema.magazineTags)
    )

    async function handleFilterPress(tag){
        
        collection === "GunCollection" ? 
        /*@ts-expect-error*/
          await db.update(schema.gunTags).set({active: not(schema.gunTags.active)}).where((eq(schema.gunTags.label, tag.label)))
          : collection === "AmmoCollection" ?
          /*@ts-expect-error*/
          await db.update(schema.ammoTags).set({active: not(schema.ammoTags.active)}).where((eq(schema.ammoTags.label, tag.label)))
          : collection === "AccessoryCollection_Optics" ?
          /*@ts-expect-error*/
          await db.update(schema.opticsTags).set({active: not(schema.opticsTags.active)}).where((eq(schema.opticsTags.label, tag.label)))
          : collection === "AccessoryCollection_Magazines" ?
          /*@ts-expect-error*/
          await db.update(schema.magazineTags).set({active: not(schema.magazineTags.active)}).where((eq(schema.magazineTags.label, tag.label)))
          : null
    }

    return(
        <View style={{flex: 1, padding: defaultViewPadding}}>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                <Text>Filter:</Text>
                <Switch 
                  value={collection==="GunCollection" ? gunFilterOn : collection ==="AmmoCollection" ? ammoFilterOn : collection === "AccessoryCollection_Optics" ? opticsFilterOn : magazinesFilterOn} 
                  onValueChange={()=>collection==="GunCollection" ? toggleGunFilterOn() : collection === "AmmoCollection" ? toggleAmmoFilterOn() : collection === "AccessoryCollection_Optics" ? toggleOpticsFilterOn() : toggleMagazinesFilterOn()} />
              </View>
              <View>
              {
                collection === "GunCollection" ? 
                  gunTags.map((tag, index)=>{
                  return <Checkbox.Item mode="android" key={`filter_${tag.label}_${index}`} label={tag.label} status={tag.active ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)} />
                })
              :
                collection === "AmmoCollection" ?
                  ammoTags.map((tag, index)=>{
                  return <Checkbox.Item mode="android" key={`filter_${tag.label}_${index}`} label={tag.label} status={tag.active ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)} />
                })
              : 
                collection === "AccessoryCollection_Optics" ?
                  opticsTags.map((tag, index)=>{
                  return <Checkbox.Item mode="android" key={`filter_${tag.label}_${index}`} label={tag.label} status={tag.active ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)} />
                })
              : collection === "AccessoryCollection_Magazines" ?
                  magazineTags.map((tag, index)=>{
                  return <Checkbox.Item mode="android" key={`filter_${tag.label}_${index}`} label={tag.label} status={tag.active ? "checked" : "unchecked"} onPress={()=>handleFilterPress(tag)} />
                })
              : null
            }
              </View>
            </View>
    )
}