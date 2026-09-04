import { AccessoryType_LightLaser, AccessoryType_Magazine, AccessoryType_Misc, AccessoryType_Optic, AccessoryType_Scope, AccessoryType_Silencer, AmmoType, CollectionType, GunType, ItemType, Languages, LiteratureType_Book, PartType_Barrel, PartType_ConversionKit, ReloadingType_Bullet, ReloadingType_Case, ReloadingType_Die, ReloadingType_Powder, ReloadingType_Primer, SupportedCountries, weightUnitNames } from "lib/interfaces";
import sortGunCollection from "./sorters/sortGunCollection";
import { PreferredUnits, SorterSettings } from "stores/usePreferenceStore";
import sortAmmoCollection from "./sorters/sortAmmoCollection";
import * as schema from "db/schema"
import { or, like, sql, and } from 'drizzle-orm';
import { emptyGunObject, gunDataTemplate, gunRemarks } from "lib/DataTemplates/gunDataTemplate";
import { ammoDataTemplate, ammoRemarks, emptyAmmoObject } from "lib/DataTemplates/ammoDataTemplate";
import { cardActionsAccessory_LightLaser, cardActionsAccessory_Magazine, cardActionsAccessory_Misc, cardActionsAccessory_Optic, cardActionsAccessory_Scope, cardActionsAccessory_Silencer, cardActionsAmmo, cardActionsGun, cardActionsLiterature_Book, cardActionsPart_Barrel, cardActionsPart_ConversionKit, cardActionsReloading_Bullet, cardActionsReloading_Case, cardActionsReloading_Die, cardActionsReloading_Powder, cardActionsReloading_Primer, checkboxFields_ch, checkboxFields_us, printers_ch, printers_others, printers_us, requiredFieldsAccessory_LightLaser, requiredFieldsAccessory_Magazine, requiredFieldsAccessory_Misc, requiredFieldsAccessory_Optic, requiredFieldsAccessory_Scope, requiredFieldsAccessory_Silencer, requiredFieldsAmmo, requiredFieldsGun, requiredFieldsLiterature_Book, requiredFieldsPart_Barrel, requiredFieldsPart_ConversionKit, requiredFieldsReloading_Bullet, requiredFieldsReloading_Case, requiredFieldsReloading_Die, requiredFieldsReloading_Powder, requiredFieldsReloading_Primer, sortingOptionsAccessory_LightLaser, sortingOptionsAccessory_Magazine, sortingOptionsAccessory_Misc, sortingOptionsAccessory_Optic, sortingOptionsAccessory_Scope, sortingOptionsAccessory_Silencer, sortingOptionsAmmo, sortingOptionsGun, sortingOptionsLiterature_Book, sortingOptionsPart_Barrel, sortingOptionsPart_ConversionKit, sortingOptionsReloading_Bullet, sortingOptionsReloading_Case, sortingOptionsReloading_Die, sortingOptionsReloading_Powder, sortingOptionsReloading_Primer } from "configs/configs";
import sortAccessoryCollection_Silencer from "./sorters/sortAccessoryCollection_Silencer";
import { accessoryDataTemplate_Silencer, emptySilencerObject, silencerRemarks } from "lib/DataTemplates/accessoryDataTemplate_Silencer";
import sortAccessoryCollection_Optic from "./sorters/sortAccessoryCollection_Optic";
import { accessoryDataTemplate_Optic, emptyOpticObject, opticRemarks } from "lib/DataTemplates/accessoryDataTemplate_Optic";
import sortPartCollection_ConversionKit from "./sorters/sortPartCollection_ConversionKit";
import { conversionKitRemarks, emptyConversionKitObject, partDataTemplate_ConversionKit } from "lib/DataTemplates/partDataTemplate_ConversionKit";
import sortAccessoryCollection_LightLaser from "./sorters/sortAccessoryCollection_LightLaser";
import { accessoryDataTemplate_LightLaser, emptyLightLaserObject, lightLaserRemarks } from "lib/DataTemplates/accessoryDataTemplate_LightLaser";
import sortPartCollection_Barrel from "./sorters/sortPartCollection_Barrel";
import { barrelRemarks, emptyBarrelObject, partDataTemplate_Barrel } from "lib/DataTemplates/partDataTemplate_Barrel";
import sortAccessoryCollection_Scope from "./sorters/sortAccessoryCollection_Scope";
import { accessoryDataTemplate_Scope, emptyScopeObject, scopeRemarks } from "lib/DataTemplates/accessoryDataTemplate_Scope";
import sortAccessoryCollection_Magazine from "./sorters/sortAccessoryCollection_Magazine";
import { accessoryDataTemplate_Magazine, emptyMagazineObject, magazineRemarks } from "lib/DataTemplates/accessoryDataTemplate_Magazine";
import sortAccessoryCollection_Misc from "./sorters/sortAccessoryCollection_Misc";
import { accessoryDataTemplate_Misc, emptyMiscAccessoryObject, miscAccessoryRemarks } from "lib/DataTemplates/accessoryDataTemplate_Misc";
import sortLiteratureCollection_Book from "./sorters/sortLiteratureCollection_Book";
import { bookRemarks, emptyBookObject, literatureDataTemplate_Book } from "lib/DataTemplates/literatureDataTemplate_Book";
import { dataTemplate_Translations } from "lib/DataTemplates/translations";
import { tabBarLabels } from "lib/Text/text_tabBarLabels";
import { editAccessoryTitle, editAmmoTitle, editGunTitle, editLiteratureTitle, editPartTitle, editReloadingTitle, newAccessoryTitle, newAmmoTitle, newGunTitle, newLiteratureTitle, newPartTitle, newReloadingTitle } from "lib/Text/text_edit_new_item";
import { shotLabel } from "lib/textTemplates";
import { getShortCaliberName } from "./getShortCaliber";
import sortReloadingCollection_Die from "./sorters/sortReloadingCollection_Die";
import { dieRemarks, emptyDieObject, reloadingDataTemplate_Die } from "lib/DataTemplates/reloadingDataTemplate_Die";
import sortReloadingCollection_Bullet from "./sorters/sortReloadingCollection_Bullet";
import { bulletRemarks, emptyBulletObject, reloadingDataTemplate_Bullet } from "lib/DataTemplates/reloadingDataTemplate_Bullet";
import sortReloadingCollection_Case from "./sorters/sortReloadingCollection_Case";
import { caseRemarks, emptyCaseObject, reloadingDataTemplate_Case } from "lib/DataTemplates/reloadingDataTemplate_Case";
import sortReloadingCollection_Primer from "./sorters/sortReloadingCollection_Primer";
import { emptyPrimerObject, primerRemarks, reloadingDataTemplate_Primer } from "lib/DataTemplates/reloadingDataTemplate_Primer";
import sortReloadingCollection_Powder from "./sorters/sortReloadingCollection_Powder";
import { reloadingCollection_Powder } from "db/schema";
import { emptyPowderObject, powderRemarks, reloadingDataTemplate_Powder } from "lib/DataTemplates/reloadingDataTemplate_Powder";
import { convertWeightUnitsToPreferredUnit } from "./utils";

