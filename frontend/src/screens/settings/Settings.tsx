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
import {Avatar} from 'react-native-elements';
import CustomAvatar from './components/CustomAvatar';

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
    Alert.alert('Are you sure to logout?', '', [
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
    ]);
  };

  return (
    <SafeAreaView className="h-full bg-white pb-32 px-7">
      <View className="mt-24">
        <CustomAvatar username={user?.username} isUsernameShown={true} />
      </View>

      <View className="flex flex-col mt-16">
        <SettingsItem
          icon={icons.person}
          title={'Profile'}
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
        <SettingsItem
          icon={icons.preferences}
          title={'Preferences'}
          onPress={() => {
            navigation.navigate('Preferences');
          }}
        />
        <SettingsItem
          icon={icons.reminder}
          title={'Reminders'}
          onPress={() => {
            navigation.navigate('Reminders');
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
        <View className="ml-1 border-t mt-5 pt-5  border-primary-300">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
