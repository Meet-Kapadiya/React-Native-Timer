import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  UseControllerProps,
} from 'react-hook-form';
import {
  FlatList,
  Pressable,
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
import {AppConstants} from '../constants';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';

export interface InputSelectProps {
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
  data: Array<any>;
  labelField: string;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
}

const InputSelect = (props: InputSelectProps) => {
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
    data,
    itemStyle,
    itemTextStyle,
    labelField,
  } = props;

  const [input, setInput] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const filteredData = useMemo(
    () =>
      data?.filter(item =>
        item?.[labelField]?.toLowerCase()?.includes(input?.toLowerCase()),
      ),
    [data, input, labelField],
  );

  const inputChangeHandler = useCallback(
    (onChange: ControllerRenderProps['onChange'], text: string) => {
      onChange(text);
      setInput(text);
    },
    [],
  );

  const toggleFocusHandler = useCallback((isFocused: boolean) => {
    if (!isFocused) {
      setInput('');
    }
    setFocused(isFocused);
  }, []);

  const renderItem = useCallback(
    (onChange: ControllerRenderProps['onChange'], {item}: {item: any}) => {
      return (
        <Pressable
          style={({pressed}) => [
            styles.item,
            itemStyle,
            {opacity: pressed ? 0.8 : 1},
          ]}
          onPress={onChange?.bind(null, item)}>
          <Text style={[styles.text, itemTextStyle]}>{item?.[labelField]}</Text>
        </Pressable>
      );
    },
    [itemStyle, itemTextStyle, labelField],
  );

  return (
    <View style={[styles.inputView, style]}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: 'This field is required',
          ...rules,
        }}
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              style={[styles.input, inputStyle]}
              onChangeText={inputChangeHandler?.bind(null, onChange)}
              value={typeof value === 'object' ? value[labelField] : value}
              autoCapitalize="none"
              placeholder={placeholder}
              placeholderTextColor={Colors.wildDove}
              cursorColor={Colors.wildDove}
              editable={editable}
              onFocus={toggleFocusHandler?.bind(null, true)}
              onBlur={toggleFocusHandler?.bind(null, false)}
              {...inputConfig}
            />
            {focused && filteredData?.length > 0 ? (
              <FlatList
                data={filteredData}
                style={styles.list}
                contentContainerStyle={styles.listCont}
                renderItem={renderItem?.bind(null, onChange)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index?.toString()}
                keyboardShouldPersistTaps={'handled'}
                removeClippedSubviews={true}
                initialNumToRender={5}
              />
            ) : null}
          </>
        )}
      />
      {errorMessage ? (
        <Text style={styles.errorStyle}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default memo(InputSelect);

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
  list: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: rSize(47),
    backgroundColor: Colors.white,
    zIndex: 16,
    borderRadius: rSize(8),
    borderWidth: rSize(1),
    borderColor: Colors.discoBall,
    maxHeight: 120,
  },
  listCont: {
    paddingHorizontal: rSize(5.75),
    paddingVertical: rSize(6),
  },
  item: {
    paddingHorizontal: rSize(5.75),
    paddingVertical: rSize(6),
    borderRadius: rSize(8),
  },
  text: {
    fontSize: rFont(14),
    fontFamily: Fonts.Poppins400,
    color: Colors.carbon,
  },
});
