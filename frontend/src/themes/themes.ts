import {colors, colorScheme} from './colors';

export type ThemeType = {
  light: Theme;
  dark: Theme;
};

export type Theme = {
  name: string;
  colors: typeof colorScheme; // TO DO Can be colorScheme from ./colors.ts
};

// export enum ThemeType {
//   primary,
//   blue,
// }

const primaryLightColors = {
  primary: {
    100: '#0061FF0A',
    200: '#92b4e5',
    250: '#5A99FF',
    300: '#0061FF',
  },
  background: {primary: 'white', secondary: '#e6ecf5', third: '#e6f0ed'}, //edecec #eef2f8
  text: {
    primary: 'black',
    secondary: '#5d5d5d',
    third: '#2c2c2c',
    todo: '#10b981',
    todoV2: '#5db597',
  },
};

const primaryDarkColors = {
  primary: {
    100: '#0061FF0A',
    200: '#3e5c8a',
    250: '#2c77ff',
    300: '#3B82F6', // #0061FF
  },
  background: {primary: '#2f2f2f', secondary: '#1e1e1e', third: '#1a1a1a'}, //primary: '#2f2f2f'
  text: {
    primary: 'white',
    secondary: '#eef2f8',
    third: '#d8e0ed',
    todo: '#10b981',
    todoV2: '#5db597',
  }, // secondary: '#3a3a3a
};

// const blueLightColors = {
//   primary: {
//     100: '#0061FF0A',
//     200: '#0061FF1A',
//     250: '#5A99FF',
//     300: '#0061FF',
//   },
//   background: {primary: 'white', secondary: '#e6ecf5'}, //edecec #eef2f8
//   text: {primary: 'black', secondary: '#5d5d5d', third: 'gray'},
// };

// const blueDarkColors = {
//   primary: {
//     100: '#0061FF0A',
//     200: '#0061FF1A',
//     250: '#3582ff',
//     300: '#0061FF',
//   },
//   background: {primary: '#2f2f2f', secondary: '#1a1a1a'}, //primary: '#2f2f2f'
//   text: {primary: 'white', secondary: '#eef2f8', third: '#d8e0ed'}, // secondary: '#3a3a3a
// };

// Tema nesnesi
export const themes: Record<string, ThemeType> = {
  primary: {
    light: {
      name: 'Primary Light',
      colors: primaryLightColors,
    },
    dark: {
      name: 'Primary Dark',
      colors: primaryDarkColors,
    },
  },
  // blue: {
  //   light: {
  //     name: 'Blue Light',
  //     colors: blueLightColors,
  //   },
  //   dark: {
  //     name: 'Blue Dark',
  //     colors: blueDarkColors,
  //   },
  // },
};
