import { View, Text } from "react-native"
import { Checkbox } from 'react-native-paper';
import { GunType } from "../interfaces"
import { useState } from "react";
import { checkBoxes } from "../lib/gunDataTemplate";

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
}

export default function NewCheckboxArea({data, gunData, setGunData}: Props){

    const convertArrayToObject = (array:string[]) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item]: false,
            };
        }, initialValue);
    };

    function handleCheckBoxCheck(checkBox:string){
        const newChecked = checked
        newChecked[checkBox] = !newChecked[checkBox]
        setChecked(newChecked)
        setGunData({...gunData, [data]: newChecked})
    }

    const [checked, setChecked] = useState<{key:boolean}>(gunData && gunData[data] ? gunData[data] : convertArrayToObject(checkBoxes));

    return(
        <View>
            {checkBoxes.map(checkBox=>{
                return(
                    <Checkbox.Item key={checkBox} label={checkBox} status={checked[checkBox] ? "checked" : "unchecked"} onPress={()=>{handleCheckBoxCheck(checkBox)}}/>
                )
            })}
            
        </View>
    )
}