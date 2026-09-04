import { SimpleTranslation } from "lib/textTemplates";

export type DataTemplateTranslation = {name: string} & SimpleTranslation

interface DataTemplateTranslations {
    manufacturer: DataTemplateTranslation
    model: DataTemplateTranslation
    manufacturingDate: DataTemplateTranslation
    originCountry: DataTemplateTranslation
    caliber: DataTemplateTranslation
    serial: DataTemplateTranslation
    permit: DataTemplateTranslation
    acquisitionDate_unix: DataTemplateTranslation
    paidPrice: DataTemplateTranslation
    boughtFrom: DataTemplateTranslation
    marketValue: DataTemplateTranslation
    shotCount: DataTemplateTranslation
    lastShotAt_unix: DataTemplateTranslation
    lastCleanedAt_unix: DataTemplateTranslation
    cleanInterval: DataTemplateTranslation
    cleanInterval_CustomTime: DataTemplateTranslation
    cleanInterval_ShotCount: DataTemplateTranslation
    cleanIntervalDisplay: DataTemplateTranslation
    mainColor: DataTemplateTranslation
    language: DataTemplateTranslation
    title: DataTemplateTranslation
    subtitle: DataTemplateTranslation
    isbn: DataTemplateTranslation
    publishingDate: DataTemplateTranslation
    author: DataTemplateTranslation
    publisher: DataTemplateTranslation
    edition: DataTemplateTranslation
    series: DataTemplateTranslation
    volume: DataTemplateTranslation
    pages: DataTemplateTranslation
    format: DataTemplateTranslation
    lumen: DataTemplateTranslation
    candela: DataTemplateTranslation
    wavelength: DataTemplateTranslation
    laserPower: DataTemplateTranslation
    batteryLastChangedAt_unix: DataTemplateTranslation
    currentlyMountedOn: DataTemplateTranslation
    capacity: DataTemplateTranslation
    currentStock: DataTemplateTranslation
    material: DataTemplateTranslation
    platform: DataTemplateTranslation
    reticle: DataTemplateTranslation
    reticleColor: DataTemplateTranslation
    zoom: DataTemplateTranslation
    unit: DataTemplateTranslation
    clicksToUnitElevation: DataTemplateTranslation
    clicksToUnitWindage: DataTemplateTranslation
    thread: DataTemplateTranslation
    decibelRating: DataTemplateTranslation
    designation: DataTemplateTranslation
    headstamp: DataTemplateTranslation
    lastTopUpAt_unix: DataTemplateTranslation
    criticalStock: DataTemplateTranslation
    barrelLength: DataTemplateTranslation
    bulletType: DataTemplateTranslation
    bulletWeight: DataTemplateTranslation
    footprint: DataTemplateTranslation
    customInventoryDesignation: DataTemplateTranslation
    qrCode: DataTemplateTranslation
    dieSeries: DataTemplateTranslation
    group: DataTemplateTranslation
    partNumber: DataTemplateTranslation
    shellHolder: DataTemplateTranslation
    ballisticCoefficient: DataTemplateTranslation
    primer: DataTemplateTranslation
    caseLength: DataTemplateTranslation
    type: DataTemplateTranslation
    texture: DataTemplateTranslation
    application: DataTemplateTranslation
    powderWeight: DataTemplateTranslation
    criticalPowderWeight: DataTemplateTranslation
    batteryType: DataTemplateTranslation
    glassDimensions: DataTemplateTranslation
    focalPlane: DataTemplateTranslation
    de_wbkColor: DataTemplateTranslation
    de_wbkNumber: DataTemplateTranslation
    de_wbkRunningNumber: DataTemplateTranslation
    de_nwrId: DataTemplateTranslation
}

interface DataTemplateTranslationRemarks {
    remarks: DataTemplateTranslation
}

