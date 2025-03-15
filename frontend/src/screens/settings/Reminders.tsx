import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../themes/ThemeProvider';

const Reminders = () => {
  const {colors} = useTheme();
  return (
    <SafeAreaView
      className="h-full pb-32 px-5"
      style={{backgroundColor: colors.background.secondary}}>
      <View
        className="flex flex-row justify-center p-4 rounded-2xl"
        style={{backgroundColor: colors.background.primary}}>
        <Text
          className="text-xl font-rubik-medium"
          style={{color: colors.text.primary}}>
          Reminders
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Reminders;
