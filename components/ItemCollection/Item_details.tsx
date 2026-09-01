import { View } from "react-native"
import { Checkbox, Text, IconButton } from 'react-native-paper';
import { determineCountryCheckboxes, determineDataTemplate, determineRemarkDataTemplate } from 'functions/determinators';
import { useItemStore } from "stores/useItemStore";
import { usePreferenceStore } from "stores/usePreferenceStore";
import { barrelLengthPrefixFields, bulletWeightPrefixFields, caliberPickerTriggerFields, caseLengthPrefixFields, cleanIntervalOptions, colorPickerTriggerFields, currencyPrefixFields, datePickerTriggerFields, dateTimeOptions, dropDownTriggerFields, powderWeightPrefixFields } from "configs/configs";
import { cleanIntervals, shotLabel } from "lib/textTemplates";
import { GetColorName } from 'hex-color-to-color-name';
import { checkDate, convertLengthUnitsToPreferredUnit, convertWeightUnitsToPreferredUnit } from "functions/utils";
import { checkBoxes } from "lib/DataTemplates/gunDataTemplate";
import { getShortCaliberName } from "functions/getShortCaliber";
import { dropDownPickerOptions } from "lib/dropDownPickerOptions";

export default function Item_details(){

    const { currentItem, currentCollection } = useItemStore()
    const { language, theme, generalSettings, caliberDisplayNameList, preferredUnits, country } = usePreferenceStore()

    function getCleanIntervalDisplayValue(){
        if("cleanIntervalDisplay" in currentItem && !currentItem?.cleanIntervalDisplay){
            return ""
        }
        if("cleanIntervalDisplay" in currentItem){
            const [presetString, shotSelectString] = currentItem.cleanIntervalDisplay.split("/").map(s => s.trim())
            
            if(!cleanIntervalOptions.includes(presetString)){
                return ""
            }

            if(presetString && shotSelectString){
                return `${cleanIntervals[presetString][language]} / ${shotSelectString} ${shotLabel[language]}`
            }
            
            if(presetString){
                return `${cleanIntervals[presetString][language]}` 
            }
            if(shotSelectString){
                return `${shotSelectString} ${shotLabel[language]}`
            }
        }
        return ""
    }

    function checkColor(color:string){
        if(color.length === 9){
            return color.substring(0,8)
        }
        return color
    }    

    function insertText(dataItem){
        // dataItem is a TemplateItem
        if(caliberPickerTriggerFields.includes(dataItem.name) && dataItem.name in currentItem && currentItem[dataItem.name]){
            if(generalSettings.caliberDisplayName){
                return getShortCaliberName(currentItem[dataItem.name], caliberDisplayNameList).join("\n")
            } else {
                return currentItem[dataItem.name].join("\n")
            }
        }
        if(colorPickerTriggerFields.includes(dataItem.name) && dataItem.name in currentItem && currentItem[dataItem.name]){
            return GetColorName(`${checkColor(currentItem[dataItem.name]).split("#")[1]}`)
        }
        if(currencyPrefixFields.includes(dataItem.name)){
            return `${preferredUnits.selectedCurrency} ${currentItem[dataItem.name] ? currentItem[dataItem.name] :  ""}` 
        }
        if(bulletWeightPrefixFields.includes(dataItem.name)){
            return `${preferredUnits.bulletWeightUnit} ${currentItem[dataItem.name] ? convertWeightUnitsToPreferredUnit(preferredUnits, dataItem.name, currentItem[dataItem.name])  :  ""}` 
        }
        if(powderWeightPrefixFields.includes(dataItem.name)){
            return `${preferredUnits.powderWeightUnit} ${currentItem[dataItem.name] ? convertWeightUnitsToPreferredUnit(preferredUnits, dataItem.name, currentItem[dataItem.name])  :  ""}` 
        }
        if(barrelLengthPrefixFields.includes(dataItem.name)){
            return `${preferredUnits.barrelLengthUnit} ${currentItem[dataItem.name] ? convertLengthUnitsToPreferredUnit(preferredUnits, dataItem.name, currentItem[dataItem.name]) :  ""}` 
        }
        if(caseLengthPrefixFields.includes(dataItem.name)){
            return `${preferredUnits.caseLengthUnit} ${currentItem[dataItem.name] ? convertLengthUnitsToPreferredUnit(preferredUnits, dataItem.name, currentItem[dataItem.name]) :  ""}` 
        }
        if(dataItem.name === "cleanIntervalDisplay" && currentItem[dataItem.name]){
            return getCleanIntervalDisplayValue()
        }
        if(datePickerTriggerFields.includes(dataItem.name) && dataItem.name in currentItem && currentItem[dataItem.name]){
            let date: Date
            try {
                date = new Date(currentItem[dataItem.name])
                
                if (isNaN(date.getTime())) {
                    return `Invalid Date isNaN: ${currentItem[dataItem.name]}`
                }

                return date.toLocaleDateString("de-CH", dateTimeOptions)
            } catch (e) {
                return `Invalid Date catch: ${currentItem[dataItem.name]}`
            }
        }
        if(dropDownTriggerFields.includes(dataItem.name) && dataItem.name in currentItem && currentItem[dataItem.name]){
            const targetValues = dropDownPickerOptions[dataItem.name][language]
            const targetValue = targetValues.filter(value => value.value === currentItem[dataItem.name])[0]

            return targetValue.label
        }

        return currentItem[dataItem.name]
    }

    function hasCountryPrefix(name: string): boolean {
        return name.length > 3 && name[2] === "_"
    }

    function matchesCountry(name: string, country: string): boolean {
        return name.slice(0, 2).toLowerCase() === country.toLowerCase();
    }

    return(


        <View>
                        {determineDataTemplate(currentCollection).map((dataItem, index)=>{
                                    const isGenericField = !hasCountryPrefix(dataItem.name)
                                    const isCurrentCountryField = hasCountryPrefix(dataItem.name) && matchesCountry(dataItem.name, country)
                                    const shouldShowField = isGenericField || isCurrentCountryField

                            if(!generalSettings.emptyFields && shouldShowField){
                                return(
                                    <View key={`${dataItem.name}`} style={{flex: 1, flexDirection: "column"}} >
{/* Textfield Label in selected language */}
                                        <Text style={{width: "100%", fontSize: 12,}}>{`${dataItem[language]}:`}</Text>
                {/* Textfield content */}
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                            {insertText(dataItem)}
                                        </Text>
            {/* Interval Warning Icons */}
                                        {dataItem.name === "lastCleanedAt_unix" && checkDate(currentItem) ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <IconButton icon="spray-bottle" iconColor={theme.colors.error} /><IconButton icon="toothbrush" iconColor={theme.colors.error} />
                                            </View> 
                                        : 
                                        null}
                    {/* Color splotch */}
                                        {colorPickerTriggerFields.includes(dataItem.name) && dataItem.name in currentItem && currentItem[dataItem.name] ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentItem[dataItem.name]}`, transform:[{translateY: -5}]}}>
                                                </View>
                                            </View> 
                                        : 
                                        null}
                                    </View>
                                )
                            } else if(currentItem[dataItem.name] && shouldShowField){
                            return(
                                <View key={`${dataItem.name}`} style={{flex: 1, flexDirection: "column"}} >
                                    {/* Textfield Label in selected language */}
                                        <Text style={{width: "100%", fontSize: 12,}}>{`${dataItem[language]}:`}</Text>
                {/* Textfield content */}
                                        <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>
                                            {insertText(dataItem)}
                                        </Text>
            {/* Interval Warning Icons */}
                                        {dataItem.name === "lastCleanedAt_unix" && checkDate(currentItem) ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <IconButton icon="spray-bottle" iconColor={theme.colors.error} /><IconButton icon="toothbrush" iconColor={theme.colors.error} />
                                            </View> 
                                        : 
                                        null}
                    {/* Color splotch */}
                                        {colorPickerTriggerFields.includes(dataItem.name) && dataItem.name in currentItem && currentItem[dataItem.name] ? 
                                            <View style={{position:"absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                                <View style={{height: "50%", aspectRatio: "5/1", borderRadius: 50, backgroundColor: `${currentItem[dataItem.name]}`, transform:[{translateY: -5}]}}>
                                                </View>
                                            </View> 
                                        : 
                                        null}
                                </View>
                            )
                                }
                        })}

                        <View style={{flex: 1, flexDirection: "column"}} >
                            {currentCollection === "gunCollection" ? checkBoxes.map(checkBox=>{
                                if(determineCountryCheckboxes(country).includes(checkBox.name)){
                                    if(!generalSettings.emptyFields){
                                        return <Checkbox.Item mode="android" key={checkBox.name} label={checkBox[language]} status={currentItem[checkBox.name] ? "checked" : "unchecked"}/>
                                    } else {
                                        return currentItem[checkBox.name] ? <Checkbox.Item mode="android" key={checkBox.name} label={checkBox[language]} status={currentItem[checkBox.name] ? "checked" : "unchecked"}/> : null
                                    }
                                }
                            }) : null}
                        </View>
                        <View style={{flex: 1, flexDirection: "column"}} >
                            <Text style={{width: "100%", fontSize: 12,}}>{determineRemarkDataTemplate(currentCollection)[language]}</Text>
                            <Text style={{width: "100%", fontSize: 18, marginBottom: 5, paddingBottom: 5, borderBottomColor: theme.colors.primary, borderBottomWidth: 0.2}}>{currentItem.remarks}</Text>
                        </View>
                    </View>
    )
}