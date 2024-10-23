import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { GunType, AmmoType, ItemTypes, CollectionItems } from '../interfaces';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { setTextAreaLabel } from '../utils';

interface Props{
    itemType: ItemTypes
    data: string
    itemData?: CollectionItems
    setItemData?: React.Dispatch<React.SetStateAction<CollectionItems>>
}

export default function NewText({itemType, data, itemData, setItemData}: Props){

    const [input, setInput] = useState<string>(itemData ? itemData[data] : "")
    const [charCount, setCharCount] = useState(0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    const [isFocus, setFocus] = useState<boolean>(false)

    const { language } = usePreferenceStore()

    const MAX_CHAR_COUNT = 1000

    function updateItemData(input:string){
        if(charCount < MAX_CHAR_COUNT){
            setCharCount(input.length)
            setInput(input)
            setItemData({...itemData, [data]: input.trim()})
            }
            
        if(charCount >= MAX_CHAR_COUNT && isBackspace){
            setCharCount(input.length)
            setInput(input)
            setItemData({...itemData, [data]: input.trim()})
        }
    }

    return(
        <TextInput
            label={`${setTextAreaLabel(itemType, language)} ${isFocus ? `${charCount}/${MAX_CHAR_COUNT}` : ``}`} 
            style={{
                flex: 1,
                height: 200
            }}
            value={input}
            onFocus={()=>setFocus(true)}
            onBlur={()=>setFocus(false)}
            onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
            onChangeText={(input:string) => updateItemData(input)}
            multiline={true}
            returnKeyType='done'
            returnKeyLabel='OK'
        />
    )
}