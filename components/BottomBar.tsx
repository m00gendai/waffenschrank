import { TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { usePreferenceStore } from "../stores/usePreferenceStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { tabBarLabels } from "../lib/textTemplates";

type RootStackParamList = {
  GunCollection: undefined;
  AmmoCollection: undefined;
  // Add other routes here if needed
};

type BottomBarNavigationProp = StackNavigationProp<RootStackParamList>;


export default function BottomBar(){

    type RootStackParamList = {
        GunCollection: undefined;
        AmmoCollection: undefined;
        // Add other routes here if needed
      };
      

    const { displayAsGrid, toggleDisplayAsGrid, sortBy, setSortBy, language, setSortGunIcon, sortGunIcon, sortGunsAscending, toggleSortGunsAscending, theme } = usePreferenceStore()
    const navigation = useNavigation<BottomBarNavigationProp>()
    
    return(
        <View style={{width: "100%", height: 60, backgroundColor: theme.colors.backdrop, flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
      <TouchableOpacity onPress={()=>navigation.navigate("GunCollection")} style={{ alignItems: 'center' }}>
        <Icon source="pistol" size={24} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.primary, marginTop: 4 }}>{tabBarLabels.gunCollection[language]}</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>navigation.navigate("AmmoCollection")} style={{ alignItems: 'center' }}>
        <Icon source="bullet" size={24} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.primary, marginTop: 4 }}>{tabBarLabels.ammoCollection[language]}</Text>
       </TouchableOpacity>
          </View>
    )
}