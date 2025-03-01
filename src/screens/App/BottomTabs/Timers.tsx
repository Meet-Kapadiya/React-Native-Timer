import {useIsFocused} from '@react-navigation/native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppState, SectionList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Category from '../../../components/Category';
import TimerComponent from '../../../components/Timer';
import {
  loadProgress,
  restoreProgress,
  saveProgress,
  TimersState,
} from '../../../redux/Timers';
import {
  Category as CategoryType,
  StoreDispatch,
  Timer,
} from '../../../redux/store.types';
import {rSize} from '../../../utils/responsive';
import Dropdown from '../../../components/Dropdown';

export interface Section {
  title: string;
  running: boolean;
  data: Timer[];
}

const Timers = () => {
  const {top} = useSafeAreaInsets();
  const categories = useSelector(TimersState);
  const dispatch = useDispatch<StoreDispatch>();
  const isFocused = useIsFocused();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Array<CategoryType>>([]);
  const [selected, setSelected] = useState<Array<string>>([]);

  const progressRef = useRef<Array<CategoryType>>(progress);

  useEffect(() => {
    setProgress(prevState => {
      const tempCategoryArr: Array<CategoryType> = [];
      categories?.forEach((category, categoryIndex) => {
        if (prevState[categoryIndex]?.name === category?.name) {
          const tempTimerArr: Array<Timer> = [];
          category?.timers?.forEach((timer, timerIndex) => {
            if (
              prevState[categoryIndex]?.timers?.[timerIndex]?.name ===
              timer?.name
            ) {
              tempTimerArr?.push(
                prevState[categoryIndex]?.timers?.[timerIndex],
              );
            } else {
              tempTimerArr.push(timer);
            }
          });
          tempCategoryArr.push({
            ...prevState[categoryIndex],
            timers: tempTimerArr,
          });
        } else {
          tempCategoryArr.push(category);
        }
      });
      return tempCategoryArr;
    });
  }, [categories]);

  const data = useMemo(
    () =>
      categories?.map(item => ({
        title: item?.name,
        data: item?.timers,
        running: item?.running,
      })),
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

  const renderSectionHeader = useCallback(
    ({section}: {section: Section}) => {
      const index = progress?.findIndex(item => item?.name === section?.title);
      const isCompleted = !progress?.[index]?.timers?.filter(
        item => item?.timeLeft,
      )?.length;

      return (
        <Category
          style={
            index === progress?.length - 1 &&
            !expanded?.[section?.title] &&
            styles.noBottomBorder
          }
          name={section?.title}
          index={index}
          selected={
            selected?.length ? selected?.includes(section?.title) : true
          }
          isCompleted={isCompleted}
          running={progress?.[index]?.running}
          expanded={expanded?.[section?.title]}
          toggleExpand={toggleExpand}
          setProgress={setProgress}
        />
      );
    },
    [expanded, progress, selected, toggleExpand],
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
      const categoryIndex = progress?.findIndex(
        category => category?.name === section?.title,
      );

      return (
        <TimerComponent
          style={
            categoryIndex === progress?.length - 1 &&
            index === progress?.[categoryIndex]?.timers?.length - 1 &&
            styles.noBottomBorder
          }
          timer={item}
          timerIndex={index}
          categoryIndex={categoryIndex}
          timeLeft={progress?.[categoryIndex]?.timers?.[index]?.timeLeft}
          running={progress?.[categoryIndex]?.timers?.[index]?.running}
          expanded={expanded?.[section?.title]}
          setProgress={setProgress}
        />
      );
    },
    [expanded, progress],
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

  useEffect(() => {
    progressRef.current = progress;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        dispatch(saveProgress(progress, new Date().toISOString()));
      } else if (nextAppState === 'active') {
        dispatch(restoreProgress());
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [progress, dispatch]);

  useEffect(() => {
    if (!isFocused) {
      dispatch(loadProgress(progressRef.current));
    }
  }, [dispatch, isFocused]);

  return (
    <View style={[styles.root, {paddingTop: top + rSize(4)}]}>
      <Dropdown
        data={Array.isArray(dropdownData) ? dropdownData : []}
        defaultValue={selected}
        placeholder={'Select Category'}
        otherProps={{
          search: true,
          inputSearchStyle: styles.dropdownSearch,
          onChange: changeHandler,
        }}
      />
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

export default memo(Timers);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: rSize(20),
  },
  listCont: {
    paddingVertical: rSize(16),
  },
  noBottomBorder: {
    borderBottomWidth: 0,
    borderColor: 'transparent',
  },
  dropdownSearch: {
    borderRadius: rSize(8),
    height: rSize(40),
  },
});
