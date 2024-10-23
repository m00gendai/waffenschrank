import { View, TouchableNativeFeedback, ScrollView } from "react-native"
import { deleteTagFromListAlert, newTags, tagModal } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { useItemStore } from "../stores/useItemStore"
import { Button, Chip, IconButton, TextInput, Text, Dialog, Surface, Modal, Portal } from "react-native-paper"
import { GunType, AmmoType, ItemTypes, CollectionItems } from "../interfaces"
import { useState } from "react"
import ModalContainer from "./ModalContainer"
import * as schema from "../db/schema"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import {db} from "../db/client"
import { eq, lt, gte, ne, and, or, like, asc, desc, exists, isNull, sql, inArray } from 'drizzle-orm';
import { defaultViewPadding } from "../configs"

interface Props{
    itemType: ItemTypes
    data: string
    itemData?: CollectionItems
    setItemData?: React.Dispatch<React.SetStateAction<CollectionItems>>
}

export default function NewChipArea({itemType, data, itemData, setItemData}:Props){

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
        .from(schema.opticsCollection)
    )

    const { language, theme } = usePreferenceStore()
    const { currentItem } = useItemStore()

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
        if(itemType === "Gun" && itemData !== null && itemData.tags !== null && itemData.tags !== undefined && itemData.tags.length !== 0){
            if(currentItem !== null){
                if(itemData.tags.includes(tagText)){
                    return
                }
            }
        }
        if(itemType === "Ammo" && itemData !== null && itemData.tags !== null && itemData.tags !== undefined && itemData.tags.length !== 0){
            if(currentItem !== null){
                if(itemData.tags.includes(tagText)){
                    return
                }
            }
        }
        if(itemType === "Accessory_Optic" && itemData !== null && itemData.tags !== null && itemData.tags !== undefined && itemData.tags.length !== 0){
            if(currentItem !== null){
                if(itemData.tags.includes(tagText)){
                    return
                }
            }
        }

        itemData && itemData.tags ? setItemData({...itemData, tags: [...itemData.tags, tagText]}) : itemData && !itemData.tags ? setItemData({...itemData, tags: [tagText]}) : null

        if(itemType === "Gun"){
           await db.insert(schema.gunTags).values({label: tagText}).onConflictDoNothing()
        }
        if(itemType === "Ammo"){
            await db.insert(schema.ammoTags).values({label: tagText}).onConflictDoNothing()
        }
        if(itemType === "Accessory_Optic"){
            await db.insert(schema.opticsTags).values({label: tagText}).onConflictDoNothing()
        }
        
        setText("")
    }

    function deleteTag(tag:string){
            const tags: string[] = itemData.tags
            tags.splice(tags.indexOf(tag), 1)
            setItemData({...itemData, tags: tags})
    }

    function addTagFromList(tag:string){
        console.log(tag)
        if(itemData !== undefined){
            if(currentItem !== null){
                if(currentItem.tags !== null && currentItem.tags !== undefined && currentItem.tags.length !== 0){
                    if(currentItem.tags.includes(tag)){
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
        if(itemType === "Gun"){
            await db.delete(schema.gunTags).where(eq(schema.gunTags.label, currentTag))
            toggleTagDeleteDialogVisible(false)
        }
        if(itemType === "Ammo"){
            await db.delete(schema.ammoTags).where(eq(schema.ammoTags.label, currentTag))
            toggleTagDeleteDialogVisible(false)
        }
    }

    return(
        <View >
        <TouchableNativeFeedback onPress={()=>setViewTagModal(true)} >
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10, marginTop: 10}}>
                {itemData !== undefined && itemData && itemData.tags && itemData.tags.length !== 0 ?
                itemData.tags.map((tag, index) =>{
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
                {Array.from(new Set(itemType === "Gun" ? 
                    gunTags.map((tag, index) => 
                        <View key={`${tag.label}_${index}`} style={{padding: 5}}>
                            <Chip onPress={()=>addTagFromList(tag.label)} onClose={()=>handleDeleteTagFromList(tag.label)}>{tag.label}</Chip>
                        </View>) 
                    : itemType === "Ammo" ?
                    ammoTags.map((tag, index) => 
                        <View key={`${tag.label}_${index}`} style={{padding: 5}}>
                            <Chip onPress={()=>addTagFromList(tag.label)} onClose={()=>handleDeleteTagFromList(tag.label)}>{tag.label}</Chip>
                        </View>)
                        : null
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
                {itemData !== undefined && itemData?.tags?.map((tag, index) =>{
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