interface DataTemplateTranslationCheckboxes {
    fullAuto: DataTemplateTranslation
    exFullAuto: DataTemplateTranslation
    highCapacityMagazine: DataTemplateTranslation
    short: DataTemplateTranslation
    launcher: DataTemplateTranslation
    decepticon: DataTemplateTranslation
    blooptoob: DataTemplateTranslation
    grandfather: DataTemplateTranslation
    pistol: DataTemplateTranslation
    rifle: DataTemplateTranslation
    shotgun: DataTemplateTranslation
    sbr: DataTemplateTranslation
    sbs: DataTemplateTranslation
    aow: DataTemplateTranslation
    machineGun: DataTemplateTranslation
    dd: DataTemplateTranslation
    pmf: DataTemplateTranslation
    cr: DataTemplateTranslation
    nfa: DataTemplateTranslation
    antique: DataTemplateTranslation
}

interface DataTemplateTranslationSell {
    sold_buyerName: DataTemplateTranslation
    sold_sellPrice: DataTemplateTranslation
    sold_buyerPermit: DataTemplateTranslation
    sold_sellDate_unix: DataTemplateTranslation
    sold_remarks: DataTemplateTranslation
}

interface DataTemplateTranslationsSoldIsSold {
    sold_isSold: DataTemplateTranslation
}

interface DataTemplateTranslationsInternalKeys {
    tags: DataTemplateTranslation
    images: DataTemplateTranslation
}


