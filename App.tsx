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
      
      switchLanguage(isPreferences === null ? "de" : isPreferences.language === undefined ? "de" : isPreferences.language)
      switchTheme(isPreferences === null ? "default" : isPreferences.theme === undefined ? "default" : isPreferences.theme)
    }
    getPreferences()
  },[])

  const currentTheme = {...theme, roundness : 5}
  
  return (
    <PaperProvider theme={currentTheme}>
      <GunCollection />
      {mainMenuOpen ? 
      <MainMenu />
      : 
      null}
    </PaperProvider>
  )}