export function determineSchema(collection:CollectionType){
    switch(collection){
        case "gunCollection":
            return schema.gunCollection
        case "ammoCollection":
            return schema.ammoCollection
        case "accessoryCollection_Silencer":
            return schema.accessoryCollection_Silencer
        case "accessoryCollection_Optic":
            return schema.accessoryCollection_Optic
        case "accessoryCollection_Scope":
            return schema.accessoryCollection_Scope
        case "accessoryCollection_LightLaser":
            return schema.accessoryCollection_LightLaser
        case "accessoryCollection_Magazine":
            return schema.accessoryCollection_Magazine
        case "accessoryCollection_Misc":
            return schema.accessoryCollection_Misc
        case "partCollection_ConversionKit":
            return schema.partCollection_ConversionKit
        case "partCollection_Barrel":
            return schema.partCollection_Barrel
        case "literatureCollection_Book":
            return schema.literatureCollection_Book
        case "reloadingCollection_Die":
            return schema.reloadingCollection_Die
        case "reloadingCollection_Bullet":
            return schema.reloadingCollection_Bullet
        case "reloadingCollection_Case":
            return schema.reloadingCollection_Case
        case "reloadingCollection_Primer":
            return schema.reloadingCollection_Primer
        case "reloadingCollection_Powder":
            return schema.reloadingCollection_Powder
    }
}

