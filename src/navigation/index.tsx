import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { GlobalStyle } from '../constants/styles';
import { StoreDispatch } from '../redux/store.types';
import { restoreProgress } from '../redux/Timers';
import { Colors } from '../theme';
import AppNavigation from './AppNavigation';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.white,
  },
};

const RootNavigation = () => {
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    dispatch(restoreProgress());
  }, [dispatch]);

  return (
    <View style={GlobalStyle.flex1}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <NavigationContainer theme={navTheme}>
        <AppNavigation />
      </NavigationContainer>
    </View>
  );
};

export default memo(RootNavigation);
