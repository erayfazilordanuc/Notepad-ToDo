import React from 'react';
import {View, Text, Image} from 'react-native';
import images from '../constants/images';
import {useTheme} from '../themes/ThemeProvider';

interface NoResultProps {
  isNote: boolean;
}

const NoResults = ({isNote}: NoResultProps) => {
  const {colors} = useTheme();

  return (
    <View className="flex items-center my-36">
      <Image
        source={isNote ? images.noResult : images.noResultToDo}
        className="w-11/12 h-80"
        resizeMode="contain"
      />
      <Text
        className="text-2xl font-rubik-bold mt-5"
        style={{color: colors.text.primary}}>
        {isNote ? 'No Notes' : "No To Do's"}
      </Text>
      <Text className="text-base mt-2" style={{color: colors.text.secondary}}>
        {/* You don't have any notes yet */}
        {isNote ? 'No notes found' : "No to do's found"}
      </Text>
    </View>
  );
};

export default NoResults;
