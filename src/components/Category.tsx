import React, {Dispatch, memo, SetStateAction, useCallback} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Fonts, Images} from '../assets';
import {Category as CategoryType, Timer} from '../redux/store.types';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';

interface CategoryProps {
  name: string;
  index?: number;
  running?: boolean;
  expanded: boolean;
  isHistory?: boolean;
  isCompleted?: boolean;
  style?: StyleProp<ViewStyle>;
  toggleExpand: (title: string) => void;
  setProgress?: Dispatch<SetStateAction<Array<CategoryType>>>;
}

const Category = (props: CategoryProps) => {
  const {
    name,
    running,
    expanded,
    index,
    isHistory,
    isCompleted,
    style,
    toggleExpand,
    setProgress = () => {},
  } = props;

  const playPauseHandler = useCallback(() => {
    setProgress(prev => {
      const tempArr = JSON.parse(JSON.stringify(prev));
      if (index !== undefined && index >= 0) {
        const tempRunning = tempArr[index]?.running;
        tempArr[index].running = !tempRunning;
        tempArr[index].timers = tempArr?.[index]?.timers?.map(
          (timer: Timer) => ({
            ...timer,
            running: timer?.timeLeft ? !tempRunning : false,
          }),
        );
      }
      return tempArr;
    });
  }, [index, setProgress]);

  const resetHandler = useCallback(() => {
    setProgress(prev => {
      const tempArr = JSON.parse(JSON.stringify(prev));
      if (index !== undefined && index >= 0) {
        tempArr[index].running = false;
        tempArr[index].timers = tempArr?.[index]?.timers?.map(
          (timer: Timer) => ({
            ...timer,
            running: false,
            timeLeft: timer.duration,
          }),
        );
      }
      return tempArr;
    });
  }, [setProgress, index]);

  return (
    <Pressable
      style={[styles.category, style]}
      onPress={toggleExpand?.bind(null, name)}>
      <Text style={styles.title}>{name}</Text>
      {!isHistory ? (
        <View style={styles.actions}>
          {!isCompleted ? (
            <Pressable hitSlop={rSize(2)} onPress={playPauseHandler}>
              <FastImage
                source={running ? Images.pause : Images.play}
                resizeMode="contain"
                style={styles.actionIcon}
              />
            </Pressable>
          ) : null}
          <Pressable hitSlop={rSize(2)} onPress={resetHandler}>
            <FastImage
              source={Images.reset}
              resizeMode="contain"
              style={styles.actionIcon}
            />
          </Pressable>
        </View>
      ) : null}
      <FastImage
        source={expanded ? Images.upArrow : Images.downArrow}
        style={styles.arrowIcon}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default memo(Category);

const styles = StyleSheet.create({
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rSize(16),
    borderBottomWidth: rSize(1),
    borderColor: Colors.christmasSilver,
    gap: rSize(16),
  },
  title: {
    flex: 1,
    fontSize: rFont(12),
    fontFamily: Fonts.Poppins500,
    color: Colors.carbon,
    includeFontPadding: false,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rSize(8),
  },
  actionIcon: {
    width: rSize(14),
    height: rSize(14),
  },
  arrowIcon: {
    width: rSize(12),
    height: rSize(9),
  },
});
