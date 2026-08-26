import { IconButton, List, TextInput, Text, Searchbar, Chip } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { ItemType } from '../lib/interfaces';
import { TouchableNativeFeedback, View, ScrollView, Pressable, Platform, Keyboard } from 'react-native';
import { calibers } from '../lib/caliberData';
import { usePreferenceStore } from '../stores//usePreferenceStore';
import { defaultViewPadding, maxCharCountText } from '../configs/configs';
import ModalContainer from './ModalContainer';
import { caliberPickerStrings } from '../lib/textTemplates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREFERENCES } from 'configs/configs_DB';
import { modalTexts } from 'lib/Text/text_modals';

interface Props{
    data: string
    itemData?: ItemType
    setItemData?: React.Dispatch<React.SetStateAction<ItemType>>
    label: string
    multiCaliber: boolean
}

export default function NewText({data, itemData, setItemData, label, multiCaliber}: Props){

    async function setLastUsedCaliber(name:string[]){
        let isPreferences 
        try{
            const preferences:string = await AsyncStorage.getItem(PREFERENCES)
            isPreferences = preferences ? JSON.parse(preferences) : null;
        } catch(e){
          throw new Error(`CaliberPicker setLastUsedCaliber getPreferences: ${e}`)
        }
        let lastUsedCalibers: string[] = []
        try{
            if(isPreferences?.lastUsedCalibers){
                lastUsedCalibers = isPreferences.lastUsedCalibers
            }
            let addedCaliber: string[] = []
            if(lastUsedCalibers.includes(name[0])){
                addedCaliber = [...lastUsedCalibers]
            } else {
                addedCaliber = [...name, ...lastUsedCalibers]
            }
            const insertableArray:string[]= addedCaliber.toSpliced(10)
            const newPreferences = {...isPreferences, lastUsedCalibers: insertableArray}
            await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
        }catch(e){
            throw new Error(`CaliberPicker setLastUsedCaliber getPreferences.lastUsedCalibers: ${e}`)
        }
    }

    function determineActiveCaliber(itemData: ItemType ){
        if(!itemData){
            return [] // if itemData is falsy, return an empty array. This shouldnt really happen but you never know
        }
        if(itemData && !itemData[data]){
            return [] // if itemData does exist, but caliber property is falsy, return an empty array
        }
        if(Array.isArray(itemData[data])){
            return itemData[data] // if itemData does exist and caliber property contains an array of calibers as it should be, return it
        }
        if(!Array.isArray(itemData[data]) && itemData[data].startsWith("[")){
            return [itemData[data].slice(1,-1)] // if for whatever reason (legacy/imports) the caliber property is a stringed array, return an array with the [ and ] removed
        }
        return [itemData[data]] // if its JUST a string, return an aray of it
    }

    const [input, setInput] = useState<string[]>(itemData && itemData[data] ? itemData[data] : [])
    const [showModalCaliber, setShowModalCaliber] = useState<boolean>(false)
    const [activeCaliber, setActiveCaliber] = useState<string[]>(determineActiveCaliber(itemData))
    const [caliberView, setCaliberView] = useState<"search" | "list">("search")
    const [caliberQuery, setCaliberQuery] = useState<string>("")
    const [lastUsed, setLastUsed] = useState<string[]>([])

    const { language, theme } = usePreferenceStore()

    const [charCount, setCharCount] = useState(0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    const [isFocus, setFocus] = useState<boolean>(false)

    useEffect(()=>{
        async function getLastUsedCaliber(){
            let isPreferences 
            try{
                const preferences:string = await AsyncStorage.getItem(PREFERENCES)
                isPreferences = preferences ? JSON.parse(preferences) : null;
            } catch(e){
            throw new Error(`CaliberPicker setLastUsedCaliber getPreferences: ${e}`)
            }
            try{
                if(isPreferences?.lastUsedCalibers){
                    setLastUsed(isPreferences.lastUsedCalibers)
                }
            }catch(e){
                console.error(e)
            }
        }
        getLastUsedCaliber()
    },[])


    function updateItemData(input: string[]){
    // Convert to appropriate format based on multiCaliber
    let finalValue: string[] = input;

    if(charCount < maxCharCountText){
        setCharCount(0)
        setInput(finalValue)
        setItemData({...itemData, [data]: finalValue})
    }
    if(charCount >= maxCharCountText && isBackspace){
        setCharCount(0)
        setInput(finalValue)
        setItemData({...itemData, [data]: finalValue})
    }
}

    function handleCaliberItemSelect(name:string){
        if(activeCaliber.length === 0){ // empty caliber array, just push the new selection
            setActiveCaliber([name])
            return
        }
        if(activeCaliber.length !== 0){
            if(activeCaliber.includes(name)){ // not empty, but name already exists in caliber array -> remove it
                const index: number = activeCaliber.indexOf(name)
                const newActiveCaliber: string[] = activeCaliber.toSpliced(index, 1)
                setActiveCaliber(newActiveCaliber)
                return
            }
            if(!activeCaliber.includes(name)){ // not empty, name does not exist in caliber array -> ...
                if(multiCaliber){ // ... if multiple calibers are allowed, push it
                    setActiveCaliber([...activeCaliber, name])
                    return
                } else { // ... if multiple calibers are disallowed, replace it
                    setActiveCaliber([name])
                    return
                }
            }
        }
    }

    function handleCaliberSelectConfirm(){
        updateItemData(activeCaliber)
        setShowModalCaliber(false)
        setLastUsedCaliber(activeCaliber)
    }

    function handleCaliberSelectCancel(){
        setActiveCaliber(itemData && itemData[data] ? itemData[data] : "")
        setShowModalCaliber(false)
    }

    function handleFocus(){
        setFocus(true)
        if(input === undefined){
            setCharCount(0)
        } else if(input === null){
            setCharCount(0)
        } else {
            setCharCount(input.toString().length)
        }
    }

    function handleInputPress(){
        Keyboard.dismiss()
        setShowModalCaliber(true)
    }

    return(
        <View style={{flex: 1}}>
            <Pressable style={{flex: 1}} onPress={()=>{Platform.OS === "android" ? handleInputPress() : null}}>
                <TextInput
                    label={`${label} ${isFocus ? `${charCount}/${maxCharCountText}` : ``}`} 
                    style={{
                        flex: 1,
                    }}
                    onFocus={()=>handleFocus()}
                    onBlur={()=>setFocus(false)}
                    value={input ? input.toString() : ""}
                    editable={false}
                    showSoftInputOnFocus={true}
                    onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
                    left={null}
                    inputMode={"text"}
                    multiline={true}
                    onPress={()=>{Platform.OS === "ios" ? handleInputPress() : null}}
                    returnKeyType='done'
                    returnKeyLabel='OK'
                    onSubmitEditing={()=>Keyboard.dismiss()}
                />
            </Pressable>
           
            <ModalContainer
                title={modalTexts.caliberPicker.title[language]}
                subtitle={modalTexts.caliberPicker.text[language]}
                visible={showModalCaliber}
                setVisible={setShowModalCaliber}
                content={
                    <List.Section style={{width: "100%", flexDirection: "column", height: "100%"}}>
                        <ScrollView style={{height: "20%", width: "100%", backgroundColor: theme.colors.background}}>
                            {Array.isArray(activeCaliber) && activeCaliber.length !== 0 ? 
                                activeCaliber.map((cal, index) => {return <View key={cal} style={{paddingTop: index === 0 ? defaultViewPadding : 0, paddingLeft: defaultViewPadding, paddingRight: defaultViewPadding, paddingBottom: defaultViewPadding/2}}><Chip onClose={()=>{handleCaliberItemSelect(cal)}}>{cal}</Chip></View>}) 
                                : <Text style={{padding: defaultViewPadding}}>{`${caliberPickerStrings.caliberSelection[language]}`}</Text>
                            }
                        </ScrollView>
                        <View style={{height: "10%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: defaultViewPadding}}>
                            <TouchableNativeFeedback onPress={()=>setCaliberView("search")}>
                                <View style={{
                                    borderTopLeftRadius: 15, 
                                    borderBottomLeftRadius: 15, 
                                    position: "relative", 
                                    width: "50%", 
                                    height: "100%", 
                                    backgroundColor: caliberView === "search" ? theme.colors.primary : "transparent", 
                                    borderWidth: 1, 
                                    borderColor: caliberView === "list" ? theme.colors.primary : "transparent", 
                                    display: "flex", 
                                    justifyContent: "flex-start", 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    paddingLeft: defaultViewPadding
                                }}>
                                    <Text style={{color: caliberView === "search" ? theme.colors.onPrimary : theme.colors.onBackground}}>
                                        {caliberPickerStrings.tabSearch[language]}
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={()=>setCaliberView("list")}>
                                <View style={{
                                    borderTopRightRadius: 15, 
                                    borderBottomRightRadius: 15, 
                                    position: "relative", 
                                    width: "50%", 
                                    height: "100%", 
                                    backgroundColor: caliberView === "list" ? theme.colors.primary : "transparent", 
                                    borderWidth: 1, 
                                    borderColor: caliberView === "search" ? theme.colors.primary : "transparent", 
                                    display: "flex", 
                                    justifyContent: "flex-end", 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    paddingRight: defaultViewPadding
                                }}>
                                    <Text style={{color: caliberView === "list" ? theme.colors.onPrimary : theme.colors.onBackground}}>
                                        {caliberPickerStrings.tabList[language]}
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
{/* #################### LIST VIEW #################### */}
                        {caliberView === "list" ?
                        <ScrollView style={{height: "70%", width: "100%", backgroundColor: "yellow"}}>
                            {calibers.map((caliber, index) =>{
                                return(
                                    <List.Accordion
                                        title={caliber.range}
                                        key={caliber.range}
                                        style={{
                                            backgroundColor: theme.colors.secondaryContainer,
                                        }}
                                    >
                                        <View style={{backgroundColor: theme.colors.tertiaryContainer}}>
                                            {caliber.variants.map((variant, index)=>{
                                                return(
                                                    <List.Item key={`${variant.name}_${index}`} title={variant.name} titleStyle={{color: activeCaliber !== undefined && activeCaliber !== null && activeCaliber.length !== 0 && activeCaliber.includes(variant.name) ? theme.colors.onTertiary : theme.colors.onTertiaryContainer}} onPress={()=>handleCaliberItemSelect(variant.name)} style={{backgroundColor: activeCaliber.includes(variant.name) ? theme.colors.tertiary : "transparent"}}/>
                                                )
                                            })}
                                        </View>
                                    </List.Accordion>
                                )
                            })}
                        </ScrollView>
                        :
                        <View style={{height: "70%"}}>
{/* #################### SEARCH VIEW #################### */}
                            <View style={{padding: defaultViewPadding}}>
                                <Searchbar
                                    placeholder={caliberPickerStrings.tabSearch[language]}
                                    onChangeText={setCaliberQuery}
                                    value={caliberQuery}
                                />
                            </View>
                            <ScrollView>
                            {calibers.map((caliber, index) => {
                                if (caliberQuery.length >= 2) {
                                    return caliber.variants.map((variant, index) => {
                                        const normalizedName = variant.name.toLowerCase().replaceAll(".", "")
                                        const queryWords = caliberQuery.toLowerCase().replaceAll(".", "").split(" ").filter(split => split.length > 0)

                                        const isMatch = queryWords.every(word => normalizedName.includes(word))

                                        if (isMatch) {
                                            return (
                                                <List.Item key={`${variant.name}_${index}`} title={variant.name} titleStyle={{color: activeCaliber && activeCaliber.length !== 0 && activeCaliber.includes(variant.name) ? theme.colors.onTertiary : theme.colors.onTertiaryContainer}} onPress={()=>handleCaliberItemSelect(variant.name)} style={{backgroundColor: activeCaliber.includes(variant.name) ? theme.colors.tertiary : "transparent"}}/>
                                            )
                                        }
                                    })
                                }
                            })}
                            {caliberQuery.length < 1 && activeCaliber.length > 0 ?
                                activeCaliber.map((variant, index) => {
                                    if(activeCaliber.includes(variant)){
                                        return <List.Item key={`${variant}_${index}`} title={variant} titleStyle={{color: activeCaliber && activeCaliber.includes(variant) ? theme.colors.onTertiary : theme.colors.onTertiaryContainer}} onPress={()=>handleCaliberItemSelect(variant)} style={{backgroundColor: activeCaliber.includes(variant) ? theme.colors.tertiary : "transparent"}}/>
                                    }
                                })
                            :
                            lastUsed.map((caliber, index) =>{
                                return <List.Item key={`${caliber}_${index}`} title={caliber} onPress={()=>handleCaliberItemSelect(caliber)} />
                            })
                            }
                            </ScrollView>
                        </View>}
                    </List.Section>
                }
                buttonACK={<IconButton icon="check" onPress={() => handleCaliberSelectConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
                buttonCNL={<IconButton icon="cancel" onPress={() => handleCaliberSelectCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />}
                buttonDEL={null}
            />

        </View>
    )
}