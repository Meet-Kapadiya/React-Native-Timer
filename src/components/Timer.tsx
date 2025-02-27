import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showToast} from '../../App';
import {Fonts, Images} from '../assets';
import {
  Category,
  StoreDispatch,
  Timer as TimerType,
} from '../redux/store.types';
import {Colors} from '../theme';
import {rFont, rSize} from '../utils/responsive';
import {useDispatch} from 'react-redux';
import {setComplete} from '../redux/Timers';

interface TimerProps {
  timer: TimerType;
  categoryIndex?: number;
  timerIndex: number;
  expanded: boolean;
  running?: boolean;
  timeLeft?: number;
  isHistory?: boolean;
  style?: StyleProp<ViewStyle>;
  setProgress?: Dispatch<SetStateAction<Array<Category>>>;
}

const Timer = (props: TimerProps) => {
  const {
    timer,
    expanded,
    categoryIndex,
    timerIndex,
    running,
    timeLeft,
    isHistory,
    style,
    setProgress = () => {},
  } = props;
  const progress = useRef<Animated.Value>(new Animated.Value(1)).current;
  const intervalId = useRef<NodeJS.Timeout>(null);
  const dispatch = useDispatch<StoreDispatch>();

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const playPauseHandler = useCallback(() => {
    setProgress(prev => {
      const tempArr = JSON.parse(JSON.stringify(prev));
      if (categoryIndex !== undefined && categoryIndex >= 0) {
        tempArr[categoryIndex].timers[timerIndex].running =
          !tempArr?.[categoryIndex]?.timers?.[timerIndex]?.running;
      }
      return tempArr;
    });
  }, [setProgress, categoryIndex, timerIndex]);

  const resetHandler = useCallback(() => {
    setProgress(prev => {
      const tempArr = JSON.parse(JSON.stringify(prev));
      if (categoryIndex !== undefined && categoryIndex >= 0) {
        tempArr[categoryIndex].timers[timerIndex].running = false;
        tempArr[categoryIndex].timers[timerIndex].timeLeft = timer?.duration;
      }
      return tempArr;
    });
  }, [setProgress, categoryIndex, timerIndex, timer?.duration]);

  useEffect(() => {
    if (
      running &&
      timeLeft !== undefined &&
      timeLeft > 0 &&
      !intervalId.current
    ) {
      intervalId.current = setInterval(() => {
        setProgress(prev => {
          const tempArr = JSON.parse(JSON.stringify(prev));
          if (categoryIndex !== undefined && categoryIndex >= 0) {
            tempArr[categoryIndex].timers[timerIndex].timeLeft =
              tempArr?.[categoryIndex]?.timers?.[timerIndex]?.timeLeft - 1;
          }
          return tempArr;
        });
      }, 1000);
    } else if (!running && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, categoryIndex, timerIndex]);

  useEffect(() => {
    if (timeLeft !== undefined) {
      if (timeLeft <= 0 && intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        setProgress(prev => {
          const tempArr = JSON.parse(JSON.stringify(prev));
          if (categoryIndex !== undefined && categoryIndex >= 0) {
            tempArr[categoryIndex].timers[timerIndex].running = false;

            let timersRunning = 0;
            tempArr?.[categoryIndex]?.timers?.forEach((item: TimerType) => {
              if (item?.running) {
                timersRunning++;
              }
            });

            if (!timersRunning) {
              tempArr[categoryIndex].running = false;
            }
          }
          return tempArr;
        });
        dispatch(setComplete({categoryIndex, timerIndex}));
        showToast({
          message: `Congratulations, ${timer?.name} has completed 🎉`,
        });
      }

      if (timeLeft > 0) {
        Animated.timing(progress, {
          toValue: timeLeft / timer?.duration,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, categoryIndex, timerIndex]);

  return expanded ? (
    <View style={[styles.timer, style]}>
      <Text style={styles.title}>{timer?.name}</Text>
      {!isHistory ? (
        <>
          {timeLeft ? (
            <>
              <Text style={styles.timeLeft}>{timeLeft}</Text>
              <View style={styles.progressCont}>
                <Animated.View style={[styles.progressBar, {width}]} />
                <Text style={styles.progress}>
                  {!isNaN((timeLeft / timer?.duration) * 100)
                    ? ((timeLeft / timer?.duration) * 100)?.toFixed(0) + '%'
                    : '0%'}
                </Text>
              </View>
            </>
          ) : (
            <FastImage
              source={Images.check}
              resizeMode="contain"
              style={styles.actionIcon}
              tintColor={Colors.success}
            />
          )}
          <View style={styles.actions}>
            {timeLeft ? (
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
        </>
      ) : (
        <Text style={styles.duration}>{timer?.duration}</Text>
      )}
    </View>
  ) : null;
};

export default memo(Timer);

const styles = StyleSheet.create({
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rSize(12),
    borderBottomWidth: rSize(1),
    borderColor: Colors.christmasSilver,
    marginHorizontal: rSize(4),
  },
  title: {
    flex: 1,
    fontSize: rFont(10),
    fontFamily: Fonts.Poppins400,
    color: Colors.carbon,
    includeFontPadding: false,
  },
  timeLeft: {
    fontSize: rFont(10),
    fontFamily: Fonts.Poppins400,
    color: Colors.carbon,
    marginRight: rSize(8),
    includeFontPadding: false,
  },
  progressCont: {
    width: rSize(28),
    height: rSize(12),
    backgroundColor: Colors.christmasSilver,
    borderRadius: rSize(8),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    backgroundColor: Colors.lightBlue,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rSize(8),
    marginLeft: rSize(8),
  },
  actionIcon: {
    width: rSize(12),
    height: rSize(12),
  },
  progress: {
    fontSize: rFont(6),
    fontFamily: Fonts.Poppins400,
    color: Colors.carbon,
    includeFontPadding: false,
    textAlign: 'center',
  },
  duration: {
    fontSize: rFont(10),
    fontFamily: Fonts.Poppins400,
    color: Colors.carbon,
    includeFontPadding: false,
  },
});