export function determineSchemaStringFromTabBarLabel(collection:string){
    switch(collection){
        case "gunCollection":
            return "gunCollection"
        case "ammoCollection":
            return "ammoCollection"
        case "silencerCollection":
            return "accessoryCollection_Silencer"
        case "opticCollection":
            return "accessoryCollection_Optic"
        case "scopeCollection":
            return "accessoryCollection_Scope"
        case "lightLaserCollection":
            return "accessoryCollection_LightLaser"
        case "magazineCollection":
            return "accessoryCollection_Magazine"
        case "miscAccessoryCollection":
            return "accessoryCollection_Misc"
        case "conversionCollection":
            return "partCollection_ConversionKit"
        case "barrelCollection":
            return "partCollection_Barrel"
        case "bookCollection":
            return "literatureCollection_Book"
        case "dieCollection":
            return "reloadingCollection_Die"
        case "bulletCollection":
            return "reloadingCollection_Bullet"
        case "caseCollection":
            return "reloadingCollection_Case"
        case "primerCollection":
            return "reloadingCollection_Primer"
        case "powderCollection":
            return "reloadingCollection_Powder"
    }
}

export function determineTagSchema(collection:CollectionType){
    switch(collection){
        case "gunCollection":
            return schema.gunTags
        case "ammoCollection":
            return schema.ammoTags
        case "accessoryCollection_Silencer":
            return schema.accessory_SilencerTags
        case "accessoryCollection_Optic":
            return schema.accessory_OpticTags
        case "accessoryCollection_Scope":
            return schema.accessory_ScopeTags
        case "accessoryCollection_LightLaser":
            return schema.accessory_LightLaserTags
        case "accessoryCollection_Magazine":
            return schema.accessory_MagazineTags
        case "accessoryCollection_Misc":
            return schema.accessory_MiscTags
        case "partCollection_ConversionKit":
            return schema.part_ConversionKitTags
        case "partCollection_Barrel":
            return schema.part_BarrelTags
        case "literatureCollection_Book":
            return schema.literature_BookTags
        case "reloadingCollection_Die":
            return schema.reloading_DieTags
        case "reloadingCollection_Bullet":
            return schema.reloading_BulletTags
        case "reloadingCollection_Case":
            return schema.reloading_CaseTags
        case "reloadingCollection_Primer":
            return schema.reloading_PrimerTags
        case "reloadingCollection_Powder":
            return schema.reloading_PowderTags
    }
}

export function determineSortingFunction(collection:CollectionType, sortBy: SorterSettings){

    switch(collection){
        case "gunCollection":{
            return sortGunCollection(sortBy[collection].direction, sortBy[collection].type)
        };
        case "ammoCollection":{
            return sortAmmoCollection(sortBy[collection].direction, sortBy[collection].type)
        }
        case "accessoryCollection_Silencer":{
            return sortAccessoryCollection_Silencer(sortBy[collection].direction, sortBy[collection].type)
        };
        case "accessoryCollection_Optic":{
            return sortAccessoryCollection_Optic(sortBy[collection].direction, sortBy[collection].type)
        };
        case "accessoryCollection_Scope":{
            return sortAccessoryCollection_Scope(sortBy[collection].direction, sortBy[collection].type)
        };
        case "accessoryCollection_LightLaser":{
            return sortAccessoryCollection_LightLaser(sortBy[collection].direction, sortBy[collection].type)
        };
        case "accessoryCollection_Magazine":{
            return sortAccessoryCollection_Magazine(sortBy[collection].direction, sortBy[collection].type)
        };
        case "accessoryCollection_Misc":{
            return sortAccessoryCollection_Misc(sortBy[collection].direction, sortBy[collection].type)
        };
        case "partCollection_ConversionKit":{
            return sortPartCollection_ConversionKit(sortBy[collection].direction, sortBy[collection].type)
        };
        case "partCollection_Barrel":{
            return sortPartCollection_Barrel(sortBy[collection].direction, sortBy[collection].type)
        };
        case "literatureCollection_Book":{
            return sortLiteratureCollection_Book(sortBy[collection].direction, sortBy[collection].type)
        }
        case "reloadingCollection_Die":{
            return sortReloadingCollection_Die(sortBy[collection].direction, sortBy[collection].type)
        };
        case "reloadingCollection_Bullet":{
            return sortReloadingCollection_Bullet(sortBy[collection].direction, sortBy[collection].type)
        };
        case "reloadingCollection_Case":{
            return sortReloadingCollection_Case(sortBy[collection].direction, sortBy[collection].type)
        };
        case "reloadingCollection_Primer":{
            return sortReloadingCollection_Primer(sortBy[collection].direction, sortBy[collection].type)
        };
        case "reloadingCollection_Powder":{
            return sortReloadingCollection_Powder(sortBy[collection].direction, sortBy[collection].type)
        };
    }
}

