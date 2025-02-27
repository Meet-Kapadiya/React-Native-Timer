import store from './';

export type StoreDispatch = typeof store.dispatch;

export type RootStoreState = ReturnType<typeof store.getState>;

export interface Category {
  name: string;
  running: boolean;
  timers: Array<Timer>;
}

export interface Timer {
  name: string;
  duration: number;
  timeLeft: number;
  running: boolean;
}
