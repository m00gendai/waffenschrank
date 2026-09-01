import { TextInput } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { ItemType } from '../lib/interfaces';
import { View, Pressable, Keyboard, Platform } from 'react-native';
import { barrelLengthPrefixFields, bulletWeightPrefixFields, caseLengthPrefixFields, currencyPrefixFields, fieldsForAutocomplete, maxCharCountText, numberTextFields, powderWeightPrefixFields, requiredFieldsAmmo, requiredFieldsGun, unitFields_Length, unitFields_Weight } from '../configs/configs';
import { usePreferenceStore } from 'stores/usePreferenceStore';
import Autocomplete from './Autocomplete';
import { convertLengthUnitsToMillimeter, convertLengthUnitsToPreferredUnit, convertWeightUnitsToMilligram, convertWeightUnitsToPreferredUnit } from 'functions/utils';
import * as schema from "db/schema"
import { db } from "db/client"
import { eq, asc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Dropdown } from 'react-native-paper-dropdown';
import { dropDownPickerOptions } from 'lib/dropDownPickerOptions';

interface Props{
    data: string
    itemData?: ItemType
    setItemData?: React.Dispatch<React.SetStateAction<ItemType>>
    label: string
    autocompleteData?: {id: string, label: string, field: string}[]
}

export default function NewText_DropDownPicker({data, itemData, setItemData, label, autocompleteData}: Props){

    const { preferredUnits, language } = usePreferenceStore()

    function handleConversions(itemData:ItemType, data:string){
        if(unitFields_Weight.includes(data)){
            return convertWeightUnitsToPreferredUnit(preferredUnits, data, itemData[data])
        }
        if(unitFields_Length.includes(data)){
            return convertLengthUnitsToPreferredUnit(preferredUnits, data, itemData[data])
        }
        return itemData[data]
    }

    const input = useRef<string>(itemData && itemData[data] ? handleConversions(itemData, data) : "")

    const [charCount, setCharCount] = useState(input.current?.length ?? 0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    const [isFocus, setFocus] = useState<boolean>(false)
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    function updateItemData(text:string){
        let determinedText: string
        if(unitFields_Weight.includes(data)){
            determinedText = convertWeightUnitsToMilligram(preferredUnits, data, text)
        } else if(unitFields_Length.includes(data)){
            determinedText = convertLengthUnitsToMillimeter(preferredUnits, data, text)
        }else {
            determinedText = text
        }
        
        if(charCount < maxCharCountText){
            setCharCount(text.length ?? 0)
            input.current = text
            setItemData({...itemData, [data]: Array.isArray(determinedText) ? determinedText : determinedText.trim()})
        }
        if(charCount >= maxCharCountText && isBackspace){
            setCharCount(text.length ?? 0)
            input.current = text
            setItemData({...itemData, [data]: Array.isArray(determinedText) ? determinedText : determinedText.trim()})
        }
    }

    function handleFocus(){
        setFocus(true)
        if(input === undefined){
            setCharCount(0)
        } else if(input === null){
            setCharCount(0)
        } else {
            setCharCount(input.current.toString().length)
        }
    }



useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const keyboardWillShow = Keyboard.addListener(showEvent, (e) => {
        setKeyboardHeight(e.endCoordinates.height)
    })
    const keyboardWillHide = Keyboard.addListener(hideEvent, () => {
        setKeyboardHeight(0)
    })

    return () => {
        keyboardWillShow.remove()
        keyboardWillHide.remove()
    }
}, [])

    return(
        <View style={{flex: 1}}>
            <Pressable style={{flex: 1}}>
                <Dropdown
                    label={`${label}${requiredFieldsGun.includes(data) ? "*" : requiredFieldsAmmo.includes(data) ? "*" : ""} ${isFocus ? `${charCount}/${maxCharCountText}` : ``}`} 
                    value={input.current ? input.current.toString() : ""}
                    placeholder="Select Gender"
                    options={dropDownPickerOptions[data][language]}
                    onSelect={updateItemData}
                />
            </Pressable>
        </View>
    )
}