export function determineSearchQueryFields(collection:CollectionType, searchQuery:string){
    const searchWords = searchQuery
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

    switch(collection){
        
        case "gunCollection":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "ammoCollection":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].designation}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].caliber}, '')`, `%${word}%`),
                    )
                )
            )
        }
        case "accessoryCollection_Silencer":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "accessoryCollection_Optic":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "accessoryCollection_Scope":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "accessoryCollection_LightLaser":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "accessoryCollection_Magazine":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "accessoryCollection_Misc":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "partCollection_ConversionKit":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "partCollection_Barrel":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].caliber}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "literatureCollection_Book":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].title}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].subtitle}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].series}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "reloadingCollection_Die":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].caliber}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "reloadingCollection_Bullet":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].caliber}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "reloadingCollection_Case":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].caliber}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "reloadingCollection_Primer":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].model}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
        case "reloadingCollection_Powder":{
            return and(
                ...searchWords.map((word) =>
                    or(
                        like(sql`COALESCE(${schema[collection].designation}, '')`, `%${word}%`),
                        like(sql`COALESCE(${schema[collection].manufacturer}, '')`, `%${word}%`)
                    )
                )
            )
        }
    }
}

export function determineDataTemplate(collection: CollectionType){

    switch(collection){
        case "gunCollection": 
            return gunDataTemplate
        case "ammoCollection":
            return ammoDataTemplate
        case "accessoryCollection_Silencer":
            return accessoryDataTemplate_Silencer
        case "accessoryCollection_Optic":
            return accessoryDataTemplate_Optic
        case "accessoryCollection_Scope":
            return accessoryDataTemplate_Scope
        case "accessoryCollection_LightLaser":
            return accessoryDataTemplate_LightLaser
        case "accessoryCollection_Magazine":
            return accessoryDataTemplate_Magazine
        case "accessoryCollection_Misc":
            return accessoryDataTemplate_Misc
        case "partCollection_ConversionKit":
            return partDataTemplate_ConversionKit
        case "partCollection_Barrel":
            return partDataTemplate_Barrel
        case "literatureCollection_Book":
            return literatureDataTemplate_Book
        case "reloadingCollection_Die":
            return reloadingDataTemplate_Die
        case "reloadingCollection_Bullet":
            return reloadingDataTemplate_Bullet
        case "reloadingCollection_Case":
            return reloadingDataTemplate_Case
        case "reloadingCollection_Primer":
            return reloadingDataTemplate_Primer
        case "reloadingCollection_Powder":
            return reloadingDataTemplate_Powder
    }
}

export function determineRemarkDataTemplate(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return gunRemarks
        case "ammoCollection":
            return ammoRemarks
         case "accessoryCollection_Silencer":
            return silencerRemarks
        case "accessoryCollection_Optic":
            return opticRemarks
        case "accessoryCollection_Scope":
            return scopeRemarks
        case "accessoryCollection_LightLaser":
            return lightLaserRemarks
        case "accessoryCollection_Magazine":
            return magazineRemarks
        case "accessoryCollection_Misc":
            return miscAccessoryRemarks
        case "partCollection_ConversionKit":
            return conversionKitRemarks
        case "partCollection_Barrel":
            return barrelRemarks
        case "literatureCollection_Book":
            return bookRemarks
        case "reloadingCollection_Die":
            return dieRemarks
        case "reloadingCollection_Bullet":
            return bulletRemarks
        case "reloadingCollection_Case":
            return caseRemarks
        case "reloadingCollection_Primer":
            return primerRemarks
        case "reloadingCollection_Powder":
            return powderRemarks
    }
}

export function determineEmptyObject(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return emptyGunObject
        case "ammoCollection":
            return emptyAmmoObject
        case "accessoryCollection_Silencer":
            return emptySilencerObject
        case "accessoryCollection_Optic":
            return emptyOpticObject
        case "accessoryCollection_Scope":
            return emptyScopeObject
        case "accessoryCollection_LightLaser":
            return emptyLightLaserObject
        case "accessoryCollection_Magazine":
            return emptyMagazineObject
        case "accessoryCollection_Misc":
            return emptyMiscAccessoryObject
        case "partCollection_ConversionKit":
            return emptyConversionKitObject
        case "partCollection_Barrel":
            return emptyBarrelObject
        case "literatureCollection_Book":
            return emptyBookObject
        case "reloadingCollection_Die":
            return emptyDieObject
        case "reloadingCollection_Bullet":
            return emptyBulletObject
        case "reloadingCollection_Case":
            return emptyCaseObject
        case "reloadingCollection_Primer":
            return emptyPrimerObject
        case "reloadingCollection_Powder":
            return emptyPowderObject
    }
}

export function determineEmptyObjectReturns(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return {...emptyGunObject}
        case "ammoCollection":
            return {...emptyAmmoObject}
        case "accessoryCollection_Silencer":
            return {...emptySilencerObject}
        case "accessoryCollection_Optic":
            return {...emptyOpticObject}
        case "accessoryCollection_Scope":
            return {...emptyScopeObject}
        case "accessoryCollection_LightLaser":
            return {...emptyLightLaserObject}
        case "accessoryCollection_Magazine":
            return {...emptyMagazineObject}
        case "accessoryCollection_Misc":
            return {...emptyMiscAccessoryObject}
        case "partCollection_ConversionKit":
            return {...emptyConversionKitObject}
        case "partCollection_Barrel":
            return {...emptyBarrelObject}
        case "literatureCollection_Book":
            return {...emptyBookObject}
        case "reloadingCollection_Die":
            return {...emptyDieObject}
        case "reloadingCollection_Bullet":
            return {...emptyBulletObject}
        case "reloadingCollection_Case":
            return {...emptyCaseObject}
        case "reloadingCollection_Primer":
            return {...emptyPrimerObject}
        case "reloadingCollection_Powder":
            return {...emptyPowderObject}
    }
}

export function determineRequiredFields(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return requiredFieldsGun
        case "ammoCollection":
            return requiredFieldsAmmo
        case "accessoryCollection_Silencer":
            return requiredFieldsAccessory_Silencer
        case "accessoryCollection_Optic":
            return requiredFieldsAccessory_Optic
        case "accessoryCollection_Scope":
            return requiredFieldsAccessory_Scope
        case "accessoryCollection_LightLaser":
            return requiredFieldsAccessory_LightLaser
        case "accessoryCollection_Magazine":
            return requiredFieldsAccessory_Magazine
        case "accessoryCollection_Misc":
            return requiredFieldsAccessory_Misc
        case "partCollection_ConversionKit":
            return requiredFieldsPart_ConversionKit
        case "partCollection_Barrel":
            return requiredFieldsPart_Barrel
        case "literatureCollection_Book":
            return requiredFieldsLiterature_Book
        case "reloadingCollection_Die":
            return requiredFieldsReloading_Die
        case "reloadingCollection_Bullet":
            return requiredFieldsReloading_Bullet
        case "reloadingCollection_Case":
            return requiredFieldsReloading_Case
        case "reloadingCollection_Primer":
            return requiredFieldsReloading_Primer
        case "reloadingCollection_Powder":
            return requiredFieldsReloading_Powder
    }
}

export function determineSortingOptions(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return sortingOptionsGun
        case "ammoCollection":
            return sortingOptionsAmmo
        case "accessoryCollection_Silencer":
            return sortingOptionsAccessory_Silencer
        case "accessoryCollection_Optic":
            return sortingOptionsAccessory_Optic
        case "accessoryCollection_Scope":
            return sortingOptionsAccessory_Scope
        case "accessoryCollection_LightLaser":
            return sortingOptionsAccessory_LightLaser
        case "accessoryCollection_Magazine":
            return sortingOptionsAccessory_Magazine
        case "accessoryCollection_Misc":
            return sortingOptionsAccessory_Misc
        case "partCollection_ConversionKit":
            return sortingOptionsPart_ConversionKit
        case "partCollection_Barrel":
            return sortingOptionsPart_Barrel
        case "literatureCollection_Book":
            return sortingOptionsLiterature_Book
        case "reloadingCollection_Die":
            return sortingOptionsReloading_Die
        case "reloadingCollection_Bullet":
            return sortingOptionsReloading_Bullet
        case "reloadingCollection_Case":
            return sortingOptionsReloading_Case
        case "reloadingCollection_Primer":
            return sortingOptionsReloading_Primer
        case "reloadingCollection_Powder":
            return sortingOptionsReloading_Powder
    }
}

export function determineCardOptions(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return cardActionsGun
        case "ammoCollection":
            return cardActionsAmmo
        case "accessoryCollection_Silencer":
            return cardActionsAccessory_Silencer
        case "accessoryCollection_Optic":
            return cardActionsAccessory_Optic
        case "accessoryCollection_Scope":
            return cardActionsAccessory_Scope
        case "accessoryCollection_LightLaser":
            return cardActionsAccessory_LightLaser
        case "accessoryCollection_Magazine":
            return cardActionsAccessory_Magazine
        case "accessoryCollection_Misc":
            return cardActionsAccessory_Misc
        case "partCollection_ConversionKit":
            return cardActionsPart_ConversionKit
        case "partCollection_Barrel":
            return cardActionsPart_Barrel
        case "literatureCollection_Book":
            return cardActionsLiterature_Book
        case "reloadingCollection_Die":
            return cardActionsReloading_Die
        case "reloadingCollection_Bullet":
            return cardActionsReloading_Bullet
        case "reloadingCollection_Case":
            return cardActionsReloading_Case
        case "reloadingCollection_Primer":
            return cardActionsReloading_Primer
        case "reloadingCollection_Powder":
            return cardActionsReloading_Powder
    }
}

export function determineIfCustomIcon(collection: CollectionType){
    switch(collection){
        case "partCollection_PistolSlide":
            return true
        case "partCollection_PistolFrame":
            return true
        default: 
            return false
    }
}

export function determineCustomIcon(collection: CollectionType){
    switch(collection){
        case "partCollection_PistolSlide":
            return require("../assets/775788_several different realistic rifles and pistols on _xl-1024-v1-0.png")
        case "partCollection_PistolFrame":
            return require("../assets/775788_several different realistic rifles and pistols on _xl-1024-v1-0.png")
    }
}

export function determineAccessoryIcons(collection: CollectionType){
    switch(collection){
        case "gunCollection":
            return "pistol"
        case "ammoCollection":
            return "ammunition"
        case "accessoryCollection_Silencer":
            return "volume-mute"
        case "accessoryCollection_Optic":
            return "toslink"
        case "accessoryCollection_Scope":
            return "crosshairs"
        case "accessoryCollection_LightLaser":
            return "spotlight-beam"
        case "accessoryCollection_Magazine":
            return "magazine-pistol"
        case "accessoryCollection_Misc":
            return "help-circle-outline"
        case "partCollection_ConversionKit":
            return "cog-transfer-outline"
        case "partCollection_Barrel":
            return "lightbulb-fluorescent-tube-outline"
        case "literatureCollection_Book":
            return "bookshelf"
        case "reloadingCollection_Die":
            return "lightbulb-cfl-spiral"
        case "reloadingCollection_Bullet":
            return "gate-and"
        case "reloadingCollection_Case":
            return "test-tube-empty"
        case "reloadingCollection_Powder":
            return "shaker"
        case "reloadingCollection_Primer":
            return "fire-circle"
    }
}

export function determineTabBarLabel(collection: CollectionType){
    switch(collection){
        case "gunCollection": 
            return tabBarLabels.gunCollection
        case "ammoCollection":
            return tabBarLabels.ammoCollection
        case "accessoryCollection_Silencer":
            return tabBarLabels.silencerCollection
        case "accessoryCollection_Optic":
            return tabBarLabels.opticCollection
        case "accessoryCollection_Scope":
            return tabBarLabels.scopeCollection
        case "accessoryCollection_LightLaser":
            return tabBarLabels.lightLaserCollection
        case "accessoryCollection_Magazine":
            return tabBarLabels.magazineCollection
        case "accessoryCollection_Misc":
            return tabBarLabels.miscAccessoryCollection
        case "partCollection_ConversionKit":
            return tabBarLabels.conversionCollection
        case "partCollection_Barrel":
            return tabBarLabels.barrelCollection
        case "literatureCollection_Book":
            return tabBarLabels.bookCollection
        case "reloadingCollection_Die":
            return tabBarLabels.dieCollection
        case "reloadingCollection_Bullet":
            return tabBarLabels.bulletCollection
        case "reloadingCollection_Case":
            return tabBarLabels.caseCollection
        case "reloadingCollection_Primer":
            return tabBarLabels.primerCollection
        case "reloadingCollection_Powder":
            return tabBarLabels.powderCollection
    }
}

export function determineNewItemTitle(collection: CollectionType){
    if(collection.startsWith("gun")){
        return newGunTitle
    }
    if(collection.startsWith("ammo")){
        return newAmmoTitle
    }
    if(collection.startsWith("accessoryCollection_")){
        return newAccessoryTitle
    }
    if(collection.startsWith("partCollection_")){
        return newPartTitle
    }
    if(collection.startsWith("literatureCollection_")){
        return newLiteratureTitle
    }
    if(collection.startsWith("reloadingCollection_")){
        return newReloadingTitle
    }
}

export function determineEditItemTitle(collection: CollectionType){
    if(collection.startsWith("gun")){
        return editGunTitle
    }
    if(collection.startsWith("ammo")){
        return editAmmoTitle
    }
    if(collection.startsWith("accessoryCollection_")){
        return editAccessoryTitle
    }
    if(collection.startsWith("partCollection_")){
        return editPartTitle
    }
    if(collection.startsWith("literatureCollection_")){
        return editLiteratureTitle
    }
    if(collection.startsWith("reloadingCollection_")){
        return editReloadingTitle
    }
}

export function determineCardTitle(collection: CollectionType, itemIn: ItemType, language:Languages){
    switch(collection){
        case "gunCollection": 
            {   const item = itemIn as GunType
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "ammoCollection":
            {   const item = itemIn as AmmoType
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.designation}`
            }
        case "accessoryCollection_Silencer":
            {   const item = itemIn as AccessoryType_Silencer
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "accessoryCollection_Optic":
            {   const item = itemIn as AccessoryType_Optic
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "accessoryCollection_Scope":
            {   const item = itemIn as AccessoryType_Scope
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "accessoryCollection_LightLaser":
            {   const item = itemIn as AccessoryType_LightLaser
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "accessoryCollection_Magazine":
            {   const item = itemIn as AccessoryType_Magazine
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "accessoryCollection_Misc":
            {   const item = itemIn as AccessoryType_Misc
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "partCollection_ConversionKit":
            {   const item = itemIn as PartType_ConversionKit
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "partCollection_Barrel":
            {   const item = itemIn as PartType_Barrel
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "literatureCollection_Book":
            {   const item = itemIn as LiteratureType_Book
                return `${item.title}${item.volume && item.volume.length != 0 ? ` (${dataTemplate_Translations.volume[language]} ${item.volume})` : ""}`
            }
        case "reloadingCollection_Die":
            {   const item = itemIn as ReloadingType_Die
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "reloadingCollection_Bullet":
            {   const item = itemIn as ReloadingType_Bullet
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "reloadingCollection_Case":
            {   const item = itemIn as ReloadingType_Case
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "reloadingCollection_Primer":
            {   const item = itemIn as ReloadingType_Primer
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.model}`
            }
        case "reloadingCollection_Powder":
            {   const item = itemIn as ReloadingType_Powder
                return `${item.manufacturer && item.manufacturer.length != 0 ? `${item.manufacturer}` : ""}${item.manufacturer && item.manufacturer.length != 0 ? ` ` : ""}${item.designation}`
            }
    }
}

export function determineCardSubtitle(collection: CollectionType, itemIn: ItemType, language:Languages, caliberDisplayNameList:{ name: string; displayName?: string }[], preferredUnits: PreferredUnits){
    switch(collection){
        case "gunCollection": 
            {   const item = itemIn as GunType
                return item.serial && item.serial.length !== 0 ? item.serial : " "
            }
        case "ammoCollection":
            {   const item = itemIn as AmmoType
                return item.caliber && item.caliber.length !== 0 ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "accessoryCollection_Silencer":
            {   const item = itemIn as AccessoryType_Silencer
                return item.caliber && item.caliber.length !== 0 ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "accessoryCollection_Optic":
            {   const item = itemIn as AccessoryType_Optic
                return item.reticle ? item.reticle : " "
            }
        case "accessoryCollection_Scope":
            {   const item = itemIn as AccessoryType_Scope
                return item.zoom ? item.zoom : " "
            }
        case "accessoryCollection_LightLaser":
            {   const item = itemIn as AccessoryType_LightLaser
                return item.serial && item.serial.length != 0 ? item.serial : " "
            }
        case "accessoryCollection_Magazine":
            {   const item = itemIn as AccessoryType_Magazine
                const capacity = item.capacity ? `${item.capacity} ${shotLabel[language]}` : ""
                const caliber = item.caliber ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
                return `${capacity} ${caliber}`
            }
        case "accessoryCollection_Misc":
            {   const item = itemIn as AccessoryType_Misc
                return " "
            }
        case "partCollection_ConversionKit":
            {   const item = itemIn as PartType_ConversionKit
                return item.caliber ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "partCollection_Barrel":
            {   const item = itemIn as PartType_Barrel
                return item.caliber ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "literatureCollection_Book":
            {   const item = itemIn as LiteratureType_Book
                return `${item.subtitle && item.subtitle.length != 0 ? `${item.subtitle}` : " "}`
            }
        case "reloadingCollection_Die":
            {   const item = itemIn as ReloadingType_Die
                return item.caliber ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "reloadingCollection_Bullet":
            {   const item = itemIn as ReloadingType_Bullet
                return item.caliber ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "reloadingCollection_Case":
            {   const item = itemIn as ReloadingType_Case
                return item.caliber ? getShortCaliberName(item.caliber, caliberDisplayNameList).join(", ") : " "
            }
        case "reloadingCollection_Primer":
            {   const item = itemIn as ReloadingType_Primer
                return item.type ? item.type : " "
            }
        case "reloadingCollection_Powder":
            {   const item = itemIn as ReloadingType_Powder
                return item.powderWeight ? `${preferredUnits.powderWeightUnit} ${convertWeightUnitsToPreferredUnit(preferredUnits, "powderWeight", item.powderWeight)}` : ""
            }
    }
}

export function determineCountryCheckboxes(iso:SupportedCountries){
    switch(iso){
        case "ch":
            return checkboxFields_ch
        case "us":
            return checkboxFields_us
        default: 
            return []
    }
}

export function determinePlaceHolderImage(collection: CollectionType){
    if(collection.startsWith("gun")){
        return require("../assets/Placeholder_Guns.png")
    }
    if(collection.startsWith("ammo")){
        return require("../assets/Placeholder_Ammo.png")
    }
    if(collection.startsWith("accessoryCollection_")){
        return require("../assets/Placeholder_Accessories.png")
    }
    if(collection.startsWith("partCollection_")){
        return require("../assets/Placeholder_Parts.png")
    }
    if(collection.startsWith("literatureCollection_")){
        return require("../assets/Placeholder_Literature.png")
    }
    if(collection.startsWith("reloadingCollection_")){
        return require("../assets/Placeholder_Reloading.png")
    }
}

export function determineCountryImage(county: SupportedCountries){
    switch(county){
        case "ch": 
            return require("../assets/switzerland.png")
         case "us": 
            return require("../assets/usa.png")
         case "de": 
            return require("../assets/germany.png")
    }
}
        

export function determineCostLoggerSchema(collection: CollectionType){
    switch(collection){
        case "ammoCollection":
            return schema.costLoggerAmmunition
        case "reloadingCollection_Bullet":
            return schema.costLoggerBullets
        case "reloadingCollection_Case":
            return schema.costLoggerCasings
        case "reloadingCollection_Primer":
            return schema.costLoggerPrimers
        case "reloadingCollection_Powder":
            return schema.costLoggerPowder
    }
}

export function determineCountryPrinters(iso:SupportedCountries){
    switch(iso){
        case "ch":
            return printers_ch
        case "us":
            return printers_us
        default:
            return printers_others
    }
}

export function determineWeightUnitMultiplier(unit:weightUnitNames){
    switch(unit){
        case "gr":
            return 100
        case "oz":
            return 10
        case "lb":
            return 1
        case "mg":
            return 100
        case "g":
            return 100
        case "kg":
            return 1
    }
}