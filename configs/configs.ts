import { CollectionType, CommonStyles, CountrySelection, Languages, ListPrinter, SortingTypesAccessory_LightLaser, SortingTypesAccessory_Magazine, SortingTypesAccessory_Misc, SortingTypesAccessory_Optic, SortingTypesAccessory_Scope, SortingTypesAccessory_Silencer, SortingTypesAmmo, SortingTypesGun, SortingTypesLiterature_Book, SortingTypesPart_Barrel, SortingTypesPart_ConversionKit, SortingTypesReloading_Bullet, SortingTypesReloading_Case, SortingTypesReloading_Die, SortingTypesReloading_Powder, SortingTypesReloading_Primer, SupportedCountries } from "../lib/interfaces"
import { SimpleTranslation } from "../lib/textTemplates"

export const defaultGridGap:number = 10

export const defaultViewPadding:number = 10

export const defaultModalBackdrop:string = "rgba(0,0,0,0.1)"

export const defaultBottomBarHeight:number = 60

export const defaultSearchBarHeight:number = 56

export const defaultBottomBarTextHeight: number = 30

export const defaultCardOptionsMenuIconSize: number = 36
export const defaultCardOptionsMenuFontSize: number = 12

export const dateLocales:SimpleTranslation = {
    de: "de-CH",
    en: "en-US",
    fr: "fr-CH",
    it: "it-CH", 
    ch: "de-CH"
}

export const dateTimeOptions:Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
}

export const languageSelection:{flag:string, code:Languages}[] = [
    {flag: "🇩🇪", code: "de"},
    {flag: "🇨🇭", code: "ch"},
    {flag: "🇫🇷", code: "fr"},
    {flag: "🇮🇹", code: "it"},
    {flag: "🇺🇸", code: "en"},
]

export const countrySelection:CountrySelection[] = [
    {flag: "🇨🇭", name: {
        de: "Schweiz",
        en: "Switzerland",
        fr: "Suisse",
        it: "Svizzera",
        ch: "Svizra"
    }, iso: "ch"},
    {flag: "🇩🇪", name: {
        de: "Deutschland",
        en: "Germany",
        fr: "Allemagne",
        it: "Germania",
        ch: "Germania"
    }, iso: "de"},
    {flag: "🇺🇸", name: {
        de: "Vereinigte Staaten von Amerika",
        en: "United States of America",
        fr: " États-Unis d'Amérique",
        it: "Stati Uniti d'America",
        ch: "Stadis Unids da l’America"
    }, iso: "us"},
    {flag: "🏴‍☠️", name: {
        de: "Anderes Land",
        en: "Other country",
        fr: "Autre pays",
        it: "Altro paese",
        ch: "Ulteriur pajais"
    }, iso: "--"}
]

export const pdfCommonStyles:CommonStyles = {
    allPageMargin: "15mm",
    allPageMarginIOS: Math.ceil(15*2.83465),
    allTitleFontSize: "30px",
    allSubtitleFontSize: "12px",
    allTableFontSize: "15px",
    imageGap: "20px",
    tableVerticalMargin: "20px",
    tableRowVerticalPadding: "5px",
    tableCellPadding: "5px",
    footerWidth: "calc(100% - 30mm)",
    footerFontSize: "8px",
    footerTopBorder: "1px solid grey",
    footerPaddingTop: "5px",
    footerMarginTop: "5mm",
    tagPadding: "5px",
    tagFontSize: "10px",
    tagContainerGap: "10px"
}

export const pdfDateOptions:Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit"
}
export const maxCharCountText = 200
export const maxCharCountRemark = 5000

