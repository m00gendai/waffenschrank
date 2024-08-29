import { IconButton, List, Surface, TextInput, Text, Badge, Portal, Modal, RadioButton, Divider, Button, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import { GunType, AmmoType } from '../interfaces';
import { TouchableNativeFeedback, View, ScrollView, Pressable, Platform, Keyboard } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import ColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';
import { calibers } from '../lib/caliberData';
import { usePreferenceStore } from '../stores//usePreferenceStore';
import { defaultModalBackdrop, defaultViewPadding, requiredFieldsAmmo, requiredFieldsGun } from '../configs';
import ModalContainer from './ModalContainer';
import { caliberPickerStrings, cleanIntervals, modalTexts } from '../lib/textTemplates';
import { GetColorName } from 'hex-color-to-color-name';
import { useGunStore } from '../stores/useGunStore';

interface Props{
    data: string
    gunData?: GunType
    setGunData?: React.Dispatch<React.SetStateAction<GunType>>
    ammoData?: AmmoType
    setAmmoData?: React.Dispatch<React.SetStateAction<AmmoType>>
    label: string
}

export default function NewText({data, gunData, setGunData, ammoData, setAmmoData, label}: Props){

    const [input, setInput] = useState<string>(gunData ? Array.isArray(gunData[data]) ? gunData[data].join("\n") : gunData[data] : ammoData ? ammoData[data] : "")
    const [showDateTime, setShowDateTime] = useState<boolean>(false)
    const [date, setDate] = useState<(string | number | Date | dayjs.Dayjs)>(dayjs());
    const [initialDate, setInitialDate] = useState<string>(gunData ? gunData[data] : ammoData ? ammoData[data] : "")
    const [showModal, setShowModal] = useState(false);
    const [showModalCaliber, setShowModalCaliber] = useState<boolean>(false)
    const [showCleanModal, setShowCleanModal] = useState<boolean>(false)
    const [color, setColor] = useState<string>(gunData ? gunData[data] : "#000")
    const [activeCaliber, setActiveCaliber] = useState<string[]>(gunData && data === "caliber" && gunData[data] !== undefined ? gunData[data] : ammoData && data === "caliber" && ammoData[data] !== undefined ? [ammoData[data]] : [])
    const [cleanInterval, setCleanInterval] = useState<string | null>(null)
    const [checked, setChecked] = useState<string>("-")
    const [caliberView, setCaliberView] = useState<"search" | "list">("list")

    const { language, theme } = usePreferenceStore()
    const { currentGun } = useGunStore()

    const [charCount, setCharCount] = useState(0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    const [isFocus, setFocus] = useState<boolean>(false)
    const [caliberQuery, setCaliberQuery] = useState<string>("")

    const MAX_CHAR_COUNT: number = 100
    const cleanIntervalOptions:string[] = ["none", "day_1", "day_7", "day_14", "month_1", "month_3", "month_6", "month_9", "year_1", "year_5", "year_10"]    

    function updateGunData(input:string | string[]){
        if(charCount < MAX_CHAR_COUNT){
            setCharCount(input !== undefined ? input.length : 0)
            setInput(Array.isArray(input) ? input.join("\n") : input)
            setGunData({...gunData, [data]: input})
        }
        if(charCount >= MAX_CHAR_COUNT && isBackspace){
            setCharCount(input !== undefined ? input.length : 0)
            setInput(Array.isArray(input) ? input.join("\n") : input)
            setGunData({...gunData, [data]: input})
        }
    }

    function updateAmmoData(input:string){
        if(charCount < MAX_CHAR_COUNT){
            setCharCount(input !== undefined ? input.length : 0)
            setInput(input)
            setAmmoData({...ammoData, [data]: input})
        }
        if(charCount >= MAX_CHAR_COUNT && isBackspace){
            setCharCount(input !== undefined ? input.length : 0)
            setInput(input)
            setAmmoData({...ammoData, [data]: input})
        }
    }

    function updateDate(input){
        setInput(new Date(input).toLocaleDateString("de-CH"))
        setDate(input)
    }

    function confirmDate(){
        gunData !== undefined ? updateGunData(input) : updateAmmoData(input)
        setShowDateTime(false)
        setInitialDate(input)
    }

    function cancelDate(){
        gunData !== undefined ? updateGunData(initialDate) : updateAmmoData(initialDate)
        setShowDateTime(false)
    }

    function deleteDate(){
        gunData !== undefined ? updateGunData("") : updateAmmoData("")
        setShowDateTime(false)
    }

    const onSelectColor = ({ hex }) => {
        console.log(hex.length)
        if(hex.length === 9){
            setColor(hex.substring(0,7))
        } else {
            setColor(hex)
        }
        
    };

    function handleColorConfirm(){
        updateGunData(color)
        setShowModal(false)
    }

    function handleColorCancel(){
        setColor(gunData ? gunData[data] : "#000")
        setShowModal(false)
    }

    function handleCaliberItemSelect(name:string){
        if(gunData !== undefined){
        if(activeCaliber.includes(name)){
            const index: number = activeCaliber.indexOf(name)
            const newActiveCaliber: string[] = Array.isArray(activeCaliber) ? activeCaliber.toSpliced(index, 1) : []
            setActiveCaliber(newActiveCaliber)
        }
        if(!activeCaliber.includes(name)){
            activeCaliber.length !== 0 ? Array.isArray(activeCaliber) ? setActiveCaliber([...activeCaliber, name]) : setActiveCaliber([activeCaliber, name]) : setActiveCaliber([name])
        }
    }
    if(ammoData !== undefined){
        if(activeCaliber.includes(name)){
            setActiveCaliber([])
        }
        if(!activeCaliber.includes(name)){
            setActiveCaliber([name])
        }
    }
    }

    function handleCaliberSelectConfirm(){
        gunData !== undefined && gunData ? updateGunData(activeCaliber) : updateAmmoData(activeCaliber.toString())
        setShowModalCaliber(false)
    }

    function handleCaliberSelectCancel(){
        setActiveCaliber(gunData !== undefined && gunData ? gunData[data] : ammoData !== undefined && ammoData ? ammoData[data] : "")
        setShowModalCaliber(false)
    }

    function handleCleanIntervalConfirm(){
        updateGunData(checked)
        setShowCleanModal(false)
    }

    function handleCleanIntervalCancel(){
        setShowCleanModal(false)
    }

function handleFocus(){
    setFocus(true)
    setCharCount(input !== undefined && input !== null ? input.length : 0)
}

function handleInputPress(){
    Keyboard.dismiss()
        data === "acquisitionDate" ? setShowDateTime(true) :
        data === "lastCleanedAt" ? setShowDateTime(true) : 
        data === "lastShotAt" ? setShowDateTime(true) : 
        data === "mainColor" ? setShowModal(true) : 
        data === "caliber" ? setShowModalCaliber(true) : 
        data === "lastTopUpAt" ? setShowDateTime(true) : 
        data === "cleanInterval" ? setShowCleanModal(true) :
        null
    }

    return(

          <View style={{flex: 1}}>
                <Pressable style={{flex: 1}} onPress={()=>{Platform.OS === "android" ? handleInputPress() : null}}>
                    <TextInput
                        label={`${label}${gunData !== undefined ? requiredFieldsGun.includes(data) ? "*" : "" : requiredFieldsAmmo.includes(data) ? "*" : ""} ${isFocus ? `${charCount}/${MAX_CHAR_COUNT}` : ``}`} 
                        style={{
                            flex: 1,
                        }}
                        onFocus={()=>handleFocus()}
                        onBlur={()=>setFocus(false)}
                        value={input === undefined ? "" : input === null ? "" : data === "cleanInterval" && gunData[data] !== undefined && gunData[data] ? cleanIntervals[input][language] : input.toString()}
                        editable={data === "acquisitionDate" ? false : data === "mainColor" ? false : data === "caliber" ? false : data === "lastCleanedAt" ? false : data === "lastShotAt" ? false : data === "lastTopUpAt" ? false : data === "cleanInterval" ? false : true}
                        showSoftInputOnFocus={data === "acquisitionDate" ? false : true}
                        onChangeText={input => gunData !== undefined ? updateGunData(input) : updateAmmoData(input)}
                        onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
                        left={data === "paidPrice" ? <TextInput.Affix text="CHF " /> : data === "marketValue" ? <TextInput.Affix text="CHF " />  : null}
                        inputMode={`${data === "paidPrice" ? "decimal" : data === "marketValue" ? "decimal" : data === "shotCount" ? "decimal" : "text"}`}
                        multiline={gunData && Array.isArray(gunData[data])}
                        onPress={()=>{Platform.OS === "ios" ? handleInputPress() : null}}
                        returnKeyType='done'
                        returnKeyLabel='OK'
                        onSubmitEditing={()=>Keyboard.dismiss()}
                    />
                </Pressable>
           
            
            {/* DATE TIME PICKER */}
            <ModalContainer 
                title={modalTexts.datePicker.title[language]} 
                subtitle={modalTexts.datePicker.text[language]} 
                visible={showDateTime} 
                setVisible={setShowDateTime}
                content={<DateTimePicker
                            mode="single"
                            locale="de"
                            date={date}
                            onChange={(params) => updateDate(params.date)}
                            selectedItemColor={theme.colors.primaryContainer}
                            calendarTextStyle={{color: theme.colors.onBackground}}
                            headerTextStyle={{color: theme.colors.primary}}
                            weekDaysTextStyle={{color: theme.colors.onBackground}}
                            headerButtonColor={theme.colors.primary}
                            monthContainerStyle={{backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.secondaryContainer}}
                            yearContainerStyle={{backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.secondaryContainer}}
                        />}
                buttonACK={<IconButton mode="contained" onPress={()=>confirmDate()} icon={"check"} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
                buttonCNL={<IconButton mode="contained" onPress={()=>cancelDate()} icon={"cancel"} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} />}
                buttonDEL={<IconButton mode="contained" onPress={()=>deleteDate()} icon={"delete"} style={{width: 50, backgroundColor: theme.colors.errorContainer}} iconColor={theme.colors.onErrorContainer}/>}
             />
        
            {/* COLOR PICKER */}
            <ModalContainer
                title={modalTexts.colorPicker.title[language]}
                subtitle={modalTexts.colorPicker.text[language]}
                visible={showModal}
                setVisible={setShowModal}
                content={<ColorPicker style={{ width: '100%', padding: 10 }} value={gunData ? gunData[data] : "#000"} onComplete={onSelectColor}>
                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}><Text>{currentGun ? GetColorName(currentGun.mainColor) : ""}</Text><Text>{GetColorName(color)}</Text></View>
                <Preview style={{marginBottom: 10}} />
                <Panel1 style={{marginBottom: 10}} />
                <HueSlider style={{marginBottom: 20, marginTop: 20}} />
                <Swatches colors={["#000000", "#c0c0c0", "#e0e0e0", "#818589", "#6b8e23", "#877348", "#f6d7b0", "#ff69b4", "#ffc5cb", "#dd8a3c", "#56301d"]}/>
            </ColorPicker>}
            buttonACK={<IconButton icon="check" onPress={() => handleColorConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
            buttonCNL={<IconButton icon="cancel" onPress={() => handleColorCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />}
            buttonDEL={null}
            />

            {/* CALIBER PICKER */}
            <ModalContainer
                title={modalTexts.caliberPicker.title[language]}
                subtitle={modalTexts.caliberPicker.text[language]}
                visible={showModalCaliber}
                setVisible={setShowModalCaliber}
                content={<List.Section style={{width: "100%", flexDirection: "column", height: "100%"}}>
                    <ScrollView style={{height: "20%", width: "100%", backgroundColor: theme.colors.background}}>
                    <Text variant="titleMedium" style={{color: theme.colors.primary, padding: defaultViewPadding}}>{`${Array.isArray(activeCaliber) && activeCaliber.length !== 0 ? activeCaliber.join("\n") : caliberPickerStrings.caliberSelection[language]}`}</Text>
               </ScrollView>
               <View style={{height: "10%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: defaultViewPadding}}>
                    <TouchableNativeFeedback onPress={()=>setCaliberView("list")}><View style={{borderTopLeftRadius: 15, borderBottomLeftRadius: 15, position: "relative", width: "50%", height: "100%", backgroundColor: caliberView === "list" ? theme.colors.primary : "transparent", borderWidth: 1, borderColor: caliberView === "search" ? theme.colors.primary : "transparent", display: "flex", justifyContent: "flex-start", flexDirection: "row", alignItems: "center", paddingLeft: defaultViewPadding}}><Text style={{color: caliberView === "list" ? theme.colors.onPrimary : theme.colors.onBackground}}>{caliberPickerStrings.tabList[language]}</Text></View></TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>setCaliberView("search")}><View style={{borderTopRightRadius: 15, borderBottomRightRadius: 15, position: "relative", width: "50%", height: "100%", backgroundColor: caliberView === "search" ? theme.colors.primary : "transparent", borderWidth: 1, borderColor: caliberView === "list" ? theme.colors.primary : "transparent", display: "flex", justifyContent: "flex-end", flexDirection: "row", alignItems: "center", paddingRight: defaultViewPadding}}><Text style={{color: caliberView === "search" ? theme.colors.onPrimary : theme.colors.onBackground}}>{caliberPickerStrings.tabSearch[language]}</Text></View></TouchableNativeFeedback>
                </View>
                {caliberView === "list" ?
                <ScrollView style={{height: "70%", width: "100%", backgroundColor: "yellow"}}>
                {calibers.map((caliber, index) =>{
                        return(
                            <List.Accordion
                                title={caliber.range}
                                key={caliber.range}
                                style={{
                                    backgroundColor: theme.colors.secondaryContainer,
                                }}
                            >
                                <View style={{backgroundColor: theme.colors.tertiaryContainer}}>
                                    {caliber.variants.map((variant, index)=>{
                                        return(
                                            <List.Item key={`${variant.name}_${index}`} title={variant.name} titleStyle={{color: activeCaliber !== undefined && activeCaliber !== null && activeCaliber.length !== 0 && activeCaliber.includes(variant.name) ? theme.colors.onTertiary : theme.colors.onTertiaryContainer}} onPress={()=>handleCaliberItemSelect(variant.name)} style={{backgroundColor: activeCaliber.includes(variant.name) ? theme.colors.tertiary : "transparent"}}/>
                                        )
                                    })}
                                </View>

                            </List.Accordion>
                        )
                    })}
                </ScrollView>
                :
                <View style={{height: "70%"}}>
                <View style={{padding: defaultViewPadding}}>
                <Searchbar
      placeholder={caliberPickerStrings.tabSearch[language]}
      onChangeText={setCaliberQuery}
      value={caliberQuery}
    />
                </View>
                <ScrollView>
                {calibers.map((caliber, index) =>{
                        return caliber.variants.map((variant, index)=>{
                            if(variant.name.toLowerCase().includes(caliberQuery.toLowerCase())){
                            return(
                                <List.Item key={`${variant.name}_${index}`} title={variant.name} titleStyle={{color: activeCaliber !== undefined && activeCaliber !== null && activeCaliber.length !== 0 && activeCaliber.includes(variant.name) ? theme.colors.onTertiary : theme.colors.onTertiaryContainer}} onPress={()=>handleCaliberItemSelect(variant.name)} style={{backgroundColor: activeCaliber.includes(variant.name) ? theme.colors.tertiary : "transparent"}}/>
                            )}
                        })})}
                </ScrollView>
                </View>}
            </List.Section>}
            buttonACK={<IconButton icon="check" onPress={() => handleCaliberSelectConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
            buttonCNL={<IconButton icon="cancel" onPress={() => handleCaliberSelectCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />}
            buttonDEL={null}
            />

            {/* CLEAN INTERVAL */}
            <ModalContainer
                title={modalTexts.cleanInterval.title[language]}
                subtitle={modalTexts.cleanInterval.text[language]}
                visible={showCleanModal}
                setVisible={setShowCleanModal}
                content={<View style={{width: "100%", display: "flex", padding: defaultViewPadding}}>
                    <ScrollView>
                        {cleanIntervalOptions.map((option, index)=>{
                            return (
                                <View key={`cleanIntervalOption__${index}`}>
                                    <TouchableNativeFeedback onPress={() => setChecked(option)}>
                                        <View style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center", marginBottom: defaultViewPadding, marginTop: defaultViewPadding}}>
                                            <Text style={{flex: 9}}>{cleanIntervals[option][language]}</Text>
                                            <RadioButton
                                                value={option}
                                                status={ checked === option ? 'checked' : 'unchecked' }
                                                onPress={() => setChecked(option)}
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
                                    {index < cleanIntervalOptions.length-1 ? <Divider /> : null}
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>}
                buttonACK={<IconButton icon="check" onPress={() => handleCleanIntervalConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>}
                buttonCNL={<IconButton icon="cancel" onPress={() => handleCleanIntervalCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />}
                buttonDEL={null}
            />
           </View>
    )
}