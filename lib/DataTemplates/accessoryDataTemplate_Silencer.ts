import { excludedKeysForDataTemplates } from "../../configs/configs";
import { AccessoryType_Silencer } from "lib/interfaces"
import { SimpleTranslation } from "lib/textTemplates";
import { dataTemplate_Translations, DataTemplateTranslation, dataTemplate_TranslationRemarks, dataTemplate_TranslationSoldTranslations, dataTemplate_TranslationSoldisSold } from "./translations";

type TemplateKeys = keyof Omit<AccessoryType_Silencer, "id" | "createdAt" | "lastModifiedAt" | "db_id" | "tags" | "images" | "remarks">;

type TemplateItem = {
    name: TemplateKeys
} & SimpleTranslation;

export const emptySilencerObject:AccessoryType_Silencer= {
    id: "",
    manufacturer: null,
    model: "",
    manufacturingDate: null,
    originCountry: null,
    caliber: [],
    thread: null,
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
    decibelRating: null,
    material: null,
    currentlyMountedOn: null,
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

export const accessoryDataTemplate_Silencer:TemplateItem[] = Object.keys(emptySilencerObject)
    .filter(key => !excludedKeysForDataTemplates.includes(key))
    .map(key =>{
    const translation = dataTemplate_Translations[key as keyof typeof dataTemplate_Translations];    
    return translation as TemplateItem;
})

export const silencerRemarks: DataTemplateTranslation = dataTemplate_TranslationRemarks.remarks

// This is a compile time check if all the keys in the emptyObject are present in dataTemplate_Translations.
// This is important because a runtime check is for naught; There must be a guarantee that all keys are present.
const _check: Record<TemplateKeys, any> = {...dataTemplate_Translations, ...dataTemplate_TranslationSoldTranslations, ...dataTemplate_TranslationSoldisSold};
