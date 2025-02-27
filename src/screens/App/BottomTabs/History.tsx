import React, {memo, useCallback, useMemo, useState} from 'react';
import {Pressable, SectionList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Category from '../../../components/Category';
import TimerComponent from '../../../components/Timer';
import {TimersState} from '../../../redux/Timers';
import {Timer} from '../../../redux/store.types';
import {rSize} from '../../../utils/responsive';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../assets';
import {Colors} from '../../../theme';
import RNFS from 'react-native-fs';
import {showToast} from '../../../../App';
import {AppConstants} from '../../../constants';

interface TimersData {
  date: string;
  categories: Array<{
    name: string;
    timers: Array<{name: string; duration: number}>;
  }>;
}

export interface Section {
  title: string;
  running: boolean;
  data: Timer[];
}

const History = () => {
  const {top} = useSafeAreaInsets();
  const categories = useSelector(TimersState);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const data = useMemo(
    () =>
      categories
        ?.map(category => ({
          title: category?.name,
          data: category?.timers?.filter(timer => !timer?.timeLeft),
          running: category?.running,
        }))
        ?.filter(category => category?.data?.length),
    [categories],
  );

  const toggleExpand = useCallback((title: string) => {
    setExpanded(prev => ({...prev, [title]: !prev[title]}));
  }, []);

  const exportDataHandler = useCallback(async () => {
    try {
      const timersData: TimersData = {
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        categories: [],
      };

      categories?.forEach(category => {
        const timers: Array<{name: string; duration: number}> = [];
        category?.timers?.forEach(timer => {
          if (!timer?.timeLeft) {
            timers?.push({name: timer?.name, duration: timer?.duration});
          }
        });
        timersData.categories.push({name: category?.name, timers: timers});
      });

      const jsonString = JSON.stringify(timersData, null, 2);

      const filePath = `${
        AppConstants.isAndroid
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath
      }/timers.json`;
      await RNFS.writeFile(filePath, jsonString, 'utf8');

      showToast({message: 'JSON file exported successfully 🎉'});
    } catch (error) {
      console.error('Export Error: ', error);
      showToast({message: 'Failed to export JSON file.', type: 'error'});
    }
  }, [categories]);

  const renderSectionHeader = useCallback(
    ({section}: {section: Section}) => {
      return (
        <Category
          name={section?.title}
          isHistory={true}
          expanded={expanded?.[section?.title]}
          toggleExpand={toggleExpand}
        />
      );
    },
    [expanded, toggleExpand],
  );

  const renderItem = useCallback(
    ({
      item,
      index,
      section,
    }: {
      item: Timer;
      index: number;
      section: Section;
    }) => {
      return (
        <TimerComponent
          timer={item}
          isHistory={true}
          timerIndex={index}
          expanded={expanded?.[section?.title]}
        />
      );
    },
    [expanded],
  );

  return (
    <View style={[styles.root, {paddingTop: top + rSize(4)}]}>
      <Pressable hitSlop={2} onPress={exportDataHandler}>
        <FastImage
          source={Images.downloadCircular}
          style={styles.downloadCircularIcon}
          resizeMode="contain"
          tintColor={Colors.carbon}
        />
      </Pressable>
      <SectionList<Timer, Section>
        sections={data}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        contentContainerStyle={styles.listCont}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index?.toString()}
        removeClippedSubviews={true}
        initialNumToRender={8}
      />
    </View>
  );
};

export default memo(History);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: rSize(20),
  },
  downloadCircularIcon: {
    width: rSize(14),
    height: rSize(14),
    alignSelf: 'flex-end',
  },
  listCont: {
    paddingBottom: rSize(20),
  },
});
