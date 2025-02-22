import icons from '../../../constants/icons';
import {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

interface NoteProps {
  note: Note;
  isEditMode: boolean;
  allSelected: boolean | false;
  onPress: () => boolean;
  onLongPress: (id: number) => void;
}



const Note = ({
  note,
  isEditMode,
  allSelected,
  onPress,
  onLongPress,
}: NoteProps) => {
  const MAX_TITLE_LENGTH = 41;
  const MAX_CONTENT_LENGTH = 75;

  const [isSelected, setIsSelected] = useState(false);

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
      className="border border-primary-100 flex-1 w-full mt-4 px-3 py-4 rounded-2xl bg-white shadow-lg shadow-black-100/70 relative"
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

      <View className="flex flex-col">
        <View className="flex flex-row justify-between items-center">
          <Text
            className={`text-base font-rubik-bold flex-shrink ${
              note.title ? 'text-primary-300' : 'text-black-200'
            }`}>
            {note.title
              ? note.title.length > MAX_TITLE_LENGTH
                ? `${note.title.substring(0, MAX_TITLE_LENGTH)}...`
                : note.title
              : 'New Note'}
          </Text>

          {isEditMode && (
            <TouchableOpacity onPress={handleOnPress} className="ml-2">
              <Image
                source={isSelected ? icons.checked : icons.unchecked}
                className="size-6"
              />
            </TouchableOpacity>
          )}
        </View>

        {!isEditMode && (
          <Text className="text-sm font-rubik text-black-200 leading-4">
            {note.content.length > MAX_CONTENT_LENGTH
              ? `${note.content.substring(0, MAX_CONTENT_LENGTH)}...`
              : note.content}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Note;
