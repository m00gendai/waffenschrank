import { AccessoryType_Magazine, AccessoryType_Misc, AccessoryType_Optic, AccessoryType_Silencer, AmmoType, CollectionItems, GunType, ItemTypes, SortingTypes } from "./interfaces";
import { gunDataTemplate, gunRemarks } from "./lib/gunDataTemplate";
import { accessory_magazinesDeleteAlert, accessory_miscDeleteAlert, accessory_opticsDeleteAlert, accessory_silencersDeleteAlert, ammoDeleteAlert, gunDeleteAlert, newAccessory_magazinesTitle, newAccessory_miscTitle, newAccessory_opticsTitle, newAccessory_silencersTitle, newAmmoTitle, newGunTitle, toastMessages, validationErros } from "./lib//textTemplates";
import { ammoDataTemplate, ammoRemarks } from "./lib/ammoDataTemplate";
import { requiredFieldsAmmo, requiredFieldsGun } from "./configs";
import * as ImagePicker from "expo-image-picker"
import { ImageResult, manipulateAsync } from 'expo-image-manipulator';
import { Alert, Image } from "react-native"
import * as schema from "./db/schema"
import { exampleAccessoryEmpty_Optic, exampleAmmoEmpty, exampleGunEmpty, exampleAccessoryEmpty_Magazine, exampleAccessoryEmpty_Misc, exampleAccessoryEmpty_Silencer } from "./lib/examples";
import { accessoryDataTemplate_optics, accessoryRemarks_optics, accessoryRemarks_magazines, accessoryDataTemplate_magazines, accessoryRemarks_misc, accessoryDataTemplate_misc, accessoryRemarks_silencers, accessoryDataTemplate_silencers } from "./lib/accessoryDataTemplate";

const nonSetValue: number = 999999999999999

export function getSortAlternateValue(sortBy:SortingTypes){
    switch(sortBy){
        case "alphabetical":
            return ""
        case "caliber":
            return ""
        case "acquisitionDate":
            return nonSetValue
        case "createdAt":
            return schema.gunCollection.createdAt
        case "lastCleanedAt":
            return nonSetValue
        case "lastModifiedAt":
            return schema.gunCollection.createdAt
        case "lastShotAt":
            return nonSetValue
        case "marketValue":
            return nonSetValue
        case "paidPrice":
            return nonSetValue
    }
}

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
        default:
            return "alphabetical-variant"
    }
}

export function getSchema(schemaQuery: ItemTypes){
    switch(schemaQuery){
        case "Gun":
            return schema.gunCollection
        case "Ammo":
            return schema.ammoCollection
        case "Accessory_Optic":
            return schema.opticsCollection
        case "Accessory_Magazine":
            return schema.magazineCollection
        case "Accessory_Misc":
            return schema.accMiscCollection
        case "Accessory_Silencer":
            return schema.silencerCollection
    }
}

export function setCardTitle(item: CollectionItems, itemType: ItemTypes){
    if(itemType === "Gun"){
        const definition = item as GunType
        return `${definition.manufacturer && definition.manufacturer.length != 0 ? `${definition.manufacturer}` : ""}${definition.manufacturer && definition.manufacturer.length != 0 ? ` ` : ""}${definition.model}`
    }
    if(itemType === "Ammo"){
        const definition = item as AmmoType
        return `${definition.manufacturer && definition.manufacturer.length !== 0 ? `${definition.manufacturer}` : ""}${definition.manufacturer && definition.manufacturer.length !== 0 ? ` ` : ""}${definition.designation}`
    }
    if(itemType === "Accessory_Optic"){
        const definition = item as AccessoryType_Optic
        return `${definition.manufacturer && definition.manufacturer.length !== 0 ? `${definition.manufacturer}` : ""}${definition.manufacturer && definition.manufacturer.length !== 0 ? ` ` : ""}${definition.designation}`
    }
    if(itemType === "Accessory_Magazine"){
        const definition = item as AccessoryType_Magazine
        return `${definition.manufacturer && definition.manufacturer.length !== 0 ? `${definition.manufacturer}` : ""}${definition.manufacturer && definition.manufacturer.length !== 0 ? ` ` : ""}${definition.designation}`
    }
    if(itemType === "Accessory_Misc"){
        const definition = item as AccessoryType_Misc
        return `${definition.manufacturer && definition.manufacturer.length !== 0 ? `${definition.manufacturer}` : ""}${definition.manufacturer && definition.manufacturer.length !== 0 ? ` ` : ""}${definition.designation}`
    }
    if(itemType === "Accessory_Silencer"){
        const definition = item as AccessoryType_Silencer
        return `${definition.manufacturer && definition.manufacturer.length !== 0 ? `${definition.manufacturer}` : ""}${definition.manufacturer && definition.manufacturer.length !== 0 ? ` ` : ""}${definition.designation}`
    }
}

