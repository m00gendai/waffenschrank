import { AmmoType, GunType, SortingTypes } from "./interfaces";
import { gunDataTemplate } from "./lib/gunDataTemplate";
import { validationErros } from "./lib//textTemplates";
import { ammoDataTemplate } from "./lib/ammoDataTemplate";
import { requiredFieldsAmmo, requiredFieldsGun } from "./configs";
import * as ImagePicker from "expo-image-picker"
import { ImageResult, manipulateAsync } from 'expo-image-manipulator';

export function doSortBy(value: SortingTypes, ascending: boolean, items: GunType[] | AmmoType[]){
    if(value === "alphabetical"){
        const sorted = items.sort((a, b) =>{

            let x:string
            let y:string
            if(a.model !== undefined){
                x = a.manufacturer === null ? a.model : a.manufacturer === undefined ? a.model : `${a.manufacturer} ${a.model}`
                y = b.manufacturer === null ? b.model : b.manufacturer === undefined ? b.model : `${b.manufacturer} ${b.model}`
            }
            if(a.designation !== undefined){
                x = a.manufacturer === null ? a.designation : a.manufacturer === undefined ? a.designation : `${a.designation} ${a.manufacturer}`
                y = b.manufacturer === null ? b.designation : b.manufacturer === undefined ? b.designation : `${b.designation} ${b.manufacturer}`
            }
            
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastAdded"){
        const sorted = items.sort((a, b) =>{
            const x = a.createdAt
            const y = b.createdAt
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "lastModified"){
        const sorted = items.sort((a, b) =>{
            const x = a.lastModifiedAt !== undefined ? a.lastModifiedAt : a.createdAt
            const y = b.lastModifiedAt !== undefined ? b.lastModifiedAt : b.createdAt
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
}

export function getIcon(type:SortingTypes){
    switch(type){
        case "alphabetical":
            return "alphabetical-variant"
        case "lastAdded":
            return "clock-plus-outline"
        case "lastModified":
            return "clock-edit-outline"
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