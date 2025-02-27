import {Image, TextInput, View} from 'react-native';
import icons from '../constants/icons';

const SearchBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  return (
    <View className="flex flex-row items-center justify-between w-5/6 px-4 rounded-full bg-primary-100 border border-primary-200">
      <View className=" flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          placeholderTextColor={'gray'}
          selectionColor={'#7AADFF'}
          value={search}
          onChangeText={(value: string) => {
            setSearch(value);
          }}
          placeholder="Search for notes"
          className="text-sm font-rubik text-black-300 ml-2  mt-1 h-12"
          multiline
        />
      </View>
      {/* TO DO buraya profil avatarı eklenebilir */}
    </View>
  );
};

export default SearchBar;
