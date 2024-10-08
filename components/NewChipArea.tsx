import { View, TouchableNativeFeedback, ScrollView } from "react-native"
import { deleteTagFromListAlert, newTags, tagModal } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { useGunStore } from "../stores/useGunStore"
import { useAmmoStore } from "../stores/useAmmoStore"
import { Button, Chip, IconButton, TextInput, Text, Dialog, Surface, Modal, Portal } from "react-native-paper"
import { GunType, AmmoType } from "../interfaces"
import { useState } from "react"
import { useTagStore } from "../stores/useTagStore"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultViewPadding } from "../configs"
import { TAGS, A_TAGS } from "../configs_DB"
import { BlurView } from "expo-blur"
import ModalContainer from "./ModalContainer"
import * as schema from "../db/schema"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import {db} from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, inArray } from 'drizzle-orm';

interface Props{
    data: string
    gunData?: GunType
    setGunData?: React.Dispatch<React.SetStateAction<GunType>>
    ammoData?: AmmoType
    setAmmoData?: React.Dispatch<React.SetStateAction<AmmoType>>
}

export default function NewChipArea({data, gunData, setGunData, ammoData, setAmmoData}:Props){

    const { data: gunTags } = useLiveQuery(
        db.select()
        .from(schema.gunTags)
    )

    const { data: ammoTags } = useLiveQuery(
        db.select()
        .from(schema.ammoTags)
    )


    const { language, theme } = usePreferenceStore()
    const { currentGun } = useGunStore()
    const { currentAmmo } = useAmmoStore()


    const [viewTagModal, setViewTagModal] = useState<boolean>(false)
    const [text, setText] = useState<string>("")
    const [currentTag, setCurrentTag] = useState<string>("")
    const [tagDeleteDialogVisible, toggleTagDeleteDialogVisible] = useState<boolean>(false)

    async function saveNewTag(tag: string | null){
        console.log("new tag")
        console.log(tag)
        const tagText:string = tag !== null ? tag : text
        console.log("new tag text")
        console.log(tagText)
        if(tag === null && text === ""){
            return
        }
        if(gunData !== undefined && gunData !== null && gunData.tags !== null && gunData.tags !== undefined && gunData.tags.length !== 0){
            if(currentGun !== null){
                if(gunData.tags.includes(tagText)){
                    return
                }
            }
        }
        if(ammoData !== undefined && ammoData !== null && ammoData.tags !== null && ammoData.tags !== undefined && ammoData.tags.length !== 0){
            if(currentAmmo !== null){
                if(ammoData.tags.includes(tagText)){
                    return
                }
            }
        }
        gunData !== undefined && gunData && gunData.tags ? 
        setGunData({...gunData, tags: [...gunData.tags, tagText]})
        : gunData !== undefined && gunData && !gunData.tags ? setGunData({...gunData, tags: [tagText]})
        : ammoData !== undefined && ammoData && ammoData.tags ?
        setAmmoData({...ammoData, tags: [...ammoData.tags, tagText]})
        : setAmmoData({...ammoData, tags: [tagText]})

        if(gunData !== undefined){
           await db.insert(schema.gunTags).values({label: tagText}).onConflictDoNothing()
        }
        if(ammoData !== undefined){
            await db.insert(schema.ammoTags).values({label: tagText}).onConflictDoNothing()
        }

        
        setText("")
    }

    function deleteTag(tag:string){
        if(gunData !== undefined){
        const tags: string[] = gunData.tags
        tags.splice(tags.indexOf(tag), 1)
        setGunData({...gunData, tags: tags})
        }
        if(ammoData !== undefined){
            const tags: string[] = ammoData.tags
        tags.splice(tags.indexOf(tag), 1)
        setAmmoData({...ammoData, tags: tags})
        }
    }

    function addTagFromList(tag:string){
        console.log(tag)
        if(ammoData !== undefined){
            if(currentAmmo !== null){
                if(currentAmmo.tags !== null && currentAmmo.tags !== undefined && currentAmmo.tags.length !== 0){
                    if(currentAmmo.tags.includes(tag)){
                        return
                    }
                }
            }
            saveNewTag(tag)
        }
        if(gunData !== undefined){
            if(currentGun !== null){
                if(currentGun.tags !== null && currentGun.tags !== undefined && currentGun.tags.length !== 0){
                    if(currentGun.tags.includes(tag)){
                        return
                    }
                }
            }
            saveNewTag(tag)
        }
    }

    function handleDeleteTagFromList(tag:string){
        setCurrentTag(tag)
        toggleTagDeleteDialogVisible(true)
    }

    async function deleteTagFromList(){
        if(gunData !== undefined){
            await db.delete(schema.gunTags).where(eq(schema.gunTags.label, currentTag))
            toggleTagDeleteDialogVisible(false)
        }
        if(ammoData !== undefined){
            await db.delete(schema.ammoTags).where(eq(schema.ammoTags.label, currentTag))
            toggleTagDeleteDialogVisible(false)
        }
    }

    return(
        <View >
        <TouchableNativeFeedback onPress={()=>setViewTagModal(true)} >
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10, marginTop: 10}}>
                {gunData !== undefined && gunData && gunData.tags && gunData.tags.length !== 0 ?
                gunData.tags.map((tag, index) =>{
                    return  <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                }) : ammoData !== undefined && ammoData && ammoData.tags && ammoData.tags.length !== 0 ?
                ammoData.tags.map((tag, index) =>{
                    return  <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                }) : <Chip>{newTags[language]}</Chip>}
            </View>
        </TouchableNativeFeedback>

        
        <ModalContainer visible={viewTagModal} setVisible={setViewTagModal}
            title={tagModal.title[language]}
            subtitle={tagModal.subtitle[language]}
            content={<View><Surface style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginBottom: 10, justifyContent: "flex-start", padding: defaultViewPadding}}>
            <Text style={{width: "100%"}}>{tagModal.existingTags[language]}</Text>
            <View style={{height: 100, width: "100%"}}>
                <ScrollView contentContainerStyle={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start"}}>
                {Array.from(new Set(gunData !== undefined ? 
                    gunTags.map((tag, index) => 
                        <View key={`${tag.label}_${index}`} style={{padding: 5}}>
                            <Chip onPress={()=>addTagFromList(tag.label)} onClose={()=>handleDeleteTagFromList(tag.label)}>{tag.label}</Chip>
                        </View>) 
                    : 
                    ammoTags.map((tag, index) => 
                        <View key={`${tag.label}_${index}`} style={{padding: 5}}>
                            <Chip onPress={()=>addTagFromList(tag.label)} onClose={()=>handleDeleteTagFromList(tag.label)}>{tag.label}</Chip>
                        </View>)
                ))}
                </ScrollView>
                </View>
            </Surface>
            <Surface style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10, padding: defaultViewPadding}}>
                <TextInput
                    label={tagModal.inputTags[language]}
                    value={text}
                    onChangeText={text => setText(text)}
                    style={{flex: 8, marginRight: 10}}
                    returnKeyType='done'
                    returnKeyLabel='OK'
                    />
                    <IconButton mode="contained" icon={"floppy"} size={30} onPress={()=>saveNewTag(null)} style={{ margin: 0}} />
            </Surface>
            <Surface style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginBottom: 10, justifyContent: "flex-start", padding: defaultViewPadding}}>
            <Text style={{width: "100%"}}>{tagModal.selectedTags[language]}</Text>
            <View style={{height: 100, width: "100%"}}>
                <ScrollView contentContainerStyle={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start"}}>
                {gunData !== undefined && gunData?.tags?.map((tag, index) =>{
                    return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip onClose={()=>deleteTag(tag)}>{tag}</Chip></View>
                })}
                {ammoData !== undefined && ammoData?.tags?.map((tag, index) =>{
                    return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip onClose={()=>deleteTag(tag)}>{tag}</Chip></View>
                })}
                </ScrollView>
            </View>
            </Surface>
            <Dialog visible={tagDeleteDialogVisible} onDismiss={()=>toggleTagDeleteDialogVisible(false)}>
            <Dialog.Title>
                    {deleteTagFromListAlert.title[language]}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{deleteTagFromListAlert.subtitle[language]}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>deleteTagFromList()} icon="delete" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{deleteTagFromListAlert.yes[language]}</Button>
                        <Button onPress={()=>toggleTagDeleteDialogVisible(false)} icon="cancel" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{deleteTagFromListAlert.no[language]}</Button>
                    </Dialog.Actions>
                </Dialog>
                </View>}
            buttonACK={<IconButton icon="check" onPress={() => setViewTagModal(false)} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
            buttonCNL={null}
            buttonDEL={null}
        
        />
                          
              

        </View>
    )
}