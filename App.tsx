import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GlobalStyle} from './src/constants/styles';
import RootNavigation from './src/navigation';
import store, {persistor} from './src/redux';
import Toast, {ToastMethods, ToastParams} from './src/components/Toast';
import SplashScreen from 'react-native-splash-screen';

const toastRef = React.createRef<ToastMethods>();

export const showToast = (params: ToastParams) => {
  toastRef?.current?.show(params);
};

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <View style={GlobalStyle.flex1}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <Toast ref={toastRef} />
            <RootNavigation />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};

export default memo(App);
