import { SimpleTranslation } from "./interfaces_text";

interface mainMenu_database{
    title: SimpleTranslation
    saveArsenalDB: SimpleTranslation
    shareArsenalDB: SimpleTranslation
    saveArsenalCSV: SimpleTranslation
    shareArsenalCSV: SimpleTranslation
    importArsenalDB: SimpleTranslation
    importCustomCSV: SimpleTranslation
    importArsenalCSV: SimpleTranslation
    importCSVModalTitle: SimpleTranslation
    importCSVModalText: SimpleTranslation
}

export const mainMenu_ammunitionDatabase: mainMenu_database = {
    title:{
        de: "Datenbank Munition",
        en: "Ammunition Database",
        fr: "Base de données munitions",
        it: "Database munizioni",
        ch: "Banca da datas muniziun",
    },
    saveArsenalDB:{
        de: "Arsenal Datenbank lokal auf dem Gerät speichern",
        en: "Save Arsenal database locally on the device",
        fr: "Enregistrer la base de données Arsenal localement sur l'appareil",
        it: "Salvare il database dell'Arsenale in locale sul dispositivo",
        ch: "Arcunar la banca da datas d' Arsenal localmain sin l'apparat",
    },
    shareArsenalDB:{
        de: "Arsenal Datenbank teilen (via Threema senden, in Cloud-App speichern, ...)",
        en: "Share Arsenal database (send via Threema, save in cloud app, ...)",
        fr: "Partager la base de données Arsenal (envoyer via Threema, enregistrer dans l'application Cloud, ...)",
        it: "Condividere il database dell'Arsenal (inviare via Threema, salvare in un'applicazione cloud, ...)",
        ch: "Parter ina banca da datas d'Arsenal (trametter a Threema, arcunar en l'app da cloud, ...)",
    },
    saveArsenalCSV:{
        de: "Arsenal CSV Datei lokal auf dem Gerät speichern",
        en: "Save Arsenal CSV file locally on the device",
        fr: "Enregistrer le fichier CSV Arsenal localement sur l'appareil",
        it: "Salvare il file CSV dell'Arsenale localmente sul dispositivo",
        ch: "Arsenal CSV Datei localmain sin l'apparat",
    },
    shareArsenalCSV:{
        de: "Arsenal CSV Datei teilen (via Threema senden, in Cloud-App speichern, ...)",
        en: "Share Arsenal CSV file (send via Threema, save in cloud app, ...)",
        fr: "Partager le fichier CSV Arsenal (envoyer via Threema, enregistrer dans l'application Cloud, ...)",
        it: "Condividere il file CSV dell'Arsenal (inviare tramite Threema, salvare nell'app cloud, ...)",
        ch: "Arsenal CSV Datei (trametter via Threema, arcunar en l'app cloud, ...)",
    },
    importArsenalDB:{
        de: "Arsenal Datenbank importieren (ammoDB_17...)",
        en: "Import Arsenal database (ammoDB_17...)",
        fr: "Importer la base de données Arsenal (ammoDB_17...)",
        it: "Importazione del database Arsenal (ammoDB_17...)",
        ch: "Import d' Arsenal banca da datas (ammoDB_17...)",
    },
    importCustomCSV:{
        de: "Eigene CSV Datei importieren",
        en: "Import custom CSV file",
        fr: "Importer son propre fichier CSV", 
        it: "Importare il proprio file CSV", 
        ch: "Importar in'atgna datoteca dad CSV",
    },
    importArsenalCSV:{
        de: "Arsenal CSV Datei importieren",
        en: "Import Arsenal CSV file",
        fr: "Importer un fichier CSV Arsenal", 
        it: "Importazione del file CSV dell'Arsenale", 
        ch: "Arsenal CSV datoteca d'import",
    },
    importCSVModalTitle:{
        de: "Eigene CSV Datei importieren",
        en: "Import custom CSV file",
        fr: "Importer son propre fichier CSV", 
        it: "Importare il proprio file CSV", 
        ch: "Importar in'atgna datoteca dad CSV",
    },
    importCSVModalText:{
        de: `Auswählen, welche Werte der CSV-Datei denjenigen von Arsenal entsprechen.\nAlle nicht zugewiesenen Werte der CSV-Datei werden automatisch in das Feld "Bemerkungen" übertragen.\n\nHinweis: Das Kaliberfeld muss für die QuickShot-Funktion exakt wie in der Kaliberauswahl der Arsenal App angegeben werden.\nEs empfielt sich, dies vordergängig in der CSV-Datei anzupassen, oder nachträglich in der App.`,
        en: `Select which values of the CSV file correspond to those of Arsenal.\nAll unassigned values of the CSV file are automatically transferred to the "Remarks" field.\n\nNote: For the QuickShot function, the caliber field must be specified exactly as in the caliber selection of the Arsenal app.\nIt is recommended to adjust this in the CSV file beforehand, or afterwards in the app.`,
        fr: `Sélectionner quelles valeurs du fichier CSV correspondent à celles d'Arsenal.\nToutes les valeurs non attribuées du fichier CSV sont automatiquement transférées dans le champ "Remarques".\n\nRemarque : pour la fonction QuickShot, le champ de calibre doit être indiqué exactement comme dans la sélection de calibre de l'app Arsenal.\nIl est recommandé de l'adapter au préalable dans le fichier CSV, ou ultérieurement dans l'app.`,
        it: `Selezionare quali valori del file CSV corrispondono a quelli di Arsenal.\nTutti i valori non assegnati del file CSV vengono automaticamente trasferiti nel campo "Osservazioni".\n\nNota: il campo del calibro per la funzione QuickShot deve essere specificato esattamente come nella selezione del calibro dell'app Arsenal.\nSi consiglia di regolarlo prima nel file CSV o successivamente nell'app.`,
        ch: `Tscherner las valurs da la datoteca CSV che correspundan a quellas d'arsenal.\nTuttas da las valurs da la datoteca CSV che n'èn betg vegnidas attribuidas vegnan transferidas automaticamain en il champ "Remartgas".\n\nRemartga: Il champ da caliber sto vegnir inditgà per la funcziun da QuickShot precis sco tar la tscherna da l'app d'arsenal.\nE èsi recumandà d' adattar quai per il mument en la datoteca da CSV u pli tard en l' app`,
    }
}

