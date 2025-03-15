import {useTheme} from '../../../themes/ThemeProvider';
import icons from '../../../constants/icons';
import {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {themes} from '../../../themes/themes';

interface NoteProps {
  note: Note | any;
  isEditMode: boolean;
  allSelected: boolean | false;
  searchValue: string;
  onPress: () => boolean;
  onLongPress: (id: number) => void;
}

const NoteCard = ({
  note,
  isEditMode,
  allSelected,
  searchValue,
  onPress,
  onLongPress,
}: NoteProps) => {
  const MAX_CONTENT_LENGTH = 350;
  const EDIT_MODE_MAX_CONTENT_LENGTH = 41;

  const [isSelected, setIsSelected] = useState(false);

  const {theme, colors, setTheme} = useTheme();

  const handleOnPress = () => {
    const isSelected = onPress();
    setIsSelected(isSelected);
  };

  useEffect(() => {
    if (!isEditMode) {
      setIsSelected(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    setIsSelected(allSelected);
  }, [allSelected]);

  return (
    <TouchableOpacity
      className="flex-1 w-full mb-4 px-3 py-2 rounded-2xl" // border border-primary-200 relative
      style={{backgroundColor: colors.background.primary}}
      onPress={handleOnPress}
      onLongPress={() => {
        onLongPress(note.id!);
        setIsSelected(true);
      }}>
      {/* <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          {note.title}
        </Text>
      </View> */}

      {/* <Image source={item.image} className="w-full h-40 rounded-lg" /> */}

      <View className="flex flex-col px-1">
        <View className="flex flex-row justify-between items-center mt-1">
          {(note.title !== '' || note.isFavorited || isEditMode) && (
            <Text
              className={`text-lg font-rubik-medium flex-shrink`}
              style={{
                color:
                  theme.name === 'Primary Light'
                    ? colors.primary[300]
                    : colors.primary[250],
                lineHeight: 20,
              }}>
              {note.title}
            </Text>
          )}

          <View className="flex flex-row ml-2">
            {note.isFavorited && (
              <Image
                source={icons.favorited}
                className="size-5"
                tintColor={
                  theme.name === 'Primary Light'
                    ? colors.primary[300]
                    : colors.primary[250]
                }
              />
            )}
            {isEditMode && (
              <TouchableOpacity onPress={handleOnPress} className="ml-2">
                <Image
                  source={isSelected ? icons.checked : icons.unchecked}
                  className="size-5"
                  tintColor={colors.text.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text
          className="text-md font-rubik text-black-200 leading-5 mt-1"
          style={{
            color:
              theme.name === 'Primary Light'
                ? colors.text.third
                : colors.text.secondary,
          }}
          numberOfLines={15}>
          {isEditMode
            ? `${note.content.substring(0, EDIT_MODE_MAX_CONTENT_LENGTH)} ${
                note.content.length > 0 ? '... ' : ''
              }`
            : note.content.length > MAX_CONTENT_LENGTH
            ? `${note.content.substring(0, MAX_CONTENT_LENGTH)}...`
            : note.content}
        </Text>

        <Text
          className="text-sm font-rubik text-black-200 leading-4 text-right mt-4 mb-1"
          style={{color: colors.text.secondary}}>
          {/* TO DO burada dil seçimine göre format değişmeli */}
          {new Date(note.updatedAt!).toLocaleDateString('en-EN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteCard;

// Year: {String(new Date(note.createdAt!).getFullYear())}
// Month: {String(new Date(note.createdAt!).getMonth())}
// Day: {String(new Date(note.createdAt!).getDay())}
