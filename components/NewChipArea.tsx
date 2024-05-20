import { View, Text, TouchableNativeFeedback, Modal } from "react-native"
import { gunTags } from "../lib/gunDataTemplate"
import { usePreferenceStore } from "../stores/usePreferenceStore"
import { useGunStore } from "../stores/useGunStore"
import { Button, Chip, IconButton, TextInput } from "react-native-paper"
import { GunType } from "../interfaces"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTagStore } from "../stores/useTagStore"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TAGS } from "../configs"

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
}

export default function NewChipArea({data, gunData, setGunData}:Props){

    const { language } = usePreferenceStore()
    const { currentGun } = useGunStore()
    const {tags, setTags} = useTagStore()

    const [viewTagModal, setViewTagModal] = useState<boolean>(false)
    const [text, setText] = useState<string>("")

    async function saveNewTag(){
        gunData && gunData.tags ? 
        setGunData({...gunData, tags: [...gunData.tags, text]})
        : setGunData({...gunData, tags: [text]})

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

        
        setText("")
    }

    function deleteTag(tag:string){
        const tags: string[] = gunData.tags
        tags.splice(tags.indexOf(tag), 1)
        setGunData({...gunData, tags: tags})
    }

    return(
        <View >
        <TouchableNativeFeedback onPress={()=>setViewTagModal(true)} >
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10, marginTop: 10}}>
                {gunData && gunData.tags && gunData.tags.length !== 0 ?
                gunData.tags.map((tag, index) =>{
                    return  <View key={`${tag}_${index}`} style={{padding: 5}}><Chip >{tag}</Chip></View>
                }) : <Chip>{gunTags[language]}</Chip>}
            </View>
        </TouchableNativeFeedback>
        <Modal visible={viewTagModal} transparent>
                    
        <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: "rgba(0,0,0,0.5)"}}>
            <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <View style={{width: "80%", padding: 10, backgroundColor: "white"}}>
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <TextInput
                                        label="Schlagwort eingeben"
                                        value={text}
                                        onChangeText={text => setText(text)}
                                        style={{flex: 9}}
                                        />
                                        <IconButton mode="contained" icon={"floppy"} size={20} onPress={saveNewTag} style={{flex: 1}} />
                                </View>
                                <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginBottom: 10, justifyContent: "flex-start"}}>
                                    {gunData?.tags?.map((tag, index) =>{
                                        return <View key={`${tag}_${index}`} style={{padding: 5}}><Chip onClose={()=>deleteTag(tag)}>{tag}</Chip></View>
                                    })}
                                </View>
                                <Button mode="contained" onPress={()=>setViewTagModal(false)}>Close</Button>
                            </View>
                            </View>
                     
                    </View>
                </Modal>
        </View>
    )
}