import { AmmoType, GunType, SortingTypes } from "./interfaces";
import { gunDataTemplate } from "./lib/gunDataTemplate";
import { validationErros } from "./lib//textTemplates";
import { ammoDataTemplate } from "./lib/ammoDataTemplate";
import { requiredFieldsAmmo, requiredFieldsGun } from "./configs";
import * as ImagePicker from "expo-image-picker"
import { ImageResult, manipulateAsync } from 'expo-image-manipulator';
import { Alert, Image } from "react-native"
import * as schema from "./db/schema"

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

/*
export function doSortBy(value: SortingTypes, ascending: boolean, items: GunType[] | AmmoType[]){
    if(value === "alphabetical"){
        const sorted = items.sort((a, b) =>{

            let x:string
            let y:string
            if(a.model !== undefined){
                x = a.manufacturer === null ? a.model : a.manufacturer === undefined ? a.model : a.manufacturer === "" ? a.model : `${a.manufacturer} ${a.model}`
                y = b.manufacturer === null ? b.model : b.manufacturer === undefined ? b.model : b.manufacturer === "" ? b.model : `${b.manufacturer} ${b.model}`
            }
            if(a.designation !== undefined){
                x = a.manufacturer === null ? a.designation : a.manufacturer === undefined ? a.designation : a.manufacturer === "" ? a.designation : `${a.designation} ${a.manufacturer}`
                y = b.manufacturer === null ? b.designation : b.manufacturer === undefined ? b.designation : b.manufacturer === "" ? b.designation : `${b.designation} ${b.manufacturer}`
            }
            
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastAddedAt"){
        try{
        const sorted = items.sort((a, b) =>{
            const x = a.createdAt === undefined ? nonSetValue : a.createdAt === null ? nonSetValue : a.createdAt === "" ? nonSetValue : new Date(a.createdAt).getTime()
            const y = b.createdAt === undefined ? nonSetValue : b.createdAt === null ? nonSetValue : b.createdAt === "" ? nonSetValue : new Date(b.createdAt).getTime()
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }catch(e){
        console.log(e)
    }
    }
    if(value === "lastModifiedAt"){
        const sorted = items.sort((a, b) =>{
            const x = a.lastModifiedAt !== undefined ? new Date(a.lastModifiedAt).getTime() : new Date(a.createdAt).getTime()
            const y = b.lastModifiedAt !== undefined ? new Date(b.lastModifiedAt).getTime() : new Date(b.createdAt).getTime()
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "caliber"){
        const sorted = items.sort((a, b) =>{
            const x = a.caliber !== undefined ? a.caliber : a.designation
            const y = b.caliber !== undefined ? b.caliber : b.designation
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "paidPrice"){
        const sorted = items.sort((a, b) =>{
            const x = a.paidPrice === undefined ? nonSetValue : a.paidPrice === null ? nonSetValue : a.paidPrice === "" ? nonSetValue : Number(a.paidPrice)
            const y = b.paidPrice === undefined ? nonSetValue : b.paidPrice === null ? nonSetValue : b.paidPrice === "" ? nonSetValue : Number(b.paidPrice)
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "marketValue"){
        const sorted = items.sort((a, b) =>{
            const x = a.marketValue === undefined ? nonSetValue : a.marketValue === null ? nonSetValue : a.marketValue === "" ? nonSetValue : Number(a.marketValue)
            const y = b.marketValue === undefined ? nonSetValue : b.marketValue === null ? nonSetValue : b.marketValue === "" ? nonSetValue : Number(b.marketValue)
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "acquisitionDate"){
        const parseDate = (dateStr:string) => {
            if (!dateStr) return new Date(0);
            const [day, month, year]:number[] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };
        const sorted = items.sort((a, b) =>{
            const x = a.acquisitionDate === undefined ? nonSetValue : a.acquisitionDate === null ? nonSetValue : a.acquisitionDate === "" ? nonSetValue : Math.floor(parseDate(a.acquisitionDate).getTime() / 1000) 
            const y = b.acquisitionDate === undefined ? nonSetValue : b.acquisitionDate === null ? nonSetValue : b.acquisitionDate === "" ? nonSetValue : Math.floor(parseDate(b.acquisitionDate).getTime() / 1000)
    
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastCleanedAt"){
        const parseDate = (dateStr:string) => {
            if (!dateStr) return new Date(0);
            const [day, month, year]:number[] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };
        const sorted = items.sort((a, b) =>{
            const x = a.lastCleanedAt === undefined ? nonSetValue : a.lastCleanedAt === null ? nonSetValue : a.lastCleanedAt === "" ? nonSetValue : Math.floor(parseDate(a.lastCleanedAt).getTime() / 1000)
            const y = b.lastCleanedAt === undefined ? nonSetValue : b.lastCleanedAt === null ? nonSetValue : b.lastCleanedAt === "" ? nonSetValue : Math.floor(parseDate(b.lastCleanedAt).getTime() / 1000)
    
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastShotAt"){
        const parseDate = (dateStr:string) => {
            if (!dateStr) return new Date(0);
            const [day, month, year]:number[] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };
        const sorted = items.sort((a, b) =>{
            const x = a.lastShotAt === undefined ? nonSetValue : a.lastShotAt === null ? nonSetValue : a.lastShotAt === "" ? nonSetValue : Math.floor(parseDate(a.lastShotAt).getTime() / 1000)
            const y = b.lastShotAt === undefined ? nonSetValue : b.lastShotAt === null ? nonSetValue : b.lastShotAt === "" ? nonSetValue : Math.floor(parseDate(b.lastShotAt).getTime() / 1000)
    
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
}
*/

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

export function checkDate(gun:GunType){
    if(gun === undefined){
        return
    }
    if(gun.lastCleanedAt === undefined){
        return
    }
    if(gun.lastCleanedAt === null){
        return
    }
    if(gun.cleanInterval === undefined){
        return
    }
    if(gun.cleanInterval === "none"){
        return
    }
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let [day, month, year] = gun.lastCleanedAt.split('.')
    const firstDate = new Date(Number(year), Number(month) - 1, Number(day)).getTime()
    const todayYear = new Date().getFullYear()
    const todayMonth = new Date().getMonth()
    const todayDay = new Date().getDate()
    const secondDate = new Date(todayYear, todayMonth, todayDay).getTime()
    const diffDays = Math.round(Math.abs((Number(firstDate) - Number(secondDate)) / oneDay));
    if(diffDays > mapIntervals(gun.cleanInterval)){
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