export function setCardSubtitle(item: CollectionItems, itemType: ItemTypes, shortCaliber?: string){
    if(itemType === "Gun"){
        const definition = item as GunType
        return definition.serial && definition.serial.length != 0 ? definition.serial : " "
    }
    if(itemType === "Ammo"){
        const definition = item as AmmoType
        return definition.caliber && definition.caliber.length !== 0 ? shortCaliber : " "
    }
    if(itemType === "Accessory_Optic"){
        const definition = item as AccessoryType_Optic
        return definition.currentlyMountedOn && definition.currentlyMountedOn.length !== 0 ? " " : " "
    }
    if(itemType === "Accessory_Magazine"){
        const definition = item as AccessoryType_Magazine
        return definition.stock ? definition.stock : " "
    }
    if(itemType === "Accessory_Misc"){
        const definition = item as AccessoryType_Misc
        return definition.stock ? definition.stock : " "
    }
    if(itemType === "Accessory_Silencer"){
        const definition = item as AccessoryType_Silencer
        return definition.caliber && definition.caliber.length !== 0 ? definition.caliber : " "
    }
}

export function getDeleteDialogTitle(item: CollectionItems, itemType: ItemTypes, language: string){
    if(itemType === "Gun"){
        const definition = item as GunType
        return `${definition.model === null ? "" : definition.model === undefined ? "" : definition.model} ${gunDeleteAlert.title[language]}`
    }
    if(itemType === "Ammo"){
        const definition = item as AmmoType
        return `${definition.designation === null ? "" : definition.designation === undefined ? "" : definition.designation} ${ammoDeleteAlert.title[language]}`
    }
    if(itemType === "Accessory_Optic"){
        const definition = item as AccessoryType_Optic
        return `${definition.designation === null ? "" : definition.designation === undefined ? "" : definition.designation} ${accessory_opticsDeleteAlert.title[language]}`
    }
    if(itemType === "Accessory_Magazine"){
        const definition = item as AccessoryType_Magazine
        return `${definition.designation === null ? "" : definition.designation === undefined ? "" : definition.designation} ${accessory_magazinesDeleteAlert.title[language]}`
    }
    if(itemType === "Accessory_Misc"){
        const definition = item as AccessoryType_Misc
        return `${definition.designation === null ? "" : definition.designation === undefined ? "" : definition.designation} ${accessory_miscDeleteAlert.title[language]}`
    }
    if(itemType === "Accessory_Silencer"){
        const definition = item as AccessoryType_Silencer
        return `${definition.designation === null ? "" : definition.designation === undefined ? "" : definition.designation} ${accessory_silencersDeleteAlert.title[language]}`
    }
}

export function getNewItemTitle(itemType: ItemTypes, language: string){
    if(itemType === "Gun"){
        return newGunTitle[language]
    }
    if(itemType === "Ammo"){
        return newAmmoTitle[language]
    }
    if(itemType === "Accessory_Optic"){
        return newAccessory_opticsTitle[language]
    }
    if(itemType === "Accessory_Magazine"){
        return newAccessory_magazinesTitle[language]
    }
    if(itemType === "Accessory_Misc"){
        return newAccessory_miscTitle[language]
    }
    if(itemType === "Accessory_Silencer"){
        return newAccessory_silencersTitle[language]
    }
}

