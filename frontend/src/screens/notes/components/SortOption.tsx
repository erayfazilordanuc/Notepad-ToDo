import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import icons from '../../../constants/icons';

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
  sortType: SortType;
  sortTypeASC: SortType;
  sortTypeDESC: SortType;
  setSortType: (sortType: SortType) => void;
  setSortModalVisible: (state: boolean) => void;
}

const SortOption = ({
  title,
  sortType,
  sortTypeASC,
  sortTypeDESC,
  setSortType,
  setSortModalVisible,
}: SortProps) => {
  return (
    <View className="flex flex-row justify-center items-center pt-2 pb-1">
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
          className={`text-lg font-rubik p-2 text-center ${
            sortType === sortTypeDESC || sortType === sortTypeASC
              ? 'text-primary-300'
              : 'text-gray-500'
          }`}>
          {title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="pl-2"
        onPress={() => {
          setSortType(sortTypeASC);
          setTimeout(() => {
            setSortModalVisible(false);
          }, 200);
        }}>
        <Image
          source={
            sortType === sortTypeASC
              ? icons.sortArrowUpSelected
              : icons.sortArrowUp
          }
          className="size-5"
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="pl-2"
        onPress={() => {
          setSortType(sortTypeDESC);
          setTimeout(() => {
            setSortModalVisible(false);
          }, 200);
        }}>
        <Image
          source={
            sortType === sortTypeDESC
              ? icons.sortArrowDownSelected
              : icons.sortArrowDown
          }
          className="size-5"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SortOption;
