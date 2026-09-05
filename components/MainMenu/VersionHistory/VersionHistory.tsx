import { Platform, View } from "react-native";
import { Divider, List, Text } from "react-native-paper";
import { defaultViewPadding } from "configs/configs";
import { usePreferenceStore } from "stores/usePreferenceStore";
import { versionHistory } from "./releaseNotes";
import { Languages } from "lib/interfaces";
import { preferenceTitles } from "lib/Text/text_settings";
import Markdown from "@ronradtke/react-native-markdown-display";

export default function VersionHistory(){

    const { language, theme } = usePreferenceStore()

    const markdownStyles = {
        strong: { fontWeight: "700" as const },
        bullet_list_icon: { color: theme.colors.onBackground },
        text: {color: theme.colors.onBackground}
    };

    return(
        <View>
            <List.Accordion left={props => <List.Icon {...props} icon="clock-start" />} title={preferenceTitles.versionHistory[language]} titleStyle={{fontWeight: "700", color: theme.colors.onBackground}}>
                <View style={{ marginLeft: 5, marginRight: 5, padding: defaultViewPadding, backgroundColor: theme.colors.secondaryContainer, borderColor: theme.colors.primary, borderLeftWidth: 5}}>
                    {versionHistory.map((version, index) =>{
                        const lang:Languages = language === "ch" ? "de" : language
                        return(
                            <View 
                                key={`VersionHistory_${index}`}
                            >
                                <Markdown style={markdownStyles}>
                                    {`**${version.title}**\n${version[lang].text}`}
                                </Markdown>
                                {Platform.OS === "ios" && version[lang].ios ? (
                                    <Markdown style={markdownStyles}>{`*iOS:*\n\n${version[lang].ios}`}</Markdown>
                                ) : null}
                                {Platform.OS === "android" && version[lang].android ? (
                                    <Markdown style={markdownStyles}>{`*Android:*\n\n${version[lang].android}`}</Markdown>
                                ) : null}
                                 <Divider style={{width: "100%", borderWidth: 0.5, borderColor: theme.colors.backdrop, marginTop: defaultViewPadding, marginBottom: defaultViewPadding}} />
                            </View>
                        )
                    })}
                </View>
            </List.Accordion>
        </View>
    )
}