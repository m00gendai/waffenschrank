import { TextInput } from 'react-native-paper';
import { useState } from 'react';


export default function NewText({data, gunData, setGunData}){

    const [input, setInput] = useState(gunData[data])

    function updateGunData(input){
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