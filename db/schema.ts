import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { colorThemes } from "../lib/colorThemes"

export const gunCollection = sqliteTable('guns', {
    db_id: integer('id').primaryKey().notNull(),
    id: text("uuid").notNull(),
    createdAt: integer("createdAt").notNull(),
    lastModifiedAt: integer("lastModifiedAt"),
    images: text("images", {mode: "json"}),
    tags: text("tags", {mode: "json"}),
    manufacturer: text("manufacturer"),
    model: text('name').notNull(),
    manufacturingDate: text("manufacturinDdate"),
    originCountry: text("originCountry"),
    caliber: text("caliber", {mode: "json"}),
    serial: text("serial"),
    permit: text("permit"),
    acquisitionDate: text("acquisitionDate"),
    paidPrice: text("paidPrice"),
    boughtFrom: text("boughtFrom"),
    marketValue: text("marketValue"),
    shotCount: text("shotCount"),
    lastShotAt: text("lastShotAt"),
    lastCleanedAt: text("lastCleanedAt"),
    cleanInterval: text("cleanInterval", {enum: ["none", "day_1", "day_7", "day_14", "month_1", "month_3", "month_6", "month_9", "year_1", "year_5", "year_10"]}),
    mainColor: text("mainColor"),
    remarks: text("remarks"),
    fullAuto: integer("fullAuto", {mode: "boolean"}).default(false),
    exFullAuto: integer("exFullAuto", {mode: "boolean"}).default(false),
    highCapacityMagazine: integer("highCapacityMagazine", {mode: "boolean"}).default(false),
    short: integer("short", {mode: "boolean"}).default(false),
    launcher: integer("launcher", {mode: "boolean"}).default(false),
    decepticon: integer("decepticon", {mode: "boolean"}).default(false),
    blooptoob: integer("blooptoob", {mode: "boolean"}).default(false),
    grandfather: integer("grandfather", {mode: "boolean"}).default(false),
})

export const ammoCollection = sqliteTable("ammo", {
    db_id: integer('id').primaryKey().notNull(),
    id: text("uuid").notNull(),
    createdAt: integer("createdAt").notNull(),
    lastModifiedAt: integer("lastModifiedAt"),
    images: text("images", {mode: "json"}),
    tags: text("tags", {mode: "json"}),
    manufacturer: text("manufacturer"),
    designation: text("designation").notNull(),
    originCountry: text("originCountry"),
    caliber: text("caliber"),
    bulletType: text("bulletType"),
    bulletWeight: text("bulletWeight"),
    headstamp: text("headstamp"),
    currentStock: text("currentStock"),
    lastTopUpAt: text("lastTopUpAt"),
    criticalStock: text("criticalStock"),
    remarks: text("remarks"),
})

export const opticsCollection = sqliteTable("opticsCollection", {
    db_id: integer("id").primaryKey().notNull(),
    id: text("uuid").notNull(),
    createdAt: integer("createdAt").notNull(),
    lastModifiedAt: integer("lastModifiedAt"),
    images: text("images", {mode: "json"}),
    tags: text("tags", {mode: "json"}),
    manufacturer: text("manufacturer"),
    designation: text("designation").notNull(),
    type: text("type"),
    batteryType: text("batteryType"),
    lastBatteryChangeAt: integer("lastBatteryChangeAt"),
    reticle: text("reticle"),
    magnification: text("magnification"),
    measurement: text("measurement"),
    clicks: integer("clicks"),
    acquisitionDate: text("acquisitionDate"),
    paidPrice: text("paidPrice"),
    boughtFrom: text("boughtFrom"),
    marketValue: text("marketValue"),
    currentlyMountedOn: text("gun_id").references(()=>gunCollection.id),
    remarks: text("remarks"),
})

export const magazineCollection = sqliteTable("magazineCollection", {
    db_id: integer("id").primaryKey().notNull(),
    id: text("uuid").notNull(),
    createdAt: integer("createdAt").notNull(),
    lastModifiedAt: integer("lastModifiedAt"),
    images: text("images", {mode: "json"}),
    tags: text("tags", {mode: "json"}),
    manufacturer: text("manufacturer"),
    designation: text("designation").notNull(),
    platform: text("platform"),
    caliber: text("caliber"),
    capacity: integer("capacity"),
    material: text("material"),
    type: text("type"),
    stock: integer("stock"),
    acquisitionDate: text("acquisitionDate"),
    paidPrice: text("paidPrice"),
    boughtFrom: text("boughtFrom"),
    marketValue: text("marketValue"),
    remarks: text("remarks"),
})

export const accMiscCollection = sqliteTable("accMiscCollection", {
    db_id: integer("id").primaryKey().notNull(),
    id: text("uuid").notNull(),
    createdAt: integer("createdAt").notNull(),
    lastModifiedAt: integer("lastModifiedAt"),
    images: text("images", {mode: "json"}),
    tags: text("tags", {mode: "json"}),
    manufacturer: text("manufacturer"),
    designation: text("designation").notNull(),
    stock: integer("stock"),
    acquisitionDate: text("acquisitionDate"),
    paidPrice: text("paidPrice"),
    boughtFrom: text("boughtFrom"),
    marketValue: text("marketValue"),
    remarks: text("remarks"),
})

