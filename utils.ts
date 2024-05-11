import { GunType } from "./interfaces";

export function sortBy(value: string, ascending: boolean, guns: GunType[]){
    if(value === "alphabetical"){
        const sorted = guns.sort((a, b) =>{
            const x = `${a.Hersteller} ${a.Modellbezeichnung}`
            const y = `${b.Hersteller} ${b.Modellbezeichnung}`
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

export function gunDataValidation(value:GunType){
    let validationResponse: {field: string, error: string}[] = []
    const requiredFields: string[] = ["Modellbezeichnung"]
    for(const entry of requiredFields){
       if( !(entry in value) || value[entry].length == 0 ){
        validationResponse = [...validationResponse, {field: entry, error: "Feld darf nicht leer sein"}]
       }
    }
    return validationResponse
}