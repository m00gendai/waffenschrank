import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react"
import {PREFERENCES } from "./configs"
import 'react-native-gesture-handler';
import React from 'react';
import { usePreferenceStore } from './stores/usePreferenceStore';
import { useViewStore } from './stores/useViewStore';
import GunCollection from './components/GunCollection';
import MainMenu from './components/mainMenu';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { tabBarLabels } from './lib/textTemplates';
import AmmoCollection from './components/AmmoCollection';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  const { switchLanguage, theme, switchTheme, language } = usePreferenceStore();
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

  const Tab = createBottomTabNavigator();
  
  return (
    <NavigationContainer>
    <PaperProvider theme={currentTheme}>
    <StatusBar backgroundColor={mainMenuOpen ? theme.colors.primary : theme.colors.background} style="auto" />
    <Tab.Navigator screenOptions={{
        headerShown: false
        

      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
         style={{padding: 0, margin: 0,}}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            /*@ts-expect-error*/
            const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="GunCollection"
        component={GunCollection}
        options={{
          tabBarLabel: tabBarLabels.gunCollection[language],
          tabBarIcon: ({ color, size }) => {
            return <Icon name="pistol" size={size} color={color} style={{padding: 0, margin: 0}} />;
          },
        }}
      />
      <Tab.Screen
        name="AmmoCollection"
        component={AmmoCollection}
        options={{
          tabBarLabel: tabBarLabels.ammoCollection[language],
          tabBarIcon: ({ color, size }) => {
            return <Icon name="bullet" size={size} color={color} style={{padding: 0, margin: 0}} />;
          },
        }}
      />
    </Tab.Navigator>
      
      {mainMenuOpen ? 
      <MainMenu />
      : 
      null}
    </PaperProvider>
    </NavigationContainer>
  )}

