import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Theme, themes} from '../../themes/themes';
import {useTheme} from '../../themes/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../constants/icons';

const Preferences = () => {
  const [user, setUser] = useState<User | null>(null);

  const {theme, colors, setTheme} = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const setUserTheme = async () => {
      await AsyncStorage.setItem(
        `${user!.username}-main-theme`,
        JSON.stringify(theme),
      );
    };

    setUserTheme();
  }, [theme]);

  return (
    <SafeAreaView
      className={`flex-1 pb-32 px-5`}
      style={{backgroundColor: colors.background.secondary}}>
      <ScrollView>
        <View className="mb-4">
          <Text
            className="text-xl font-rubik-medium p-4 rounded-2xl mb-2"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}>
            Theme:{'  '}
            <Text selectable className="text-xl font-rubik">
              {theme.name}
            </Text>
          </Text>
          <Text
            className="text-xl font-rubik-medium p-4 rounded-2xl mb-2"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}>
            Colors:{'  '}
            <Text selectable className="text-xl font-rubik">
              {colors.primary[100]}
            </Text>
          </Text>
          <Text
            className="text-xl font-rubik-medium p-4 rounded-2xl mb-2"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}>
            Background Color:{'  '}
            <Text selectable className="text-xl font-rubik">
              {colors.background.primary}
            </Text>
          </Text>
          <View
            className="flex flex-row justify-between items-center px-4 py-3 rounded-2xl mb-2"
            style={{
              backgroundColor: colors.background.primary,
            }}>
            <Text
              className="text-xl font-rubik-medium"
              style={{
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
              }}>
              Change Theme
            </Text>
            <View className="flex flex-row">
              <TouchableOpacity
                className="text-xl font-rubik-medium"
                onPress={() => {
                  setTheme(themes.primary.light);
                }}>
                <Image
                  source={
                    theme.name === 'Primary Light'
                      ? icons.lightMode
                      : icons.lightModeFilled
                  }
                  className="size-10"
                  tintColor={colors.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="text-xl font-rubik-medium ml-1"
                onPress={() => {
                  setTheme(themes.primary.dark);
                }}>
                <Image
                  source={
                    theme.name === 'Primary Dark' // theme.name === "Primary Light" is not working
                      ? icons.darkMode
                      : icons.darkModeFilled
                  }
                  className="size-10"
                  tintColor={colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preferences;

{
  /* <TouchableOpacity
              className="text-xl font-rubik-medium ml-1"
              onPress={() => {
                setTheme(
                  theme === themes.primary.dark
                    ? themes.primary.light
                    : themes.primary.dark,
                );
              }}>
              <Image
                source={
                  theme.name === 'Primary Dark' // theme === themes.primary.light is not working
                    ? icons.nightMode
                    : icons.dayMode
                }
                className="size-10"
              />
            </TouchableOpacity> */
}
