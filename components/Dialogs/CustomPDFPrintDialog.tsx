import ModalContainer from "components/ModalContainer";
import { countryExclusiveFields, defaultViewPadding, pdfExcludedKeys, screenNameParamsAll } from "configs/configs";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, Text, Portal, Checkbox } from "react-native-paper";
import { usePreferenceStore } from "stores/usePreferenceStore";
import { useViewStore } from "stores/useViewStore";
import { createQRcodeDialogText } from "lib/Text/textTemplates_generateQRcodes";
import { printCustomCollection } from "functions/printers/printCustomCollectionToPDF";
import { Dropdown } from "react-native-paper-dropdown";
import { useEffect, useState } from "react";
import { CollectionType, SupportedCountries } from "lib/interfaces";
import { determineEmptyObject, determineTabBarLabel } from "functions/determinators";
import { dataTemplate_Translations } from "lib/DataTemplates/translations";
import { modalTexts } from "lib/Text/text_modals";
import { selectCollection } from "lib/textTemplates";

export default function customShippingLabelDialog(){

    const { customPDFPrintVisible, setCustomPDFPrintVisible } = useViewStore()
    const { language, theme, generalSettings, caliberDisplayNameList, preferredUnits, sortBy, country } = usePreferenceStore()

    const [selectedScreen, setSelectedScreen] = useState<CollectionType>("gunCollection")
    const [selectedAttributes, setSelectedAttributes] = useState(new Set<string>());

    useEffect(()=>{
        setSelectedAttributes(new Set())
    },[selectedScreen])

    const screenData = screenNameParamsAll.map(screen => {
            return(
                {label: `${determineTabBarLabel(screen)[language]}`, value: screen}
            )
        })

    async function handleConfirm(){
      try{
        await printCustomCollection(
            language, 
            generalSettings.caliberDisplayName, 
            caliberDisplayNameList, 
            selectedScreen as CollectionType, 
            Array.from(selectedAttributes), 
            preferredUnits,
            determineTabBarLabel(selectedScreen)[language],
            sortBy
        ),
            setSelectedAttributes(new Set())
            setCustomPDFPrintVisible(false)

        }catch(e){
            console.error(`Print Ammo Collection Error: ${e}`)
        } 
    }

    function handleCancel(){
        setCustomPDFPrintVisible(false)
        setSelectedAttributes(new Set())
    }

    function handleCheckboxPress(data:string){
        setSelectedAttributes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(data)) {
                newSet.delete(data);
            } else {
                if(selectedAttributes.size < 7){
                    newSet.add(data);
                }
            }
            return newSet;
        })
    }

    function getExcludedKeys(country: SupportedCountries){
    
      const countrySpecificExcludedKeys = Object.entries(countryExclusiveFields).filter(entry =>{
        return entry[0] !== country
      })
        const flatmapped = countrySpecificExcludedKeys.flatMap(entry => entry[1])
      return [...pdfExcludedKeys, ...flatmapped]
    }

    return (<Portal>
        <ModalContainer
                            title={modalTexts.customPDFPrinter.title[language]}
                            subtitle={modalTexts.customPDFPrinter.text[language]}
                            visible={customPDFPrintVisible}
                            setVisible={setCustomPDFPrintVisible}
                            content={
                                <View style={{ padding: defaultViewPadding, display: "flex", height: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "flex-start", alignContent: "flex-start" }}>
                                    <View style={{width: "100%"}}>
                                        <Dropdown
                                            label={selectCollection[language]}
                                            options={screenData}
                                            value={selectedScreen}
                                            onSelect={setSelectedScreen}
                                            menuContentStyle={{height: "100%"}}
                                        />
                                    </View>
                                    <View style={{width: "100%", paddingTop: defaultViewPadding, paddingBottom: defaultViewPadding}}>
                                        <ScrollView style={{marginBottom: defaultViewPadding*5}}>
                                            {Object.entries(determineEmptyObject(selectedScreen)).map((data, index) =>{
                                                if(!getExcludedKeys(country).includes(data[0]) && dataTemplate_Translations[data[0]]){
                                                    return (
                                                        <View key={`${data[0]}_${index}`} style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                                            <Checkbox.Android
                                                                status={selectedAttributes.has(data[0]) ? 'checked' : 'unchecked'}
                                                                onPress={() => handleCheckboxPress(data[0])}
                                                                
                                                            />
                                                            <Text>{dataTemplate_Translations[data[0]][language]}</Text>
                                                        </View>
                                                    )
                                                }
                                            })}
                                        </ScrollView>
                                    </View>
                                </View>
                            }
                buttonACK={<IconButton icon="printer" onPress={() => handleConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
                buttonCNL={<IconButton icon="cancel" onPress={() => handleCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />}
                buttonDEL={null}
            />
            
            </Portal>

                                )
    
}