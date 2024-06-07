import { View, TouchableNativeFeedback, Modal } from "react-native"
import { newTags } from "../lib/textTemplates"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { useGunStore } from "../stores/useGunStore"
import { useAmmoStore } from "../stores/useAmmoStore"
import { Button, Chip, IconButton, TextInput } from "react-native-paper"
import { GunType, AmmoType } from "../interfaces"
import { useState } from "react"
import { useTagStore } from "../stores/useTagStore"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TAGS, A_TAGS } from "../configs"

interface Props{
    data: string
    gunData?: GunType
    setGunData?: React.Dispatch<React.SetStateAction<GunType>>
    ammoData?: AmmoType
    setAmmoData?: React.Dispatch<React.SetStateAction<AmmoType>>
}

export default function NewChipArea({data, gunData, setGunData, ammoData, setAmmoData}:Props){
console.log(gunData, ammoData)
    const { language, theme } = usePreferenceStore()
    const { currentGun } = useGunStore()
    const { currentAmmo } = useAmmoStore()
    const {tags, setTags, ammo_tags, setAmmoTags} = useTagStore()

    const [viewTagModal, setViewTagModal] = useState<boolean>(false)
    const [text, setText] = useState<string>("")

    async function saveNewTag(){
        if(text === ""){
            return
        }
        gunData !== undefined && gunData && gunData.tags ? 
        setGunData({...gunData, tags: [...gunData.tags, text]})
        : gunData !== undefined && gunData && !gunData.tags ? setGunData({...gunData, tags: [text]})
        : ammoData !== undefined && ammoData && ammoData.tags ?
        setAmmoData({...ammoData, tags: [...ammoData.tags, text]})
        : setAmmoData({...ammoData, tags: [text]})

        if(gunData !== undefined){
            const allTags:string = await AsyncStorage.getItem(TAGS) // gets the object that holds all key values
            const allTagsArray = allTags === null ? [] : JSON.parse(allTags)
            console.log("allTagsArray")
            console.log(allTagsArray)
            if(!allTagsArray.some(element => element.label === text)){
                setTags({label: text, status: true})

            
                const newTags:{label:string, status:boolean}[] = allTagsArray.length === 0 ? [{label:text,status:true}] : [...allTagsArray, {label:text,status:true}] // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
                console.log("newTags")
                console.log(newTags)
                await AsyncStorage.setItem(TAGS, JSON.stringify(newTags)) // Save the key object
            }
        }
        if(ammoData !== undefined){
            const allTags:string = await AsyncStorage.getItem(A_TAGS) // gets the object that holds all key values
            const allTagsArray = allTags === null ? [] : JSON.parse(allTags)
            console.log("allTagsArray")
            console.log(allTagsArray)
            if(!allTagsArray.some(element => element.label === text)){
                setAmmoTags({label: text, status: true})
    
            
                const newTags:{label:string, status:boolean}[] = allTagsArray.length === 0 ? [{label:text,status:true}] : [...allTagsArray, {label:text,status:true}] // if its the first gun to be saved, create an array with the id of the gun. Otherwise, merge the key into the existing array
               console.log("newTags")
               console.log(newTags)
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
                    
        <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
            <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <View style={{width: "85%", padding: 10, backgroundColor: theme.colors.background}}>
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <TextInput
                                        label="Schlagwort eingeben"
                                        value={text}
                                        onChangeText={text => setText(text)}
                                        style={{flex: 8, marginRight: 10}}
                                        />
                                        <IconButton mode="contained" icon={"floppy"} size={30} onPress={saveNewTag} style={{flex: 2, height: "100%", margin: 0}} />
                                </View>
                                <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginBottom: 10, justifyContent: "flex-start"}}>
                                    {gunData !== undefined && gunData?.tags?.map((tag, index) =>{
                                        return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip onClose={()=>deleteTag(tag)}>{tag}</Chip></View>
                                    })}
                                    {ammoData !== undefined && ammoData?.tags?.map((tag, index) =>{
                                        return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip onClose={()=>deleteTag(tag)}>{tag}</Chip></View>
                                    })}
                                </View>
                                <Button mode="contained" onPress={()=>setViewTagModal(false)}>OK</Button>
                            </View>
                            </View>
                     
                    </View>
                </Modal>
        </View>
    )
}