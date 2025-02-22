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

const Security = () => {
  const [user, setUser] = useState<User | null>(null);

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
    <SafeAreaView className="flex-1 bg-primary-200 pb-32 px-7">
      <ScrollView className="p-2 mt-4">
        <View className="flex flex-row justify-start items-center mb-4">
          <Text className="text-xl font-rubik-bold border-b border-primary-200 ">
            Id:{'  '}
          </Text>
          <Text selectable className="text-lg font-rubik">
            {user?.id || 'N/A'}
          </Text>
        </View>

        <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">Username:{'  '}</Text>
          <Text selectable className="text-lg font-rubik">
            {user?.username || 'N/A'}
          </Text>
        </View>

        <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">Email:{'  '}</Text>
          <Text selectable className="text-lg font-rubik">
            {user?.email || 'N/A'}
          </Text>
        </View>

        <View className=" mb-4 pb-3 border-b border-primary-200">
          <View className="flex flex-row justify-between">
            <Text className="text-xl font-rubik-bold">Access Token: </Text>
            <TouchableOpacity
              onPress={() => setShowAccessToken(!showAccessToken)}
              className="mr-2">
              <Image
                source={showAccessToken ? icons.arrowDown : icons.arrow}
                className="ml-12 mr-1 size-5"
              />
            </TouchableOpacity>
          </View>
          <Text selectable className="text-md">
            {accessToken
              ? showAccessToken
                ? accessToken
                : `${accessToken.substring(0, 100)}...`
              : 'N/A'}
          </Text>
        </View>

        <View className="mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">Refresh Token: </Text>
          <Text selectable className="text-md">
            {refreshToken ? refreshToken : 'N/A'}
          </Text>
        </View>

        <View className="mb-4 pb-4 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">
            IPv4 Adress:{'  '}
            <Text selectable className="text-md font-rubik">
              {String(apiBaseUrl.match(/\d+\.\d+\.\d+\.\d+/))}
            </Text>
          </Text>
        </View>

        <View className="mb-4 pb-4 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">
            Api Base Url:{'  '}
            <Text selectable className="text-md font-rubik">
              {apiBaseUrl}
            </Text>
          </Text>
        </View>

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">
            Account Enable:{'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any).enabled || 'N/A'}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">
            Account Expired:{'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any).accountNonExpired ? 'Yes' : 'No'}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">
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

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">
            Last Login: {'  '}
            <Text selectable className="text-md font-rubik">
              {(user as any)?.lastLoginAt
                ? new Date(parseInt((user as any).lastLoginAt)).toLocaleString()
                : 'N/A'}
            </Text>
          </Text>
        </View> */}

        {/* <View className="flex flex-row justify-start items-center mb-4 pb-3 border-b border-primary-200">
          <Text className="text-xl font-rubik-bold">Provider Data: </Text>
          {user?.providerData?.map((provider, index) => (
            <Text selectable key={index} className="text-md">
              {JSON.stringify(provider, null, 2)}
            </Text>
          )) || 'N/A'}
        </View> */}

        <View className="mt-6 p-3 rounded-md">
          <Text className="text-xl font-rubik-bold mb-2">Full User Data:</Text>
          <Text selectable className="text-sm">
            {JSON.stringify(user, null, 2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Security;