export function setSnackbarTextSave(itemType: ItemTypes, value: CollectionItems, language: string){
   if(itemType === "Gun"){
        const definition = value as GunType
        return `${definition.manufacturer ? definition.manufacturer : ""} ${definition.model} ${toastMessages.saved[language]}`
   } 
   if(itemType === "Ammo"){
        const definition = value as AmmoType
        return `${definition.manufacturer ? definition.manufacturer : ""} ${definition.designation} ${toastMessages.saved[language]}`
   }
   if(itemType === "Accessory_Optic"){
        const definition = value as AccessoryType_Optic
        return `${definition.manufacturer ? definition.manufacturer : ""} ${definition.designation} ${toastMessages.saved[language]}`
    }
    if(itemType === "Accessory_Magazine"){
        const definition = value as AccessoryType_Magazine
        return `${definition.manufacturer ? definition.manufacturer : ""} ${definition.designation} ${toastMessages.saved[language]}`
    }
    if(itemType === "Accessory_Misc"){
        const definition = value as AccessoryType_Misc
        return `${definition.manufacturer ? definition.manufacturer : ""} ${definition.designation} ${toastMessages.saved[language]}`
    }
    if(itemType === "Accessory_Silencer"){
        const definition = value as AccessoryType_Silencer
        return `${definition.manufacturer ? definition.manufacturer : ""} ${definition.designation} ${toastMessages.saved[language]}`
    }
}

export function setTextAreaLabel(itemType: ItemTypes, language: string){
    if(itemType === "Gun"){
        return gunRemarks[language]
    }
    if(itemType === "Ammo"){
        return ammoRemarks[language]
    }
    if(itemType === "Accessory_Optic"){
        return accessoryRemarks_optics[language]
    }
    if(itemType === "Accessory_Magazine"){
        return accessoryRemarks_magazines[language]
    }
    if(itemType === "Accessory_Misc"){
        return accessoryRemarks_misc[language]
    }
    if(itemType === "Accessory_Silencer"){
        return accessoryRemarks_silencers[language]
    }
}

export function returnCompareObject(itemType: ItemTypes){
    if(itemType === "Gun"){
        return exampleGunEmpty
    }
    if(itemType === "Ammo"){
        return exampleAmmoEmpty
    }
    if(itemType === "Accessory_Optic"){
        return exampleAccessoryEmpty_Optic
    }
    if(itemType === "Accessory_Magazine"){
        return exampleAccessoryEmpty_Magazine
    }
    if(itemType === "Accessory_Misc"){
        return exampleAccessoryEmpty_Misc
    }
    if(itemType === "Accessory_Silencer"){
        return exampleAccessoryEmpty_Silencer
    }
}

export function getItemTemplate(itemType: ItemTypes){
    if(itemType === "Gun"){
        return gunDataTemplate
    }
    if(itemType === "Ammo"){
        return ammoDataTemplate
    }
    if(itemType === "Accessory_Optic"){
        return accessoryDataTemplate_optics
    }
    if(itemType === "Accessory_Magazine"){
        return accessoryDataTemplate_magazines
    }
    if(itemType === "Accessory_Misc"){
        return accessoryDataTemplate_misc
    }
    if(itemType === "Accessory_Silencer"){
        return accessoryDataTemplate_silencers
    }
}

export function getItemTemplateRemarks(itemType: ItemTypes){
    if(itemType === "Gun"){
        return gunRemarks
    }
    if(itemType === "Ammo"){
        return ammoRemarks
    }
    if(itemType === "Accessory_Optic"){
        return accessoryRemarks_optics
    }
    if(itemType === "Accessory_Magazine"){
        return accessoryRemarks_magazines
    }
    if(itemType === "Accessory_Misc"){
        return accessoryRemarks_misc
    }
    if(itemType === "Accessory_Silencer"){
        return accessoryRemarks_silencers
    }
}

