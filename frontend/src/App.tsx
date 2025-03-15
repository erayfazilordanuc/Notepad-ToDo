import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import '../global.css';
import AppNavigator from './navigation/AppNavigator';
import {ThemeProvider, useTheme} from './themes/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
