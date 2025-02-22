import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import '../global.css';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
