import { View, Text } from "react-native"
import { Checkbox } from 'react-native-paper';
import { GunType } from "../interfaces"
import { useState } from "react";
import { checkBoxes } from "../lib/gunDataTemplate";

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
    lang: string
}

export default function NewCheckboxArea({data, gunData, setGunData, lang}: Props){

    const convertArrayToObject = (array:{ name: string; de: string; en: string; fr: string; }[]) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item.name]: false,
            };
        }, initialValue);
    };

    function handleCheckBoxCheck(checkBox:string){

        /*
            status object should be:
            { checkboxName: boolean, checboxName: boolean etc}
        */

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
                    <Checkbox.Item key={checkBox.name} label={checkBox[lang]} status={checked[checkBox.name] ? "checked" : "unchecked"} onPress={()=>{handleCheckBoxCheck(checkBox.name)}}/>
                )
            })}
            
        </View>
    )
}