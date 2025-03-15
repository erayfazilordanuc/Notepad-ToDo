import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiBaseUrl} from '../../api/apiClient';
import {useTheme} from '../../themes/ThemeProvider';

const Security = () => {
  const [user, setUser] = useState<User | null>(null);

  const {theme, colors, setTheme} = useTheme();

  const [accessToken, setAccessToken] = useState<String | null>(null);

  const [refreshToken, setRefreshToken] = useState<String | null>(null);

  const [showAccessToken, setShowAccessToken] = useState(false);

  const [apiBaseUrl, setApiBaseUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);
    };

    const fetchTokens = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    };

    fetchUser();
    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchApiBaseUrl = async () => {
      const apiBaseUrl = await getApiBaseUrl();
      setApiBaseUrl(apiBaseUrl);
    };

    fetchApiBaseUrl();
  }, []);

  return (
    <SafeAreaView
      className={`flex-1 pb-32 px-5`}
      style={{backgroundColor: colors.background.secondary}}>
      <ScrollView>
        <View
          className="flex flex-row justify-start items-center mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium"
            style={{color: colors.text.primary}}>
            Id:{'  '}
          </Text>
          <Text
            selectable
            className="text-lg font-rubik"
            style={{color: colors.text.primary}}>
            {user?.id || 'N/A'}
          </Text>
        </View>

        <View
          className="flex flex-row justify-start items-center pb-3 mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium"
            style={{color: colors.text.primary}}>
            Username:{'  '}
          </Text>
          <Text
            selectable
            className="text-lg font-rubik"
            style={{color: colors.text.primary}}>
            {user?.username || 'N/A'}
          </Text>
        </View>

        <View
          className="flex flex-row justify-start items-center pb-3 mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium"
            style={{color: colors.text.primary}}>
            Email:{'  '}
          </Text>
          <Text
            selectable
            className="text-lg font-rubik"
            style={{color: colors.text.primary}}>
            {user?.email || 'N/A'}
          </Text>
        </View>

        <View
          className="pb-3 mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <View className="flex flex-row justify-between">
            <Text
              className="text-xl font-rubik-medium"
              style={{color: colors.text.primary}}>
              Access Token:{' '}
            </Text>
            <TouchableOpacity
              onPress={() => setShowAccessToken(!showAccessToken)}
              className="mr-2">
              <Image
                source={showAccessToken ? icons.arrowDown : icons.arrow}
                className="ml-12 mr-2 size-7"
                tintColor={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
          <Text
            selectable
            className="text-md"
            style={{color: colors.text.primary}}>
            {accessToken
              ? showAccessToken
                ? accessToken
                : `${accessToken.substring(0, 100)}...`
              : 'N/A'}
          </Text>
        </View>

        <View
          className="pb-3 mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium"
            style={{color: colors.text.primary}}>
            Refresh Token:{' '}
          </Text>
          <Text
            selectable
            className="text-md"
            style={{color: colors.text.primary}}>
            {refreshToken ? refreshToken : 'N/A'}
          </Text>
        </View>

        <View
          className="pb-4 mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium"
            style={{color: colors.text.primary}}>
            IPv4 Adress:{'  '}
            <Text
              selectable
              className="text-md font-rubik"
              style={{color: colors.text.primary}}>
              {String(apiBaseUrl.match(/\d+\.\d+\.\d+\.\d+/))}
            </Text>
          </Text>
        </View>

        <View
          className="pb-4 mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium"
            style={{color: colors.text.primary}}>
            Api Base Url:{'  '}
            <Text selectable className="text-md font-rubik">
              {apiBaseUrl}
            </Text>
          </Text>
        </View>

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3">
          <Text className="text-xl font-rubik-medium">
            Account Enable:{'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any).enabled || 'N/A'}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3">
          <Text className="text-xl font-rubik-medium">
            Account Expired:{'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any).accountNonExpired ? 'Yes' : 'No'}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3">
          <Text className="text-xl font-rubik-medium">
            Token Expiration:{'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any)?.stsTokenManager?.expirationTime
                ? new Date(
                    (user as any).stsTokenManager.expirationTime,
                  ).toLocaleString()
                : ''}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3">
          <Text className="text-xl font-rubik-medium">
            Last Login: {'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any)?.lastLoginAt
                ? new Date(parseInt((user as any).lastLoginAt)).toLocaleString()
                : 'N/A'}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3">
          <Text className="text-xl font-rubik-medium">Provider Data: </Text>
          {user?.providerData?.map((provider, index) => (
            <Text selectable key={index} className="text-md">
              {JSON.stringify(provider, null, 2)}
            </Text>
          )) || 'N/A'}
        </View> */}

        <View
          className="mb-2 p-4 rounded-2xl"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-xl font-rubik-medium mb-2"
            style={{color: colors.text.primary}}>
            Full User Data:
          </Text>
          <Text
            selectable
            className="text-lg"
            style={{color: colors.text.primary}}>
            {JSON.stringify(user, null, 2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Security;
