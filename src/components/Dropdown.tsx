import React, {forwardRef, memo, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {
  DropdownProps,
  IDropdownRef,
} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import {Fonts, Images} from '../assets';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';

interface DropdownComponentProps {
  data: DropdownProps<any>['data'];
  style?: DropdownProps<any>['style'];
  containerStyle?: DropdownProps<any>['containerStyle'];
  itemTextStyle?: StyleProp<TextStyle>;
  disable?: DropdownProps<any>['disable'];
  selectedTextStyle?: DropdownProps<any>['selectedTextStyle'];
  placeholderStyle?: DropdownProps<any>['placeholderStyle'];
  rightIconStyle?: FastImageProps['style'];
  rightIconTintColor?: FastImageProps['tintColor'];
  otherProps?: Omit<DropdownProps<any>, 'data' | 'labelField' | 'valueField'>;
  onChange?: (value: string) => void;
  defaultValue?: DropdownProps<any>['value'];
  placeholder?: DropdownProps<any>['placeholder'];
}

const DropdownComponent = forwardRef<IDropdownRef, DropdownComponentProps>(
  (props, ref) => {
    const {
      data,
      style,
      containerStyle,
      itemTextStyle,
      disable,
      selectedTextStyle,
      placeholderStyle,
      rightIconStyle,
      rightIconTintColor,
      otherProps,
      onChange,
      defaultValue,
      placeholder,
    } = props;

    const [value, setValue] = useState<any>(null);

    const renderItem = (item: any) => {
      return (
        <View
          style={[
            styles.item,
            {
              backgroundColor:
                (Array.isArray(value) && value?.includes(item.value)) ||
                item.value === value
                  ? Colors.lightBlue
                  : Colors.white,
            },
            item?.style,
          ]}>
          <Text
            style={[
              styles.text,
              itemTextStyle,
              !item?.value && styles.noValueItemText,
            ]}>
            {item.label}
          </Text>
        </View>
      );
    };

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <Dropdown
        ref={ref}
        style={[styles.root, style]}
        containerStyle={[styles.dropdownContainer, containerStyle]}
        placeholderStyle={[styles.text, placeholderStyle]}
        selectedTextStyle={[styles.text, selectedTextStyle]}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder ? placeholder : 'Select item'}
        value={value}
        onChange={item => {
          setValue(item.value);
          if (onChange) {
            onChange(item.value);
          }
        }}
        renderRightIcon={() => (
          <FastImage
            source={Images.downArrow}
            resizeMode="contain"
            style={rightIconStyle ? rightIconStyle : styles.rightIcon}
            tintColor={
              rightIconTintColor ? rightIconTintColor : Colors.sapphireBlue
            }
          />
        )}
        renderItem={renderItem}
        disable={disable}
        showsVerticalScrollIndicator={false}
        flatListProps={{
          contentContainerStyle: styles.listCont,
          ...(otherProps?.flatListProps ? otherProps?.flatListProps : {}),
        }}
        {...otherProps}
      />
    );
  },
);

export default memo(DropdownComponent);

const styles = StyleSheet.create({
  root: {
    height: rSize(40),
    backgroundColor: Colors.white,
    borderRadius: rSize(8),
    paddingHorizontal: rSize(12.5),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dropdownContainer: {
    paddingHorizontal: rSize(5.75),
    paddingVertical: rSize(6),
    borderRadius: rSize(8),
    borderWidth: rSize(1),
    borderColor: '#D5D5D5',
    marginTop: rSize(1),
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
  rightIcon: {
    width: rSize(12),
    height: rSize(9),
  },
  listCont: {
    gap: rSize(2),
  },
  noValueItemText: {
    color: Colors.wildDove,
  },
});
