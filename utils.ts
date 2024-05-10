import { GunType } from "./interfaces";

export function sortBy(value: string, ascending: boolean, guns: GunType[]){
    if(value === "alphabetical"){
        const sorted = guns.sort((a, b) =>{
            const x = a.Hersteller
            const y = b.Hersteller
            if(ascending){
                return x > y ? 1 : x < y ? -1 : 0
            } else {
                return x < y ? 1 : x > y ? -1 : 0
        }})
        return sorted
    }
    if(value === "chronological"){
        const sorted = guns.sort((a, b) =>{
            const x = a.Modellbezeichnung
            const y = b.Modellbezeichnung
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