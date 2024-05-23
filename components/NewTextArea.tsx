import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { GunType } from '../interfaces';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { gunRemarks } from '../lib/gunDataTemplate';

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
}

export default function NewText({data, gunData, setGunData}: Props){

    const [input, setInput] = useState<string>(gunData ? gunData[data] : "")
    const [charCount, setCharCount] = useState(0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    const [isFocus, setFocus] = useState<boolean>(false)

    const { language } = usePreferenceStore()

    const MAX_CHAR_COUNT = 1000

    /* Chunking isnt necessary at 1000 characters max limit. However, for future reference it remains. Who knows, maybe I need it somehow*/
    function chunking(input:string){
        
        const MAX_CHUNK_SIZE = 50

        const chunkCount = Math.ceil(input.length/MAX_CHUNK_SIZE)

        const chunks = Array.from(Array(chunkCount).keys()).map((_, index) =>{
            return input.substring((MAX_CHUNK_SIZE*index), ((MAX_CHUNK_SIZE*index)+MAX_CHUNK_SIZE))
        })
        
        return chunks
    }

    function updateGunData(input:string){
        if(charCount < MAX_CHAR_COUNT){
            setCharCount(input.length)
            setInput(input)
            setGunData({...gunData, [data]: input})
            }
            
        if(charCount >= MAX_CHAR_COUNT && isBackspace){
            setCharCount(input.length)
            setInput(input)
            setGunData({...gunData, [data]: input})
        }
    }

    return(
        <TextInput
            label={`${gunRemarks[language]} ${isFocus ? `${charCount}/${MAX_CHAR_COUNT}` : ``}`} 
            style={{
                flex: 1,
                height: 200
            }}
            value={input}
            onFocus={()=>setFocus(true)}
            onBlur={()=>setFocus(false)}
            onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
            onChangeText={(input:string) => updateGunData(input)}
            multiline={true}
        />
    )
}