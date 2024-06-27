import { SimpleTranslation } from "./interfaces_text";

interface mainMenu_ammunitionDatabase{
    title: SimpleTranslation,
    saveArsenalDB: SimpleTranslation,
    importArsenalDB: SimpleTranslation,
    importCSV: SimpleTranslation,
    importCSVModalTitle: SimpleTranslation,
    importCSVModalText: SimpleTranslation,
}

export const mainMenu_ammunitionDatabase: mainMenu_ammunitionDatabase = {
    title:{
        de: "Datenbank Munition",
        en: "Ammunition Database",
        fr: "Base de données munitions",
        it: "Database munizioni",
        ch: "Banca da datas muniziun",
    },
    saveArsenalDB:{
        de: "Speichern als Arsenal Datenbank",
        en: "Save as Arsenal database",
        fr: "Enregistrer en tant que base de données Arsenal",
        it: "Salva come database Arsenal",
        ch: "Arcunar sco arsenal banca da datas",
    },
    importArsenalDB:{
        de: "Arsenal Datenbank importieren (ammoDB_17...)",
        en: "Import Arsenal database (ammoDB_17...)",
        fr: "Importer la base de données Arsenal (ammoDB_17...)",
        it: "Importazione del database Arsenal (ammoDB_17...)",
        ch: "Import d' Arsenal banca da datas (ammoDB_17...)",
    },
    importCSV:{
        de: "Eigene CSV Datenbank importieren",
        en: "Import own CSV database",
        fr: "Importer sa propre base de données CSV", 
        it: "Importare il proprio database CSV", 
        ch: "Importar in'atgna banca da datas CSV",
    },
    importCSVModalTitle:{
        de: "Eigene CSV Datenbank importieren",
        en: "Import own CSV database",
        fr: "Importer sa propre base de données CSV", 
        it: "Importare il proprio database CSV", 
        ch: "Importar in'atgna banca da datas CSV",
    },
    importCSVModalText:{
        de: `Auswählen, welche Werte der CSV-Datei denjenigen von Arsenal entsprechen.\nAlle nicht zugewiesenen Werte der CSV-Datei werden automatisch in das Feld "Bemerkungen" übertragen.\n\n Hinweis: Das Kaliberfeld muss für die QuickShot-Funktion exakt wie in der Kaliberauswahl der Arsenal App angegeben werden.\nEs empfielt sich, dies vordergängig in der CSV Datei anzupassen, oder nachträglich in der App.`,
        en: "",
        fr: "",
        it: "",
        ch: "",
    }
}