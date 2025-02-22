import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useGlobalContext} from '../../firebase/global-provider';

function Launch() {
  // Burada direk useNavigation() kullanmayı dene
  const navigation = useNavigation<RootScreenNavigationProp>();

  // const {user} = useGlobalContext();
  // TO DO burada global user nesnesi alsın ona göre yönlendirsin

  const checkToken = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const user = await AsyncStorage.getItem('user');

    if (accessToken || refreshToken || user) {
      navigation.navigate('App');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  // TO DO Add splash screen here
  return <View className="flex flex-1 bg-zinc-50" />;
}
export default Launch;
