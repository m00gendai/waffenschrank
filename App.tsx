import { PaperProvider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react"
import {PREFERENCES } from "./configs"
import 'react-native-gesture-handler';
import React from 'react';
import { usePreferenceStore } from './stores/usePreferenceStore';
import { useViewStore } from './stores/useViewStore';
import GunCollection from './components/GunCollection';
import MainMenu from './components/mainMenu';


export default function App() {

  const { switchLanguage, theme, switchTheme } = usePreferenceStore();
  const { mainMenuOpen } = useViewStore()
  
  useEffect(()=>{
    async function getPreferences(){
      const preferences:string = await AsyncStorage.getItem(PREFERENCES)
      const isPreferences = preferences === null ? null : JSON.parse(preferences)
      
      switchLanguage(isPreferences === null ? "de" : isPreferences.language === null ? "de" : isPreferences.language)
      switchTheme(isPreferences === null ? "de" : isPreferences.theme === null ? "de" : isPreferences.theme)
    }
    getPreferences()
  },[])


  return (
    <PaperProvider theme={theme}>
      <GunCollection />
      {mainMenuOpen ? 
      <MainMenu />
      : 
      null}
    </PaperProvider>
  )}
