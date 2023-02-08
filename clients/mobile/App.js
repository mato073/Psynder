import React, { useEffect } from 'react';

import { PersistGate } from 'redux-persist/es/integration/react'
import { persistStore } from 'redux-persist'
import { connect } from 'react-redux';

import Store from './js/Redux/Store';

import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import RootStackScreen from './js/navigation/RootStackNavigator'

import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux'

import SplashScreen from 'react-native-splash-screen';
import StatusBarColor from './js/components/StatusBarColor';
import Loader from './js/components/Loader'

import { getTheme } from './js/Redux/Saga/selectors/selector';

import { UseNetInfo } from "./js/pages/Offline"
import { CheckVersion } from "./js/pages/CheckNewVersion"

const persistor = persistStore(Store);

const CustomDefaultTheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    background: '#ffffff',
    text: '#555555',
    icon: '#555555',
    agenda: "#F0EBEA"
  }
}

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    background: '#36393f',
    text: '#eaeaec',
    icon: '#eaeaec',
    agenda: "#2F3136"
  }
}

const AppScreen = (props) => {

  useEffect(() => {
    UseNetInfo(props)
    CheckVersion(props)
  }, [])

  const theme = props.theme.data === "light" ? CustomDefaultTheme : CustomDarkTheme;
  
  return (
    <PaperProvider theme={theme}>
      <PersistGate persistor={persistor} loading={<Loader/>}>
        <StatusBarColor/>
        <NavigationContainer theme={theme}>
          <RootStackScreen/>
        </NavigationContainer>
      </PersistGate>
    </PaperProvider>
  );
}

const mapStateToProps = (state) => ({
  theme: getTheme(state)
});

const AppScreenContainer = connect(mapStateToProps)(AppScreen );

const App = () => {
  
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <ReduxProvider store={Store}>
      <AppScreenContainer/>
    </ReduxProvider>
  );
};

export default App;