export function getEntryTitle(itemType: ItemTypes, item: CollectionItems){
    if(itemType === "Gun"){
        const definition = item as GunType
        return `${definition.manufacturer !== undefined? definition.manufacturer : ""} ${definition.model}`
    }
    if(itemType === "Ammo"){
        const definition = item as AmmoType
        return `${definition.manufacturer !== undefined? definition.manufacturer : ""} ${definition.designation}`
    }
    if(itemType === "Accessory_Optic"){
        const definition = item as AccessoryType_Optic
        return `${definition.manufacturer !== undefined? definition.manufacturer : ""} ${definition.designation}`
    }
    if(itemType === "Accessory_Magazine"){
        const definition = item as AccessoryType_Magazine
        return `${definition.manufacturer !== undefined? definition.manufacturer : ""} ${definition.designation}`
    }
    if(itemType === "Accessory_Misc"){
        const definition = item as AccessoryType_Misc
        return `${definition.manufacturer !== undefined? definition.manufacturer : ""} ${definition.designation}`
    }
    if(itemType === "Accessory_Silencer"){
        const definition = item as AccessoryType_Silencer
        return `${definition.manufacturer !== undefined? definition.manufacturer : ""} ${definition.designation}`
    }
}

export function gunDataValidation(value:GunType, lang:string){
    let validationResponse: {field: string, error: string}[] = []
    const requiredFields: string[] = requiredFieldsGun
    const x:{de: string, en: string, fr: string}[] = gunDataTemplate.filter(item => requiredFields.includes(item.name))
    for(const entry of requiredFields){
       if( !(entry in value) || value[entry].length == 0 ){
        validationResponse = [...validationResponse, {field: x[0][lang], error: validationErros.requiredFieldEmpty[lang]}]
       }
    }
    return validationResponse
}

export function ammoDataValidation(value:AmmoType, lang:string){
    let validationResponse: {field: string, error: string}[] = []
    const requiredFields: string[] = requiredFieldsAmmo
    const x:{de: string, en: string, fr: string}[] = ammoDataTemplate.filter(item => requiredFields.includes(item.name))
    for(const entry of requiredFields){
       if( !(entry in value) || value[entry].length == 0 ){
        validationResponse = [...validationResponse, {field: x[0][lang], error: validationErros.requiredFieldEmpty[lang]}]
       }
    }
    return validationResponse
}

export async function imageHandling(result:ImagePicker.ImagePickerResult, resizeImages:boolean){
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

export function getImageSize(base64ImageUri){
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

export function sanitizeFileName(fileName) {
    // Define the forbidden characters for Windows, macOS, and Linux
    const forbiddenCharacters = /[\\/:*?"<>|]/g;
    
    // Replace forbidden characters with an underscore
    let sanitized = fileName.replace(forbiddenCharacters, '_');
    
    // Trim leading and trailing spaces and periods
    sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
    
    return sanitized;
}

function mapIntervals(interval){
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

export function checkDate(item:CollectionItems){
    if(item === undefined){
        return
    }
    if(item.lastCleanedAt === undefined){
        return
    }
    if(item.lastCleanedAt === null){
        return
    }
    if(item.cleanInterval === undefined){
        return
    }
    if(item.cleanInterval === "none"){
        return
    }
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let [day, month, year] = item.lastCleanedAt.split('.')
    const firstDate = new Date(Number(year), Number(month) - 1, Number(day)).getTime()
    const todayYear = new Date().getFullYear()
    const todayMonth = new Date().getMonth()
    const todayDay = new Date().getDate()
    const secondDate = new Date(todayYear, todayMonth, todayDay).getTime()
    const diffDays = Math.round(Math.abs((Number(firstDate) - Number(secondDate)) / oneDay));
    if(diffDays > mapIntervals(item.cleanInterval)){
        return true
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
