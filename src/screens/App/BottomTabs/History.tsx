import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, SectionList, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {showToast} from '../../../../App';
import {Images} from '../../../assets';
import Category from '../../../components/Category';
import Dropdown from '../../../components/Dropdown';
import TimerComponent from '../../../components/Timer';
import {AppConstants} from '../../../constants';
import {TimersState} from '../../../redux/Timers';
import {Timer} from '../../../redux/store.types';
import {Colors} from '../../../theme';
import {rSize} from '../../../utils/responsive';

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
  const [selected, setSelected] = useState<Array<string>>([]);

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

  const dropdownData = useMemo(() => {
    const tempArr = categories?.map(item => ({
      label: item?.name,
      value: item?.name,
    }));
    if (selected?.length) {
      tempArr.unshift({label: 'Select Category', value: ''});
    }
    return tempArr;
  }, [categories, selected?.length]);

  const changeHandler = useCallback((item: any) => {
    if (!item?.value) {
      setSelected([]);
      return;
    }

    setSelected(prev => {
      const tempArr = [...prev];
      const index = tempArr?.findIndex(value => value === item?.value);
      if (index === -1) {
        tempArr?.push(item?.value);
      } else {
        tempArr?.splice(index, 1);
      }
      return tempArr;
    });
  }, []);

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
          selected={
            selected?.length ? selected?.includes(section?.title) : true
          }
          toggleExpand={toggleExpand}
        />
      );
    },
    [expanded, selected, toggleExpand],
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

  useEffect(() => {
    setExpanded(prev => {
      const updatedExpanded = {...prev};

      Object.keys(updatedExpanded).forEach(category => {
        if (!selected?.includes(category)) {
          updatedExpanded[category] = false;
        }
      });

      return updatedExpanded;
    });
  }, [selected]);

  return (
    <View style={[styles.root, {paddingTop: top + rSize(4)}]}>
      <View style={styles.topCont}>
        <Dropdown
          style={styles.dropdown}
          data={Array.isArray(dropdownData) ? dropdownData : []}
          defaultValue={selected}
          placeholder={'Select Category'}
          otherProps={{
            search: true,
            inputSearchStyle: styles.dropdownSearch,
            onChange: changeHandler,
          }}
        />
        <Pressable hitSlop={2} onPress={exportDataHandler}>
          <FastImage
            source={Images.downloadCircular}
            style={styles.downloadCircularIcon}
            resizeMode="contain"
            tintColor={Colors.carbon}
          />
        </Pressable>
      </View>
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
  topCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rSize(16),
  },
  dropdown: {
    flex: 1,
  },
  dropdownSearch: {
    borderRadius: rSize(8),
    height: rSize(40),
  },
  downloadCircularIcon: {
    width: rSize(24),
    height: rSize(24),
  },
  listCont: {
    paddingVertical: rSize(16),
  },
});
