import { Keyboard, PixelRatio, Platform, Pressable, View } from "react-native"
import { Portal, Text } from "react-native-paper"
import { usePreferenceStore } from "stores/usePreferenceStore"
import * as schema from "db/schema"
import { db } from "db/client"
import { eq, asc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useEffect, useRef, useState } from "react"
import { defaultViewPadding } from "configs/configs"
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface Props{
    title: string
    data: string
    autocompleteData: {id: string, label: string, field: string}[]
    inputText: string | string[]
    updateItemData: (text: string) => void
    charCount: number
    isFocus: boolean
    keyboardHeight: number
}

export default function Autocomplete({title, data, autocompleteData,inputText, updateItemData, charCount, isFocus, keyboardHeight}:Props){

    const { theme } = usePreferenceStore()

    const [rerender, setRerender] = useState(0)
    const [visible, setVisible] = useState<boolean>(true)
    const [hasSelected, setHasSelected] = useState<boolean>(false)

    const bottomSheetRef = useRef<BottomSheet>(null);

    function handleAutocomplete(text: string){
        updateItemData(text)
        setRerender(rerender => rerender + 1)
        setHasSelected(true)
    }

    function getMatches(){
        return autocompleteData?.some((data) =>
            data.label.toLowerCase().includes((inputText as string).toLowerCase())
        )
    }

    useEffect(() => {
        const hasMatches = getMatches()
        if (charCount >= 2 && isFocus && hasMatches) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [charCount, isFocus, autocompleteData])

    return(
        <Portal>
            {charCount >= 2 && isFocus && autocompleteData?.length > 0 && visible && !hasSelected ? <BottomSheet
                ref={bottomSheetRef}

                snapPoints={[
                    "12.5%", "25%", "50%"
                ]}
                index={1}
                handleComponent={null}   
                enableDynamicSizing={false}
                overDragResistanceFactor={1}
                keyboardBehavior="interactive"        // follows keyboard up
                keyboardBlurBehavior="restore"        // snaps back down on dismiss
                android_keyboardInputMode="adjustResize"
                bottomInset={keyboardHeight + (Platform.OS === 'android' ? 50 : 0)}
            >
                <View 
                    style={{
                        backgroundColor: theme.colors.primary,
                        padding: defaultViewPadding,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
                    }}
                >
                    <Text style={{color: theme.colors.onPrimary}}>{`Autocomplete: ${title}`}</Text>
                </View>
                
                <BottomSheetScrollView  
                    keyboardShouldPersistTaps="handled"
                >
                    {autocompleteData.map((data, index) =>{
                        if(data.label.toLowerCase().includes((inputText as string).toLowerCase())){
                            return (
                                <Pressable 
                                    style={{
                                        padding: defaultViewPadding, 
                                        backgroundColor: index%2 === 1 ? theme.colors.surfaceVariant : theme.colors.surface
                                    }}
                                    onPress={()=>handleAutocomplete(data.label)}
                                    key={data.id}
                                >
                                    <Text>{data.label}</Text>
                                </Pressable>
                            )
                        }
                        return null
                    })}
                </BottomSheetScrollView >

            </BottomSheet> : null}
        </Portal>
    )
}