export const silencerCollection = sqliteTable("silencerCollection", {
    db_id: integer("id").primaryKey().notNull(),
    id: text("uuid").notNull(),
    createdAt: integer("createdAt").notNull(),
    lastModifiedAt: integer("lastModifiedAt"),
    images: text("images", {mode: "json"}),
    tags: text("tags", {mode: "json"}),
    manufacturer: text("manufacturer"),
    designation: text("designation").notNull(),
    mountingType: text("mountingType"),
    caliber: text("caliber", {mode: "json"}),
    decibel: text("decibel"),
    acquisitionDate: text("acquisitionDate"),
    paidPrice: text("paidPrice"),
    boughtFrom: text("boughtFrom"),
    marketValue: text("marketValue"),
    currentlyMountedOn: text("gun_id").references(()=>gunCollection.id),
    remarks: text("remarks"),
})

export const gunTags = sqliteTable("gunTags", {
    db_id: integer('id').primaryKey().notNull(),
    label: text("label").notNull().unique("gunTag_label"),
    color: text("color"),
    active: integer("active", {mode: "boolean"}).default(true),
})

export const ammoTags = sqliteTable("ammoTags", {
    db_id: integer('id').primaryKey().notNull(),
    label: text("label").notNull().unique("ammoTag_label"),
    color: text("color"),
    active: integer("active", {mode: "boolean"}).default(true),
})

export const opticsTags = sqliteTable("opticsTags", {
    db_id: integer('id').primaryKey().notNull(),
    label: text("label").notNull().unique("opticsTag_label"),
    color: text("color"),
    active: integer("active", {mode: "boolean"}).default(true),
})

export const magazineTags = sqliteTable("magazineTags", {
    db_id: integer('id').primaryKey().notNull(),
    label: text("label").notNull().unique("magazineTag_label"),
    color: text("color"),
    active: integer("active", {mode: "boolean"}).default(true),
})

export const accMiscTags = sqliteTable("accMiscTags", {
    db_id: integer('id').primaryKey().notNull(),
    label: text("label").notNull().unique("accMiscTag_label"),
    color: text("color"),
    active: integer("active", {mode: "boolean"}).default(true),
})


export const silencerTags = sqliteTable("silencerTags", {
    db_id: integer('id').primaryKey().notNull(),
    label: text("label").notNull().unique("silencerTag_label"),
    color: text("color"),
    active: integer("active", {mode: "boolean"}).default(true),
})

export const gunReminders = sqliteTable("gunReminder",{
    db_id: integer('id').primaryKey().notNull(),
    id: text("uuid").notNull(),
    label: text("label").notNull(),
    gun_id: text('gun_id').references(() => gunCollection.id),
})

export const settings = sqliteTable("settings", {
    db_id: integer('id').primaryKey().notNull(),
    generalSettings_loginGuard: integer("generalSettings_loginGuard", {mode: "boolean"}).default(false),
    generalSettings_hideEmptyFields: integer("generalSettings_hideEmptyFields", {mode: "boolean"}).default(false),
    generalSettings_resizeImages: integer("generalSettings_resizeImages", {mode: "boolean"}).default(true),
    generalSettings_caliberDisplayName: integer("generalSettings_caliberDisplayName", {mode: "boolean"}).default(false),
    language: text("language").default("de"),
    theme: text("theme", {mode: "json"}).default({theme: {name: "default", colors: colorThemes.default}}),
    sortBy_Guns: text("sortBy_Guns").default("alphabetical"),
    sortBy_Ammo: text("sortBy_Ammo").default("alphabetical"),
    sortBy_Accessory_Optic: text("sortBy_Accessory_Optic").default("alphabetical"),
    sortBy_Accessory_Silencer: text("sortBy_Accessory_Silencer").default("alphabetical"),
    sortBy_Accessory_Magazine: text("sortBy_Accessory_Magazine").default("alphabetical"),
    sortBy_Accessory_Misc: text("sortBy_Accessory_Misc").default("alphabetical"),
    sortOrder_Guns: text("sortOrder_Guns", {enum: ["asc", "desc"]}).default("asc"),
    sortOrder_Ammo: text("sortOrder_Ammo", {enum: ["asc", "desc"]}).default("asc"),
    sortOrder_Accessory_Optic: text("sortOrder_Accessory_Optic", {enum: ["asc", "desc"]}).default("asc"),
    sortOrder_Accessory_Silencer: text("sortOrder_Accessory_Silencer", {enum: ["asc", "desc"]}).default("asc"),
    sortOrder_Accessory_Magazine: text("sortOrder_Accessory_Magazine", {enum: ["asc", "desc"]}).default("asc"),
    sortOrder_Accessory_Misc: text("sortOrder_Accessory_Misc", {enum: ["asc", "desc"]}).default("asc"),
    displayMode_Guns: text("displayMode_Guns",{enum: ["grid", "list", "compactList"]}).default("grid"),
    displayMode_Ammo: text("displayMode_Ammo",{enum: ["grid", "list", "compactList"]}).default("grid"),
    displayMode_Accessory_Optic: text("displayMode_Accessory_Optic",{enum: ["grid", "list", "compactList"]}).default("grid"),
    displayMode_Accessory_Silencer: text("displayMode_Accessory_Silencer",{enum: ["grid", "list", "compactList"]}).default("grid"),
    displayMode_Accessory_Magazine: text("displayMode_Accessory_Magazine",{enum: ["grid", "list", "compactList"]}).default("grid"),
    displayMode_Accessory_Misc: text("displayMode_Accessory_Misc",{enum: ["grid", "list", "compactList"]}).default("grid"),
})