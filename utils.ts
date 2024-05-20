import { GunType } from "./interfaces";
import { gunDataTemplate } from "./lib/gunDataTemplate";
import { validationErros } from "./lib//textTemplates";

export function doSortBy(value: "alphabetical" | "chronological" | "caliber", ascending: boolean, guns: GunType[]){
    if(value === "alphabetical"){
        const sorted = guns.sort((a, b) =>{
            const x = `${a.manufacturer} ${a.model}`
            const y = `${b.manufacturer} ${b.model}`
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "chronological"){
        const sorted = guns.sort((a, b) =>{
            const x = a.createdAt
            const y = b.createdAt
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value = "caliber"){
        return guns
    }
}

export function getIcon(type:string){
    switch(type){
        case "alphabetical":
            return "alphabetical-variant"
        case "chronological":
            return "clock-outline"
        case "caliber":
            return "bullet"
    }
}

export function gunDataValidation(value:GunType, lang:string){
    let validationResponse: {field: string, error: string}[] = []
    const requiredFields: string[] = ["model"]
    const x:{de: string, en: string, fr: string}[] = gunDataTemplate.filter(item => requiredFields.includes(item.name))
    for(const entry of requiredFields){
       if( !(entry in value) || value[entry].length == 0 ){
        validationResponse = [...validationResponse, {field: x[0][lang], error: validationErros.requiredFieldEmpty[lang]}]
       }
    }
    return validationResponse
}