import { View, TouchableNativeFeedback, Modal, ScrollView } from "react-native"
import { deleteTagFromListAlert, newTags, tagModal } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { useGunStore } from "../stores/useGunStore"
import { useAmmoStore } from "../stores/useAmmoStore"
import { Button, Chip, IconButton, TextInput, Text, Dialog, Surface } from "react-native-paper"
import { GunType, AmmoType } from "../interfaces"
import { useState } from "react"
import { useTagStore } from "../stores/useTagStore"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TAGS, A_TAGS, defaultViewPadding } from "../configs"
import { BlurView } from "expo-blur"

interface Props{
    data: string
    gunData?: GunType
    setGunData?: React.Dispatch<React.SetStateAction<GunType>>
    ammoData?: AmmoType
    setAmmoData?: React.Dispatch<React.SetStateAction<AmmoType>>
}

export default function NewChipArea({data, gunData, setGunData, ammoData, setAmmoData}:Props){

    const { language, theme } = usePreferenceStore()
    const { currentGun } = useGunStore()
    const { currentAmmo } = useAmmoStore()
    const {tags, setTags, ammo_tags, setAmmoTags, overWriteAmmoTags, overWriteTags} = useTagStore()

    const [viewTagModal, setViewTagModal] = useState<boolean>(false)
    const [text, setText] = useState<string>("")
    const [currentTag, setCurrentTag] = useState<string>("")
    const [tagDeleteDialogVisible, toggleTagDeleteDialogVisible] = useState<boolean>(false)

    async function saveNewTag(tag: string | null){
        const tagText:string = tag !== null ? tag : text
        if(tag === null && text === ""){
            return
        }
        if(gunData !== undefined && gunData.tags !== null && gunData.tags !== undefined && gunData.tags.length !== 0){
            if(gunData.tags.includes(tagText)){
                return
            }
        }
        if(ammoData !== undefined && ammoData.tags !== null && ammoData.tags !== undefined && ammoData.tags.length !== 0){
            if(ammoData.tags.includes(tagText)){
                return
            }
        }
        gunData !== undefined && gunData && gunData.tags ? 
        setGunData({...gunData, tags: [...gunData.tags, tagText]})
        : gunData !== undefined && gunData && !gunData.tags ? setGunData({...gunData, tags: [tagText]})
        : ammoData !== undefined && ammoData && ammoData.tags ?
        setAmmoData({...ammoData, tags: [...ammoData.tags, tagText]})
        : setAmmoData({...ammoData, tags: [tagText]})

        if(gunData !== undefined){
            const allTags:string = await AsyncStorage.getItem(TAGS) // gets the object that holds all key values
            const allTagsArray = allTags === null ? [] : JSON.parse(allTags)
            if(!allTagsArray.some(element => element.label === tagText)){
                setTags({label: tagText, status: true})


                const newTags:{label:string, status:boolean}[] = allTagsArray.length === 0 ? [{label:tagText,status:true}] : [...allTagsArray, {label:tagText,status:true}] // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
                await AsyncStorage.setItem(TAGS, JSON.stringify(newTags)) // Save the key object
            }
        }
        if(ammoData !== undefined){
            const allTags:string = await AsyncStorage.getItem(A_TAGS) // gets the object that holds all key values
            const allTagsArray = allTags === null ? [] : JSON.parse(allTags)
            if(!allTagsArray.some(element => element.label === tagText)){
                setAmmoTags({label: tagText, status: true})
    
            
                const newTags:{label:string, status:boolean}[] = allTagsArray.length === 0 ? [{label:tagText,status:true}] : [...allTagsArray, {label:tagText,status:true}] // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
                await AsyncStorage.setItem(A_TAGS, JSON.stringify(newTags)) // Save the key object
            }
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
        if(ammoData !== undefined){
            if(currentAmmo.tags !== null && currentAmmo.tags !== undefined && currentAmmo.tags.length !== 0){
                if(currentAmmo.tags.includes(tag)){
                    return
                }
            }
            saveNewTag(tag)
        }
        if(gunData !== undefined){
            if(currentGun.tags !== null && currentGun.tags !== undefined && currentGun.tags.length !== 0){
                if(currentGun.tags.includes(tag)){
                    return
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
            const allTags:string = await AsyncStorage.getItem(TAGS) // gets the object that holds all key values
            const allTagsArray:{label:string, status:boolean}[] = allTags === null ? [] : JSON.parse(allTags)

            const index = allTagsArray.findIndex(element => element.label === currentTag)
            const newTags:{label:string, status:boolean}[] = allTagsArray.toSpliced(index, 1)
            overWriteTags(newTags)
            await AsyncStorage.setItem(TAGS, JSON.stringify(newTags)) // Save the key object
            }
        if(ammoData !== undefined){
            const allTags:string = await AsyncStorage.getItem(A_TAGS) // gets the object that holds all key values
            const allTagsArray:{label:string, status:boolean}[] = allTags === null ? [] : JSON.parse(allTags)
            const index = allTagsArray.findIndex(element => element.label === currentTag)
            const newTags:{label:string, status:boolean}[] = allTagsArray.toSpliced(index, 1)
            overWriteAmmoTags(newTags)
            await AsyncStorage.setItem(A_TAGS, JSON.stringify(newTags)) // Save the key object
            }
            deleteTag(currentTag)
            toggleTagDeleteDialogVisible(false)
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
        <Modal visible={viewTagModal} transparent>
        <BlurView intensity={100}>    
        <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
           <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <View style={{width: "85%", padding: 10, backgroundColor: theme.colors.background, elevation: 10}}>
                            <Text variant="titleMedium" style={{color: theme.colors.primary}}>{tagModal.title[language]}</Text>
                            <Text variant="bodyMedium">{tagModal.subtitle[language]}</Text>
                            <Surface style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginBottom: 10, justifyContent: "flex-start", padding: defaultViewPadding}}>
                                <Text style={{width: "100%"}}>{tagModal.existingTags[language]}</Text>
                                <View style={{height: 100, width: "100%"}}>
                                    <ScrollView contentContainerStyle={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start"}}>
                                    {Array.from(new Set(gunData !== undefined ? 
                                        tags.map((tag, index) => 
                                            <View key={`${tag.label}_${index}`} style={{padding: 5}}>
                                                <Chip onPress={()=>addTagFromList(tag.label)} onClose={()=>handleDeleteTagFromList(tag.label)}>{tag.label}</Chip>
                                            </View>) 
                                        : 
                                        ammo_tags.map((tag, index) => 
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
                                <Button mode="contained" onPress={()=>setViewTagModal(false)}>OK</Button>
                            </View>
                            </View>
                     
                    </View>
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
                    </BlurView>
                </Modal>

                

        </View>
    )
}