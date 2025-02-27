import {Dimensions, Platform} from 'react-native';

export const AppConstants = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
};

export const NaturalNumber = /^[1-9][0-9]*$/;

export enum AppScreens {
  BottomTabs = 'BottomTabs',
  Home = 'Home',
  Timers = 'Timers',
  History = 'History',
}
