import {useTheme} from '../../../themes/ThemeProvider';
import icons from '../../../constants/icons';
import {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {themes} from '../../../themes/themes';
import {addEventListener} from '@react-native-community/netinfo';
import {updateToDo} from '../../../api/todoService';

interface ToDoProps {
  todo: Note | any;
  isEditMode: boolean;
  allSelected: boolean | false;
  searchValue: string;
  refresh: () => void;
  onDone?: (todo: ToDo) => void;
  onPress: () => boolean;
  onLongPress: (id: number) => void;
}

const ToDoCard = ({
  todo,
  isEditMode,
  allSelected,
  searchValue,
  refresh,
  onDone,
  onPress,
  onLongPress,
}: ToDoProps) => {
  const MAX_CONTENT_LENGTH = 350;
  const EDIT_MODE_MAX_CONTENT_LENGTH = 41;

  const [userOnline, setUserOnline] = useState(false);

  const [prevToDo, setPrevToDo] = useState<ToDo | null>(null);

  const [isSelected, setIsSelected] = useState(false);

  const [isDone, setIsDone] = useState(todo.isDone);

  const {theme, colors, setTheme} = useTheme();

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setUserOnline(state.isConnected!);
    });

    return () => unsubscribe();
  }, [todo]);

  useEffect(() => {
    setIsDone(todo.isDone);
  }, []);

  const handleOnEditPress = () => {
    const isSelected = onPress();
    setIsSelected(isSelected);
  };

  const handleOnPress = () => {
    if (!todo) return;

    const todoPayload: ToDoRequestPayload = {
      title: todo.title,
      content: todo.content,
      authorId: todo.authorId,
      isDone: !isDone,
      isFavorited: todo.isFavorited,
    };

    updateToDo(todo.id!, todoPayload, userOnline);
    setPrevToDo(todo);

    console.log('geliyor');

    setIsDone(!isDone);
    setTimeout(() => refresh(), 50);
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
      className="flex flex-col items-stretch mb-4 px-3 py-2 rounded-2xl relative" // border border-primary-200
      style={{backgroundColor: colors.background.primary}}
      onPress={handleOnEditPress}
      onLongPress={() => {
        onLongPress(todo.id!);
        setIsSelected(true);
      }}>
      {/* <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          {note.title}
        </Text>
      </View> */}

      {/* <Image source={item.image} className="w-full h-40 rounded-lg" /> */}
      <View className="flex flex-row items-center justify-between mt-1">
        {/* Sol Tarafta: Checkbox ve Başlık */}
        <View className="flex flex-row items-center flex-1">
          <TouchableOpacity onPress={handleOnPress} className="p-1">
            <Image
              source={isDone ? icons.checkedToDo : icons.uncheckedToDo}
              className="size-10"
              tintColor={colors.text.secondary}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg font-rubik-medium flex-shrink ml-2`}
            style={{
              textDecorationLine: todo.isDone ? 'line-through' : 'none',
              color: isDone ? colors.text.secondary : colors.text.todo,
            }}>
            {todo.title}
          </Text>
        </View>

        {/* Sağ Tarafta: Favori İkonu ve Edit Mod İkonu */}
        <View className="flex flex-row items-center">
          {todo.isFavorited && (
            <Image
              source={icons.favorited}
              className="size-5 mr-2"
              tintColor={isDone ? colors.text.secondary : colors.text.todo}
            />
          )}
          {isEditMode && (
            <TouchableOpacity onPress={handleOnEditPress} className="mr-2">
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
        className="text-sm font-rubik text-black-200 leading-4 text-right mt-4 mb-1"
        style={{color: colors.text.secondary}}>
        {/* TO DO burada dil seçimine göre format değişmeli */}
        {new Date(todo.updatedAt!).toLocaleDateString('en-EN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </Text>
    </TouchableOpacity>
  );
};

export default ToDoCard;

// Year: {String(new Date(note.createdAt!).getFullYear())}
// Month: {String(new Date(note.createdAt!).getMonth())}
// Day: {String(new Date(note.createdAt!).getDay())}
