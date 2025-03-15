import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useGlobalContext} from '../../firebase/global-provider';
import {useTheme} from '../../themes/ThemeProvider';
import {Theme, themes} from '../../themes/themes';
// import {useGlobalContext} from '../../firebase/global-provider';

function Launch() {
  // Burada direk useNavigation() kullanmayı dene
  const navigation = useNavigation<RootScreenNavigationProp>();

  const {theme, colors, setTheme} = useTheme();
  // const {user} = useGlobalContext();
  // TO DO burada global user nesnesi alsın ona göre yönlendirsin

  const checkToken = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user: User = JSON.parse(userData!);

    if (user) {
      const defaultThemeJson = await AsyncStorage.getItem(
        `${user.username}-main-theme`,
      );
      if (defaultThemeJson) {
        const defaultTheme: Theme = defaultThemeJson
          ? JSON.parse(defaultThemeJson)
          : null;
        if (theme) {
          setTheme(defaultTheme);
        }
      }
    }

    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (accessToken || refreshToken || userData) {
      navigation.navigate('App');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  // TO DO Add splash screen here
  return (
    <View
      className="flex flex-1"
      style={{backgroundColor: colors.background.primary}}
    />
  );
}
export default Launch;
