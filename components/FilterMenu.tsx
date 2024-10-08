import { View } from "react-native"
import { Text, Switch, Checkbox } from "react-native-paper"
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { defaultViewPadding } from "../configs";
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { db } from "../db/client"
import * as schema from "../db/schema"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, not } from 'drizzle-orm';

interface Props{
    collection: "gunCollection" | "ammoCollection"
}

export default function FilterMenu({collection}:Props){

    const { gunFilterOn, toggleGunFilterOn, ammoFilterOn, toggleAmmoFilterOn } = usePreferenceStore()

    const { data: gunTags } = useLiveQuery(
        db.select()
        .from(schema.gunTags)
    )

    const { data: ammoTags } = useLiveQuery(
      db.select()
      .from(schema.ammoTags)
  ) 

    async function handleFilterPressGuns(tag){
        
        collection === "gunCollection" ? 
        /*@ts-expect-error*/
          await db.update(schema.gunTags).set({active: not(schema.gunTags.active)}).where((eq(schema.gunTags.label, tag.label)))
          :
          /*@ts-expect-error*/
          await db.update(schema.ammoTags).set({active: not(schema.ammoTags.active)}).where((eq(schema.ammoTags.label, tag.label)))
    }

    return(
        <View style={{flex: 1, padding: defaultViewPadding}}>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                <Text>Filter:</Text>
                <Switch value={collection==="gunCollection" ? gunFilterOn : ammoFilterOn} onValueChange={()=>collection==="gunCollection" ? toggleGunFilterOn() : toggleAmmoFilterOn()} />
              </View>
              <View>
              {collection === "gunCollection" ? 
                gunTags.map((tag, index)=>{
                return <Checkbox.Item mode="android" key={`filter_${tag.label}_${index}`} label={tag.label} status={tag.active ? "checked" : "unchecked"} onPress={()=>handleFilterPressGuns(tag)} />
              })
            :
            ammoTags.map((tag, index)=>{
              return <Checkbox.Item mode="android" key={`filter_${tag.label}_${index}`} label={tag.label} status={tag.active ? "checked" : "unchecked"} onPress={()=>handleFilterPressGuns(tag)} />
            })
            }
              </View>
            </View>
    )
}