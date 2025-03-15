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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {logout} from '../../api/authService';
import {getUser} from '../../api/userService';
import icons from '../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from 'react-native-elements';
import CustomAvatar from './components/CustomAvatar';
import {useTheme} from '../../themes/ThemeProvider';
import CustomAlert from '../../components/CustomAlert';

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textColor?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textColor,
  showArrow = true,
}: SettingsItemProps) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center justify-between py-3">
      <View className="flex flex-row items-center gap-3">
        <Image
          source={icon}
          className="size-7"
          tintColor={textColor ? textColor : colors.text.primary}
        />
        <Text
          style={{color: textColor ? textColor : colors.text.primary}}
          className={`font-rubik text-lg`}>
          {title}
        </Text>
      </View>

      {showArrow && (
        <Image
          source={icons.rightArrow}
          className="size-5"
          tintColor={colors.text.primary}
        />
      )}
    </TouchableOpacity>
  );
};

const Settings = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const appNavigation = useNavigation<AppScreenNavigationProp>();
  const {colors} = useTheme();

  const [user, setUser] = useState<User | null>(null);

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    appNavigation.navigate('Launch');
  };

  return (
    <SafeAreaView
      className="h-full pb-32 px-5"
      style={{backgroundColor: colors.background.secondary}}>
      <View className="mt-12">
        <CustomAvatar username={user?.username} isUsernameShown={true} />
      </View>

      <View
        className="flex flex-col mt-16 px-4 py-2 rounded-2xl"
        style={{backgroundColor: colors.background.primary}}>
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
        <View className="ml-1 border-t mt-2 pt-1  border-primary-300">
          <CustomAlert
            message={'Are you sure to logout?'}
            visible={isAlertVisible}
            onYes={handleLogout}
            onCancel={() => {
              setIsAlertVisible(false);
            }}
          />
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textColor="#fd5353"
            showArrow={false}
            onPress={() => {
              setIsAlertVisible(true);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
