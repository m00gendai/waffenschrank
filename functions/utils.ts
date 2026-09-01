import { AmmoType, CollectionType, Color, distUnitNames, GunType, ItemType, Languages, SortingTypes, weightUnitNames } from "../lib/interfaces";
import { SimpleTranslation, validationErros } from "../lib/textTemplates";
import { dateTimeOptions, unitFields_Length, unitFields_Weight } from "../configs/configs";
import * as ImagePicker from "expo-image-picker"
import { ImageResult, manipulateAsync } from 'expo-image-manipulator';
import { Alert, Image } from "react-native"
import { determineDataTemplate, determineRequiredFields } from "functions/determinators";
import { DisplayVariants, PreferredUnits } from "stores/usePreferenceStore";
import { colord } from "colord";
import { distUnits, weightUnits } from "lib/unitData";

export function getIcon(type:SortingTypes){
    switch(type){
        case "alphabetical":
            return "alphabetical-variant"
        case "createdAt":
            return "clock-plus-outline"
        case "lastModifiedAt":
            return "clock-edit-outline"
        case "paidPrice":
            return "cash-register"
        case "marketValue":
            return "chart-line"
        case "acquisitionDate":
            return "credit-card-clock-outline"
        case "lastCleanedAt":
            return "toothbrush"
        case "lastShotAt":
            return "bullseye"
        case "currentStock":
            return "counter"
        case "lastTopUpAt":
            return "basket-plus-outline"
        case "decibelRating":
            return "volume-source"
        case "pages":
            return "book-open-page-variant-outline"
        default:
            return "alphabetical-variant"
    }
}

export function getDisplaySwitchIcon(type: DisplayVariants){
    switch(type){
        case "list":
            return "format-list-bulleted-type"
        case "grid":
            return "view-grid"
        case "compactList":
            return "format-list-group"
        default:
            return "view-grid"
    }
}

export function itemDataValidation(collection: CollectionType, value:ItemType, lang:Languages){
    let validationResponse: {field: string, error: string}[] = []
    const requiredFields: string[] = determineRequiredFields(collection)
    const x:SimpleTranslation[] = determineDataTemplate(collection).filter(item => requiredFields.includes(item.name))
    for(const entry of requiredFields){
       if( !(entry in value) || (value[entry as keyof ItemType] as any)?.length === 0){
        validationResponse = [...validationResponse, {field: x[0][lang], error: validationErros.requiredFieldEmpty[lang]}]
       }
    }
    return validationResponse
}

export async function imageHandling(result:ImagePicker.ImagePickerResult, resizeImages:boolean){
    if(!result.assets){
        return
    }
    if(!resizeImages){
        return result.assets[0]
    }
    const imageWidth:number = result.assets[0].width
    const imageHeight: number = result.assets[0].height
    if(imageWidth >= imageHeight && imageWidth <= 1000){
        return result.assets[0]
    }
    if(imageHeight >= imageWidth && imageHeight <= 1000){
        return result.assets[0]
    }
    const altered:ImageResult = await manipulateAsync(
        result.assets[0].uri,
        [{resize: imageWidth >= imageHeight ? {width: 1000} : {height: 1000}}],
        {compress: 1}
    );
    return altered
}

export function getImageSize(base64ImageUri: string){
    return new Promise((resolve, reject) => {
        Image.getSize(base64ImageUri, (width, height) => {
            if (width && height) {
                resolve({ width: width, height: height });
            } else {
                reject({ width: 0, height: 0 });
            }
        });
    });
};

