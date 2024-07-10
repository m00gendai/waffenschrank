import { Modal, Portal, Text } from "react-native-paper";
import { defaultModalBackdrop, defaultViewPadding } from "../configs";
import { ScrollView, View } from "react-native";
import { usePreferenceStore } from "../stores/usePreferenceStore";

interface Props{
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    subtitle: string
    content: React.ReactNode
    buttonACK: React.ReactNode
    buttonCNL: React.ReactNode
    buttonDEL: React.ReactNode
}

export default function ModalContainer({visible, setVisible, title, subtitle, content, buttonACK, buttonCNL, buttonDEL}:Props){

    const { language, theme } = usePreferenceStore()
    
    return(
        <Portal>
            <Modal visible={visible} onDismiss={()=>setVisible(false)}>
                <View style={{width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", flexWrap: "wrap", backgroundColor: defaultModalBackdrop}}>
                    <View style={{borderRadius: 25, width: "85%", height: "85%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap", backgroundColor: theme.colors.background}}>
                        <View style={{borderTopLeftRadius: 25, borderTopRightRadius: 25, width: "100%", flex: 2.5, backgroundColor: theme.colors.background, borderBottomColor: theme.colors.primary, borderBottomWidth: 1, marginBottom: 5}}>
                            <Text variant="titleLarge" style={{color: theme.colors.primary, padding: defaultViewPadding}}>{title}</Text>
                            <ScrollView>
                                <Text variant="bodySmall" style={{width: "100%", padding: defaultViewPadding, backgroundColor: theme.colors.background}}>{subtitle}</Text>
                            </ScrollView>
                        </View>
                        <View style={{flex: 8, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        {content}
                        </View>
                        <View style={{flex: 1, width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: theme.colors.primary, padding: defaultViewPadding, borderBottomLeftRadius: 25, borderBottomRightRadius: 25}}>
                            {buttonACK}
                            {buttonDEL}
                            {buttonCNL}
                        </View>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}