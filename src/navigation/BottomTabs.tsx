import {
  BottomTabBarButtonProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {memo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {AppScreens} from '../constants';
import Home from '../screens/App/BottomTabs/Home';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import {Fonts, Images} from '../assets';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';
import Timers from '../screens/App/BottomTabs/Timers';
import History from '../screens/App/BottomTabs/History';

export type BottomTabsParamList = {
  [AppScreens.Home]: undefined;
  [AppScreens.Timers]: undefined;
  [AppScreens.History]: undefined;
};

export type BottomTabNavigation = BottomTabNavigationProp<BottomTabsParamList>;

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const TabBarButton = (props: BottomTabBarButtonProps) => (
  <Pressable {...props} android_ripple={{color: 'transparent'}}>
    {props.children}
  </Pressable>
);

const TabBarIcon = (
  icon: FastImageProps['source'],
  props: {
    focused: boolean;
    color: string;
    size: number;
  },
) => {
  const {focused} = props;

  return (
    <FastImage
      source={icon}
      style={styles.tabBarIcon}
      resizeMode="contain"
      tintColor={focused ? Colors.sapphireBlue : Colors.dugong}
    />
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: TabBarButton,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarInactiveTintColor: Colors.dugong,
        tabBarActiveTintColor: Colors.sapphireBlue,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name={AppScreens.Home}
        component={Home}
        options={{
          tabBarIcon: TabBarIcon?.bind(null, Images.home),
        }}
      />
      <Tab.Screen
        name={AppScreens.Timers}
        component={Timers}
        options={{
          tabBarIcon: TabBarIcon?.bind(null, Images.clock),
        }}
      />
      <Tab.Screen
        name={AppScreens.History}
        component={History}
        options={{
          tabBarIcon: TabBarIcon?.bind(null, Images.file),
        }}
      />
    </Tab.Navigator>
  );
};

export default memo(BottomTabs);

const styles = StyleSheet.create({
  tabBar: {
    height: rSize(64),
  },
  tabBarIcon: {
    width: rSize(20),
    height: rSize(20),
  },
  tabBarLabel: {
    fontFamily: Fonts.Poppins400,
    fontSize: rFont(12),
  },
});
