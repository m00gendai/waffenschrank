interface DropDownPickerOptionsEntry {
    de: { label: string, value: string }[],
    en: { label: string, value: string }[],
    fr: { label: string, value: string }[],
    it: { label: string, value: string }[],
    ch: { label: string, value: string }[],
}

export interface DropDownPickerOptions {
    de_wbkColor: DropDownPickerOptionsEntry
}

export const dropDownPickerOptions: DropDownPickerOptions = {
    de_wbkColor: {
        de: [
            { label: '🟩 Grün', value: 'green' },
            { label: '🟨 Gelb', value: 'yellow' },
            { label: '🟥 Rot', value: 'red' },
        ],
        en: [
            { label: '🟩 Green', value: 'green' },
            { label: '🟨 Yellow', value: 'yellow' },
            { label: '🟥 Red', value: 'red' },
        ],
        fr: [
            { label: '🟩 Vert', value: 'green' },
            { label: '🟨 Jaune', value: 'yellow' },
            { label: '🟥 Rouge', value: 'red' },
        ],
        it: [
            { label: '🟩 Verde', value: 'green' },
            { label: '🟨 Giallo', value: 'yellow' },
            { label: '🟥 Rosso', value: 'red' },
        ],
        ch: [
            { label: '🟩 Verd', value: 'green' },
            { label: '🟨 Mellen', value: 'yellow' },
            { label: '🟥 Cotschen', value: 'red' },
        ],
    }
}