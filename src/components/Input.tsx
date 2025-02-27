import React, {memo} from 'react';
import {Control, Controller, UseControllerProps} from 'react-hook-form';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Fonts} from '../assets';
import {AppConstants, NaturalNumber} from '../constants';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';

export interface InputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'] & TextStyle;
  errorMessage?: string;
  defaultValue?: string;
  inputConfig?: TextInputProps;
  control: Control<any>;
  name: string;
  placeholder?: string;
  editable?: boolean;
  rules?: UseControllerProps['rules'];
}

const Input = (props: InputProps) => {
  const {
    style,
    defaultValue,
    inputStyle,
    errorMessage,
    inputConfig,
    control,
    name,
    placeholder,
    editable,
    rules,
  } = props;

  return (
    <View style={[styles.inputView, style]}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: 'This field is required',
          pattern:
            inputConfig?.keyboardType === 'number-pad'
              ? {
                  value: NaturalNumber,
                  message: 'Enter valid number',
                }
              : undefined,
          ...rules,
        }}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={[styles.input, inputStyle]}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder={placeholder}
            placeholderTextColor={Colors.wildDove}
            cursorColor={Colors.wildDove}
            editable={editable}
            {...inputConfig}
          />
        )}
      />
      {errorMessage ? (
        <Text style={styles.errorStyle}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    height: rSize(47),
    backgroundColor: Colors.white,
    borderRadius: rSize(8),
    borderWidth: rSize(1),
    borderColor: Colors.discoBall,
    paddingHorizontal: rSize(16),
  },
  input: {
    fontFamily: Fonts.Poppins400,
    fontSize: rFont(16),
    color: Colors.carbon,
    flex: 1,
    padding: 0,
  },
  errorStyle: {
    color: Colors.pickledRadish,
    fontSize: rFont(12),
    fontFamily: Fonts.Poppins500,
    position: 'absolute',
    bottom: AppConstants.isAndroid ? -rFont(20) : -rSize(16),
  },
});

export default memo(Input);
