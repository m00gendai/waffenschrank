export interface SimpleTranslation{
    de: string
    en: string
    fr: string
    it: string
    ch: string
}

interface Alert{
    title: SimpleTranslation
    subtitle: SimpleTranslation
    yes: SimpleTranslation
    no: SimpleTranslation
}

interface Validation{
    requiredFieldEmpty: SimpleTranslation
}

interface Toast{
    saved: SimpleTranslation
    changed: SimpleTranslation
    dbSaveSuccess: SimpleTranslation
    dbImportSuccess: SimpleTranslation
    wrongGunDbSelected: SimpleTranslation
    wrongAmmoDbSelected: SimpleTranslation
}


interface PreferenceTitle{
    language: SimpleTranslation
    colors: SimpleTranslation
    db_gun: SimpleTranslation
    saveDb_gun: SimpleTranslation
    importDb_gun: SimpleTranslation
    db_ammo: SimpleTranslation
    saveDb_ammo: SimpleTranslation
    importDb_ammo: SimpleTranslation
    importCSV_ammo: SimpleTranslation
    gunList: SimpleTranslation
    printAllGuns: SimpleTranslation
    printArt5: SimpleTranslation
    printGallery: SimpleTranslation
    ammoList: SimpleTranslation
    printAllAmmo: SimpleTranslation
    generalSettings: SimpleTranslation
    about: SimpleTranslation
    statistics: SimpleTranslation
}

interface DatabaseOperation{
    export: SimpleTranslation
    import: SimpleTranslation
}

interface TabBarLabels{
    gunCollection: SimpleTranslation
    ammoCollection: SimpleTranslation
}

interface AmmoQuickUpdate{
    title: SimpleTranslation
    error: SimpleTranslation
    placeholder: SimpleTranslation
}

interface Tooltips{
    tagFilter: SimpleTranslation
    noGunsAddedYet: SimpleTranslation
    noAmmoAddedYet: SimpleTranslation
}

interface Sorting{
    alphabetic: SimpleTranslation
    lastModified: SimpleTranslation
    lastAdded: SimpleTranslation
    paidPrice: SimpleTranslation
    marketValue: SimpleTranslation
    acquisitionDate: SimpleTranslation
    lastCleaned: SimpleTranslation
    lastShot: SimpleTranslation
}

interface GunQuickShot{
    title: SimpleTranslation
    updateNonStock: SimpleTranslation
    updateNonStockInput: SimpleTranslation
    updateFromStock: SimpleTranslation
    errorNoAmountDefined: SimpleTranslation
    errorAmountTooLow: SimpleTranslation
}

interface TagModal{
    title: SimpleTranslation
    subtitle: SimpleTranslation
    existingTags: SimpleTranslation
    inputTags: SimpleTranslation
    selectedTags: SimpleTranslation
}

interface GeneralSettingsLabels{
    displayImagesInListViewGun: SimpleTranslation
    displayImagesInListViewAmmo: SimpleTranslation
    resizeImages: SimpleTranslation
    loginGuard: SimpleTranslation
    emptyFields: SimpleTranslation
    caliberDisplayName: SimpleTranslation
}

interface ModalText{
    datePicker: ModalTextItems
    colorPicker: ModalTextItems
    caliberPicker: ModalTextItems
    cleanInterval: ModalTextItems
}

interface ModalTextItems{
    title: SimpleTranslation
    text: SimpleTranslation
}

["-", "1 Tag", "7 Tage", "14 Tage", "1 Monat", "3 Monate", "6 Monate", "9 Monate", "1 Jahr", "5 Jahre", "10 Jahre"]

interface CleanIntervals{
    none: SimpleTranslation
    day_1: SimpleTranslation
    day_7: SimpleTranslation
    day_14: SimpleTranslation
    month_1: SimpleTranslation
    month_3: SimpleTranslation
    month_6: SimpleTranslation
    month_9: SimpleTranslation
    year_1: SimpleTranslation
    year_5: SimpleTranslation
    year_10: SimpleTranslation
}

interface CaliberPickerStrings{
    caliberSelection: SimpleTranslation
    tabList: SimpleTranslation
    tabSearch: SimpleTranslation
}

interface aboutThanksPersons{
    michelle: SimpleTranslation
    jonas: SimpleTranslation
    owg: SimpleTranslation
    waffenforum: SimpleTranslation
    others: SimpleTranslation
}

interface LongPressActions{
    clone: SimpleTranslation
    delete: SimpleTranslation
}

interface iosWarning{
    title: SimpleTranslation
    text: SimpleTranslation
    ok: SimpleTranslation
    cancel: SimpleTranslation
}

export const cleanIntervals:CleanIntervals = {
    none: {
        de: "-",
        en: "-",
        fr: "-",
        it: "-",
        ch: "-",
    },
    day_1: {
        de: "1 Tag",
        en: "1 day",
        fr: "1 jour",
        it: "1 giorno",
        ch: "1 di",
    },
    day_7: {
        de: "1 Woche",
        en: "1 week",
        fr: "1 semaine",
        it: "1 settimana",
        ch: "1 emna",
    },
    day_14: {
        de: "2 Wochen",
        en: "2 weeks",
        fr: "2 semaines",
        it: "2 settimane",
        ch: "2 emnas",
    },
    month_1:{
        de: "1 Monat",
        en: "1 month",
        fr: "1 mois",
        it: "1 mese",
        ch: "1 mais",
    },
    month_3: {
        de: "3 Monate",
        en: "3 months",
        fr: "3 mois",
        it: "3 mesi",
        ch: "3 mais",
    },
    month_6: {
        de: "6 Monate",
        en: "6 months",
        fr: "6 mois",
        it: "6 mesi",
        ch: "6 mais",
    },
    month_9: {
        de: "9 Monate",
        en: "9 months",
        fr: "9 mois",
        it: "9 mesi",
        ch: "9 mais",
    },
    year_1: {
        de: "1 Jahr",
        en: "1 year",
        fr: "1 Année",
        it: "1 anno",
        ch: "1 onn",
    },
    year_5: {
        de: "5 Jahre",
        en: "5 years",
        fr: "5 ans",
        it: "5 anni",
        ch: "5 onns",
    },
    year_10: {
        de: "10 Jahre",
        en: "10' years",
        fr: "10 ans",
        it: "10 anni",
        ch: "10 onns",
    },
}

