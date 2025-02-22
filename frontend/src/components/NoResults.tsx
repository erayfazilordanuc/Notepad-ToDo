import React from 'react';
import {View, Text, Image} from 'react-native';
import images from '../constants/images';

const NoResults = () => {
  return (
    <View className="flex items-center my-36">
      <Image
        source={images.noResult}
        className="w-11/12 h-80"
        resizeMode="contain"
      />
      <Text className="text-2xl font-rubik-bold text-black-300 mt-5">
        No Notes
      </Text>
      <Text className="text-base text-black-100 mt-2">
        {/* You don't have any notes yet */}
        No notes found
      </Text>
    </View>
  );
};

export default NoResults;
