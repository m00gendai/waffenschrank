import { IconButton, List, Surface, TextInput, Text, Badge, Portal, Modal } from 'react-native-paper';
import { useState } from 'react';
import { GunType, AmmoType } from '../interfaces';
import { TouchableNativeFeedback, View, ScrollView } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import ColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';
import { calibers } from '../lib/caliberData';
import { usePreferenceStore } from '../stores//usePreferenceStore';
import { defaultModalBackdrop, defaultViewPadding, requiredFieldsAmmo, requiredFieldsGun } from '../configs';

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
    const [color, setColor] = useState<string>(gunData ? gunData[data] : "#000")
    const [activeCaliber, setActiveCaliber] = useState<string[]>(gunData && data === "caliber" && gunData[data] !== undefined ? gunData[data] : ammoData && data === "caliber" && ammoData[data] !== undefined ? [ammoData[data]] : [])


    const [charCount, setCharCount] = useState(0)
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    const [isFocus, setFocus] = useState<boolean>(false)

    const MAX_CHAR_COUNT: number = 100

    const { language, theme } = usePreferenceStore()

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
        setColor(hex)
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

function handleFocus(){
    setFocus(true)
    setCharCount(input !== undefined ? input.length : 0)
}

    return(
        <View style={{flex: 1}}>
            <TouchableNativeFeedback 
                style={{flex: 1}} 
                onPress={()=>{
                    data === "acquisitionDate" ? setShowDateTime(true) :
                    data === "lastCleanedAt" ? setShowDateTime(true) : 
                    data === "lastShotAt" ? setShowDateTime(true) : 
                    data === "mainColor" ? setShowModal(true) : 
                    data === "caliber" ? setShowModalCaliber(true) : 
                    data === "lastTopUpAt" ? setShowDateTime(true) : 
                    null}}
            >          
                <View style={{flex: 1}}>
                    <TextInput
                        label={`${label}${gunData !== undefined ? requiredFieldsGun.includes(data) ? "*" : "" : requiredFieldsAmmo.includes(data) ? "*" : ""} ${isFocus ? `${charCount}/${MAX_CHAR_COUNT}` : ``}`} 
                        style={{
                            flex: 1,
                        }}
                        onFocus={()=>handleFocus()}
                        onBlur={()=>setFocus(false)}
                        value={input === undefined ? "" : input.toString()}
                        editable={data === "acquisitionDate" ? false : data === "mainColor" ? false : data === "caliber" ? false : data === "lastCleanedAt" ? false : data === "lastShotAt" ? false : data === "lastTopUpAt" ? false : true}
                        showSoftInputOnFocus={data === "acquisitionDate" ? false : true}
                        onChangeText={input => gunData !== undefined ? updateGunData(input) : updateAmmoData(input)}
                        onKeyPress={({nativeEvent}) => setIsBackspace(nativeEvent.key === "Backspace" ? true : false)}
                        left={data === "paidPrice" ? <TextInput.Affix text="CHF " /> : null}
                        inputMode={`${data === "paidPrice" ? "decimal" : data === "shotCount" ? "decimal" : "text"}`}
                        multiline={gunData && Array.isArray(gunData[data])}
                    />
                </View>
            </TouchableNativeFeedback>
            
            {/* DATE TIME PICKER */}
            <Portal>
            <Modal visible={showDateTime} onDismiss={()=>setShowDateTime(false)}>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: defaultModalBackdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>

                            <View style={{backgroundColor: theme.colors.background, width: "100%"}}>
                                <DateTimePicker
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
                                />
                            
                            <View style={{width: "100%", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between"}}>
                                <IconButton mode="contained" onPress={()=>confirmDate()} icon={"check"} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                                <IconButton mode="contained" onPress={()=>cancelDate()} icon={"cancel"} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} />
                                <IconButton mode="contained" onPress={()=>deleteDate()} icon={"delete"} style={{width: 50, backgroundColor: theme.colors.errorContainer}} iconColor={theme.colors.onErrorContainer}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            </Portal>
        
            {/* COLOR PICKER */}
            <Portal>
            <Modal visible={showModal} onDismiss={()=>setShowModal(false)}>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: defaultModalBackdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                        <View style={{backgroundColor: theme.colors.background, width: "100%"}}>
                            <ColorPicker style={{ width: '100%', padding: 10 }} value={gunData ? gunData[data] : "#000"} onComplete={onSelectColor}>
                                <Preview style={{marginBottom: 10}} />
                                <Panel1 style={{marginBottom: 10}} />
                                <HueSlider style={{marginBottom: 20, marginTop: 20}} />
                                <Swatches colors={["#000000", "#c0c0c0", "#e0e0e0", "#818589", "#6b8e23", "#877348", "#f6d7b0", "#ff69b4", "#ffc5cb", "#dd8a3c", "#56301d"]}/>
                            </ColorPicker>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <IconButton icon="check" onPress={() => handleColorConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                                <IconButton icon="cancel" onPress={() => handleColorCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            </Portal>


            {/* CALIBER PICKER */}
            <Portal>
            <Modal visible={showModalCaliber} onDismiss={()=>setShowModalCaliber(false)}>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: defaultModalBackdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                        <View style={{backgroundColor: theme.colors.background, width: "100%", height: "90%"}}>
                            <List.Section style={{flex: 1}}>
                                <View style={{padding: defaultViewPadding}}>
                                    <Text variant="titleMedium" style={{color: theme.colors.primary}}>{`${Array.isArray(activeCaliber) && activeCaliber.length !== 0 ? activeCaliber.join("\n") : "Kaliber auswählen"}`}</Text>
                               </View>
                                <ScrollView>
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
                            </List.Section>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <IconButton icon="check" onPress={() => handleCaliberSelectConfirm()} style={{width: 50, backgroundColor: theme.colors.primary}} iconColor={theme.colors.onPrimary}/>
                                <IconButton icon="cancel" onPress={() => handleCaliberSelectCancel()} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} iconColor={theme.colors.onSecondaryContainer} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            </Portal>
        </View>
    )
}