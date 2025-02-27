import {RouteProp} from '@react-navigation/native';
import {AppNavigation, AppStackParamList} from './AppNavigation';
import { BottomTabsParamList } from './BottomTabs';

export interface AppNavScreenProps<
  S extends keyof (AppStackParamList &
    BottomTabsParamList) = keyof (AppStackParamList & BottomTabsParamList),
> {
  navigation: AppNavigation;
  route: RouteProp<AppStackParamList & BottomTabsParamList, S>;
}
