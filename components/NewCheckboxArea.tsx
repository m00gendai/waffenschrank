import { View, Text } from "react-native"
import { Checkbox } from 'react-native-paper';
import { GunType } from "../interfaces"
import { useState } from "react";
import { checkBoxes } from "../lib/gunDataTemplate";
import { usePreferenceStore } from "../stores/usePreferenceStore";

interface Props{
    data: string
    gunData: GunType
    setGunData: React.Dispatch<React.SetStateAction<GunType>>
}

export default function NewCheckboxArea({data, gunData, setGunData}: Props){

    const convertArrayToObject = (array:{ name: string; de: string; en: string; fr: string; }[]) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item.name]: false,
            };
        }, initialValue);
    };

    const { language } = usePreferenceStore()
    const [checked, setChecked] = useState<{key:boolean} | "">(gunData !== null && gunData.id !== undefined && gunData.id !== "" && gunData[data] !== undefined ? gunData[data] : convertArrayToObject(checkBoxes));

    

    function handleCheckBoxCheck(checkBox:string){

        /*
            status object should be:
            { checkboxName: boolean, checboxName: boolean etc}
        */
console.log(checkBox)
let newChecked
if(checked === ""){
    newChecked = {checkBox: false} // this is for legacy compatibility and broken CSV
} else {
    newChecked = checked
}

        newChecked[checkBox] = !newChecked[checkBox]
        setChecked(newChecked)
        setGunData({...gunData, [data]: newChecked})
    }

   

    return(
        <View>
            {checkBoxes.map(checkBox=>{
                return(
                    <Checkbox.Item mode={"android"} key={checkBox.name} label={checkBox[language]} status={checked[checkBox.name] ? "checked" : "unchecked"} onPress={()=>{handleCheckBoxCheck(checkBox.name)}}/>
                )
            })}
            
        </View>
    )
}
