import {Dimensions} from 'react-native';

export const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
}: {width: number; height: number} = Dimensions.get('screen');

export const convert = (input: number) => {
  return input * (SCREEN_WIDTH / 1000);
};
