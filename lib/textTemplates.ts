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
    gunList: SimpleTranslation
    printAllGuns: SimpleTranslation
    printArt5: SimpleTranslation
    printGallery: SimpleTranslation
    ammoList: SimpleTranslation
    printAllAmmo: SimpleTranslation
    generalSettings: SimpleTranslation
    about: SimpleTranslation
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
}

interface Sorting{
    alphabetic: SimpleTranslation
    lastModified: SimpleTranslation
    lastAdded: SimpleTranslation
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
        de: "Datenbank gespeichert",
        en: "Database saved",
        fr: "Base de données enregistrée",
        it: "Database salvato",
        ch: "Arcunà banca da datas",
    },
    dbImportSuccess: {
        de: "Datensätze importiert",
        en: "datasets imported",
        fr: "enregistrements importés",
        it: "dati importati",
        ch: "importà unitads da datas",
    }
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
        de: "Speichern",
        en: "Save",
        fr: "Enregistrer",
        it: "Salva",
        ch: "Arcunar",
    },
    importDb_ammo: {
        de: "Importieren",
        en: "Import",
        fr: "Importer",
        it: "Importa",
        ch: "Importar",
    },
    gunList: {
        de: "Waffenverzeichnis",
        en: "List of weapons",
        fr: "Liste des armes",
        it: "Elenco delle armi",
        ch: "Register da las armas",
    },
    printAllGuns: {
        de: "Komplett",
        en: "Complete",
        fr: "Complet",
        it: "Completo",
        ch: "Cumpletta",
    },
    printArt5:{
        de: "WG Art. 5",
        en: "WA Art. 5",
        fr: "LArm Art. 5",
        it: "LArm Art. 5",
        ch: "LArm Art. 5",
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
        de: "Komplett",
        en: "Complete",
        fr: "Complet",
        it: "Completo",
        ch: "Cumpletta",
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
    }
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