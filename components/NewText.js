import { Button, TextInput } from 'react-native-paper';
import { useState, useEffect } from 'react';

export default function NewText({data, gunData, setGunData}){

    const [input, setInput] = useState(gunData[data])

    function updateGunData(){
        setGunData({...gunData, [data]: input})
    }

    return(
        <TextInput
            label={data} 
            style={{
                flex: 1
            }}
            value={input}
            onChangeText={input => setInput(input)}
            onBlur={()=>updateGunData()}
        />
    )
}