export const mainMenu_gunDatabase: mainMenu_database = {
    title:{
        de: "Datenbank Waffen",
        en: "Ammunition Database",
        fr: "Base de données munitions",
        it: "Database munizioni",
        ch: "Banca da datas muniziun",
    },
    saveArsenalDB:{
        de: "Arsenal Datenbank lokal auf dem Gerät speichern",
        en: "Save Arsenal database locally on the device",
        fr: "Enregistrer la base de données Arsenal localement sur l'appareil",
        it: "Salvare il database dell'Arsenale in locale sul dispositivo",
        ch: "Arcunar la banca da datas d' Arsenal localmain sin l'apparat",
    },
    shareArsenalDB:{
        de: "Arsenal Datenbank teilen (via Threema senden, in Cloud-App speichern, ...)",
        en: "Share Arsenal database (send via Threema, save in cloud app, ...)",
        fr: "Partager la base de données Arsenal (envoyer via Threema, enregistrer dans l'application Cloud, ...)",
        it: "Condividere il database dell'Arsenal (inviare via Threema, salvare in un'applicazione cloud, ...)",
        ch: "Parter ina banca da datas d'Arsenal (trametter a Threema, arcunar en l'app da cloud, ...)",
    },
    saveArsenalCSV:{
        de: "Arsenal CSV Datei lokal auf dem Gerät speichern",
        en: "Save Arsenal CSV file locally on the device",
        fr: "Enregistrer le fichier CSV Arsenal localement sur l'appareil",
        it: "Salvare il file CSV dell'Arsenale localmente sul dispositivo",
        ch: "Arsenal CSV Datei localmain sin l'apparat",
    },
    shareArsenalCSV:{
        de: "Arsenal CSV Datei teilen (via Threema senden, in Cloud-App speichern, ...)",
        en: "Share Arsenal CSV file (send via Threema, save in cloud app, ...)",
        fr: "Partager le fichier CSV Arsenal (envoyer via Threema, enregistrer dans l'application Cloud, ...)",
        it: "Condividere il file CSV dell'Arsenal (inviare tramite Threema, salvare nell'app cloud, ...)",
        ch: "Arsenal CSV Datei (trametter via Threema, arcunar en l'app cloud, ...)",
    },
    importArsenalDB:{
        de: "Arsenal Datenbank importieren (gunDB_17...)",
        en: "Import Arsenal database (ammoDB_17...)",
        fr: "Importer la base de données Arsenal (ammoDB_17...)",
        it: "Importazione del database Arsenal (ammoDB_17...)",
        ch: "Import d' Arsenal banca da datas (ammoDB_17...)",
    },
    importCustomCSV:{
        de: "Eigene CSV Datei importieren",
        en: "Import custom CSV file",
        fr: "Importer son propre fichier CSV", 
        it: "Importare il proprio file CSV", 
        ch: "Importar in'atgna datoteca dad CSV",
    },
    importArsenalCSV:{
        de: "Arsenal CSV Datei importieren",
        en: "Import Arsenal CSV file",
        fr: "Importer un fichier CSV Arsenal", 
        it: "Importazione del file CSV dell'Arsenale", 
        ch: "Arsenal CSV datoteca d'import",
    },
    importCSVModalTitle:{
        de: "Eigene CSV Datei importieren",
        en: "Import custom CSV file",
        fr: "Importer son propre fichier CSV", 
        it: "Importare il proprio file CSV", 
        ch: "Importar in'atgna datoteca dad CSV",
    },
    importCSVModalText:{
        de: `Auswählen, welche Werte der CSV-Datei denjenigen von Arsenal entsprechen.\nAlle nicht zugewiesenen Werte der CSV-Datei werden automatisch in das Feld "Bemerkungen" übertragen.\n\n Hinweis: Das Kaliberfeld muss für die QuickShot-Funktion exakt wie in der Kaliberauswahl der Arsenal App angegeben werden.\nEs empfielt sich, dies vordergängig in der CSV-Datei anzupassen, oder nachträglich in der App.`,
        en: `Select which values of the CSV file correspond to those of Arsenal.\nAll unassigned values of the CSV file are automatically transferred to the "Remarks" field.\n\n Note: For the QuickShot function, the caliber field must be specified exactly as in the caliber selection of the Arsenal app.\nIt is recommended to adjust this in the CSV file beforehand, or afterwards in the app.`,
        fr: `Sélectionner quelles valeurs du fichier CSV correspondent à celles d'Arsenal.\nToutes les valeurs non attribuées du fichier CSV sont automatiquement transférées dans le champ "Remarques".\nn Remarque : pour la fonction QuickShot, le champ de calibre doit être indiqué exactement comme dans la sélection de calibre de l'app Arsenal.\nIl est recommandé de l'adapter au préalable dans le fichier CSV, ou ultérieurement dans l'app.`,
        it: `Selezionare quali valori del file CSV corrispondono a quelli di Arsenal.\nTutti i valori non assegnati del file CSV vengono automaticamente trasferiti nel campo "Osservazioni".\nNota: il campo del calibro per la funzione QuickShot deve essere specificato esattamente come nella selezione del calibro dell'app Arsenal.\nSi consiglia di regolarlo prima nel file CSV o successivamente nell'app.`,
        ch: `Tscherner las valurs da la datoteca CSV che correspundan a quellas d'arsenal.\nTuttas da las valurs da la datoteca CSV che n'èn betg vegnidas attribuidas vegnan transferidas automaticamain en il champ "Remartgas".\n Remartga: Il champ da caliber sto vegnir inditgà per la funcziun da QuickShot precis sco tar la tscherna da l'app d'arsenal.\nE èsi recumandà d' adattar quai per il mument en la datoteca da CSV u pli tard en l' app`,
    }
}