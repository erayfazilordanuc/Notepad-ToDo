import React from 'react';
import {View, Text, Pressable, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import '../../global.css';
import icons from '../constants/icons';
import {SafeAreaView} from 'react-native-safe-area-context';

interface CustomHeaderProps {
  title: string;
  icon?: any;
  backgroundColor?: string;
  borderColor?: string;
  className?: string;
  backArrowEnable?: boolean | false;
}

const CustomHeader = ({
  title,
  icon,
  backgroundColor,
  borderColor,
  className,
  backArrowEnable,
}: CustomHeaderProps) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      className={`bg-${backgroundColor ? backgroundColor : 'white'}`}>
      <View
        // TO DO ERROR Burada önce renkleri bir kere kullanmam gerekiyor yoksa borderColor parametresi çalışmıyor
        // {`border-${
        //   borderColor ? borderColor : 'primary-300'
        // }`} ---> Not works
        className={`flex flex-row items-center justify-between pb-5 border-b ${className} mt-5 mx-7`}>
        {backArrowEnable && (
          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex items-center justify-center h-7 w-7 bg-white rounded-full pr-8">
              <Image source={icons.backArrow} className="size-7" />
            </TouchableOpacity>
          </View>
        )}
        <Text className="text-xl font-rubik-bold mr-2">{title}</Text>
        <Image source={icon} className="size-6 mb-1" />
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
