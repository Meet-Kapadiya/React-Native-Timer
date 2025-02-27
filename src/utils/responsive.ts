import {Dimensions, PixelRatio} from 'react-native';

const {width} = Dimensions.get('window');
const BASE_WIDTH = 375;

export const rSize = (size: number) => size * (width / BASE_WIDTH);

export const rFont = (fontSize: number) =>
  Math.round(PixelRatio.roundToNearestPixel(fontSize * (width / BASE_WIDTH)));
