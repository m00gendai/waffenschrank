interface SimpleTranslation{
    de: string
    en: string
    fr: string
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
    db: SimpleTranslation
    saveDb: SimpleTranslation
    importDb: SimpleTranslation
}

interface DatabaseOperation{
    export: SimpleTranslation
    import: SimpleTranslation
}

export const editGunTitle:SimpleTranslation = {
    de: "Waffe bearbeiten",
    en: "Edit Gun",
    fr: "Modifier l'arme",
}

export const newGunTitle:SimpleTranslation = {
    de: "Neue Waffe",
    en: "New Gun",
    fr: "Nouvelle arme"
}

export const unsavedChangesAlert:Alert = {
    title: {
        de: "Es hat nicht gespeicherte Änderungen",
        en: "Unsaved changes",
        fr: "Il a des modifications non sauvegardées",
    },
    subtitle: {
        de: "Wirklich zurück?",
        en: "Continue?",
        fr: "vraiment revenir?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non"
    }
}

export const imageDeleteAlert:Alert = {
    title: {
        de: "Bild wirklich löschen?",
        en: "Delete image?",
        fr: "Supprimer vraiment l'image?",
    },
    subtitle: {
        de: "",
        en: "",
        fr: "",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non"
    }
}

export const gunDeleteAlert:Alert = {
    title: {
        de: "wirklich löschen?",
        en: "will be deleted",
        fr: "vraiment supprimer?",
    },
    subtitle: {
        de: "Die Waffe wird unwiderruflich gelöscht. Wirklich fortfahren?",
        en: "The gun will be irrevocably deleted. Really continue?",
        fr: "L'arme sera effacée de manière irréversible. Vraiment continuer?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non"
    }
}

export const validationFailedAlert:Alert = {
    title: {
        de: "Validierung fehlgeschlagen",
        en: "Validation failed",
        fr: "Echec de la validation",
    },
    subtitle: {
        de: "",
        en: "",
        fr: "",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
    },
    no: {
        de: "OK",
        en: "OK",
        fr: "OK"
    }
}

export const databaseImportAlert:Alert = {
    title: {
        de: "Datenbank importieren und aktuelle überschreiben?",
        en: "Import database and overwrite current?",
        fr: "Importer la base de données et remplacer l'actuelle?",
    },
    subtitle: {
        de: "Die aktuelle Datenbank wird unwiderruflich mit der importierten überschrieben. Wirklich fortfahren?",
        en: "The current database will be irrevocally overwritten. Really continue?",
        fr: "La base de données actuelle est irrémédiablement écrasée par celle qui a été importée. Vraiment continuer?",
    },
    yes: {
        de: "Ja",
        en: "Yes",
        fr: "Oui",
    },
    no: {
        de: "Nein",
        en: "No",
        fr: "Non"
    }
}


export const validationErros: Validation = {
    requiredFieldEmpty: {
        de: "Feld darf nicht leer sein",
        en: "Field can not be empty",
        fr: "Le champ ne doit pas être vide",
    },
}

export const toastMessages:Toast = {
    saved: {
        de: "gespeichert",
        en: "saved",
        fr: "enregistré"
    },
    changed: {
        de: "geändert",
        en: "changed",
        fr: "modifié"
    },
    dbSaveSuccess: {
        de: "Datenbank gespeichert",
        en: "Database saved",
        fr: "Base de données enregistrée"
    },
    dbImportSuccess: {
        de: "Datensätze importiert",
        en: "datasets imported",
        fr: "enregistrements importés"
    }
}

export const preferenceTitles:PreferenceTitle = {
    language: {
        de: "Grüezi wohl!",
        en: "Tally ho!",
        fr: "Enchanté!"
    },
    colors: {
        de: "Farbschema",
        en: "Color scheme",
        fr: "Schéma de couleurs"
    },
    db: {
        de: "Datenbank",
        en: "Database",
        fr: "Base de données"
    },
    saveDb: {
        de: "Speichern",
        en: "Save",
        fr: "Enregistrer"
    },
    importDb: {
        de: "Importieren",
        en: "Import",
        fr: "Importer"
    },
    
}

export const databaseOperations:DatabaseOperation = {
    export: {
        de: "Datenbank wird gespeichert...",
        en: "Database is being saved...",
        fr: "Base de données en cours d'enregistrement",
    },
    import: {
        de: "Datenbank wird importiert...",
        en: "Database is being imported...",
        fr: "Base de données en cours d'importation...",
    }
}