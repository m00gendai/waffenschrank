import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { GunType } from '../interfaces';

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
}

export default function NewText({data, gunData, setGunData}: Props){

    const [input, setInput] = useState<string>(null)

    function updateGunData(input:string){
        setInput(input)
        setGunData({...gunData, [data]: input})
    }

    return(
        <TextInput
            label={data} 
            style={{
                flex: 1
            }}
            value={input}
            onChangeText={input => updateGunData(input)}
        />
    )
}