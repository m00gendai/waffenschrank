import { Dimensions, FlatList, View } from "react-native"
import { Appbar, Button, Checkbox, IconButton, List, RadioButton, Switch, Text } from "react-native-paper"
import { usePreferenceStore } from "stores/usePreferenceStore"
import * as schema from "db/schema"
import { db } from "db/client"
import { countryExclusiveFields, datePickerTriggerFields, defaultViewPadding, excludedKeysForDataTemplates } from "configs/configs"
import { ScrollView } from "react-native-gesture-handler"
import { dataTemplate_Translations } from "lib/DataTemplates/translations"
import { CollectionType, ItemType, SupportedCountries } from "lib/interfaces"
import { useRoute } from "@react-navigation/native"
import { LabelTemplate, shippingLabelData_ISO, shippingLabelData_US } from "lib/shippingLables"
import { useCallback, useState } from "react"
import QRCode from 'react-native-qrcode-skia';
import { printLabelsToPDF } from "functions/printers/printLabelsToPDF"
import { determineCardSubtitle, determineCardTitle, determineEmptyObject } from "functions/determinators"
import { useViewStore } from "stores/useViewStore"
import CustomShippingLabelDialog from "components/Dialogs/CustomShippingLabelDialog"
import { generateQRcodeText, screenTitles } from "lib/Text/textTemplates_generateQRcodes"
import { parseDate } from "functions/utils"
import { tabBarLabels } from "lib/Text/text_tabBarLabels"
import { dropDownPickerOptions } from "lib/dropDownPickerOptions"

interface RouteParams {
  collection: CollectionType,
  label: string
}

