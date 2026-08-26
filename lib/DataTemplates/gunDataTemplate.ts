import { excludedKeysForDataTemplates } from "../../configs/configs";
import { GunType } from "lib/interfaces"
import { SimpleTranslation } from "lib/textTemplates";
import { dataTemplate_Translations, DataTemplateTranslation, dataTemplate_TranslationRemarks, dataTemplate_TranslationCheckboxes } from "./translations";

type TemplateKeys = keyof Omit<GunType, "id" | "createdAt" | "lastModifiedAt" | "db_id" | "tags" | "images" | "remarks">;

type TemplateItem = {
    name: TemplateKeys
} & SimpleTranslation;

export const emptyGunObject:GunType= {
    id: "",
    manufacturer: null,
    model: "",
    manufacturingDate: null,
    originCountry: null,
    caliber: [],
    serial: null,
    permit: null,
    acquisitionDate_unix: null,
    boughtFrom: null,
    mainColor: null,
    remarks : null,
    images: [],
    createdAt: 0,
    lastModifiedAt: 0,
    shotCount: null,
    tags: [],
    lastShotAt_unix: null,
    lastCleanedAt_unix: null,
    paidPrice: null,
    marketValue: null,
    cleanInterval: null,
    cleanInterval_CustomTime: null,
    cleanInterval_ShotCount: null,
    cleanIntervalDisplay: null,
    exFullAuto: false,
    highCapacityMagazine: false,
    short: false,
    fullAuto: false,
    launcher: false,
    decepticon: false,
    blooptoob: false,
    grandfather: false,
    pistol: false,
    rifle: false,
    shotgun: false,
    sbr: false,
    sbs: false,
    aow: false,
    machineGun: false,
    dd: false,
    pmf: false,
    cr: false,
    nfa: false,
    antique: false,
    customInventoryDesignation: null,
    qrCode: null,
    sold_isSold: false,
    sold_sellDate_unix: null,
    sold_buyerName: null,
    sold_sellPrice: null,
    sold_buyerPermit: null,
    sold_remarks: null,
    de_wbkColor: null,
    de_wbkNumber: null,
    de_wbkRunningNumber: null,
    de_nwrId: null,
}

export const checkBoxes: DataTemplateTranslation[] = Object.entries(dataTemplate_TranslationCheckboxes).map(checkbox =>{
    return checkbox[1]
})
const checkboxKeys = checkBoxes.map(box => box.name)

export const gunDataTemplate:TemplateItem[] = Object.keys(emptyGunObject)
    .filter(key => !excludedKeysForDataTemplates.includes(key))
    .filter(key => !checkboxKeys.includes(key))
    .map(key =>{
        const translation = {
            ...dataTemplate_Translations[key as keyof typeof dataTemplate_Translations],
            ...dataTemplate_TranslationCheckboxes[key as keyof typeof dataTemplate_TranslationCheckboxes]
        }   
        return translation as TemplateItem
})

export const gunRemarks: DataTemplateTranslation = dataTemplate_TranslationRemarks.remarks

// This is a compile time check if all the keys in the emptyObject are present in dataTemplate_Translations.
// This is important because a runtime check is for naught; There must be a guarantee that all keys are present.
const mergedTranslations: Record<TemplateKeys, any> = {
    ...dataTemplate_Translations,
    ...Object.fromEntries(
        Object.entries(dataTemplate_TranslationCheckboxes).map(c => [c[1].name, c])
    )
};

const _check: Record<TemplateKeys, any> = mergedTranslations;

