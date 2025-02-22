import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const Notifications = () => {
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
          <Text className="text-2xl font-rubik-bold">Notifications</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