export function sanitizeFileName(fileName: string) {
    // Define the forbidden characters for Windows, macOS, and Linux
    const forbiddenCharacters = /[\\/:*?"<>|]/g;
    
    // Replace forbidden characters with an underscore
    let sanitized = fileName.replace(forbiddenCharacters, '_');
    
    // Trim leading and trailing spaces and periods
    sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
    
    return sanitized;
}

function mapIntervals(interval: string){
    switch(interval){
        case "day_1":
            return 1
        case "day_7":
            return 7
        case "day_14":
            return 14
        case "month_1":
            return 30
        case "month_3":
            return 90
        case "month_6":
            return 180
        case "month_9":
            return 270
        case "year_1":
            return 365
        case "year_5":
            return 365*5
        case "year_10":
            return 3650
        default:
            return 0
    }
}

export function checkDate(item:ItemType){
    if(item === undefined){
        return
    }
    if(!('lastCleanedAt_unix' in item) || !('cleanInterval' in item)){
        return
    }

    if(!item.lastCleanedAt_unix){
        return
    }
    if(!item.cleanInterval){
        return
    }
    if(item.cleanInterval === "none"){
        return
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = item.lastCleanedAt_unix
    const secondDate = new Date().getTime()
    const diffDays = Math.round(Math.abs((Number(firstDate) - Number(secondDate)) / oneDay));
    if(diffDays > mapIntervals(item.cleanInterval)){
        return true
    }
    return false
}

export function checkShotCount(item:ItemType){
    if("shotCount" in item && "cleanInterval_ShotCount" in item){
        if(item.shotCount && Number(item.shotCount) > 1 && item.cleanInterval_ShotCount)
            return item.shotCount >= item.cleanInterval_ShotCount
    }
    return false
}

export function alarm(title: string, error:string){
    Alert.alert(`${title}`, `${error}`, [
      {
        text: 'OK',
        onPress: () => {return},
      },
    ])
  }

export function intlNumberFormatOptions(input: number){
    return {
        minimumFractionDigits: input % 1 === 0 ? 0 : 2,
        maximumFractionDigits: input % 1 === 0 ? 0 : 2,
    }
}

export function generateGradient(item: ItemType, theme:{name: string; colors: Color;}){
    if(item && "mainColor" in item && item.mainColor){
        const color = item.mainColor
        return [color, 
                `${colord(color).isDark() ? 
                    colord(color).lighten(0.2).toHex() : 
                    colord(color).darken(0.2).toHex()}`, 
                color]
    } else {
        const color = theme.colors.background
        return [color, color, color]
    }
}

export function convertWeightUnitsToMilligram(preferredUnits: PreferredUnits, weightField:string, inputWeight:string){
    const unit:string = preferredUnits[`${weightField}Unit` as keyof PreferredUnits] as weightUnitNames
    const base = weightUnits.filter(weight => weight.iso === unit)
    const conversion = base[0].base
    const weightInMilligram = Number(inputWeight)*conversion
    return weightInMilligram.toFixed(2)
}

export function convertSelectedUnitToMilligram(selectedUnit: weightUnitNames, inputWeight:string){
    const base = weightUnits.filter(weight => weight.iso === selectedUnit)
    const conversion = base[0].base
    const weightInMilligram = Number(inputWeight)*conversion
    return weightInMilligram.toFixed(2)
}

export function convertWeightUnitsToPreferredUnit(preferredUnits: PreferredUnits, weightField:string, inputWeight:string){
    const unit:string = preferredUnits[`${weightField}Unit` as keyof PreferredUnits] as weightUnitNames
    const base = weightUnits.filter(weight => weight.iso === unit)
    const conversion = base[0].base
    const weightInPreferredUnit = Number(inputWeight)/conversion
    return weightInPreferredUnit.toFixed(2)
}

export function convertWeightUnitsToSelectedUnit(selectedUnit: weightUnitNames, inputWeight:string){
    const base = weightUnits.filter(weight => weight.iso === selectedUnit)
    const conversion = base[0].base
    const weightInSelectedUnit = Number(inputWeight)/conversion
    return weightInSelectedUnit.toFixed(2)
}

export function convertLengthUnitsToMillimeter(preferredUnits: PreferredUnits, lengthField:string, inputLength:string){
    const unit:string = preferredUnits[`${lengthField}Unit` as keyof PreferredUnits] as distUnitNames
    const base = distUnits.filter(length => length.iso === unit)
    const conversion = base[0].base
    const lengthInMillimeter = Number(inputLength)*conversion
    return lengthInMillimeter.toFixed(2)
}

export function convertLengthUnitsToPreferredUnit(preferredUnits: PreferredUnits, lengthField:string, inputLength:string){
    const unit:string = preferredUnits[`${lengthField}Unit` as keyof PreferredUnits] as distUnitNames
    const base = distUnits.filter(length => length.iso === unit)
    const conversion = base[0].base
    const lengthInPreferredUnit = Number(inputLength)/conversion
    return lengthInPreferredUnit.toFixed(2)
}

export function checkConversionFields(item:ItemType, name: string, preferredUnits:PreferredUnits){
    if(unitFields_Weight.includes(name)){
        return `${convertWeightUnitsToPreferredUnit(preferredUnits, name, item[name])}${preferredUnits[`${name}Unit`]}`
    }
    if(unitFields_Length.includes(name)){
        return `${convertLengthUnitsToPreferredUnit(preferredUnits, name, item[name])}${preferredUnits[`${name}Unit`]}`
    }
    return item[name]
}



export function parseDate(date: string | number | null | undefined) {
    if (date === null || date === undefined || date === "") {
        return ""
    }
    const checkDate: Date = typeof date === "number" ? new Date(date) : new Date(Number(date))
    if (isNaN(checkDate.getTime())) {
        return `Invalid Date isNaN utils: ${date}`
    }
    return checkDate.toLocaleDateString("de-CH", dateTimeOptions)
}

export function getLocalesFromLanguage(language:Languages){
    switch(language){
        case "de":
            return "de-DE"
        case "en":
            return "en-US"
        case "fr":
            return "fr-FR"
        case "it":
            return "it-IT"
    }
}