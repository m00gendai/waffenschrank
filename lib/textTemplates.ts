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

