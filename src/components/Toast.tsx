/* eslint-disable @typescript-eslint/no-shadow */

import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Fonts, Images} from '../assets';
import {AppConstants} from '../constants';
import {GlobalStyle} from '../constants/styles';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';

export interface ToastParams {
  type?: string;
  title?: string;
  message?: string;
  duration?: number;
}

export interface ToastMethods {
  show: (params: ToastParams) => void;
}

const success = {
  color: '#00DF80',
  background: '#00DF800A',
};
const warning = {
  color: '#FFD21E',
  background: '#FFD21E0A',
};
const error = {
  color: '#F04248',
  background: '#F042480A',
};

const Toast = forwardRef<ToastMethods>((props, ref) => {
  const {top} = useSafeAreaInsets();
  const [showing, setShowing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<string>('');
  const fillAnimation = useRef<Animated.Value>(null);

  const show = useCallback(
    ({type = 'success', title = '', message = '', duration = 2000}) => {
      fillAnimation.current = new Animated.Value(0);
      setType(type);
      setTitle(title);
      setMessage(message);
      setShowing(true);

      Animated.timing(fillAnimation.current, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();

      setTimeout(() => {
        setShowing(false);
      }, duration);
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [show],
  );

  return (
    <>
      {showing ? (
        <View
          style={[
            styles.toastOuter,
            {
              width: AppConstants.windowWidth - rSize(40),
              top: top + rSize(16),
            },
          ]}>
          <View
            style={{
              backgroundColor:
                type === 'success'
                  ? success.background
                  : type === 'error'
                  ? error.background
                  : warning.background,
            }}>
            <View style={styles.toastInner}>
              <FastImage
                style={styles.icon}
                source={
                  type === 'success'
                    ? Images.success
                    : type === 'error'
                    ? Images.error
                    : Images.warning
                }
                resizeMode="contain"
              />
              <View style={GlobalStyle.flex1}>
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {message ? <Text style={styles.message}>{message}</Text> : null}
              </View>
            </View>
            <Animated.View
              style={[
                styles.indicator,
                {
                  width: fillAnimation.current?.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor:
                    type === 'success'
                      ? success.color
                      : type === 'error'
                      ? error.color
                      : warning.color,
                },
              ]}
            />
          </View>
        </View>
      ) : null}
    </>
  );
});

export default memo(Toast);

const styles = StyleSheet.create({
  toastOuter: {
    position: 'absolute',
    zIndex: 24,
    marginHorizontal: rSize(20),
    borderRadius: rSize(8),
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  toastInner: {
    flexDirection: 'row',
    gap: rSize(16),
    paddingHorizontal: rSize(16),
    paddingVertical: rSize(12),
    alignItems: 'center',
  },
  icon: {
    width: rSize(32),
    height: rSize(32),
  },
  title: {
    fontFamily: Fonts.Poppins600,
    fontSize: rFont(14),
    color: Colors.carbon,
    includeFontPadding: false,
  },
  message: {
    fontFamily: Fonts.Poppins400,
    fontSize: rFont(14),
    color: Colors.carbon,
    includeFontPadding: false,
  },
  indicator: {
    height: rSize(5),
    borderBottomLeftRadius: rSize(8),
  },
});
