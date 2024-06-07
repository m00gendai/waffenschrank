import { IconButton, List, Surface, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { GunType, AmmoType } from '../interfaces';
import { TouchableNativeFeedback, View, Modal, ScrollView } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import ColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';
import { calibers } from '../lib/caliberData';
import { usePreferenceStore } from '../stores//usePreferenceStore';

interface Props{
    data: string
    gunData?: GunType
    setGunData?: React.Dispatch<React.SetStateAction<GunType>>
    ammoData?: AmmoType
    setAmmoData?: React.Dispatch<React.SetStateAction<AmmoType>>
    label: string
}

export default function NewText({data, gunData, setGunData, ammoData, setAmmoData, label}: Props){

    const [input, setInput] = useState<string>(gunData ? gunData[data] : ammoData ? ammoData[data] : "")
    const [showDateTime, setShowDateTime] = useState<boolean>(false)
    const [date, setDate] = useState<(string | number | Date | dayjs.Dayjs)>(dayjs());
    const [initialDate, setInitialDate] = useState<string>(gunData ? gunData[data] : ammoData ? ammoData[data] : "")
    const [showModal, setShowModal] = useState(false);
    const [showModalCaliber, setShowModalCaliber] = useState<boolean>(false)
    const [color, setColor] = useState<string>(gunData ? gunData[data] : "#000")
    const [activeCaliber, setActiveCaliber] = useState<string>(gunData ? gunData[data] : ammoData? ammoData[data] : "")

    const { language, theme } = usePreferenceStore()

    function updateGunData(input:string){
        setInput(input)
        setGunData({...gunData, [data]: input})
    }

    function updateAmmoData(input:string){
        setInput(input)
        setAmmoData({...ammoData, [data]: input})
    }

    function updateDate(input){
        setInput(new Date(input).toLocaleDateString("de-CH"))
        setDate(input)
    }

    function confirmDate(){
        updateGunData(input)
        setShowDateTime(false)
        setInitialDate(input)
    }

    function cancelDate(){
        updateGunData(initialDate)
        setShowDateTime(false)
    }

    function deleteDate(){
        updateGunData("")
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
        setActiveCaliber(name)
    }

    function handleCaliberSelectConfirm(){
        gunData !== undefined && gunData ? updateGunData(activeCaliber) : updateAmmoData(activeCaliber)
        setShowModalCaliber(false)
    }

    function handleCaliberSelectCancel(){
        setActiveCaliber(gunData !== undefined && gunData ? gunData[data] : ammoData !== undefined && ammoData ? ammoData[data] : "")
        setShowModalCaliber(false)
    }

    return(
        <View style={{flex: 1}}>
            <TouchableNativeFeedback 
                style={{flex: 1}} 
                onPress={()=>{
                    data === "acquisitionDate" ? setShowDateTime(true) :
                    data === "lastCleanedAt" ? setShowDateTime(true) : 
                    data === "mainColor" ? setShowModal(true) : 
                    data === "caliber" ? setShowModalCaliber(true) : 
                    null}}
            >          
                <View style={{flex: 1}}>
                    <TextInput
                        label={label} 
                        style={{
                            flex: 1,
                        }}
                        value={input}
                        editable={data === "acquisitionDate" ? false : data === "mainColor" ? false : data === "caliber" ? false : data === "lastCleanedAt" ? false : true}
                        showSoftInputOnFocus={data === "acquisitionDate" ? false : true}
                        onChangeText={input => gunData !== undefined ? updateGunData(input) : updateAmmoData(input)}
                        onKeyPress={(e) => data === "acquisitionDate" ? e.preventDefault() : null}
                        left={data === "paidPrice" ? <TextInput.Affix text="CHF " /> : null}
                        inputMode={`${data === "paidPrice" ? "decimal" : data === "shotCount" ? "decimal" : "text"}`}
                    />
                </View>
            </TouchableNativeFeedback>
            
            {/* DATE TIME PICKER */}
            <Modal visible={showDateTime} animationType='slide' transparent>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
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
                                <IconButton mode="contained" onPress={()=>confirmDate()} icon={"check"} style={{width: 50, backgroundColor: theme.colors.primaryContainer}}/>
                                <IconButton mode="contained" onPress={()=>cancelDate()} icon={"cancel"} style={{width: 50, backgroundColor: theme.colors.secondaryContainer}} />
                                <IconButton mode="contained" onPress={()=>deleteDate()} icon={"delete"} style={{width: 50, backgroundColor: theme.colors.errorContainer}} iconColor={theme.colors.onErrorContainer}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        
            {/* COLOR PICKER */}
            <Modal visible={showModal} animationType='slide' transparent>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                        <View style={{backgroundColor: theme.colors.background, width: "100%"}}>
                            <ColorPicker style={{ width: '100%', padding: 10 }} value={gunData ? gunData[data] : "#000"} onComplete={onSelectColor}>
                                <Preview style={{marginBottom: 10}} />
                                <Panel1 style={{marginBottom: 10}} />
                                <HueSlider style={{marginBottom: 20, marginTop: 20}} />
                                <Swatches colors={["#000000", "#c0c0c0", "#e0e0e0", "#818589", "#6b8e23", "#877348", "#f6d7b0", "#ff69b4", "#ffc5cb", "#dd8a3c", "#56301d"]}/>
                            </ColorPicker>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <IconButton icon="check" onPress={() => handleColorConfirm()} style={{width: 50, backgroundColor: theme.colors.primaryContainer}} />
                                <IconButton icon="cancel" onPress={() => handleColorCancel()} style={{width: 50, backgroundColor: theme.colors.errorContainer}} iconColor={theme.colors.onErrorContainer} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* CALIBER PICKER */}
            <Modal visible={showModalCaliber} animationType='slide' transparent>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", backgroundColor: theme.colors.backdrop}}>
                    <View style={{width: "85%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
                        <View style={{backgroundColor: theme.colors.background, width: "100%", height: "80%"}}>
                            <List.Section titleStyle={{fontWeight: "bold", color: theme.colors.primary}}  title={`${activeCaliber ? activeCaliber : "Kaliber auswählen"}`} style={{width: "100%", flex:1}}>
                                <ScrollView>
                                    {calibers.map((caliber, index) =>{
                                        return(
                                            <List.Accordion
                                                title={caliber.range}
                                                key={caliber.range}
                                                style={{
                                                    backgroundColor: theme.colors.secondaryContainer
                                                }}
                                            >
                                                <View style={{backgroundColor: theme.colors.tertiaryContainer}}>
                                                    {caliber.variants.map((variant, index)=>{
                                                        return(
                                                            <List.Item key={`${variant.name}_${index}`} title={variant.name} titleStyle={{color: activeCaliber === variant.name ? theme.colors.onTertiary : theme.colors.onTertiaryContainer}} onPress={()=>handleCaliberItemSelect(variant.name)} style={{backgroundColor: activeCaliber === variant.name ? theme.colors.tertiary : "transparent"}}/>
                                                        )
                                                    })}
                                                </View>
                                            </List.Accordion>
                                        )
                                    })}
                                </ScrollView>
                            </List.Section>
                            <View style={{width: "100%", marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <IconButton icon="check" onPress={() => handleCaliberSelectConfirm()} style={{width: 50, backgroundColor: theme.colors.primaryContainer}} />
                                <IconButton icon="cancel" onPress={() => handleCaliberSelectCancel()} style={{width: 50, backgroundColor: theme.colors.errorContainer}} iconColor={theme.colors.onErrorContainer} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}