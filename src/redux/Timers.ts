import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Category, RootStoreState, StoreDispatch, Timer} from './store.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: Array<Category> = [];

const TimersSlice = createSlice({
  name: 'timer',
  initialState: initialState,
  reducers: {
    addTimer: (
      state,
      action: PayloadAction<{category: string; timer: Timer}>,
    ) => {
      const {category, timer} = action.payload;
      const categoryIndex = state.findIndex(
        item => item?.name?.toLowerCase() === category?.toLowerCase(),
      );
      if (categoryIndex !== -1) {
        state?.[categoryIndex]?.timers?.push(timer);
      } else {
        state?.push({
          name: category,
          timers: [timer],
          running: false,
        });
      }
    },
    setComplete: (
      state,
      action: PayloadAction<{categoryIndex?: number; timerIndex: number}>,
    ) => {
      const {categoryIndex, timerIndex} = action.payload;

      if (
        categoryIndex !== undefined &&
        categoryIndex >= 0 &&
        timerIndex >= 0
      ) {
        state[categoryIndex].timers[timerIndex].running = false;
        state[categoryIndex].timers[timerIndex].timeLeft = 0;
      }
    },
    loadProgress: (state, action: PayloadAction<Array<Category>>) => {
      return action.payload;
    },
  },
});

export const saveProgress =
  (progress: Array<Category>, timestamp: string) => async () => {
    try {
      await AsyncStorage.setItem('progress', JSON.stringify(progress));
      await AsyncStorage.setItem('timestamp', timestamp);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

export const restoreProgress = () => async (dispatch: StoreDispatch) => {
  try {
    const storedData = await AsyncStorage.getItem('progress');
    const timestamp = await AsyncStorage.getItem('timestamp');
    if (storedData && timestamp) {
      const progress: Array<Category> = JSON.parse(storedData);
      const diffInSeconds: number = Math.floor(
        (Date.now() - new Date(timestamp).getTime()) / 1000,
      );
      progress.forEach(category => {
        let timerRunnings = 0;
        category.timers?.forEach(timer => {
          if (timer.running) {
            const timeLeft = timer?.timeLeft - diffInSeconds;
            if (timeLeft > 0) {
              timer.timeLeft = timeLeft;
              timerRunnings++;
            } else {
              timer.timeLeft = 0;
              timer.running = false;
            }
          }
        });
        if (category?.running && !timerRunnings) {
          category.running = false;
        }
      });
      dispatch(TimersSlice.actions.loadProgress(progress));
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
};

export default TimersSlice.reducer;
export const TimersState = (state: RootStoreState) => state.Timers;
export const {addTimer, setComplete, loadProgress} = TimersSlice.actions;
