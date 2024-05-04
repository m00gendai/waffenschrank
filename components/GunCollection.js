import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GunCollection(){
    return(
        <SafeAreaView style={styles.container}>

            <Button style={styles.button} icon="plus" mode="contained"></Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: "flex",
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 5,
      flexDirection: "row",
      padding: 5
    },
    button: {
        width: "40%",
        aspectRatio: "1/1",
    }
  });