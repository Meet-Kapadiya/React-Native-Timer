import React, {memo} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Fonts} from '../assets';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress?: () => void;
}

const Button = (props: ButtonProps) => {
  const {style, label, labelStyle, disabled, onPress} = props;

  return (
    <Pressable
      style={({pressed}) => [
        styles.button,
        style,
        {opacity: pressed ? 0.8 : 1},
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  button: {
    height: rSize(47),
    borderRadius: rSize(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sapphireBlue,
  },
  label: {
    fontSize: rFont(20),
    color: Colors.white,
    fontFamily: Fonts.Poppins500,
  },
});