export const dataTemplate_Translations: DataTemplateTranslations = {
    "manufacturer": {
        name: "manufacturer",
        de: "Hersteller",
        en: "Manufacturer",
        fr: "Fabricant",
        it: "Produttore",
        ch: "Producent",
    },
    "model" : {
        name: "model",
        de: "Modellbezeichnung",
        en: "Model Name",
        fr: "Désignation du modèle",
        it: "Nome del modello",
        ch: "Designaziun dal model",
    },
    "manufacturingDate": {
        name: "manufacturingDate",
        de: "Herstellungszeitraum",
        en: "Manufacturing Date",
        fr: "Période de fabrication",
        it: "Periodo di produzione",
        ch: "Perioda da producziun",
        
    },
    "originCountry": {
        name: "originCountry",
        de: "Ursprungsland",    
        en: "Origin Country",
        fr: "Pays d'origine",
        it: "Paese di origine",
        ch: "Pajais d'origin",
    },
    "caliber": {
        name: "caliber",
        de: "Kaliber",
        en: "Caliber",
        fr: "Calibre",
        it: "Calibro",
        ch: "Caliber",
    },
    "serial": {   
        name: "serial",
        de: "Seriennummer",
        en: "Serial",
        fr: "Numéro de série",
        it: "Numero di serie",
        ch: "Numer da seria",
    },
    "permit": {
        name: "permit",
        de: "Bewilligung",
        en: "Permit",
        fr: "Permis",
        it: "Permesso",
        ch: "Concessiun",
    },
    "acquisitionDate_unix": {
        name: "acquisitionDate_unix",
        de: "Erwerbsdatum",     
        en: "Acquision Date",
        fr: "Date d'acquisition",
        it: "Data di acquisizione",
        ch: "Data d'acquist",
    },
    "paidPrice": {
        name: "paidPrice",
        de: "Kaufpreis",     
        en: "Price",
        fr: "Prix d'achat",
        it: "Prezzo",
        ch: "Pretsch da cumpra",
    },
    "boughtFrom": {
        name: "boughtFrom",
        de: "Gekauft bei/von",     
        en: "Acquired from",
        fr: "Acquis auprès de/par",
        it: "Acquistati presso/da",
        ch: "Acquistà tar/da",
    },
    "marketValue": {
        name: "marketValue",
        de: "Aktueller Marktwert",
        en: "Current market value",
        fr: "Valeur de marché actuelle",
        it: "Valore di mercato attuale",
        ch: "Valur actuala dal martgà"
    },
    "shotCount": {
        name: "shotCount",
        de: "Schussbelastung",
        en: "Shot count",
        fr: "Compte de tirs",
        it: "Numero di colpi sparati",
        ch: "Chargia da tir",
    },
    "lastShotAt_unix": {
        name: "lastShotAt_unix",
        de: "Zuletzt geschossen",
        en: "Last shot",
        fr: "Derniers tirs",
        it: "Ultimo colpo",
        ch: "L'ultim culp",
    },
    "lastCleanedAt_unix": {
        name: "lastCleanedAt_unix",
        de: "Zuletzt gereinigt",
        en: "Last cleaned",
        fr: "Nettoyé en dernier",
        it: "Ultima pulizia",
        ch: "Il davos purifitgà",
    },
    "cleanInterval": {
        name: "cleanInterval",
        de: "cleanInterval",
        en: "cleanInterval",
        fr: "cleanInterval",
        it: "cleanInterval",
        ch: "cleanInterval",
    },
    "cleanInterval_CustomTime": {
        name: "cleanInterval_CustomTime",
        de: "cleanInterval_CustomTime",
        en: "cleanInterval_CustomTime",
        fr: "cleanInterval_CustomTime",
        it: "cleanInterval_CustomTime",
        ch: "cleanInterval_CustomTime",
    },
    "cleanInterval_ShotCount": {
        name: "cleanInterval_ShotCount",
        de: "cleanInterval_ShotCount",
        en: "cleanInterval_ShotCount",
        fr: "cleanInterval_ShotCount",
        it: "cleanInterval_ShotCount",
        ch: "cleanInterval_ShotCount",
    },
    "cleanIntervalDisplay": {
        name: "cleanIntervalDisplay",
        de: "Reinigungsintervall",
        en: "Cleaning interval",
        fr: "Intervalle de nettoyage",
        it: "Intervallo di pulizia",
        ch: "Interval da nettegiar",
    },
    "mainColor": {
        name: "mainColor",
        de: "Hauptfarbe",
        en: "Main Color",
        fr: "Couleur principale",
        it: "Colore principale",
        ch: "Da colur principala",
    },
    "language": {
        name: "language",
        de: "Sprache",
        en: "Language",
        fr: "Langue",
        it: "Lingua",
        ch: "Favella",
    },
    "title": {
        name: "title",
        de: "Titel",
        en: "Title",
        fr: "Titre",
        it: "Titolo",
        ch: "Titel",
    }, 
    "subtitle": {
        name: "subtitle",
        de: "Untertitel",
        en: "Subtitle",
        fr: "Sous-titre",
        it: "Sottotitolo",
        ch: "Sutittel",
    },
    "isbn": {
        name: "isbn",
        de: "ISBN",
        en: "ISBN",
        fr: "ISBN",
        it: "ISBN",
        ch: "ISBN",
    },
    "publishingDate": {
        name: "publishingDate",
        de: "Publikationsdatum",
        en: "Publishing Date",
        fr: "Date de publication",
        it: "Data di pubblicazione",
        ch: "Data da publicaziun",
    },
    "author": {
        name: "author",
        de: "Author",
        en: "Author",
        fr: "Auteur",
        it: "Autore",
        ch: "Autura",
    },
    "publisher": {
        name: "publisher",
        de: "Verlag/Herausgeber",
        en: "Publisher",
        fr: "Éditeur",
        it: "Editore",
        ch: "Editur",
    },
    "edition": {
        name: "edition",
        de: "Auflage",
        en: "Edition",
        fr: "Édition",
        it: "Edizione",
        ch: "Emissiun",
    },
    "series": {
        name: "series",
        de: "Buchreihe",
        en: "Book Series",
        fr: "Collection",
        it: "Collana",
        ch: "Seria",
    },
    "volume": {
        name: "volume",
        de: "Band",
        en: "Volume",
        fr: "Volume",
        it: "Volume",
        ch: "Cudesch",
    },
    "pages": {
        name: "pages",
        de: "Seiten",
        en: "Pages",
        fr: "Pages",
        it: "Pagine",
        ch: "Paginas",
    },
    "format": {
        name: "format",
        de: "Format",
        en: "Format",
        fr: "Format",
        it: "Formato",
        ch: "Format ",
    },
    "lumen":{   
        name: "lumen",
        de: "Lumen",
        en: "Lumen",
        fr: "Lumen",
        it: "Lumen",
        ch: "Lumen",
    },
    "candela":{   
        name: "candela",
        de: "Candela",
        en: "Candela",
        fr: "Candela",
        it: "Candela",
        ch: "Candela",
    },
    "wavelength":{   
        name: "wavelength",
        de: "Wellenlänge Laser",
        en: "Laser Wavelength",
        fr: "Longueur d’onde du laser",
        it: "Lunghezza d’onda del laser",
        ch: "Laser lung d’undada",
    },
    "laserPower":{   
        name: "laserPower",
        de: "Laserstärke",
        en: "Laser Power",
        fr: "Puissance du laser",
        it: "Intensità del laser",
        ch: "Grossezza da laser",
    },
    "batteryLastChangedAt_unix":{
        name: "batteryLastChangedAt_unix",
        de: "Letzter Batteriewechsel",     
        en: "Last Battery Change",
        fr: "Dernier changement de batterie",
        it: "Ultimo cambio di batteria",
        ch: "Ultima midada da battaria",    
    },
    "currentlyMountedOn":{
        name: "currentlyMountedOn",
        de: "Montiert auf",
        en: "Mounted on",
        fr: "Morere sur",
        it: "Montare sole",
        ch: "Va montaschier sur",
    },
    "capacity": {
        name: "capacity",
        de: "Kapazität",
        en: "Capacity",
        fr: "Capacité",
        it: "Capacità",
        ch: "Capacitad ",
    },
    "currentStock": {
        name: "currentStock",
        de: "Aktuelle Menge",
        en: "Current stock",
        fr: "Montant actuel",
        it: "Quantità attuale",
        ch: "Quantitad actuala",
    },
    "reticle": {   
        name: "reticle",
        de: "Absehen",
        en: "Reticle",
        fr: "Réticule",
        it: "Reticolo",
        ch: "Griglia",
    },
    "reticleColor": {   
        name: "reticleColor",
        de: "Absehen Farbe",
        en: "Reticle Color",
        fr: "Couleur du réticule",
        it: "Colore reticolo",
        ch: "Colur da rudella en retagl",
    },
    "zoom": {   
        name: "zoom",
        de: "Vergrösserung",
        en: "Zoom",
        fr: "Agrandissement",
        it: "Ingrandimento",
        ch: "Augment",
    },
    "unit": {   
        name: "unit",
        de: "Verstelleinheit",
        en: "Click Unit",
        fr: "Unité de réglage",
        it: "Unità di regolazione",
        ch: "Sistem da regulaziun",
    },
    "clicksToUnitElevation": {   
        name: "clicksToUnitElevation",
        de: "Höhenverstellung pro Klick",
        en: "Elevation Adjustment per Click",
        fr: "ajustement de l’élévation par clic",
        it: "Rajustement de l’élévation par clic",
        ch: "Regulaziun da l’autezza per clic",
    },
    "clicksToUnitWindage": {   
        name: "clicksToUnitWindage",
        de: "Seitenverstellung pro Klick",
        en: "Windage Adjustment per Click",
        fr: "Ajustement de la dérive par clic",
        it: "Regolazione della deriva per clic",
        ch: "Regulaziun da la direcziun dal vent per in clic",
    },
    "material": {
        name: "material",
        de: "Material",
        en: "Material",
        fr: "La Materiala",
        it: "Il Materiale",
        ch: "Va Materiala",
    },
    "thread": {
        name: "thread",
        de: "Gewinde",
        en: "Threading",
        fr: "Filet",
        it: "Filetto",
        ch: "Crennà",
    },
    "decibelRating": {
        name: "decibelRating",
        de: "Dezibelwert",
        en: "Decibel Rating",
        fr: "Décibels",
        it: "Valore in decibel",
        ch: "Valur decibla",
    },
    "platform": {
        name: "platform",
        de: "Waffenplattform",
        en: "Gun Platform",
        fr: "Plateforme d’armes",
        it: "Piattaforma d’armi",
        ch: "Plattafurma d’armas",
    },
    "headstamp": {
        name: "headstamp",
        de: "Hülsenboden",
        en: "Headstamp",
        fr: "Cachet",
        it: "Punzonatura",
        ch: "Palantschieu sura",
    },
    "criticalStock": {
        name: "criticalStock",
        de: "Kritische Menge",
        en: "Critical stock",
        fr: "Quantité critique",
        it: "Scorta critica",
        ch: "Quantitad critica",
    },
    "designation": {   
        name: "designation",
        de: "Bezeichnung",
        en: "Designation",
        fr: "Désignation",
        it: "Denominazione",
        ch: "Designaziun",
    },
    "lastTopUpAt_unix": {
        name: "lastTopUpAt_unix",
        de: "Letzte Mengenänderung",
        en: "Last change of stock",
        fr: "Dernier changement de quantité",
        it: "Ultima variazione di quantità",
        ch: "Ultima midada da la quantitad",
    },
    "barrelLength": {
        name: "barrelLength",
        de: "Lauflänge",
        en: "Barrel length",
        fr: "Longueur du canon",
        it: "Lunghezza della canna",
        ch: "Lunghezza da la channa",
    },
    "bulletType":{
        name: "bulletType",
        de: "Geschosstyp",
        en: "Bullet type",
        fr: "Type de balle",
        it: "Tipo di proiettile",
        ch: "Tip da culla",
    },
    "bulletWeight":{
        name: "bulletWeight",
        de: "Geschossgewicht",
        en: "Bullet weight",
        fr: "Poids de la balle",
        it: "Peso del proiettile",
        ch: "Pais dal projectil",
    },
    "footprint":{
        name: "footprint",
        de: "Footprint",
        en: "Footprint",
        fr: "Empreinte",
        it: "Impronta",
        ch: "Impronta",
    },
    "customInventoryDesignation": {
        name: "customInventoryDesignation",
        de: "Eigene Inventarbezeichnung",
        en: "Custom Inventory Identifier",
        fr: "Désignation d’inventaire personnalisée",
        it: "Designazione inventariale personalizzata",
        ch: "Designaziun d’inventari persunalisada"
    },
    "qrCode": {
        name: "qrCode",
        de: "QR-Code",
        en: "QR-Code",
        fr: "QR-Code",
        it: "QR-Code", 
        ch: "QR-Code"
    },
    "dieSeries":{
        name: "dieSeries",
        de: "Edition",
        en: "Series",
        fr: "Série",
        it: "Serie",
        ch: "Seria",
    },
    "group":{
        name: "group",
        de: "Gruppe",
        en: "Group",
        fr: "Groupe",
        it: "Gruppo", 
        ch: "Gruppa"
    },
    "partNumber": {
        name: "partNumber",
        de: "Teilenummer",
        en: "Part Number",
        fr: "Référence",
        it: "Numero di parte", 
        ch: "Numer da part"
    },
    "shellHolder": {
        name: "shellHolder",
        de: "Hülsenhalter",
        en: "Shell Holder",
        fr: "Griffe de maintien d'étui",
        it: "Porta bossolo", 
        ch: "Tegnider da cartutsch"
    },
    "ballisticCoefficient": {
        name: "ballisticCoefficient",
        de: "Ballistik-Koeffizient",
        en: "Ballistic Coefficient",
        fr: "Coefficient Balistique",
        it: "Coefficiente Balistico",
        ch: "Boeffizient Ballistic"
    },
    "primer": {
        name: "primer",
        de: "Zündhütchen",
        en: "Primers",
        fr: "Amorces",
        it: "Capsule",
        ch: "Chamona d'envidar", 
    },
    "caseLength": {
        name: "caseLength",
        de: "OAL (Patronengesamtlänge)",
        en: "OAL (Overall Cartridge Length)",
        fr: "OAL (Longueur totale de la cartouche)",
        it: "OAL (Lunghezza totale della cartuccia)",
        ch: "OAL (Lunghezza totala da la cartuscha)",
    },
    "type": {
        name: "type",
        de: "Art",
        en: "Type",
        fr: "Type",
        it: "Tipo",
        ch: "Tip"
    },
    "powderWeight": { // behaves like current stock, thus the translations for it
        name: "powderWeight",
        de: "Aktuelle Menge",
        en: "Current stock",
        fr: "Montant actuel",
        it: "Quantità attuale",
        ch: "Quantitad actuala",
    },
    "criticalPowderWeight": { // behaves like critical stock, thus the translations for it
        name: "criticalPowderWeight",
        de: "Kritische Menge",
        en: "Critical stock",
        fr: "Quantité critique",
        it: "Scorta critica",
        ch: "Quantitad critica",
    },
    "texture": {
        name: "texture",
        de: "Beschaffenheit",
        en: "Texture",
        fr: "Texture",
        it: "Struttura",
        ch: "Textura"
    },
    "application": {
        name: "application",
        de: "Anwendungsbereich",
        en: "Application Scope",
        fr: "Domaine d’application",
        it: "Campo d’impiego",
        ch: "Champ d'applicaziun"
    },
    "batteryType":{
        name: "batteryType",
        de: "Batterietyp",
        en: "Battery Type",
        fr: "Type de pile",
        it: "Tipo di batteria",
        ch: "Tip da batteria"
    },
    "glassDimensions":{
        name: "glassDimensions",
        de: "Fenstergrösse",
        en: "Window Dimension",
        fr: "Dimensions de la fenêtre",
        it: "Dimensioni della finestra",
        ch: "Grondezza da la fanestra"
    },
    "focalPlane":{
        name: "focalPlane",
        de: "Bildebene",
        en: "Focal Plane",
        fr: "Plan focal",
        it: "Piano focale",
        ch: "Plan focal"
    },
    "de_wbkColor":{
        name: "de_wbkColor",
        de: "WBK-Farbe",
        en: "Weapon Possession License Color",
        fr: "Couleur de la carte de possession d’armes",
        it: "Colore della carta di possesso di armi",
        ch: "Culur da la carta da possess d’armas"
    },
    "de_wbkNumber":{
        name: "de_wbkNumber",
        de: "WBK Nummer",
        en: "Weapon Possession License Number",
        fr: "Numéro de la carte de possession d’armes",
        it: "Numero della carta di possesso di armi",
        ch: "Numra da la carta da possess d’armas"
    },
    "de_wbkRunningNumber":{
        name: "de_wbkRunningNumber",
        de: "Laufende Nummer",
        en: "Running Number",
        fr: "Numéro d’ordre",
        it: "Numero progressivo",
        ch: "Numra current"
    },
    "de_nwrId":{
        name: "de_nwrId",
        de: "NWR-ID",
        en: "National Weapons Register ID",
        fr: "ID du Registre national des armes",
        it: "ID del Registro nazionale delle armi",
        ch: "ID dal Register naziunal d’armas"
    },
}