export const imageFileExtensions:string[]= [".apg", ".png", ".avif", ".gif", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp", ".svg", ".webp"]
export const pdfExcludedKeys = ["db_id", "images", "createdAt", "lastModifiedAt", "status", "id", "tags", "remarks", "lastCleanedAt", "lastShotAt", "cleanInterval", "cleanInterval_CustomTime", "cleanInterval_ShotCount", "qrCode", "customInventoryDesignation"]

export const customLabelFieldsText = ["name"]
export const customLabelFieldsFormat = ["pageFormat"]
export const customLabelFieldsUnit = ["unit"]
export const customLabelFieldsNumbers = ["pageHeight", "pageWidth", "marginTop", "marginLeft", "labelWidth", "labelHeight", "horizontalPitch", "verticalPitch", "columns", "rows", "radius"]

export const requiredFieldsGun:string[] = ["model"]
export const requiredFieldsAmmo:string[] = ["designation"]
export const requiredFieldsAccessory_Silencer:string[] = ["model"]
export const requiredFieldsAccessory_Optic:string[] = ["model"]
export const requiredFieldsAccessory_Scope:string[] = ["model"]
export const requiredFieldsAccessory_LightLaser:string[] = ["model"]
export const requiredFieldsAccessory_Magazine:string[] = ["model"]
export const requiredFieldsAccessory_Misc:string[] = ["model"]
export const requiredFieldsPart_ConversionKit:string[] = ["model"]
export const requiredFieldsPart_Barrel:string[] = ["model"]
export const requiredFieldsLiterature_Book:string[] = ["title"]
export const requiredFieldsReloading_Die:string[] = ["model"]
export const requiredFieldsReloading_Bullet:string[] = ["model"]
export const requiredFieldsReloading_Case: string[] = ["model"]
export const requiredFieldsReloading_Primer: string[] = ["model"]
export const requiredFieldsReloading_Powder: string[] = ["designation"]
export const requiredFieldsSellDialog:string[] = ["sold_buyerName"]

export const currencyPrefixFields:string[] = ["paidPrice", "marketValue"]
export const bulletWeightPrefixFields:string[] = ["bulletWeight"]
export const powderWeightPrefixFields:string[] = ["powderWeight", "criticalPowderWeight"]
export const barrelLengthPrefixFields:string[] = ["barrelLength"]
export const caseLengthPrefixFields:string[] = ["caseLength"]

export const unitFields_Weight: string[] = [...bulletWeightPrefixFields, ...powderWeightPrefixFields]
export const unitFields_Length: string[] = [...barrelLengthPrefixFields, ...caseLengthPrefixFields]

export const numberTextFields: string[] = ["shotCount", "currentStock", "criticalStock", "marketValue", "paidPrice", "decibelRating", "lumen", "candela", "capacity", "pages", "edition", "bulletWeight", "barrelLength", "caseLength", "powderWeight", "criticalPowderWeight"]

export const datePickerTriggerFields: string[] =  ["acquisitionDate_unix", "lastCleanedAt_unix", "lastShotAt_unix", "lastTopUpAt_unix", "batteryLastChangedAt_unix"]
export const legacyDatePickerTriggerFields: string[] =  ["acquisitionDate", "lastCleanedAt", "lastShotAt", "lastTopUpAt"]

export const colorPickerTriggerFields: string[] = ["mainColor", "reticleColor"]
export const caliberPickerTriggerFields: string[] = ["caliber"]
export const intervalPickerTriggerFields: string[] = ["cleanIntervalDisplay"]
export const ignoreIntervalFieldsForLogger: string[] = ["cleanInterval", "cleanInterval_CustomTime", "cleanInterval_ShotCount"]
export const mountedOnTriggerFields: string[] = ["currentlyMountedOn"]
export const codeTriggerFields: string[] = ["qrCode"]
export const stockTriggerFields: string[] = ["currentStock"]

export const nonFreeTextFields: string[] = [...numberTextFields, ...datePickerTriggerFields, ...legacyDatePickerTriggerFields, ...colorPickerTriggerFields, ...caliberPickerTriggerFields, ...intervalPickerTriggerFields, ...mountedOnTriggerFields, ...codeTriggerFields]
export const fieldsForAutocomplete: string[] = ["manufacturer", "designation", "model", "title", "subtitle", "author", "originCountry", "boughtFrom", "thread", "material", "zoom", "reticle", "platform", "language", "publisher", "series"]
export const soldKeys = ["sold_isSold", "sold_buyerName", "sold_sellPrice", "sold_buyerPermit", "sold_sellDate_unix", "sold_remarks"]
export const excludedKeysForDataTemplates: string[] = ["id", "createdAt", "lastModifiedAt", "images", "tags", "remarks", "cleanInterval_CustomTime", "cleanInterval_ShotCount", "cleanInterval", ...soldKeys]
export const cleanIntervalOptions:string[] = ["none", "day_1", "day_7", "day_14", "month_1", "month_3", "month_6", "month_9", "year_1", "year_5", "year_10"] 

export const cardActionsGun: string[] = ["delete", "clone", "quickShot", "quickClean"]
export const cardActionsAccessory_Silencer: string[] = ["delete", "clone", "quickMount", "quickClean"]
export const cardActionsAccessory_Optic: string[] = ["delete", "clone", "quickMount", "quickClean", "quickBatt"]
export const cardActionsAccessory_Scope: string[] = ["delete", "clone", "quickMount", "quickClean", "quickBatt"]
export const cardActionsAccessory_LightLaser: string[] = ["delete", "clone", "quickMount", "quickBatt"]
export const cardActionsAccessory_Magazine: string[] = ["delete", "clone", "quickMount", "quickClean"]
export const cardActionsAccessory_Misc: string[] = ["delete", "clone", "quickMount"]
export const cardActionsPart_ConversionKit: string[] = ["delete", "clone", "quickMount", "quickShot", "quickClean"]
export const cardActionsPart_Barrel: string[] = ["delete", "clone", "quickMount", "quickShot", "quickClean"]
export const cardActionsLiterature_Book: string[] = ["delete", "clone"]
export const cardActionsReloading_Die: string[] = ["delete", "clone"]
export const cardActionsReloading_Bullet: string[] = ["delete", "clone", "quickStock"]
export const cardActionsReloading_Case: string[] = ["delete", "clone", "quickStock"]
export const cardActionsReloading_Primer: string[] = ["delete", "clone", "quickStock"]
export const cardActionsReloading_Powder: string[] = ["delete", "clone", "quickStock"]
export const cardActionsAmmo: string[] = ["delete", "clone", "quickStock"]
export const cardActionsMountedOn: string[] = ["goto", "unmount", "remount"]

export const screenNameParamsMain:CollectionType[] = ["gunCollection", "ammoCollection"]
export const screenNameParamsAccessory:CollectionType[] = ["accessoryCollection_Silencer", "accessoryCollection_Optic", "accessoryCollection_Scope", "accessoryCollection_LightLaser", "accessoryCollection_Magazine", "accessoryCollection_Misc"]
export const screenNameParamsPart:CollectionType[] = ["partCollection_ConversionKit", "partCollection_Barrel"]
export const screenNameParamsLiterature: CollectionType[] = ["literatureCollection_Book"]
export const screenNameParamsReloading:CollectionType[] = ["reloadingCollection_Die", "reloadingCollection_Bullet", "reloadingCollection_Case", "reloadingCollection_Primer", "reloadingCollection_Powder"]

export const screenNameParamsAll:CollectionType[] = [...screenNameParamsMain, ...screenNameParamsAccessory, ...screenNameParamsPart, ...screenNameParamsLiterature, ...screenNameParamsReloading]

export const loggerTables: string[] = ["logger", "costLoggerAmmunition", "costLoggerBullets", "costLoggerCasings", "costLoggerPrimers", "costLoggerPowder"]
export const nonCollectionTables: string[]= ["accessoryCollection", "partCollection", "accessoryMount", "partMount", "autocomplete", "gunReminders", "customShippingLabels", ...loggerTables]

export const collectionExportDirectories: CollectionType[] = screenNameParamsAll
export const collectionImportTables: (CollectionType | string)[] = [...screenNameParamsAll, ...nonCollectionTables]

export const numberBadgeCollections: CollectionType[] = ["ammoCollection", "accessoryCollection_Magazine", "reloadingCollection_Bullet", "reloadingCollection_Case", "reloadingCollection_Primer"]
export const criticalStockCollections: CollectionType[] = ["ammoCollection", "reloadingCollection_Bullet", "reloadingCollection_Case", "reloadingCollection_Primer"]

export const accessoryExceptions: CollectionType[] = ["ammoCollection", "literatureCollection_Book", "reloadingCollection_Die", "reloadingCollection_Bullet", "reloadingCollection_Case", "reloadingCollection_Primer", "reloadingCollection_Powder"]
export const costExceptions: CollectionType[] = ["gunCollection", ...screenNameParamsAccessory, ...screenNameParamsPart, ...screenNameParamsLiterature]

export const sortingOptionsGun:SortingTypesGun[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastShotAt", "lastCleanedAt"]
export const sortingOptionsAmmo:SortingTypesAmmo[] = ["alphabetical", "createdAt", "lastModifiedAt", "currentStock", "lastTopUpAt"]
export const sortingOptionsAccessory_Silencer:SortingTypesAccessory_Silencer[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastShotAt", "lastCleanedAt"]
export const sortingOptionsAccessory_Optic:SortingTypesAccessory_Optic[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastBatteryChangeAt", "lastCleanedAt"]
export const sortingOptionsAccessory_Scope:SortingTypesAccessory_Scope[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastBatteryChangeAt", "lastCleanedAt"]
export const sortingOptionsAccessory_LightLaser:SortingTypesAccessory_LightLaser[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastBatteryChangeAt"]
export const sortingOptionsAccessory_Magazine:SortingTypesAccessory_Magazine[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastShotAt", "lastCleanedAt", "capacity"]
export const sortingOptionsAccessory_Misc:SortingTypesAccessory_Misc[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt"]
export const sortingOptionsPart_ConversionKit:SortingTypesPart_ConversionKit[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastShotAt", "lastCleanedAt"]
export const sortingOptionsPart_Barrel:SortingTypesPart_Barrel[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "lastShotAt", "lastCleanedAt"]
export const sortingOptionsLiterature_Book:SortingTypesLiterature_Book[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt", "pages"]
export const sortingOptionsReloading_Die:SortingTypesReloading_Die[] = ["alphabetical", "paidPrice", "marketValue", "acquisitionDate", "createdAt", "lastModifiedAt"]
export const sortingOptionsReloading_Bullet:SortingTypesReloading_Bullet[] = ["alphabetical", "createdAt", "lastModifiedAt"]
export const sortingOptionsReloading_Case:SortingTypesReloading_Case[] = ["alphabetical", "createdAt", "lastModifiedAt"]
export const sortingOptionsReloading_Primer:SortingTypesReloading_Primer[] = ["alphabetical", "createdAt", "lastModifiedAt"]
export const sortingOptionsReloading_Powder:SortingTypesReloading_Powder[] = ["alphabetical", "createdAt", "lastModifiedAt"]

// i shouldve used more descriptive names for these but oh well
export const checkboxFields_ch = ["exFullAuto", "highCapacityMagazine", "short", "fullAuto", "launcher", "decepticon", "blooptoob", "grandfather"]
export const checkboxFields_us = ["pistol", "rifle", "shotgun", "sbr", "sbs", "aow", "machineGun", "dd", "pmf", "cr", "nfa", "antique"]

export const printers_ch: ListPrinter[] = ["gunCollection", "gunCollectionArt5", "gunCollectionHybrid", "custom"]
export const printers_us: ListPrinter[] = ["gunCollection", "custom"]
export const printers_others: ListPrinter[] = ["gunCollection", "custom"]