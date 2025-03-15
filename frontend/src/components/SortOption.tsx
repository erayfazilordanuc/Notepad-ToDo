import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import icons from '../constants/icons';
import {useTheme} from '../themes/ThemeProvider';
import {themes} from '../themes/themes';

enum SortType {
  DATE_ASCENDING,
  DATE_DESCENDING,
  ALPHABETICAL_ASCENDING,
  ALPHABETICAL_DESCENDING,
  LENGTH_ASCENDING,
  LENGTH_DESCENDING,
  FAVORITE_FIRST,
  FAVORITE_LAST,
}

interface SortProps {
  title: string;
  color: string;
  sortType: SortType;
  sortTypeASC: SortType;
  sortTypeDESC: SortType;
  setSortType: (sortType: SortType) => void;
  setSortModalVisible: (state: boolean) => void;
}

const SortOption = ({
  title,
  color,
  sortType,
  sortTypeASC,
  sortTypeDESC,
  setSortType,
  setSortModalVisible,
}: SortProps) => {
  const {theme, colors, setTheme} = useTheme();
  return (
    <View className="flex flex-row justify-center items-center rounded-2xl px-4 py-1">
      <TouchableOpacity
        onPress={() => {
          if (title === 'Alphabetic' || title === 'Favorite') {
            setSortType(sortTypeASC);
          } else {
            setSortType(sortTypeDESC);
          }
          setTimeout(() => {
            setSortModalVisible(false);
          }, 200);
        }}>
        <Text
          className={`text-lg font-rubik p-2 text-center`}
          style={{
            color:
              sortType === sortTypeDESC || sortType === sortTypeASC
                ? color
                : colors.text.secondary,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="pl-2 rounded-2xl p-2 ml-1"
        style={{
          backgroundColor:
            color === '#10b981'
              ? colors.background.third // colors.background.third is not working
              : colors.background.secondary,
        }}
        onPress={() => {
          setSortType(sortTypeASC);
          setTimeout(() => {
            setSortModalVisible(false);
          }, 200);
        }}>
        <Image
          source={icons.sortArrowUp}
          className="size-5"
          tintColor={sortType === sortTypeASC ? color : colors.text.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="rounded-2xl p-2 ml-2"
        style={{
          backgroundColor:
            color === '#10b981' ? colors.background.third : colors.background.secondary,
        }}
        onPress={() => {
          setSortType(sortTypeDESC);
          setTimeout(() => {
            setSortModalVisible(false);
          }, 200);
        }}>
        <Image
          source={icons.sortArrowDown}
          className="size-5"
          tintColor={sortType === sortTypeDESC ? color : colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SortOption;
