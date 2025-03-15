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
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import {
  createNote,
  deleteNoteById,
  getNote,
  updateNote,
} from '../../api/noteService';
import {useTheme} from '../../themes/ThemeProvider';
import {themes} from '../../themes/themes';
import {addEventListener} from '@react-native-community/netinfo';
import CustomAlert from '../../components/CustomAlert';
// import NetInfo from '@react-native-community/netinfo';

const Note = () => {
  const route = useRoute();

  const navigation = useNavigation<NotesScreenNavigationProp>();

  const {theme, colors, setTheme} = useTheme();

  const [userOnline, setUserOnline] = useState(false);

  const [prevNote, setPrevNote] = useState<Note | null>(null);

  const {noteId} = route.params as {noteId: number};

  const [note, setNote] = useState<Note | null>({
    id: 0,
    title: '',
    content: '',
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

  const windowWidth = Dimensions.get('window').width;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const inputRef = useRef<TextInput>(null);

  const textInputRef = useRef<TextInput>(null);

  const [selection, setSelection] = useState({
    start: note?.content.length ? note.content.length : 0,
    end: note?.content.length ? note.content.length : 0,
  });

  const handleOpenKeyboard = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setUserOnline(state.isConnected!);
    });

    return () => unsubscribe();
  }, [note]);

  // useEffect(() => {
  //   if (textInputRef.current) {
  //     textInputRef.current.setNativeProps({
  //       selection: {start: 0, end: 0},
  //     });
  //   }
  // }, []);

  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      // Sayfa açıldığında ScrollView'ı en üste kaydır
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  };

  const scrollTextInput = () => {
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({
        selection: {start: 0, end: 0},
      });
    }
  };

  const checkNote = async () => {
    if (note && note.title.length === 0 && note.content.length === 0) {
      await deleteNoteById(note.id, userOnline);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      // Sayfa açıldığında ScrollView'ı en üste kaydır
      scrollViewRef.current.scrollTo({y: 0, animated: false});
    }

    // setSelection({
    //   start: 0,
    //   end: 0,
    // });
  }, []);

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        const note = await getNote(noteId, userOnline);
        setNote(note);
        setPrevNote(note);
      };

      fetchNote();
    } else {
      const fetchNote = async () => {
        const note = await createNote(userOnline);
        setNote(note);
        setPrevNote(note);
      };

      fetchNote();
    }
  }, []);

  useEffect(() => {
    if (!note) return;

    if (note.id !== 0) {
      if (
        note.title === prevNote?.title &&
        note.content === prevNote?.content &&
        note.isFavorited === prevNote?.isFavorited
      ) {
        return;
      }

      const notePayload: NoteRequestPayload = {
        title: note.title,
        content: note.content,
        authorId: note.authorId,
        isFavorited: note.isFavorited,
      };

      updateNote(note.id!, notePayload, userOnline);
      setPrevNote(note);
    }
  }, [note]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true); // Klavye açıldı
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false); // Klavye kapandı
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // useEffect(() => {
  //   const backAction = async () => {
  //     await checkNote().then(() => {
  //     navigation.goBack()});
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       backAction();
  //       return true;
  //     },
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
        await checkNote();

        // Manuel olarak geri dönüşü sağla
        navigation.dispatch(event.data.action);
      },
    );

    return unsubscribe;
  }, [navigation, note]);

  const handleDeleteNote = async () => {
    setIsModalVisible(false);
    deleteNoteById(note!.id!, userOnline);
    navigation.navigate('Notes');
    // Dont goBack in order to refresh the notes because It doesnt trigger useEffect()
  };

  const handleLayout = (event: any) => {
    const {width, height, x, y} = event.nativeEvent.layout;
    console.log(`Width: ${width}, Height: ${height}, X: ${x}, Y: ${y}`);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsModalVisible(false);
        Keyboard.dismiss();
      }}
      style={{backgroundColor: colors.background.primary}}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: colors.background.primary}}>
        <View
          className="flex flex-row items-center w-full justify-between py-2 pt-3 border-b border-primary-250"
          style={{backgroundColor: colors.background.primary}}>
          <TouchableOpacity
            onPress={() => {
              checkNote();
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
                setNote(prev =>
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
                source={note?.isFavorited ? icons.favorited : icons.favorite}
                className="size-7"
                tintColor={
                  note?.isFavorited
                    ? theme.name === 'Primary Light'
                      ? colors.primary[300]
                      : colors.primary[250]
                    : colors.text.primary
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
                      borderColor: colors.background.secondary,
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
                      borderColor: colors.background.secondary,
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
                      {note!.id ? note!.id : ''}
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
                      {note?.createdAt
                        ? new Date(note!.createdAt!).toLocaleTimeString(
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
                      {note?.createdAt
                        ? new Date(note!.createdAt!).toLocaleDateString(
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
                      {note?.updatedAt
                        ? new Date(note!.updatedAt!).toLocaleTimeString(
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
                      {note?.updatedAt
                        ? new Date(note!.updatedAt!).toLocaleDateString(
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
                    borderColor: colors.background.secondary,
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
                    onYes={handleDeleteNote}
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
            paddingHorizontal: 10,
            paddingRight: 16,
            paddingTop: 6,
            backgroundColor: colors.background.secondary,
            height: windowHeight * 0.87, // isKeyboardVisible ? windowHeight * 1 :
          }}>
          <TextInput
            placeholderTextColor={'gray'}
            selectionColor={'#7AADFF'}
            value={note?.title}
            onChangeText={value => {
              setNote(prev => (prev ? {...prev, title: value} : null));
            }}
            placeholder="Title"
            className="text-wrap text-2xl font-rubik ml-2 text-left border-b pb-2"
            style={{
              color: colors.text.primary,
              borderColor: colors.primary[200],
            }}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            maxLength={100}
            numberOfLines={3}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              flex: 1,
              paddingBottom: isKeyboardVisible ? keyboardHeight * 0.3 : 0,
            }}>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <TextInput
                // selection={selection}
                placeholderTextColor={'gray'}
                selectionColor={'#7AADFF'}
                value={note?.content}
                onChangeText={value => {
                  setNote(prev => (prev ? {...prev, content: value} : null));
                }}
                onSelectionChange={({nativeEvent}) => {
                  const {selection} = nativeEvent;
                  // setSelection(selection);
                  console.log(note?.content.length);
                  console.log('Kullanıcının dokunduğu konum:', selection);
                }}
                placeholder="Note"
                className="leading-6 text-wrap text-lg font-rubik ml-2 text-left pt-3"
                style={{color: colors.text.primary}}
                multiline
                textAlignVertical="top"
                maxLength={10000}
                numberOfLines={250}
                autoFocus={false}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Note;