export default function GenerateQRCodes({navigation}){

    const route = useRoute()
    const params = route.params as RouteParams

    const { language, theme, generalSettings, caliberDisplayNameList, preferredUnits, sortBy, country } = usePreferenceStore()
    const { setCustomShippingLabelVisible } = useViewStore()

    const customLabels = db.select().from(schema.customShippingLabels).all()
    const shippingLabelData = [...shippingLabelData_ISO, ...shippingLabelData_US, ...customLabels]

    const [contentIndex, setContentIndex] = useState<number>(0)
    const [selectedLabel, setSelectedLabel] = useState<string>(shippingLabelData[0].id)
    const [selectedGuns, setSelectedGuns] = useState(new Set<string>());
    const [selectedFields, setSelectedFields] = useState(new Set<string>())
    const [qrCodeEnabled, setQrCodeEnabled] = useState<boolean>(true)
    const [textEnabled, setTextEnabled] = useState<boolean>(true)
    const [gridEnabled, setGridEnabled] = useState<boolean>(false)
    const [fontSize, setFontSize] = useState<number>(14)
    const [selectAllItems, setSelectAllItems] = useState<boolean>(false)
    

    const collectionItems = db.select().from(schema[params.collection]).all()

    const labelOptions_ISO = shippingLabelData_ISO.map(label => {
        return {label: `${label.name}\n${label.labelWidth}x${label.labelHeight}${label.unit}\n${label.rows*label.columns} per ${label.pageFormat}`, value: label.id}
    })

    const labelOptions_US = shippingLabelData_US.map(label => {
        return {label: `${label.name}\n${(label.labelWidth/25.4).toFixed(2)}x${(label.labelHeight/25.5).toFixed(2)} ${label.unit}\n${label.rows*label.columns} per ${label.pageFormat}`, value: label.id}
    })

    const labelOptions_Custom = customLabels.map(label =>{
        return {label: `${label.name}\n${label.labelWidth}x${label.labelHeight} ${label.unit}\n${label.rows*label.columns} per ${label.pageFormat}`, value: label.id}
    })

    const titles = screenTitles.map(title => title[language])

    const handleCheckboxPress = useCallback((id: string) => {
        setSelectedGuns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        })
    }, [])

    function getExcludedKeys(country: SupportedCountries){

      const countrySpecificExcludedKeys = Object.entries(countryExclusiveFields).filter(entry =>{
        return entry[0] !== country
      })
    
        const flatmapped = countrySpecificExcludedKeys.flatMap(entry => entry[1])
    
      return [...excludedKeysForDataTemplates, ...flatmapped]
    }

    const handleFieldCheckboxPress = useCallback((item: string) => {
        setSelectedFields(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) {
                newSet.delete(item);
            } else {
                newSet.add(item);
            }
            return newSet;
        })
    }, [])

    function selectAll(){
        setSelectAllItems(selectAllItems => !selectAllItems)

        setSelectedGuns(prev => {
            if(!selectAllItems){
                const newSet = new Set(prev);
                collectionItems.forEach(item => {
                    if (!newSet.has(item.id)) {
                        newSet.add(item.id);
                    } 
                })
                return newSet;
            } else {
                return new Set()
            }
        })
    }

    function getWidthHeight(id?:string){

        const label:LabelTemplate[] = shippingLabelData.filter(shippingLabel =>{
            return shippingLabel.id === (id ?? selectedLabel)
        })

        const displayWidth = Dimensions.get("window").width-(defaultViewPadding*2)

        const factor = displayWidth/label[0].labelWidth

        return {height: label[0].labelHeight*factor, width: label[0].labelWidth*factor}
    }

    function getRadius(id?: string){
        const label:LabelTemplate[] = shippingLabelData.filter(shippingLabel =>{
            return shippingLabel.id === (id ?? selectedLabel)
        })

        return label[0].radius
    }

    function getQRCodeSizeForPreview(){
        const labelWidthHeight = getWidthHeight()
        const labelRadius = getRadius()

        if(textEnabled){
            return (labelWidthHeight.width/3)-10
        }
        if(!textEnabled && labelRadius !== 100){
            return labelWidthHeight.width >= labelWidthHeight.height ? labelWidthHeight.height-10 : labelWidthHeight.width-10
        } else if(!textEnabled && labelRadius === 100){
            return labelWidthHeight.width >= labelWidthHeight.height ? (labelWidthHeight.width*0.7071)-10 : (labelWidthHeight.height*0.7071)-10
        }

    }

    function getSelectedItemsFromDatabase(){
        const items = collectionItems.filter(item => selectedGuns.has(item.id)) as ItemType[]
        return items
    }

    function parseText(field: string){
        if(datePickerTriggerFields.includes(field)){
            return parseDate(getSelectedItemsFromDatabase()[0][field])
        }
        if(Object.keys(dropDownPickerOptions).includes(field)){
            const targetValues = dropDownPickerOptions[field][language]
            const targetValue = targetValues.filter(value => value.value === getSelectedItemsFromDatabase()[0][field])[0]
              
            return targetValue?.label ?? ""
        }
        return getSelectedItemsFromDatabase()[0][field]
    }

    function generatePDF(){
        const label:LabelTemplate[] = shippingLabelData.filter(shippingLabel =>{
            return shippingLabel.id === selectedLabel
        })

        const itemArray = Array.from(selectedGuns)

        const qrCodeWidthHeight = getWidthHeight()

        printLabelsToPDF(
            language, 
            generalSettings.caliberDisplayName, 
            caliberDisplayNameList, 
            preferredUnits, 
            label[0],
            qrCodeEnabled,
            textEnabled,
            gridEnabled,
            fontSize,
            itemArray,
            params.collection,
            qrCodeWidthHeight,
            sortBy,
            Array.from(selectedFields)
        )
    }

    function forward(){
        setContentIndex(contentIndex => contentIndex+1)
    }
    function backward(){
        setContentIndex(contentIndex => contentIndex-1)
    }

    return(
        <View style={{flex: 1, paddingBottom: defaultViewPadding}}>
            <Appbar style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={tabBarLabels[params.label][language]}/>
            </Appbar>
            <View style={{padding: defaultViewPadding}}><Text variant="titleMedium">{titles[contentIndex]}</Text></View>
            {contentIndex === 0 ? 
                <ScrollView style={{flex: 1}}>
                    <RadioButton.Group onValueChange={value => setSelectedLabel(value)} value={selectedLabel}>
                        <List.Accordion title="A4">{labelOptions_ISO.map((label, index) => {
                        return <View 
                                    key={`label_${index}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        width: "100%",
                                        padding: defaultViewPadding
                                    }}
                                >
                                    <View 
                                    style={{
                                        width: getWidthHeight(label.value).width/10, 
                                        height: getWidthHeight(label.value).height/10, 
                                        borderWidth: 1, 
                                        borderStyle: "solid", 
                                        borderColor: "black", 
                                        borderRadius: getRadius(label.value)
                                    }}
                                >
                            </View>
                            <View style={{flex: 1}}>
                            <RadioButton.Item 
                                label={label.label} 
                                value={label.value} 
                                mode="android"
                            /></View>
                        </View>
                    })}</List.Accordion>
                     <List.Accordion title="US Letter">{labelOptions_US.map((label, index) => {
                        return <View 
                                    key={`label_${index}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        width: "100%",
                                        padding: defaultViewPadding
                                    }}
                                >
                                    <View 
                                    style={{
                                        width: getWidthHeight(label.value).width/10, 
                                        height: getWidthHeight(label.value).height/10, 
                                        borderWidth: 1, 
                                        borderStyle: "solid", 
                                        borderColor: "black", 
                                        borderRadius: getRadius(label.value)
                                    }}
                                >
                            </View>
                            <View style={{flex: 1}}>
                            <RadioButton.Item 
                                label={label.label} 
                                value={label.value} 
                                mode="android"
                            /></View>
                        </View>
                    })}</List.Accordion>
                    <List.Accordion title={generateQRcodeText.customLabel[language]}>{labelOptions_Custom.map((label, index) => {
                        return <View 
                                    key={`label_${index}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        width: "100%"
                                    }}
                                >
                                    <View 
                                    style={{
                                        width: getWidthHeight(label.value).width/10, 
                                        height: getWidthHeight(label.value).height/10, 
                                        borderWidth: 1, 
                                        borderStyle: "solid", 
                                        borderColor: "black", 
                                        borderRadius: getRadius(label.value)
                                    }}
                                >
                            </View>
                            <View style={{flex: 1}}>
                            <RadioButton.Item 
                                label={label.label} 
                                value={label.value} 
                                mode="android"
                            /></View>
                            
                        </View>
                        
                    })}</List.Accordion>
                    </RadioButton.Group>
                    <View><Button style={{backgroundColor: theme.colors.primary, alignSelf: "center"}} textColor={theme.colors.onPrimary} onPress={()=>setCustomShippingLabelVisible(true)}>{generateQRcodeText.createCustomLabel[language]}</Button></View>
                </ScrollView> 
            :
            contentIndex === 1 ? 
                <View style={{flex: 1}}>
                    <Checkbox.Item
                                label={generateQRcodeText.selectAll[language]}
                                status={selectAllItems ? "checked" : "unchecked"}
                                onPress={() => selectAll()}
                                mode="android"
                                style={{marginBottom: defaultViewPadding*2}}
                                labelStyle={{textAlign: "right"}}
                            />
                    <FlatList
                        data={collectionItems}
                        keyExtractor={(item, index) => `label_${index}`}
                        renderItem={({ item }) => (
                            <Checkbox.Item
                                label={`${determineCardTitle(params.collection, item as ItemType, language)}\n${determineCardSubtitle(params.collection, item as ItemType, language, caliberDisplayNameList, preferredUnits)}`}
                                status={selectedGuns.has(item.id) ? "checked" : "unchecked"}
                                onPress={() => handleCheckboxPress(item.id)}
                                mode="android"
                            />
                        )}
                    />
                </View> 
            :
            contentIndex === 2 ?
                <View style={{flex: 1}}>
                    <FlatList
                        data={Object.keys(determineEmptyObject(params.collection)).filter(item => !getExcludedKeys(country).includes(item) && dataTemplate_Translations[item])}
                        keyExtractor={(item, index) => `label_${index}`}
                        renderItem={({ item }) => (
                            <Checkbox.Item
                                label={dataTemplate_Translations[item][language]}
                                status={selectedFields.has(item) ? "checked" : "unchecked"}
                                onPress={() => handleFieldCheckboxPress(item)}
                                mode="android"
                            />
                        )}
                    />
                </View> 
            :
            contentIndex === 3 ? 
                <View style={{flex: 1}}>
                    <View 
                        style={{
                            width: getWidthHeight().width, 
                            height: getWidthHeight().height, 
                            borderColor: theme.colors.primary,
                            borderWidth: 1,
                            alignSelf: "center",
                            display: "flex",
                            flexDirection: "row",
                            overflow: "hidden",
                            borderRadius: `${getRadius()}%`
                            }}
                        >
                            {qrCodeEnabled ? <View style={{padding: defaultViewPadding, display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center", flexDirection: "row", flex: 1}}>
                                <QRCode
                                    value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    size={getQRCodeSizeForPreview()}
                                    color={`${theme.colors.onBackground}`}
                                />
                            </View> : null}
                            {textEnabled ? <View style={{padding: defaultViewPadding, flexDirection: 'column', flex: 2, flexShrink: 1}}>
                                {Array.from(selectedFields).map((field, index) =>{
                                    if(getSelectedItemsFromDatabase()[0][field]){
                                        return( 
                                            <View key={`selectedFields_${field}_${index}`}>
                                                <Text style={{fontSize: fontSize}}>{`${dataTemplate_Translations[field][language]}:`}</Text>
                                                <Text style={{fontSize: fontSize, fontWeight: "bold"}} numberOfLines={1} >{parseText(field)}</Text>
                                            </View>
                                        )
                                    }
                                })}
                            </View> : null}
                        </View>
                        <View style={{padding: defaultViewPadding}}>
                            <Text style={{fontStyle: "italic"}}>{generateQRcodeText.previewNotice[language]}</Text>
                            <View style={{marginTop: defaultViewPadding*2}}>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <Text>{generateQRcodeText.withQRcode[language]}</Text>
                                    <Switch value={qrCodeEnabled} onValueChange={()=> setQrCodeEnabled(prev => !prev)} />
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <Text>{generateQRcodeText.withText[language]}</Text>
                                    <Switch value={textEnabled} onValueChange={()=> setTextEnabled(prev => !prev)} />
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <Text>{generateQRcodeText.withGrid[language]}</Text>
                                    <Switch value={gridEnabled} onValueChange={()=> setGridEnabled(prev => !prev)} />
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <Text>{generateQRcodeText.fontSize[language]}</Text>
                                    <IconButton size={14} mode={"contained"} icon={"minus"} onPress={() => fontSize >= 2 ? setFontSize(prev => prev-1) : null} />
                                    <Text>{fontSize}</Text>
                                    <IconButton size={14} mode={"contained"} icon={"plus"} onPress={() => setFontSize(prev => prev+1)} />
                                </View>
                            </View>
                        </View>
                </View>
            :
            null
            }

            <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: defaultViewPadding}}>
                            {contentIndex !== 0 ? <IconButton
                                icon="chevron-left"
                                iconColor={theme.colors.onPrimary}
                                size={25}
                                onPress={() => backward()}
                                style={{backgroundColor: theme.colors.primary}}
                            /> : <IconButton
                                icon=""
                                iconColor={theme.colors.onPrimary}
                                size={25}
                                onPress={null}
                            />}
                            {contentIndex !== 3 ? <IconButton
                                icon="chevron-right"
                                iconColor={theme.colors.onPrimary}
                                size={25}
                                onPress={() => forward()}
                                style={{backgroundColor: theme.colors.primary}}
                            /> : <IconButton
                                icon="file-pdf-box"
                                iconColor={theme.colors.onPrimary}
                                size={25}
                                onPress={() => generatePDF()}
                                style={{backgroundColor: theme.colors.primary}}
                            />}
                        </View>
                        <CustomShippingLabelDialog />
            </View>
    )
}