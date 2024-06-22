import { Languages } from "./interfaces"
import { SimpleTranslation } from "./lib/textTemplates"

export const defaultGridGap:number = 10

export const defaultViewPadding:number = 10


/* Gun Collection databases */
export const KEY_DATABASE:string = "key0009"
export const GUN_DATABASE:string = "gun0009"
export const TAGS:string = "tag0011"

/* Ammo Collection databases */
export const A_KEY_DATABASE:string = "akey0009"
export const AMMO_DATABASE:string = "ammo0009"
export const A_TAGS:string = "atag0011"

/* Preferences database is shared */
export const PREFERENCES:string = "pre0017"

/* Range Log Database */
export const RANGELOG:string = "rlog0001"


export const dateLocales:SimpleTranslation = {
    de: "de-CH",
    en: "en-US",
    fr: "fr-CH",
    it: "it-CH", 
    ch: "de-CH"
}

export const languageSelection:{flag:string, code:Languages}[] = [
    {flag: "🇩🇪", code: "de"},
    {flag: "🇨🇭", code: "ch"},
    {flag: "🇫🇷", code: "fr"},
    {flag: "🇮🇹", code: "it"},
    {flag: "🇬🇧", code: "en"},
]

export const requiredFieldsGun:string[] = ["model"]
export const requiredFieldsAmmo:string[] = ["designation"]