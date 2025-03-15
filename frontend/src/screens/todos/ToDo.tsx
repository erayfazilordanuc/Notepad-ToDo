import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Platform,
  StyleSheet,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import {
  createToDo,
  deleteToDoById,
  getToDo,
  updateToDo,
} from '../../api/todoService';
import {useTheme} from '../../themes/ThemeProvider';
import {themes} from '../../themes/themes';
import {addEventListener} from '@react-native-community/netinfo';
import CustomAlert from '../../components/CustomAlert';
// import NetInfo from '@react-native-community/netinfo';

const ToDo = () => {
  const route = useRoute();

  const navigation = useNavigation<ToDosScreenNavigationProp>();

  const {theme, colors, setTheme} = useTheme();

  const [userOnline, setUserOnline] = useState(false);

  const [prevToDo, setPrevToDo] = useState<ToDo | null>(null);

  const {todoId} = route.params as {todoId: number};

  const [todo, setToDo] = useState<ToDo | null>({
    id: 0,
    title: '',
    content: '',
    isDone: false,
    isFavorited: false,
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [isReminderEnabled, setIsReminderEnabled] = useState(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const windowHeight = Dimensions.get('window').height;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const handleOpenKeyboard = () => {
    inputRef.current?.focus();
  };

  const checkTodo = async () => {
    if (todo && todo.title.length === 0 && todo?.content.length === 0) {
      await deleteToDoById(todo.id, userOnline);
    }
  };

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setUserOnline(state.isConnected!);
    });

    return () => unsubscribe();
  }, [todo]);

  useEffect(() => {
    if (todoId) {
      const fetchToDo = async () => {
        const todo = await getToDo(todoId, userOnline);
        setToDo(todo);
        setPrevToDo(todo);
      };

      fetchToDo();
    } else {
      const fetchToDo = async () => {
        const todo = await createToDo(userOnline);
        setToDo(todo);
        setPrevToDo(todo);
      };

      fetchToDo();
    }
  }, []);

  useEffect(() => {
    if (!todo) return;

    console.log(todo);
    if (true) {
      if (
        todo.title === prevToDo?.title &&
        todo.content === prevToDo?.content &&
        todo.isFavorited === prevToDo?.isFavorited
      ) {
        return;
      }

      const todoPayload: ToDoRequestPayload = {
        title: todo.title,
        content: todo.content,
        authorId: todo.authorId,
        isDone: todo.isDone,
        isFavorited: todo.isFavorited,
      };

      console.log(todoPayload);

      updateToDo(todo.id, todoPayload, userOnline);
      setPrevToDo(todo);
    }
  }, [todo]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     checkTodo();
  //     setTimeout(() => {
  //       navigation.goBack();
  //     }, 100);

  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'beforeRemove',
      async (event: any) => {
        // İşlem bitmeden önce çıkışı engelle
        event.preventDefault();

        // Notu kontrol et ve işlem tamamlanınca geri dön
        await checkTodo();

        // Manuel olarak geri dönüşü sağla
        navigation.dispatch(event.data.action);
      },
    );

    return unsubscribe;
  }, [navigation, todo]);

  const handleDeleteToDo = async () => {
    setIsModalVisible(false);
    deleteToDoById(todo!.id!, userOnline);
    navigation.navigate('ToDos');
    // Dont goBack in order to refresh the notes because It doesnt trigger useEffect()
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsModalVisible(false);
        Keyboard.dismiss();
      }}
      style={{backgroundColor: colors.background.primary}}>
      <SafeAreaView style={{backgroundColor: colors.background.primary}}>
        <View
          className="flex flex-row items-center w-full justify-between py-2 pt-3 border-b border-emerald-500"
          style={{backgroundColor: colors.background.primary}}>
          <TouchableOpacity
            onPress={() => {
              checkTodo();
              navigation.goBack();
            }}
            className="flex flex-row rounded-full size-11 items-center justify-center ml-2">
            <Image
              source={icons.backArrow}
              className="size-7"
              tintColor={colors.text.primary}
            />
          </TouchableOpacity>
          <View className="flex flex-row justify center">
            <TouchableOpacity
              className="flex flex-row items-center mr-3"
              onPress={() => {
                setToDo(prev =>
                  prev
                    ? {
                        ...prev,
                        isFavorited: !prev.isFavorited,
                      }
                    : null,
                );
              }}>
              {/* Basıldığında kırmızı olsun */}
              {/* Seçeneklerin içine taşınabilir */}
              <Image
                source={todo?.isFavorited ? icons.favorited : icons.favorite}
                className="size-7"
                tintColor={
                  todo?.isFavorited ? colors.text.todo : colors.text.primary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center mr-3"
              onPress={() => {
                setIsModalVisible(true);
              }}>
              <Image
                source={icons.dots}
                className="size-8"
                tintColor={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <TouchableWithoutFeedback
            onPress={event => {
              if (event.target === event.currentTarget) {
                setIsModalVisible(false);
                setShowDetails(false);
              }
            }}>
            <View className="flex-1 justify-start items-end p-5">
              <View className="flex flex-row items-start">
                {isReminderEnabled && (
                  <View
                    className="z-50 rounded-xl border p-2"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.background.third,
                    }}>
                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center pb-1"
                      style={{color: colors.text.third}}>
                      Coming soon
                    </Text>
                  </View>
                )}
                {showDetails && (
                  <View
                    className="z-50 border p-2 rounded-2xl"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.background.third,
                    }}>
                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center pb-1"
                      style={{color: colors.text.third}}>
                      <Text
                        className="text-lg font-rubik-semibold"
                        style={{color: colors.text.primary}}>
                        Id{' '}
                      </Text>
                      {todo?.id}
                    </Text>
                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center pb-2"
                      style={{color: colors.text.third}}>
                      <Text
                        className="text-lg font-rubik-semibold"
                        style={{color: colors.text.primary}}>
                        Creation
                      </Text>
                      {'\n'}
                      {todo?.createdAt
                        ? new Date(todo!.createdAt!).toLocaleTimeString(
                            'en-EN',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            },
                          )
                        : ''}
                      {'\n'}
                      {todo?.createdAt
                        ? new Date(todo!.createdAt!).toLocaleDateString(
                            'en-EN',
                            {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            },
                          )
                        : ''}
                    </Text>

                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center"
                      style={{color: colors.text.third}}>
                      <Text
                        className="text-lg font-rubik-semibold"
                        style={{color: colors.text.primary}}>
                        Last Update
                      </Text>
                      {'\n'}
                      {todo?.updatedAt
                        ? new Date(todo!.updatedAt!).toLocaleTimeString(
                            'en-EN',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            },
                          )
                        : ''}
                      {'\n'}
                      {todo?.updatedAt
                        ? new Date(todo!.updatedAt!).toLocaleDateString(
                            'en-EN',
                            {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            },
                          )
                        : ''}
                    </Text>
                  </View>
                )}
                <View
                  className="z-50 rounded-2xl border p-2"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.background.third,
                  }}>
                  <TouchableOpacity
                    className=" border-primary-200"
                    onPress={() => {
                      setIsReminderEnabled(!isReminderEnabled);
                      setShowDetails(false);
                    }}>
                    <Text
                      className="text-lg font-rubik p-2 text-center"
                      style={{color: colors.text.primary}}>
                      Reminder
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className=" border-primary-200"
                    onPress={() => {
                      setShowDetails(!showDetails);
                      setIsReminderEnabled(false);
                    }}>
                    <Text
                      className="text-lg font-rubik p-2 text-center"
                      style={{color: colors.text.primary}}>
                      Details
                    </Text>
                  </TouchableOpacity>
                  <CustomAlert
                    message={'Are you sure to delete?'}
                    visible={isAlertVisible}
                    onYes={handleDeleteToDo}
                    onCancel={() => {
                      setIsAlertVisible(false);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsAlertVisible(true);
                    }}>
                    <Text className="text-lg font-rubik text-danger p-2 text-center pb-2">
                      Delete
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    className=" border-primary-200"
                    onPress={() => {
                      setIsModalVisible(false);
                      setShowDetails(false);
                    }}>
                    <Text className="text-lg font-rubik p-2 text-center">
                      Close
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View
          style={{
            flexDirection: 'column',
            paddingHorizontal: 6,
            paddingRight: 12,
            paddingTop: 6,
            backgroundColor: colors.background.third,
            height: windowHeight * 0.87,
            paddingBottom: keyboardHeight * 0.5,
          }}>
          <TextInput
            placeholderTextColor={'gray'}
            selectionColor={'#64cc95'}
            value={todo?.title}
            onChangeText={value => {
              setToDo(prev => (prev ? {...prev, title: value} : null));
            }}
            placeholder="To do"
            className="text-wrap text-2xl font-rubik ml-2 text-left border-b pb-2"
            style={{
              color: colors.text.primary,
              borderColor:
                theme.name === 'Primary Light' ? '#9dd9c5' : '#6dc1a4',
            }}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            maxLength={100}
            numberOfLines={3}
          />
          <TextInput
            placeholderTextColor={'gray'}
            selectionColor={'#64cc95'}
            value={todo?.content}
            onChangeText={value => {
              setToDo(prev => (prev ? {...prev, content: value} : null));
            }}
            placeholder="Content"
            className="leading-6 text-wrap text-xl font-rubik ml-2 flex-1 text-left pt-3"
            style={{color: colors.text.primary}}
            multiline
            textAlignVertical="top"
            maxLength={10000}
            numberOfLines={250}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ToDo;
