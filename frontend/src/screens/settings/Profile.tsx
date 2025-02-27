import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from 'react-native-elements';
import CustomAvatar from './components/CustomAvatar';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex flex-col bg-white h-full pb-32 px-7">
      <View className="flex flex-col justify-center mt-8">
        {/* <View className="flex flex-row items-center border-b border-primary-200 mb-4">
          <Text className="text-2xl font-rubik-medium mb-2">Avatar: </Text>
          <Image
              source={{uri: 'default-image-url'}}
              className="size-12 rounded-full mb-2"
            />
        </View> */}
        <View className="flex flex-col justify-center items-center border-b border-primary-200 pb-4 mb-4">
          <Text className="text-2xl font-rubik-medium mb-1">Avatar:</Text>
          <View className="flex flex-col items-center relative">
            <CustomAvatar username={user?.username} isUsernameShown={false} />
          </View>
        </View>
        <Text className="text-2xl font-rubik-medium mb-4 border-b border-primary-200 pb-4">
          Id: <Text className="text-xl font-rubik mb-2">{user?.id}</Text>
        </Text>
        <Text className="text-2xl font-rubik-medium mb-4 border-b border-primary-200 pb-4">
          Username:{'  '}
          <Text className="text-xl font-rubik mb-2">{user?.username}</Text>
        </Text>
        <Text className="text-2xl font-rubik-medium mb-2 border-b border-primary-200 pb-4">
          Email: <Text className="text-xl font-rubik mb-2">{user?.email}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
