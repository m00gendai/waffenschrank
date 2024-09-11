import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { GunType, AmmoType } from '../interfaces';
import { usePreferenceStore } from '../stores/usePreferenceStore';
import { gunRemarks } from '../lib/gunDataTemplate';
import { ammoRemarks } from '../lib/ammoDataTemplate';

interface Props{
    data: string
    gunData?: GunType
    setGunData?: React.Dispatch<React.SetStateAction<GunType>>
    ammoData?: AmmoType
    setAmmoData?: React.Dispatch<React.SetStateAction<AmmoType>>
}

export default function NewText({data, gunData, setGunData, ammoData, setAmmoData}: Props){

    const [input, setInput] = useState<string>(gunData ? gunData[data] : ammoData ? ammoData[data] : "")
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
            setGunData({...gunData, [data]: input.trim()})
            }
            
        if(charCount >= MAX_CHAR_COUNT && isBackspace){
            setCharCount(input.length)
            setInput(input)
            setGunData({...gunData, [data]: input.trim()})
        }
    }

    function updateAmmoData(input:string){
        if(charCount < MAX_CHAR_COUNT){
            setCharCount(input.length)
            setInput(input)
            setAmmoData({...ammoData, [data]: input.trim()})
            }
            
        if(charCount >= MAX_CHAR_COUNT && isBackspace){
            setCharCount(input.length)
            setInput(input)
            setAmmoData({...ammoData, [data]: input.trim()})
        }
    }

    return(
        <TextInput
            label={`${gunData ? gunRemarks[language] : ammoRemarks[language]} ${isFocus ? `${charCount}/${MAX_CHAR_COUNT}` : ``}`} 
            style={{
                flex: 1,
                height: 200
            }}
            value={input}
            onFocus={()=>setFocus(true)}
            onBlur={()=>setFocus(false)}
            onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
            onChangeText={(input:string) => gunData ? updateGunData(input) : updateAmmoData(input)}
            multiline={true}
            returnKeyType='done'
            returnKeyLabel='OK'
        />
    )
}