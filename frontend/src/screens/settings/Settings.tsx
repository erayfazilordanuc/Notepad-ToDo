import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {logout} from '../../api/authService';
import {getUser} from '../../api/userService';
import icons from '../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3">
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-7" />
      <Text className={`font-rubik-medium text-lg text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const Settings = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const appNavigation = useNavigation<AppScreenNavigationProp>();
  const {colors, fonts} = useTheme();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Are you sure to logout?',
      'You may lose your notes if you dont have an account',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await logout();
            appNavigation.navigate('Launch');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <SafeAreaView className="h-full bg-primary-200 pb-32 px-7">
      <View className="flex flex-row justify-center mt-5 mb-48 ">
        <View className="flex flex-col items-center relative mt-5">
          {
            /* <Image
            // source={{uri: 'default-image-url'}}
            /* source={{uri: user?.photoURL || 'default-image-url'}} */
            // TO DO kullanıcı profil foto ekleme özelliği eklenebilir
            // className="size-44 relative rounded-full"> */
          }
          <Text className="text-2xl font-rubik-bold">{user?.username}</Text>
        </View>
      </View>

      <View className="flex flex-col mt-10">
        <SettingsItem
          icon={icons.person}
          title={'Profile'}
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
        <SettingsItem
          icon={icons.settings}
          title={'Preferences'}
          onPress={() => {
            navigation.navigate('Preferences');
          }}
        />
        <SettingsItem
          icon={icons.bell}
          title={'Notifications'}
          onPress={() => {
            navigation.navigate('Notifications');
          }}
        />
        <SettingsItem
          icon={icons.shield}
          title={'Security'}
          onPress={() => {
            navigation.navigate('Security');
          }}
        />
        <SettingsItem
          icon={icons.language}
          title={'Language'}
          onPress={() => {
            navigation.navigate('Language');
          }}
        />
      </View>

      <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
        <SettingsItem
          icon={icons.logout}
          title="Logout"
          textStyle="text-danger"
          showArrow={false}
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
