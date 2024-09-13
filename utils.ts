import { AmmoType, GunType, SortingTypes } from "./interfaces";
import { gunDataTemplate } from "./lib/gunDataTemplate";
import { validationErros } from "./lib//textTemplates";
import { ammoDataTemplate } from "./lib/ammoDataTemplate";
import { requiredFieldsAmmo, requiredFieldsGun } from "./configs";
import * as ImagePicker from "expo-image-picker"
import { ImageResult, manipulateAsync } from 'expo-image-manipulator';
import { Alert, Image } from "react-native"

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
    if(value === "lastAdded"){
        try{
        const sorted = items.sort((a, b) =>{
            const x = a.createdAt === undefined ? 0 : a.createdAt === null ? 0 : a.createdAt === "" ? 0 : new Date(a.createdAt).getTime()
            const y = b.createdAt === undefined ? 0 : b.createdAt === null ? 0 : b.createdAt === "" ? 0 : new Date(b.createdAt).getTime()
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
    if(value === "lastModified"){
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
            const x = a.paidPrice !== undefined ? Number(a.paidPrice) : 0
            const y = b.paidPrice !== undefined ? Number(b.paidPrice) : 0
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "marketValue"){
        const sorted = items.sort((a, b) =>{
            const x = a.marketValue !== undefined ? Number(a.marketValue) : 0
            const y = b.marketValue !== undefined ? Number(b.marketValue) : 0
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
            const x = a.acquisitionDate !== undefined ? Math.floor(parseDate(a.acquisitionDate).getTime() / 1000) : 0;
            const y = b.acquisitionDate !== undefined ? Math.floor(parseDate(b.acquisitionDate).getTime() / 1000) : 0;
    
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastCleaned"){
        const parseDate = (dateStr:string) => {
            if (!dateStr) return new Date(0);
            const [day, month, year]:number[] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };
        const sorted = items.sort((a, b) =>{
            const x = a.lastCleanedAt !== undefined ? Math.floor(parseDate(a.lastCleanedAt).getTime() / 1000) : 0;
            const y = b.lastCleanedAt !== undefined ? Math.floor(parseDate(b.lastCleanedAt).getTime() / 1000) : 0;
    
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastShot"){
        const parseDate = (dateStr:string) => {
            if (!dateStr) return new Date(0);
            const [day, month, year]:number[] = dateStr.split('.').map(Number);
            return new Date(year, month - 1, day);
        };
        const sorted = items.sort((a, b) =>{
            const x = a.lastShotAt !== undefined ? Math.floor(parseDate(a.lastShotAt).getTime() / 1000) : 0;
            const y = b.lastShotAt !== undefined ? Math.floor(parseDate(b.lastShotAt).getTime() / 1000) : 0;
    
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
}

export function getIcon(type:SortingTypes){
    switch(type){
        case "alphabetical":
            return "alphabetical-variant"
        case "lastAdded":
            return "clock-plus-outline"
        case "lastModified":
            return "clock-edit-outline"
        case "paidPrice":
            return "cash-register"
        case "marketValue":
            return "chart-line"
        case "acquisitionDate":
            return "credit-card-clock-outline"
        case "lastCleaned":
            return "toothbrush"
        case "lastShot":
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