export const dataTemplate_TranslationRemarks: DataTemplateTranslationRemarks = {
    "remarks": {
        name: "remarks",
        de: "Bemerkungen",
        en: "Remarks",
        fr: "Remarques",
        it: "Osservazioni",
        ch: "Remartgar",
    },
}

// These include all checboxes regardless of country; rendering them is done via configs
export const dataTemplate_TranslationCheckboxes: DataTemplateTranslationCheckboxes = {
    "fullAuto": {
        name: "fullAuto",
        de: "Seriefeuerwaffe",
        en: "Automatic firearm", 
        fr: "Arme à feu automatique",
        it: "Arma da fuoco automatica",
        ch: "Arma da fieu a seria",
    },
    "exFullAuto": {
        name: "exFullAuto",
        de: "Umgebaute Seriefeuerwaffe",
        en: "Converted automatic firearm", 
        fr: "Arme à feu automatique transformée",
        it: "Arma da fuoco automatica convertita",
        ch: "Arma da fieu a seria transfurmada",
    },
    "highCapacityMagazine": {
        name: "highCapacityMagazine",
        de: "Ladevorrichtung mit hoher Kapazität",
        en: "High Capacity Magazine", 
        fr: "Chargeur de grande capacité",
        it: "Caricatore ad alta capacità",
        ch: "Indriz da chargiar da gronda capacitad",
    },
    "short": {
        name: "short",
        de: "Kürzbar auf unter 60cm",
        en: "Can be shortened to under 60cm", 
        fr: "Peut être raccourci à moins de 60cm",
        it: "Può essere accorciato a meno di 60cm",
        ch: "Per pauc sin main che 60cm",
    },
    "launcher": {
        name: "launcher",
        de: "Militärisches Abschussgerät mit Sprengwirkung",
        en: "Military launching device with explosive effect",
        fr: "Lanceur militaire à effet explosif",
        it: "Ordigni militari con effetto dirompente",
        ch: "Apparats militars cun effect explosiv",
    },
    "decepticon": {
        name: "decepticon",
        de: "Gebrauchsgegenstand vortäuschend",
        en: "Resembling article of everyday use",
        fr: "Imitant un objet d’usage courant",
        it: "Simulano oggetti d’uso corrente",
        ch: "Imitaziun d’in object da diever",
    },
    "blooptoob": {
        name: "blooptoob",
        de: "Granatwerfer als Zusatz zu einer Feuerwaffe",
        en: "Grenade launcher as additional device for a firearm",
        fr: "Lance-grenades d’appoint à une arme à feu",
        it: "Lanciagranate supplementare di un’arma da fuoco",
        ch: "Bittagranatas supplementaras d’ina arma da fieu",
    },
    "grandfather": {
        name: "grandfather",
        de: "Altrechtlich erworben",
        en: "Acquired under old law", 
        fr: "Acquis sous l'ancien régime",
        it: "Acquisito in base alla vecchia legge",
        ch: "Acquistà tenor il dretg vegl",
    },
    "pistol":{
        name: "pistol",
        de: "Pistole",
        en: "Pistol",
        fr: "Pistolet",
        it: "Pistola",
        ch: "Pistola",
    },
    "rifle":{
        name: "rifle",
        de: "Gewehr",
        en: "Rifle",
        fr: "Fusil",
        it: "Fucile",
        ch: "Fusil",
    },
    "shotgun":{
        name: "shotgun",
        de: "Flinte",
        en: "Shotgun",
        fr: "Fusil à canon lisse",
        it: "Fucile a canna liscia",
        ch: "Flinta",
    },
    "sbr":{
        name: "sbr",
        de: "Gewehr mit kurzem Lauf",
        en: "Short-Barreled Rifle",
        fr: "Fusil à canon court",
        it: "Fucile a canna corta",
        ch: "Fusil cun chanun curt",
    },
    "sbs":{
        name: "sbs",
        de: "Flinte mit kurzem Lauf",
        en: "Short-Barreled",
        fr: "Fusil à canon court (lisse)",
        it: "Fucile a canna corta (liscia)",
        ch: "Flinta cun chanun curt",
    },
    "aow":{
        name: "aow",
        de: "Sonstige Waffe",
        en: "Any Other Weapon",
        fr: "Autre arme",
        it: "Altra arma",
        ch: "Autra arma",
    },
    "machineGun":{
        name: "machineGun",
        de: "Maschinengewehr",
        en: "Machine Gun",
        fr: "Mitrailleuse",
        it: "Mitragliatrice",
        ch: "Mitragliusa",
    },
    "dd":{
        name: "dd",
        de: "Zerstörungswaffe",
        en: "Destructive Device",
        fr: "Engin destructeur",
        it: "Dispositivo distruttivo",
        ch: "Apparat destructiv",
    },
    "pmf":{
        name: "pmf",
        de: "Privat hergestellte Schusswaffe",
        en: "Privately Made Firearm",
        fr: "Arme à feu fabriquée à titre privé",
        it: "Arma da fuoco di fabbricazione privata",
        ch: "Arma da fieu fabritgada privatamain",
    },
    "cr":{
        name: "cr",
        de: "Kuriosität & Relikt",
        en: "Curio & Relic",
        fr: "Curiosité et relique",
        it: "Curiosità e reliquia",
        ch: "Curiositad e relict",
    },
    "nfa":{
        name: "nfa",
        de: "NFA-Artikel",
        en: "NFA Item",
        fr: "Article NFA",
        it: "Articolo NFA",
        ch: "Artitgel NFA",
    },
    "antique":{
        name: "antique",
        de: "Antike Waffe",
        en: "Antique",
        fr: "Arme antique",
        it: "Arma antica",
        ch: "Arma antica",
    },
}

