import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { GunType } from '../interfaces';
import { NativeTouchEvent } from 'react-native';

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
}

export default function NewText({data, gunData, setGunData}: Props){

    const [input, setInput] = useState<string>(gunData ? gunData[data] : "")
    const [charCount, setCharCount] = useState(0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)

    const MAX_CHAR_COUNT = 10

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
            label={`${data} ${charCount}/${MAX_CHAR_COUNT}`} 
            style={{
                flex: 1
            }}
            value={input}
            onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
            onChangeText={(input:string) => updateGunData(input)}
            multiline={true}
        />
    )
}