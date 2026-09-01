import { defaultViewPadding } from "configs/configs";
import { printGunCollection } from "functions/printers/printGunCollectionToPDF";
import { iosWarningText } from "lib/textTemplates";
import { useState } from "react";
import { Platform, View } from "react-native";
import { Button, Dialog, Divider, IconButton, List, Portal, Text } from "react-native-paper";
import { usePreferenceStore } from "stores/usePreferenceStore";
import { CollectionType, ListPrinter } from "lib/interfaces";
import { determineAccessoryIcons, determineCountryPrinters } from "functions/determinators";
import { printAmmoCollection } from "functions/printers/printAmmoCollectionToPDF";
import { useViewStore } from "stores/useViewStore";
import CustomPDFPrintDialog from "components/Dialogs/CustomPDFPrintDialog";
import { preferenceTitles } from "lib/Text/text_settings";

export default function Lists(){

    const { language, theme, generalSettings, caliberDisplayNameList, preferredUnits, country } = usePreferenceStore()
    const { customPDFPrintVisible, setCustomPDFPrintVisible } = useViewStore()

    const [printerSrc, setPrinterSrc] = useState<ListPrinter>(null)
    const [iosWarning, toggleiosWarning] = useState<boolean>(false)

    async function handlePrints(printer: ListPrinter){
        if(printer === null){
            return
        }
        toggleiosWarning(false)
        if(printer.startsWith("gunCollection")){
            try {
                await printGunCollection(language, generalSettings.caliberDisplayName, caliberDisplayNameList, printer, preferredUnits, country)
            }catch(e){
                console.error(`Print Gun Collection Error: ${e}`)
            }
        }
        if(printer.startsWith("ammoCollection")){
            try{
                await printAmmoCollection(language, generalSettings.caliberDisplayName, caliberDisplayNameList, printer, preferredUnits)
            }catch(e){
                console.error(`Print Ammo Collection Error: ${e}`)
            }
        }
        if(printer === "custom"){
            setCustomPDFPrintVisible(true)
        }
    }
    
    async function handleIOSprints(printer: ListPrinter){
        setPrinterSrc(printer)
        toggleiosWarning(true)
    }

    const listConstructor:{title: string, icon: string | CollectionType, print: ListPrinter}[] = [
        {
            title: preferenceTitles.printAllGuns[language],
            icon: "d_gunCollection",
            print: "gunCollection",
        },
        {
            title: preferenceTitles.printArt5[language],
            icon: "d_gunCollection",
            print: "gunCollectionArt5",
        },
        {
            title: preferenceTitles.printGunsHybrid[language],
            icon: "d_gunCollection",
            print: "gunCollectionHybrid",
        },
        {
            title: preferenceTitles.printCustomList[language],
            icon: "shape-plus",
            print: "custom",
        },
    ]
    
    return(
        <View>
            
            <List.Accordion left={props => <List.Icon {...props} icon="printer" />} title={preferenceTitles.gunList[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", gap: 5}}>
                        {listConstructor.map((entry, index) => {
                            if(determineCountryPrinters(country).includes(entry.print)){
                                const icon: string | CollectionType = entry.icon.startsWith("d_") ? entry.icon.split("_")[1] : entry.icon
                                return(
                                    <View key={`listConstructorItem_${index}`}>
                                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                                            <Text style={{width: "80%"}}>{entry.title}</Text>
                                            <IconButton icon={entry.icon.startsWith("d_") ? determineAccessoryIcons(icon as CollectionType) : icon} onPress={()=> handlePrints(entry.print)} mode="contained" iconColor={theme.colors.onPrimary} style={{backgroundColor: theme.colors.primary}}/>
                                        </View>

                                        {index !== listConstructor.length-1 ? <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.onSecondary}} /> : null}
                                    </View>
                                )
                            }
                        })}
                        
                        
                    </View>
                </View>
            </List.Accordion>
            
            <CustomPDFPrintDialog />

            <Portal>
                <Dialog visible={iosWarning} onDismiss={()=>toggleiosWarning(false)}>
                    <Dialog.Title>
                        {iosWarningText.title[language]}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text>{iosWarningText.text[language]}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>handlePrints(printerSrc)} icon="heart" buttonColor={theme.colors.errorContainer} textColor={theme.colors.onErrorContainer}>{iosWarningText.ok[language]}</Button>
                        <Button onPress={()=>toggleiosWarning(false)} icon="heart-broken" buttonColor={theme.colors.secondary} textColor={theme.colors.onSecondary}>{iosWarningText.cancel[language]}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        
        </View>
    )
}