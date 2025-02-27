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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import {
  createNote,
  deleteNoteById,
  getNote,
  updateNote,
} from '../../api/noteService';
// import NetInfo from '@react-native-community/netinfo';

const Note = () => {
  const route = useRoute();

  const navigation = useNavigation<NotesScreenNavigationProp>();

  const [userOnline, setUserOnline] = useState(false);

  const [prevNote, setPrevNote] = useState<Note | null>(null);

  const {noteId} = route.params as {noteId: number};

  const [note, setNote] = useState<Note | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [isReminderEnabled, setIsReminderEnabled] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const windowHeight = Dimensions.get('window').height;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
  }, [note]);

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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsModalVisible(false);
        Keyboard.dismiss();
      }}>
      <SafeAreaView className="bg-white">
        <View className="flex flex-row items-center w-full justify-between rounded-3xl bg-white py-5 border-b border-primary-300">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center ml-3">
            <Image source={icons.backArrow} className="size-5" />
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
                tintColor={'#191D31'}
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
                  <View className="z-50 bg-white shadow-lg rounded-xl border border-primary-200 p-2">
                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center pb-1">
                      <Text className="text-lg font-rubik-semibold">Id: </Text>
                      {note!.id}
                    </Text>
                  </View>
                )}
                {showDetails && (
                  <View className="z-50 bg-white shadow-lg rounded-xl border border-primary-200 p-2">
                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center pb-1">
                      <Text className="text-lg font-rubik-semibold">Id: </Text>
                      {note!.id}
                    </Text>
                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center pb-2">
                      <Text className="text-lg font-rubik-semibold">
                        Creation:
                      </Text>
                      {'\n'}
                      {new Date(note!.createdAt!).toLocaleTimeString('en-EN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                      {'\n'}
                      {new Date(note!.createdAt!).toLocaleDateString('en-EN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>

                    <Text
                      selectable
                      className="text-lg font-rubik p-2 text-center">
                      <Text className="text-lg font-rubik-semibold">
                        Last Update:
                      </Text>
                      {'\n'}
                      {new Date(note!.updatedAt!).toLocaleTimeString('en-EN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                      {'\n'}
                      {new Date(note!.updatedAt!).toLocaleDateString('en-EN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                )}
                <View className="z-50 bg-white shadow-lg rounded-xl border border-primary-200 p-2">
                  <TouchableOpacity
                    className=" border-primary-200"
                    onPress={() => {
                      setIsReminderEnabled(!isReminderEnabled);
                      setShowDetails(false);
                    }}>
                    <Text className="text-lg font-rubik p-2 text-center">
                      Reminder
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className=" border-primary-200"
                    onPress={() => {
                      setShowDetails(!showDetails);
                      setIsReminderEnabled(false);
                    }}>
                    <Text className="text-lg font-rubik p-2 text-center">
                      Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Are you sure to delete?', '', [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: async () => {
                            setIsModalVisible(false);
                            deleteNoteById(note!.id!, userOnline);
                            navigation.navigate('Notes');
                            // Dont goBack in order to refresh the notes because It doesnt trigger useEffect()
                          },
                        },
                      ]);
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
            paddingHorizontal: 16,
            paddingRight: 22,
            paddingTop: 6,
            backgroundColor: 'white',
            height: windowHeight * 0.85,
            paddingBottom: keyboardHeight,
          }}>
          <TextInput
            placeholderTextColor={'gray'}
            selectionColor={'#7AADFF'}
            value={note?.title}
            onChangeText={value => {
              setNote(prev => (prev ? {...prev, title: value} : null));
            }}
            placeholder="Title"
            className="text-wrap text-2xl font-rubik ml-2 text-left border-b border-primary-200 pb-2"
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            maxLength={100}
            numberOfLines={3}
          />
          <TextInput
            placeholderTextColor={'gray'}
            selectionColor={'#7AADFF'}
            value={note?.content}
            onChangeText={value => {
              setNote(prev => (prev ? {...prev, content: value} : null));
            }}
            placeholder="Note"
            className="leading-6 text-wrap text-xl font-rubik ml-2 flex-1 text-left pt-3"
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

export default Note;
