import AsyncStorage from "@react-native-async-storage/async-storage"
import { defaultViewPadding, languageSelection } from "configs/configs"
import { PREFERENCES } from "configs/configs_DB"
import { Languages } from "lib/interfaces"
import { preferenceTitles } from "lib/Text/text_settings"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"
import { usePreferenceStore } from "stores/usePreferenceStore"

export default function LanguageSelection(){

    const { language, switchLanguage, theme } = usePreferenceStore()

    async function handleLanguageSwitch(lng:Languages){
        switchLanguage(lng)
        const preferences:string = await AsyncStorage.getItem(PREFERENCES)
        const newPreferences:{[key:string] : string} = preferences == null ? {"language": lng} : {...JSON.parse(preferences), "language":lng} 
        await AsyncStorage.setItem(PREFERENCES, JSON.stringify(newPreferences))
    }

    return(
        <View style={{padding: defaultViewPadding}}>
            <Text variant="titleMedium" style={{marginBottom: 10, color: theme.colors.onPrimary}}>{preferenceTitles.language[language]}</Text>
            <View style={{display: "flex", flexDirection: "row", gap: 0, flexWrap: "wrap", justifyContent: "center"}}>
                {languageSelection.map(langSelect =>{
                    return(
                        <Button 
                            style={{borderRadius: 0, marginRight: -1, marginBottom: -1}} 
                            key={langSelect.code} 
                            buttonColor={language === langSelect.code ? theme.colors.primaryContainer : theme.colors.background} 
                            onPress={()=>handleLanguageSwitch(langSelect.code)} 
                            mode="outlined"
                        >
                            {langSelect.flag}
                        </Button>
                    )
                })}
            </View>
        </View>
    )
}