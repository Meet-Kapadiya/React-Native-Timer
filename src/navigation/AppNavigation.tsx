import {NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {memo} from 'react';
import {AppScreens} from '../constants';
import BottomTabs from './BottomTabs';

export type AppStackParamList = {
  [AppScreens.BottomTabs]: undefined;
};

export type AppNavigation = NavigationProp<AppStackParamList>;

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={AppScreens.BottomTabs} component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default memo(AppNavigation);
