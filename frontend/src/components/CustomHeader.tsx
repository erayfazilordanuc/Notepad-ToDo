import React from 'react';
import {View, Text, Pressable, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import '../../global.css';
import icons from '../constants/icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../themes/ThemeProvider';
import {themes} from '../themes/themes';

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

  const {theme, colors, setTheme} = useTheme();

  return (
    <SafeAreaView
      className={`border-b ${className}`}
      style={{backgroundColor: colors.background.primary}}>
      <View
        // TO DO ERROR Burada önce renkleri bir kere kullanmam gerekiyor yoksa borderColor parametresi çalışmıyor
        // {`border-${
        //   borderColor ? borderColor : 'primary-300'
        // }`} ---> Not works
        className={`flex flex-row items-center justify-between pt-5 mx-7`}>
        {backArrowEnable && (
          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex items-center justify-center h-7 w-7 rounded-full pr-8">
              <Image
                source={icons.backArrow}
                className="size-7"
                tintColor={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        )}
        <Text
          className="text-2xl font-rubik mr-2"
          style={{color: colors.text.primary}}>
          {title}
        </Text>
        <Image
          source={icon}
          className="size-6 mb-1"
          tintColor={colors.text.primary}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