export const dataTemplate_TranslationSoldisSold: DataTemplateTranslationsSoldIsSold = {
    "sold_isSold": {
        name: "sold_isSold",
        de: "sold_isSold",
        en: "sold_isSold", 
        fr: "sold_isSold",
        it: "sold_isSold",
        ch: "sold_isSold",
    },
}

export const dataTemplate_TranslationSoldTranslations: DataTemplateTranslationSell = {
    "sold_buyerName": {
        name: "sold_buyerName",
        de: "Käufer",
        en: "Buyer", 
        fr: "Acheteur",
        it: "Acquirente",
        ch: "Cumprador",
    },
    "sold_sellPrice": {
        name: "sold_sellPrice",
        de: "Verkaufspreis",
        en: "Sell price", 
        fr: "Prix de vente",
        it: "Prezzo di vendita",
        ch: "Pretsch da vendita",
    },
    "sold_buyerPermit": {
        name: "sold_buyerPermit",
        de: "Bewilligung Käufer",
        en: "Permit buyer", 
        fr: "Autorisation acheteur",
        it: "Autorizzazione acquirente",
        ch: "Permissiun cumprador",
    },
    "sold_sellDate_unix": {
        name: "sold_sellDate_unix",
        de: "Verkaufsdatum",
        en: "Sell date", 
        fr: "Date de vente",
        it: "Data di vendita",
        ch: "Data da vendita",
    },
    "sold_remarks": {
        name: "sold_remarks",
        de: "Bemerkungen",
        en: "Remarks",
        fr: "Remarques",
        it: "Osservazioni",
        ch: "Remartgar",
    },
}

export const dataTemplate_TranslationInternalKeys: DataTemplateTranslationsInternalKeys = {
    "images": {
        name: "images",
        de: "Bilder",
        en: "Images", 
        fr: "Images",
        it: "Immagini",
        ch: "Maletgs",
    },
    "tags": {
        name: "tags",
        de: "Schlagworte",
        en: "Tags", 
        fr: "Mots-clés",
        it: "Tags",
        ch: "Tags",
    }
}

export const dataTemplate_Translations_Unified: DataTemplateTranslations &  DataTemplateTranslationRemarks & DataTemplateTranslationCheckboxes & DataTemplateTranslationCheckboxes & DataTemplateTranslationSell = {
    ...dataTemplate_Translations,
    ...dataTemplate_TranslationRemarks,
    ...dataTemplate_TranslationCheckboxes,
    ...dataTemplate_TranslationSoldisSold,
    ...dataTemplate_TranslationSoldTranslations,
    ...dataTemplate_TranslationInternalKeys
}