export const editGunTitle:SimpleTranslation = {
    de: "Waffe bearbeiten",
    en: "Edit Gun",
    fr: "Modifier l'arme",
    it: "Modifica arma",
    ch: "Elavurar in'arma",
}

export const newGunTitle:SimpleTranslation = {
    de: "Neue Waffe",
    en: "New Gun",
    fr: "Nouvelle arme",
    it: "Nuova arma",
    ch: "Nova arma",
}

export const editAmmoTitle:SimpleTranslation = {
    de: "Munition bearbeiten",
    en: "Edit Ammunition",
    fr: "Modifier les munitions",
    it: "Modifica munizioni",
    ch: "Elavurar muniziun",
}

export const newAmmoTitle:SimpleTranslation = {
    de: "Neue Munition",
    en: "New Ammunition",
    fr: "Nouvelles munitions",
    it: "Nuove munizioni",
    ch: "Nova muniziun",
}

export const unsavedChangesAlert:Alert = {
    title: {
        de: "Es hat nicht gespeicherte Änderungen",
        en: "Unsaved changes",
        fr: "Il a des modifications non sauvegardées",
        it: "Modifiche non salvate",
        ch: "I n'ha betg midadas accumuladas",
    },
    subtitle: {
        de: "Wirklich zurück?",
        en: "Continue?",
        fr: "vraiment revenir?",
        it: "Davvero tornare?",
        ch: "Propi enavos?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const imageDeleteAlert:Alert = {
    title: {
        de: "Bild wirklich löschen?",
        en: "Delete image?",
        fr: "Supprimer vraiment l'image?",
        it: "Eliminare l'immagine?",
        ch: "Propi stizzar il maletg?",
    },
    subtitle: {
        de: "",
        en: "",
        fr: "",
        it: "",
        ch: "",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const gunDeleteAlert:Alert = {
    title: {
        de: "wirklich löschen?",
        en: "will be deleted",
        fr: "vraiment supprimer?",
        it: "davvero eliminare?",
        ch: "propi stizzar?",
    },
    subtitle: {
        de: "Die Waffe wird unwiderruflich gelöscht. Wirklich fortfahren?",
        en: "The gun will be irrevocably deleted. Really continue?",
        fr: "L'arme sera effacée de manière irréversible. Vraiment continuer?",
        it: "L'arma sarà eliminata in modo irreversibile. Continuare davvero?",
        ch: "L'arma vegn stizzada irrevocablamain. Propi cuntinuar?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const ammoDeleteAlert:Alert = {
    title: {
        de: "wirklich löschen?",
        en: "will be deleted",
        fr: "vraiment supprimer?",
        it: "davvero eliminare?",
        ch: "propi stizzar?",
    },
    subtitle: {
        de: "Die Munition wird unwiderruflich gelöscht. Wirklich fortfahren?",
        en: "The ammunition will be irrevocably deleted. Really continue?",
        fr: "Les munitions sera effacée de manière irréversible. Vraiment continuer?",
        it: "Le munizioni saranno eliminate in modo irreversibile. Continuare davvero?",
        ch: "La muniziun vegn stizzada irrevocablamain. Propi cuntinuar?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const validationFailedAlert:Alert = {
    title: {
        de: "Validierung fehlgeschlagen",
        en: "Validation failed",
        fr: "Echec de la validation",
        it: "Validazione fallita",
        ch: "La validaziun n'è betg reussida",
    },
    subtitle: {
        de: "",
        en: "",
        fr: "",
        it: "",
        ch: "",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "OK",
        en: "OK",
        fr: "OK",
        it: "OK",
        ch: "OK",
    }
}

export const databaseImportAlert:Alert = {
    title: {
        de: "Datenbank importieren und aktuelle überschreiben?",
        en: "Import database and overwrite current?",
        fr: "Importer la base de données et remplacer l'actuelle?",
        it: "Importare il database e sovrascrivere l'attuale?",
        ch: "Importar la banca da datas e transcriver il scriver actual?",
    },
    subtitle: {
        de: "Die aktuelle Datenbank wird unwiderruflich mit der importierten überschrieben. Wirklich fortfahren?",
        en: "The current database will be irrevocally overwritten. Really continue?",
        fr: "La base de données actuelle est irrémédiablement écrasée par celle qui a été importée. Vraiment continuer?",
        it: "Il database attuale sarà sovrascritto in modo irrevocabile. Continuare davvero?",
        ch: "La banca da datas actuala vegn transcritta irrevocablamain cun ils importads. Propi cuntinuar?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const deleteTagFromListAlert:Alert = {
    title: {
        de: "Schlagwort wirklich löschen?",
        en: "Import database and overwrite current?",
        fr: "Importer la base de données et remplacer l'actuelle?",
        it: "Importare il database e sovrascrivere l'attuale?",
        ch: "Importar la banca da datas e transcriver il scriver actual?",
    },
    subtitle: {
        de: "Das Schlagwort wird sowohl aus der Liste wie auch aus dem Eintrag gelöscht",
        en: "The current database will be irrevocally overwritten. Really continue?",
        fr: "La base de données actuelle est irrémédiablement écrasée par celle qui a été importée. Vraiment continuer?",
        it: "Il database attuale sarà sovrascritto in modo irrevocabile. Continuare davvero?",
        ch: "La banca da datas actuala vegn transcritta irrevocablamain cun ils importads. Propi cuntinuar?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const resizeImageAlert:Alert = {
    title: {
        de: "Bildoptimierung wirklich ausschalten?",
        en: "Turn off image optimization?",
        fr: "Désactiver vraiment l'optimisation de l'image ?",
        it: "Si può davvero disattivare l'ottimizzazione delle immagini?",
        ch: "Propi eliminar l'optimaziun dal maletg?",
    },
    subtitle: {
        de: "Bildoptimierung benötigt wesentlich weniger Speicherplatz",
        en: "Image optimization requires considerably less disk space",
        fr: "L'optimisation des images nécessite beaucoup moins d'espace mémoire",
        it: "L'ottimizzazione delle immagini richiede una quantità di memoria notevolmente inferiore",
        ch: "L'optimaziun dal maletg dovra bler pli pauca plazza d'accumulaziun",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
        it: "Sì",
        ch: "Gea",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non",
        it: "No",
        ch: "Na",
    }
}

export const loginGuardAlert:Alert = {
    title: {
        de: "Biometrischer Login nicht möglich",
        en: "Biometric login not possible",
        fr: "Login biométrique impossible",
        it: "Login biometrico non possibile",
        ch: "Login biometric n'è betg pussaivel",
    },
    subtitle: {
        de: "Entweder ist Ihr Gerät nicht kompatibel, oder Sie haben keine biometrischen Daten hinterlegt.",
        en: "Either your device is not compatible or you have not registered any biometric data.",
        fr: "Soit votre appareil n'est pas compatible, soit vous n'avez pas enregistré de données biométriques.",
        it: "O il vostro dispositivo non è compatibile o non avete inserito alcun dato biometrico.",
        ch: "U che Voss apparat n'è betg cumpatibel u che Vus n'avais betg deponì datas biometricas.",
    },
    yes: {
        de: "",
        en: "",
        fr: "",
        it: "",
        ch: "",
    },
    no: {
        de: "OK",
        en: "OK",
        fr: "OK",
        it: "OK",
        ch: "OK",
    }
}


export const validationErros: Validation = {
    requiredFieldEmpty: {
        de: "Feld darf nicht leer sein",
        en: "Field can not be empty",
        fr: "Le champ ne doit pas être vide",
        it: "Il campo non può essere vuoto",
        ch: "Champ na dastga betg esser vid",
    },
}

export const toastMessages:Toast = {
    saved: {
        de: "gespeichert",
        en: "saved",
        fr: "enregistré",
        it: "salvato",
        ch: "accumulà",
    },
    changed: {
        de: "geändert",
        en: "changed",
        fr: "modifié",
        it: "modificato",
        ch: "modifitgà",
    },
    dbSaveSuccess: {
        de: "Datenbank im Downloads-Ordner gespeichert",
        en: "Database stored in the Downloads folder",
        fr: "Base de données enregistrée dans le dossier Téléchargements",
        it: "Banca dati salvata nella cartella Download",
        ch: "Arcunada en l'ordinatur da download",
    },
    dbImportSuccess: {
        de: "Datensätze importiert",
        en: "datasets imported",
        fr: "enregistrements importés",
        it: "dati importati",
        ch: "importà unitads da datas",
    },
    wrongGunDbSelected: {
        de: "Achtung: Sicherstellen, dass eine Waffendatenbank ausgewählt ist (gunDB_17.....)",
        en: "Attention: Make sure that a gun database is selected (gunDB_17.....)",
        fr: "Attention : s'assurer qu'une base de données d'armes est sélectionnée (gunDB_17.....)",
        it: "Attenzione: assicurarsi che sia selezionato un database di armi (gunDB_17.....).",
        ch: "Attenziun: garantir ch'ina banca da datas davart las armas vegnia tschernida (gunDB_17.....)"
    },
    wrongAmmoDbSelected: {
        de: "Achtung: Sicherstellen, dass eine Munitionsdatenbank ausgewählt ist (ammoDB_17.....)",
        en: "Attention: Ensure that an ammunition database is selected (ammoDB_17.....)",
        fr: "Attention : s'assurer qu'une base de données de munitions est sélectionnée (ammoDB_17.....)",
        it: "Attenzione: assicurarsi che sia selezionato un database di munizioni (ammoDB_17.....).",
        ch: "Attenziun: garantir ch'ina banca da datas da muniziun saja tschernida (ammoDB_17.....)"
    },
}

export const preferenceTitles:PreferenceTitle = {
    language: {
        de: "Grüezi wohl!",
        en: "Tally ho!",
        fr: "Enchanté!",
        it: "Ciao!",
        ch: "Allegra!",
    },
    colors: {
        de: "Farbschema",
        en: "Color scheme",
        fr: "Schéma de couleurs",
        it: "Schema di colori",
        ch: "Schema da colur",
    },
    db_gun: {
        de: "Datenbank Waffen",
        en: "Gun Database",
        fr: "Base de données armes",
        it: "Database delle armi",
        ch: "Banca da datas armas",
    },
    saveDb_gun: {
        de: "Speichern",
        en: "Save",
        fr: "Enregistrer",
        it: "Salva",
        ch: "Arcunar",
    },
    importDb_gun: {
        de: "Importieren",
        en: "Import",
        fr: "Importer",
        it: "Importa",
        ch: "Importar",
    },
    db_ammo: {
        de: "Datenbank Munition",
        en: "Ammunition Database",
        fr: "Base de données munitions",
        it: "Database munizioni",
        ch: "Banca da datas muniziun",
    },
    saveDb_ammo: {
        de: "Speichern als Arsenal Datenbank",
        en: "Save",
        fr: "Enregistrer",
        it: "Salva",
        ch: "Arcunar",
    },
    importDb_ammo: {
        de: "Arsenal Datenbank importieren (ammoDB_17...)",
        en: "Import",
        fr: "Importer",
        it: "Importa",
        ch: "Importar",
    },
    importCSV_ammo: {
        de: "Eigene CSV Datenbank importieren",
        en: "",
        fr: "", 
        it: "", 
        ch: "",
    },
    gunList: {
        de: "Waffenverzeichnis",
        en: "List of weapons",
        fr: "Liste des armes",
        it: "Elenco delle armi",
        ch: "Register da las armas",
    },
    printAllGuns: {
        de: "Komplettes Verzeichnis als Tabelle",
        en: "Complete list as a table",
        fr: "Liste complète sous forme de tableau",
        it: "Elenco completo come tabella",
        ch: "Register cumplet sco tabella",
    },
    printArt5:{
        de: "Verzeichnis nach WG Art. 5 als Tabelle",
        en: "List according to WA Art. 5 as table",
        fr: "Liste selon la LArm Art. 5 sous forme de tableau",
        it: "Elenco secondo la LArm Art. 5 come tabella",
        ch: "Register tenor la LArm Art. 5 sco tabella",
    },
    printGallery:{
        de: "Galerie",
        en: "Gallery",
        fr: "Galerie",
        it: "Galleria",
        ch: "Galaria",
    },
    ammoList: {
        de: "Munitionsverzeichnis",
        en: "List of ammunition",
        fr: "Liste des munitions",
        it: "Elenco delle munizioni",
        ch: "Register da muniziun",
    },
    printAllAmmo: {
        de: "Komplettes Verzeichnis als Tabelle",
        en: "Complete list as a table",
        fr: "Liste complète sous forme de tableau",
        it: "Elenco completo come tabella",
        ch: "Register cumplet sco tabella",
    },
    generalSettings:{
        de: "Allgemeine Einstellungen",
        en: "General settings",
        fr: "Paramètres généraux",
        it: "Impostazioni generali",
        ch: "Parameters generals",
    },
    about:{
        de: "Über",
        en: "About",
        fr: "Au sujet de",
        it: "Circa",
        ch: "Davart",
    },
    statistics:{
        de: "Statistiken",
        en: "Statistics",
        fr: "Statistiques",
        it: "Statistiche",
        ch: "Statisticas",
    }
}

export const databaseOperations:DatabaseOperation = {
    export: {
        de: "Datenbank wird gespeichert...",
        en: "Database is being saved...",
        fr: "Base de données en cours d'enregistrement",
        it: "Database in fase di salvataggio...",
        ch: "Banca da datas vegn arcunada",
    },
    import: {
        de: "Datenbank wird importiert...",
        en: "Database is being imported...",
        fr: "Base de données en cours d'importation...",
        it: "Database in fase di importazione...",
        ch: "Banca da datas vegn importada",
    }
}

export const pdfTitle:SimpleTranslation = {
    de: "Waffenverzeichnis",
    en: "List of weapons",
    fr: "Liste des armes",
    it: "Elenco delle armi",
    ch: "Register da las armas",
}

export const pdfTitleAmmo:SimpleTranslation = {
    de: "Munitionsverzeichnis",
    en: "List of ammunition",
    fr: "Liste des munitions",
    it: "Elenco delle munizioni",
    ch: "Register da muniziun",
}

export const pdfTitleArt5:SimpleTranslation = {
    de: "Waffenverzeichnis gemäss Waffengesetz Artikel 5",
    en: "List of weapons according to Weapons Act article 5",
    fr: "Liste des armes conformément à la loi sur les armes, article 5",
    it: "Elenco delle armi ai sensi dell'articolo 5 della Legge sulle armi",
    ch: "Register da las armas tenor la lescha davart las armas Artitgel 5",
}

export const pdfFooter:SimpleTranslation = {
    de: "Generiert mit der Arsenal Mobile App",
    en: "Generated using the Arsenal Mobile App",
    fr: "Généré par l'application mobile d'Arsenal",
    it: "Generato utilizzando l'app mobile Arsenal",
    ch: "Generà cun l'applicaziun mobila per Arsenal",
}

export const tabBarLabels: TabBarLabels = {
    gunCollection: {
        de: "Waffen",
        en: "Weapons",
        fr: "Armes",
        it: "Armi",
        ch: "Armas",
    },
    ammoCollection: {
        de: "Munition",
        en: "Ammunition",
        fr: "Munitions",
        it: "Munizioni",
        ch: "Muniziun",
    }
}

export const newTags:{name:string, de:string, en:string, fr:string, it:string, ch:string} = {
    name: "tags", 
    de: "Schlagworte",
    en: "Tags", 
    fr: "mots-clés",
    it: "tag",
    ch: "Pleds caracteristics",
}

export const ammoQuickUpdate:AmmoQuickUpdate = {
    title: {
        de: "Mit + oder - schnell eine Munitionszunahme oder -abnahme erfassen",
        en: "Use + or - to quickly record an increase or decrease in ammunition volume", 
        fr: "Saisir rapidement une augmentation ou une diminution de la munition avec + ou -.",
        it: "Usa + o - per registrare rapidamente un aumento o una diminuzione del volume delle munizioni",
        ch: "Registrar cun + u - svelt in augment u ina reducziun da la muniziun",
    },
    error: {
        de: "Entweder + oder - muss ausgewählt sein",
        en: "Either + or - must be selected", 
        fr: "Le + ou le - doit être sélectionné",
        it: "Deve essere selezionato + o -",
        ch: "Ubain + u - sto esser selecziunà",
    },
    placeholder: {
        de: "Menge +/-",
        en: "Amount +/-", 
        fr: "Montant +/-",
        it: "Quantità +/-",
        ch: "Quantitad +/-",
    }
}

export const tooltips:Tooltips = {
    tagFilter: {
        de: "Hier kann nach erfassten Schlagworten gefiltert werden",
        en: "Here you can filter by entered tags",
        fr: "Ici, il est possible de filtrer les mots-clés saisis",
        it: "Qui puoi filtrare per tag inseriti",
        ch: "Qua pon ins filtrar tenor pleds registrads",
    },
    noGunsAddedYet: {
        de: "Noch keine Waffen erfasst",
        en: "No guns added yet",
        fr: "Pas encore d'armes enregistrées",
        it: "Non sono ancora state registrate armi",
        ch: "Betg anc registrà armas",
    },
    noAmmoAddedYet: {
        de: "Noch keine Munition erfasst",
        en: "No ammunition added yet",
        fr: "Pas encore de munitions enregistrées",
        it: "Non sono ancora state registrate munizioni",
        ch: "Betg anc registrada ina muniziun",
    },
}

export const sorting:Sorting = {
    alphabetic: {
        de: "Alphabetisch",
        en: "Alphabetical",
        fr: "Alphabétique",
        it: "Alfabetico",
        ch: "Alfabetic",
    },
    lastModified: {
        de: "Zuletzt geändert",
        en: "Last modified",
        fr: "Dernière modification",
        it: "Ultima modifica",
        ch: "L'ultima giada midà",
    },
    lastAdded: {
        de: "Zuletzt hinzugefügt",
        en: "Last added",
        fr: "Dernier ajout",
        it: "Ultimo aggiunto",
        ch: "L'ultima giada agiuntà",
    },
    paidPrice:{
        de: "Kaufpreis",     
        en: "Price",
        fr: "Prix d'achat",
        it: "Prezzo",
        ch: "Pretsch da cumpra",
    },
    marketValue:{
        de: "Aktueller Marktwert",
        en: "Current market value",
        fr: "Valeur de marché actuelle",
        it: "Valore di mercato attuale",
        ch: "Valur actuala dal martgà"
    },
    acquisitionDate:{
        de: "Erwerbsdatum",     
        en: "Acquision Date",
        fr: "Date d'acquisition",
        it: "Data di acquisizione",
        ch: "Data d'acquist",        
    },
    lastCleaned:{
        de: "Zuletzt gereinigt",     
        en: "Last cleaned",
        fr: "Dernier nettoyage",
        it: "Ultima pulizia",
        ch: "Ultima nettegiada",        
    },
    lastShot:{
        de: "Zuletzt geschossen",     
        en: "Last shot",
        fr: "Dernier coup de feu",
        it: "Ultimo sparo",
        ch: "L'ultim culp",        
    },
}

export const search:SimpleTranslation = {
    de: "Suchen", 
    en: "search",
    fr: "Chercher",
    it: "Ricerca",
    ch: "Tschertgar"
}

export const gunQuickShot:GunQuickShot = {
    title:{
        de: "Schussbelastung erhöhen", 
        en: "Increase shot count",
        fr: "Augmenter la charge de tir",
        it: "Aumentare il carico di pallini",
        ch: "Augmentar la chargia da tir"  
    },
    updateNonStock:{
        de: "Munition nicht aus Bestand", 
        en: "Ammunition not from stock",
        fr: "Munitions non issues de stocks",
        it: "Munizioni non di scorta",
        ch: "Muniziun betg or da l'effectiv"  
    },
    updateNonStockInput:{
        de: "Menge eingeben", 
        en: "Input amount",
        fr: "Saisir la quantité",
        it: "Inserire la quantità",
        ch: "S'approfundar"  
    },
    updateFromStock:{
        de: "Munition aus Bestand", 
        en: "Ammunition from stock",
        fr: "Munitions de stocks",
        it: "Munizioni di scorta",
        ch: "Muniziun da plantadi"  
    },
    errorNoAmountDefined:{
        de: "Achtung: Kein Bestand dieses Kalibers definiert!", 
        en: "Ammunition from stock",
        fr: "Munitions de stocks",
        it: "Munizioni di scorta",
        ch: "Muniziun da plantadi"  
    },
    errorAmountTooLow:{
        de: "Achtung: Bestand dieses Kalibers ({{AMOUNT}}) ist weniger als der eingegebene Verbrauch!", 
        en: "Ammunition from stock",
        fr: "Munitions de stocks",
        it: "Munizioni di scorta",
        ch: "Muniziun da plantadi"  
    }
}

export const tagModal:TagModal ={
    title: {
        de: "Schlagworte", 
        en: "Tags",
        fr: "Mots-clés",
        it: "Parole chiave",
        ch: "pleds caracteristics"  
    },
    subtitle: {
        de: "Hier können Schlagworte erfasst werden, nach denen in der Übersicht gefiltert werden kann.", 
        en: "Here you can define tags, by which you can filter in the collection view.",
        fr: "Il est possible de saisir ici des mots-clés qui serviront à filtrer l'aperçu.",
        it: "Qui si possono inserire parole chiave, che possono poi essere filtrate nella panoramica.",
        ch: "Qua pon ins registrar chavazzins, tenor ils quals ins po filtrar en la survista."  
    },
    existingTags: {
        de: "Bereits vorhandene Schlagwörter", 
        en: "Existing tags",
        fr: "Mots-clés déjà existants",
        it: "Parole chiave esistenti",
        ch: "Pleds gia existents"  
    },
    inputTags: {
        de: "Schlagwort eingeben", 
        en: "Enter tag",
        fr: "Saisir un mot-clé",
        it: "Inserire la parola chiave",
        ch: "Dar il pled da tagl"  
    },
    selectedTags: {
        de: "Ausgewählte Schlagworte", 
        en: "Selected tags",
        fr: "Mots-clés sélectionnés",
        it: "Parole chiave selezionate",
        ch: "Pleds selecziunads"  
    }
}

export const generalSettingsLabels: GeneralSettingsLabels = {
    displayImagesInListViewGun: {
        de: "Bilder in Listenansicht Waffen anzeigen", 
        en: "Show images in gun list view",
        fr: "Afficher les images dans la vue en liste armes",
        it: "Visualizzare le immagini nella vista elenco armi",
        ch: "Mussar armas cun ina glista"  
    },
    displayImagesInListViewAmmo: {
        de: "Bilder in Listenansicht Munition anzeigen", 
        en: "Show images in ammunition list view",
        fr: "Afficher les images dans la vue en liste munitions",
        it: "Visualizzare le immagini nella vista elenco munizioni",
        ch: "Mussar maletgs cun ina glista muniziun"  
    },
    resizeImages: {
        de: "Bildoptimierung",
        en: "Image optimization",
        fr: "Optimisation des images",
        it: "Ottimizzazione delle immagini",
        ch: "Optimaziun dal maletg"
    },
    loginGuard: {
        de: "Biometrischer Login",
        en: "Biometric login",
        fr: "Login biométrique",
        it: "Login biometrico",
        ch: "Login biometric"
    },
    emptyFields: {
        de: "Leere Felder in Einträgen ausblenden",
        en: "Hide empty fields in entries",
        fr: "Masquer les champs vides dans les entrées",
        it: "Nascondere i campi vuoti nelle voci",
        ch: "Tschertgar champs vids en inscripziuns"
    },
    caliberDisplayName: {
        de: "Kurze Kaliberbezeichnungen verwenden in Einträgen und PDF-Listen",
        en: "Use short calibre designations in entries and PDF lists",
        fr: "Utiliser des désignations de calibres courtes dans les entrées et les listes PDF",
        it: "Usa etichette di calibro brevi nelle voci e nelle liste PDF",
        ch: "Duvrar nums da caliber curts en inscripziuns e glistas da pdf"
    }
}

export const aboutText: SimpleTranslation = {
    de: "Arsenal - Die schweizer App für Waffensammler!",
    en: "Arsenal - The Swiss app for gun collectors!",
    fr: "Arsenal - L'application suisse pour les collectionneurs d'armes !",
    it: "Arsenal - L'app svizzera per i collezionisti di armi!",
    ch: "Arsenal - L'app svizra per las collecziunadras ed ils collecziunaders d'armas!"
}

export const aboutThanks: SimpleTranslation = {
    de: "Speziellen Dank an:",
    en: "Special thanks to:",
    fr: "Remerciements spéciaux à",
    it: "Un ringraziamento speciale a",
    ch: "Grazia fitg spezial a",
}

export const aboutThanksPersons:aboutThanksPersons = {
    michelle:{
        de: "Michelle Fabienne Weber-Meichtry",
        en: "Michelle Fabienne Weber-Meichtry",
        fr: "Michelle Fabienne Weber-Meichtry",
        it: "Michelle Fabienne Weber-Meichtry",
        ch: "Michelle Fabienne Weber-Meichtry",
    },
    jonas:{
        de: "Jonas Hürlimann",
        en: "Jonas Hürlimann",
        fr: "Jonas Hürlimann",
        it: "Jonas Hürlimann",
        ch: "Jonas Hürlimann",
    },
    owg:{
        de: "die Betatester der Ostschweizerischen Waffen-Sammler-Gesellschaft OWG",
        en: "the beta testers of the Eastern Swiss Arms Collectors Society OWG",
        fr: "les testeurs bêta de la Société suisse orientale des collectionneurs d'armes OWG",
        it: "i beta tester della Società dei collezionisti di armi della Svizzera orientale OWG",
        ch: "ils Betatestas da la Societad d'armas da la Svizra orientala OWG",
    },
    waffenforum:{
        de: "die Betatester des waffenforum.ch",
        en: "the beta testers of waffenforum.ch",
        fr: "les testeurs bêta du waffenforum.ch",
        it: "i beta tester di waffenforum.ch ",
        ch: "ils betatesters dal waffenforum.ch",
    },
    others:{
        de: "alle anderen Tester, ohne die die App so nicht möglich wäre",
        en: "all the other testers without whom the app would not be possible",
        fr: "tous les autres testeurs sans lesquels l'application ne serait pas possible",
        it: "tutti gli altri tester, senza i quali l'app non sarebbe possibile",
        ch: "tuot ils oters tests, sainza ils quals l'app nu füss uschè pussibla",
    },
}

export const modalTexts: ModalText = {
    datePicker: {
        title: {
            de: "Datumsauswahl",
            en: "Date picker",
            fr: "Sélection de la date",
            it: "Selezione della data",
            ch: "Tscherna da las datas",
        },
        text:{
            de: "Tippe auf das Datum, um es zu setzen.\nDie Pfeile links und rechts wechseln zum vorherigen, respektive nächsten Monat.\nTippe den Monat an, um zur Monatsauswahl zu kommen.\nTippe das Jahr an, um zur Jahresauswahl zu kommen.",
            en: "Tap on the date to set it.\nThe arrows on the left and right switch to the previous and next month respectively.\nTap on the month to go to the month selection.\nTap on the year to go to the year selection.",
            fr: "Appuie sur la date pour la définir.\nLes flèches à gauche et à droite passent respectivement au mois précédent et au mois suivant.\nAppuie sur le mois pour accéder à la sélection du mois.\nAppuie sur l'année pour accéder à la sélection de l'année.",
            it: "Toccare la data per impostarla.Le frecce a sinistra e a destra passano rispettivamente al mese precedente e a quello successivo.Toccare il mese per passare alla selezione del mese.Toccare l'anno per passare alla selezione dell'anno.",
            ch: "Tippas a la data per al metter.\nIls battas a sanestra ed a dretga müdan per il mais avant, resp. il prossem mais.\n Tipp al mais per gnir a la tscherna dal mais.\n Tipp l'on per gnir a la tscherna dal mais.",
        }
    },
    colorPicker: {
        title: {
            de: "Farbauswahl",
            en: "Color picker",
            fr: "Sélection de couleurs",
            it: "Selezione del colore",
            ch: "Schelta da colurs",
        },
        text:{
            de: "Wähle die zur Waffe passende Farbe.\nDies setzt auch einen farblichen Rahmen um die Fotos.",
            en: "Choose the color that matches the gun.\nThis also sets a color frame around the photos.",
            fr: "Choisis la couleur correspondant à l'arme.\nDies met aussi un cadre coloré autour des photos.",
            it: "Scegliere il colore che si abbina all'arma.´In questo modo si crea anche una cornice di colore intorno alle foto.",
            ch: "Tscherni la colur adattada per l'arma.\nDies dat er in rom en colur enturn las fotografias.",
        }
    },
    caliberPicker: {
        title: {
            de: "Kaliberauswahl",
            en: "Caliber selection",
            fr: "Sélection du calibre",
            it: "Selezione del calibro",
            ch: "Tscherna da caliber",
        },
        text:{
            de: `Wähle die passenden Kaliber.\nBei Waffen können mehrere Kaliber gewählt werden (zum Beispiel .357 Magnum und .38 Special), bei Munitionssorten ist nur ein Kaliber vorgesehen.\nDas/die ausgewählte/n Kaliber wird/werden jeweils angezeigt.\nWichtig: Damit die Funktion "QuickShot", respektive "QuickStock" richtig funktionieren, müssen die Kaliberangabe bei Waffe und Munition übereinstimmen.`,
            en: `Select the appropriate calibers.\nMultiple calibers can be selected for weapons (for example .357 Magnum and .38 Special), only one caliber is provided for ammunition types.\nThe selected caliber(s) is/are displayed in each case.\nImportant: For the "QuickShot" and "QuickStock" functions to work correctly, the caliber information for the weapon and ammunition must match.`,
            fr: `Choisis les calibres appropriés.\nPour les armes, il est possible de choisir plusieurs calibres (par exemple .357 Magnum et .38 Special), pour les munitions, un seul calibre est prévu.\nLe(s) calibre(s) choisi(s) s'affiche(nt) à chaque fois.\nImportant : pour que la fonction "QuickShot", respectivement "QuickStock", fonctionne correctement, les indications de calibre de l'arme et des munitions doivent correspondre.`,
            it: `È possibile selezionare più calibri per le armi (ad esempio .357 Magnum e .38 Special), mentre per le munizioni è previsto un solo calibro.Il calibro o i calibri selezionati vengono visualizzati in ogni caso.Importante: affinché le funzioni "QuickShot" e "QuickStock" funzionino correttamente, le informazioni sul calibro dell'arma e delle munizioni devono corrispondere.`,
            ch: `Tschernas ils caliber correspundents.\nSche armas pon vegnir tschernidas plirs caliber (per exempel .357 magnum e .38 special), en cas da sorts da muniziun è previs mo in caliber.\nIl/il caliber tschernì vegn/sa mussà mintgamai.\nimpurtant: Per che la funcziun da "QuickShot", respectiv "QuickStock" funcziunia endretg, ston las indicaziuns da caliber tar l'arma e tar la muniziun correspunder.`,
        }
    },
    cleanInterval: {
        title: {
            de: "Reinigungsintervall",
            en: "Cleaning interval",
            fr: "Intervalle de nettoyage",
            it: "Intervallo di pulizia",
            ch: "Interval da nettegiar",
        },
        text:{
            de: `Wähle einen Zeitintervall, nach dem die Waffe wieder geputzt werden müsste.\n\nDies wird anhand des Wertes von "zuletzt geputzt" gerechnet, sofern dieser gesetzt ist.\n\nBei Überschreitung des Intervalls erscheint der Name der Waffe in der Übersicht rot.`,
            en: `Select a time interval after which the weapon should be cleaned again.\n\nThis is calculated based on the value of "last cleaned", if this is set.\n\nIf the interval is exceeded, the name of the weapon appears in red in the overview.`,
            fr: `Choisir un intervalle de temps après lequel l'arme devrait être nettoyée à nouveau.\nnCeci est calculé en fonction de la valeur de "dernier nettoyé", si celle-ci est définie.\nnSi l'intervalle est dépassé, le nom de l'arme apparaît en rouge dans l'aperçu.`,
            it: `Selezionare un intervallo di tempo dopo il quale l'arma deve essere pulita di nuovo.\n}Questo viene calcolato in base al valore di "ultima pulizia", se impostato.\n}Se l'intervallo viene superato, il nome dell'arma appare in rosso nella panoramica.`,
            ch: `Tscherni in interval da temp, cur che l'arma stuess puspè vegnir nettegiada.\n\nDies vegn quintà vi da la valur da "l'ultima nettegiada", premess che quella saja messa.\n\nBenenen surpassament da l'interval cumpara il num da l'arma en la survista cotschna.`,
        }
    },
}

export const caliberPickerStrings:CaliberPickerStrings = {
    caliberSelection:{
        de: "Ausgewählte Kaliber erscheinen hier",
        en: "Selected calibers appear here",
        fr: "Les calibres sélectionnés apparaissent ici",
        it: "I calibri selezionati appaiono qui",
        ch: "Caliber selecziunà cumpara qua",
    },
    tabList: {
        de: "Liste",
        en: "List",
        fr: "Liste",
        it: "Elenco",
        ch: "Glista",
    },
    tabSearch:{
        de: "Suche",
        en: "Search",
        fr: "Recherche",
        it: "Ricerca",
        ch: "Tschertga",
    }
}

interface StatisticItems{
    gunCount: SimpleTranslation
    gunPrice: SimpleTranslation
    gunValue: SimpleTranslation
    ammoCount: SimpleTranslation
    roundCount: SimpleTranslation
}

export const statisticItems:StatisticItems = {
    gunCount:{
        de: "Anzahl Waffen",
        en: "Number of weapons",
        fr: "Nombre d'armes",
        it: "Numero di armi",
        ch: "Dumber d'armas",
    },
    gunPrice:{
        de: "Kaufwert Waffen",
        en: "Purchase value arms",
        fr: "Valeur d'achat armes",
        it: "Valore d'acquisto armi",
        ch: "Valur da cumpra d'armas",
    },
    gunValue:{
        de: "Marktwert Waffen",
        en: "Market value arms",
        fr: "Valeur marchande armes",
        it: "Valore di mercato armi",
        ch: "Valur da martgà Armas",
    },
    ammoCount:{
        de: "Munitionssorten",
        en: "Types of ammunition",
        fr: "Types de munitions",
        it: "Varietà di munizioni",
        ch: "Spezias da muniziun",
    },
    roundCount:{
        de: "Anzahl Schuss total",
        en: "Total round count",
        fr: "Nombre de coups total",
        it: "Numero totale di cartucce",
        ch: "Dumber da patronas total",
    }
}

export const longPressActions:LongPressActions = {
    clone:{
        de: "Klonen",
        en: "Clone",
        fr: "Clone",
        it: "Clone",
        ch: "Clona",
    },
    delete: {
        de: "Löschen",
        en: "Delete",
        fr: "Supprimer",
        it: "Cancellare",
        ch: "Stizzar",
    }
}

export const iosWarningText: iosWarning = {
    title: {
        de: "iOS Warnung",
        en: "iOS warning",
        fr: "Avertissement iOS",
        it: "Avvertimento iOS",
        ch: "iOS avertiment",
    },
    text:{
        de: "Normalerweise ist das PDF sehr schnell erstellt. Leider kann es dennoch vorkommen, dass das Erstellen der PDF-Datei sehr lange dauert (mehrere Minuten). Falls das der Fall ist, kann man entweder warten, bis das Erstellen beendet ist, oder die App neu starten und den Vorgang erneut versuchen. Das Problem ist bekannt und an einer Lösung wird gearbeitet.",
        en: "Generally, the PDF file is created very quickly. Unfortunately, however, it may take a very long time to create the PDF file (several minutes). If this is the case, you can either wait until the creation is finished, or restart the app and try again. The problem is known and a solution is being worked on.",
        fr: "Généralement, la création d'un fichier PDF est très rapide. Malheureusement, il arrive que la création d'un fichier PDF prenne beaucoup de temps (plusieurs minutes). Si c'est le cas, vous pouvez soit attendre que la création soit terminée, soit redémarrer l'application et réessayer. Le problème est connu et une solution est en cours.",
        it: "Normalmente il PDF viene creato molto velocemente. Purtroppo, però, la creazione di un file PDF può richiedere molto tempo (diversi minuti). In questo caso, puoi attendere che la creazione sia terminata, oppure riavviare l'applicazione e riprovare. Il problema è noto e stiamo lavorando per risolverlo.",
        ch: "Normalmain es il PDF construì fich svelt. Deplorablamain poi tuttavia capitar che la creaziun da la datoteca da PDF dura fich ditg (pliras minutas). Sche quai è il cas, pon ins spetgar fin che la creaziun è terminada, ubain cumenzar da nov l'applicaziun ed empruvar da far danovamain il proceder. Il problem è enconuschent ed ins lavura vi d'ina soluziun."
    },
    ok:{
        de: "Versuchen",
        en: "Try",
        fr: "Essayez",
        it: "Prova",
        ch: "Pruvar",
    },
    cancel:{
        de: "Abbrechen",
        en: "Cancel",
        fr: "Annuler",
        it: "Annulla",
        ch: "Rumper giu",
    }
}

export const shotLabel: SimpleTranslation = {
    de: "Schuss",
    en: "rounds",
    fr: "coups",
    it: "colpi",
    ch: "culps",
}