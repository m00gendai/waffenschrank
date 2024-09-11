import { AmmoType, GunType } from "../interfaces";

export const exampleGun:GunType = {
    "acquisitionDate": "11.6.2024", 
    "caliber": ["9×19mm Parabellum (9mm Luger)"], 
    "createdAt": "2024-06-10T08:17:55.026Z", 
    "id": "c472c7e8-c177-4a42-badf-549e468ed42e", 
    "images": ["file:///data/user/0/host.exp.exponent/files/c45f8da7-a3cc-4798-8e38-ffd39165ca2d.jpeg"], 
    "lastCleanedAt": "18.6.2024",
    "cleanInterval": "day_7",
    "lastModifiedAt": null,
    "lastShotAt": "17.6.2024", 
    "mainColor": "#000000ff", 
    "manufacturer": "SIG", 
    "manufacturingDate": "1975", 
    "model": "P210-6", 
    "originCountry": "Schweiz", 
    "paidPrice": "1500", 
    "boughtFrom": "Treehugger Supply",
    "marketValue": "2500",
    "permit": "WES SH2009-001", 
    "remarks": "Special Edition", 
    "serial": "12345", 
    "shotCount": "110", 
    "status": {
        "exFullAuto": false, 
        "fullAuto": false, 
        "highCapacityMagazine": true, 
        "short": false,
        "launcher": false,
        "decepticon": false,
        "blooptoob": false,
        "grandfather": true
    },
    "tags": ["Pistole"]
}

export const exampleGunEmpty:GunType = {
    "acquisitionDate": "", 
    "caliber": [], 
    "createdAt": "", 
    "id": "", 
    "images": [], 
    "lastCleanedAt": "",
    "cleanInterval": "",
    "lastModifiedAt": null,
    "lastShotAt": "",
    "mainColor": "",
    "manufacturer": "",
    "manufacturingDate": "",
    "model": "",
    "originCountry": "",
    "paidPrice": "",
    "boughtFrom": "",
    "marketValue": "",
    "permit": "",
    "remarks": "",
    "serial": "",
    "shotCount": "", 
    "status": {
        "exFullAuto": false, 
        "fullAuto": false, 
        "highCapacityMagazine": false, 
        "short": false,
        "launcher": false,
        "decepticon": false,
        "blooptoob": false,
        "grandfather": false
    },
    "tags": []
}

export const exampleAmmo:AmmoType = {
    "caliber": "9×19mm Parabellum (9mm Luger)", 
    "createdAt": "2024-06-18T07:20:38.312Z", 
    "criticalStock": "50",
    "currentStock": 19, 
    "designation": "Pist Pat 14", 
    "headstamp": "T 14", 
    "id": "f7624635-3fc4-4af5-8420-fde885bc2da6", 
    "images": ["file:///data/user/0/host.exp.exponent/files/70fc605c-e3d9-4b1d-a277-ceca8ade93b1.jpeg"], 
    "lastModifiedAt":null,
    "lastTopUpAt": "18.6.2024", 
    "manufacturer": "RUAG", 
    "originCountry": "Schweiz", 
    "previousStock": 20, 
    "remarks": "Ordonnanzmunition", 
    "tags": ["Ordonnanz"]
}

export const exampleAmmoEmpty:AmmoType = {
    "caliber": "",
    "createdAt": "",
    "criticalStock": "",
    "currentStock": null,
    "designation": "", 
    "headstamp": "",
    "id": "",
    "images": [],
    "lastModifiedAt":null,
    "lastTopUpAt": "",
    "manufacturer": "",
    "originCountry": "",
    "previousStock": null,
    "remarks": "",
    "tags": []
}