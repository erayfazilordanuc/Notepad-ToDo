import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Button} from '@react-navigation/elements';
import {getUser} from '../../api/userService';
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Note from './Note';
import NoteCard from './components/NoteCard';
import icons from '../../constants/icons';
import {deleteNotesByIds, getNotesByAuthorId} from '../../api/noteService';
import NoResults from '../../components/NoResults';
import {useNetInfo} from '@react-native-community/netinfo';
import {addEventListener} from '@react-native-community/netinfo';
import SortOption from './components/SortOption';

function Notes() {
  const navigation = useNavigation<NotesScreenNavigationProp>();

  const appNavigation = useNavigation<AppScreenNavigationProp>();

  const [user, setUser] = useState<User | null>(null);

  const [userOnline, setUserOnline] = useState(false);

  const [allNotes, setAllNotes] = useState<Note[]>([]);

  const [notesToShow, setNotesToShow] = useState<Note[]>([]);

  const [search, setSearch] = useState('');

  const [layoutMode, setLayoutMode] = useState(2);

  const [isEditMode, setIsEditMode] = useState(false);

  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

  const [allSelected, setAllSelected] = useState(false);

  const [sortModalVisible, setSortModalVisible] = useState(false);

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

  const [sortType, setSortType] = useState(SortType.DATE_DESCENDING);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setUserOnline(state.isConnected!);
    });

    return () => unsubscribe();
  }, [notesToShow]);

  const fetchUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user: User = JSON.parse(userData!);
    setUser(user);
  };

  useEffect(() => {
    const initialFetch = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);

      // Info: it isnt possible to use fetchUser and fetchNotes together because of the async user object
      // Also fetchUser cant return user to use in useEffect because async operations are not allowed in useEffect

      const notesData = await getNotesByAuthorId(user!.id!, userOnline);
      setAllNotes(notesData!);
      setNotesToShow(notesData!);
    };

    initialFetch();
  }, []);

  const fetchNotes = async () => {
    if (notesToShow) {
      if (userOnline) {
        const notes = await getNotesByAuthorId(user!.id!, userOnline);
        setAllNotes(notes!);
        setNotesToShow(notes!);
      } else {
        const jsonNotes = await AsyncStorage.getItem('notes');
        const notes: Note[] = JSON.parse(jsonNotes!);
        setAllNotes(notes!);
        setNotesToShow(notes!);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [user]),
  );

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (search && search.length > 0) {
      let searchedValue = search.trim().toLocaleLowerCase();
      let searchedParams = searchedValue.split(' ');
      searchedParams = searchedParams.filter(
        param => param.length > 0 && param !== ' ',
      );
      const filteredNotes = allNotes.filter(
        note =>
          note.title.toLowerCase().includes(searchedValue) ||
          note.content.toLowerCase().includes(searchedValue),
      );

      setNotesToShow(filteredNotes);
    } else {
      setNotesToShow(allNotes);
    }
  }, [search]);

  useEffect(() => {
    const sortedNotes = [...notesToShow].sort((a: Note, b: Note) => {
      switch (sortType) {
        case SortType.DATE_ASCENDING:
          return (
            new Date(a.updatedAt!).getTime() - new Date(b.updatedAt!).getTime()
          );
        case SortType.DATE_DESCENDING:
          return (
            new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
          );
        case SortType.ALPHABETICAL_ASCENDING:
          return a.title.localeCompare(b.title);
        case SortType.ALPHABETICAL_DESCENDING:
          return b.title.localeCompare(a.title);
        case SortType.LENGTH_ASCENDING:
          return a.content.length - b.content.length;
        case SortType.LENGTH_DESCENDING:
          return b.content.length - a.content.length;
        // case SortType.FAVORITE_FIRST:
        //   return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        // case SortType.FAVORITE_LAST:
        //   return (a.isFavorite ? 1 : 0) - (b.isFavorite ? 1 : 0);
        default:
          return 0;
      }
    });

    setNotesToShow(sortedNotes);
  }, [sortType]);

  const handleSelectAll = () => {
    if (!allSelected) {
      setIdsToDelete(allNotes.map(note => note.id!));
    } else {
      setIdsToDelete([]);
    }

    setAllSelected(!allSelected);
  };

  const handleNoteCardPress = (id: number) => {
    navigation.navigate('Note', {noteId: id});
  };

  const handleCreateNote = async () => {
    navigation.navigate('Note', {noteId: null});
  };

  // const memoizedSearchBar = useMemo(() => {
  //   return <SearchBar search={search} setSearch={setSearch} />;
  // }, [search]);

  return (
    <SafeAreaView className="h-full bg-white px-1">
      {/* Layout değiştirme özelliği eklenecek */}
      {/* Satır modu 2liyken satır elemanlarının yüksekliği eşitlenmesin */}
      {/* TO DO ERROR Flat list search barın arkasına geçiyor */}
      <FlatList
        className="px-5"
        data={notesToShow}
        numColumns={layoutMode === 1 ? 1 : 2}
        key={layoutMode === 1 ? 'layout1' : 'layout2'}
        renderItem={({item}) => (
          <NoteCard
            note={item}
            isEditMode={isEditMode}
            allSelected={allSelected}
            onPress={() => {
              if (!isEditMode) {
                handleNoteCardPress(item.id!);
                return false;
              } else {
                if (!item.id) {
                  return false;
                }
                if (idsToDelete.includes(item.id)) {
                  setIdsToDelete(idsToDelete.filter(id => id !== item.id));
                  return false;
                } else {
                  setIdsToDelete([...idsToDelete, item.id]);
                  return true;
                }
              }
            }}
            onLongPress={(id: number) => {
              setIsEditMode(true);
              setIdsToDelete(prev => [...prev, id]);
            }}
          />
        )}
        keyExtractor={item => String(item.id)}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        columnWrapperClassName={`${layoutMode === 1 ? '' : 'flex gap-5'}`}
        ListEmptyComponent={<NoResults />}
        ListHeaderComponent={() => (
          <View className="px-5 mt-20">
            {isEditMode && (
              <View className="flex flex-row items-center justify-center mt-5">
                {/* TO DO Burada tüm notları seçme özelliği gelsin */}
                <TouchableOpacity
                  className="border border-primary-200 py-2 pb-3 bg-blue-50 shadow-md shadow-zinc-350 rounded-full w-1/3"
                  onPress={handleSelectAll}>
                  <Text className="text-center text-base font-rubik-bold text-primary-300 mt-1">
                    Select All
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <Modal visible={sortModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            setSortModalVisible(false);
          }}>
          <View className="flex-1 justify-start items-start mt-12 p-5 ml-1">
            <View className="z-50 bg-white shadow-lg rounded-xl border border-primary-100 p-2 justify-center items-center">
              <Text className="text-lg mt-1 text-gray-700 border-b border-primary-300 pb-2 px-3">
                Sort by
              </Text>
              <SortOption
                title={'Date'}
                sortType={sortType}
                sortTypeASC={SortType.DATE_ASCENDING}
                sortTypeDESC={SortType.DATE_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Alphabetic'}
                sortType={sortType}
                sortTypeASC={SortType.ALPHABETICAL_ASCENDING}
                sortTypeDESC={SortType.ALPHABETICAL_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Length'}
                sortType={sortType}
                sortTypeASC={SortType.LENGTH_ASCENDING}
                sortTypeDESC={SortType.LENGTH_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              {/* <TouchableOpacity
                className="border-t border-primary-300 pt-2 pb-1 px-3"
                onPress={() => {
                  setSortModalVisible(false);
                }}>
                <Text className="text-lg text-gray-500">Cancel</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View className="absolute bottom px-5 py-5 bg-opacity-100 bg-white">
        <View className="flex flex-row justify-center items-center">
          <View className="flex flex-row items-center rounded-full px-3 h-12 bg-primary-100 border border-primary-200 ml-4">
            <TouchableOpacity
              className=""
              onPress={() => {
                setSortModalVisible(!sortModalVisible);
              }}>
              <Image source={icons.sort} className="size-5" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row items-center justify-between w-2/3 px-4 rounded-full bg-primary-100 border border-primary-200 ml-2">
            <View className="flex-1 flex flex-row items-center justify-start z-50">
              <Image source={icons.search} className="size-5" />
              <TextInput
                value={search}
                onChangeText={(value: string) => {
                  setSearch(value);
                }}
                placeholder="Search for notes"
                className="text-sm font-rubik text-black-300 ml-2 flex-1 mt-1 h-12"
              />
            </View>
            {/* TO DO buraya profil avatarı eklenebilir */}
          </View>

          {/* TO DO ERROR çok item olunca tek elemanlı satırda bug oluşutyor*/}
          <View className="flex flex-row items-center rounded-full px-3 h-12 bg-primary-100 border border-primary-200 ml-2">
            <TouchableOpacity
              className=""
              onPress={() => {
                if (layoutMode === 1) {
                  setLayoutMode(2);
                } else {
                  setLayoutMode(1);
                }
              }}>
              <Image
                source={layoutMode == 1 ? icons.layout1 : icons.layout2}
                className="size-6"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="absolute bottom-20 right-5">
        <TouchableOpacity
          className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-zinc-400"
          onPress={handleCreateNote}>
          <Text className="text-3xl font-rubik-bold text-white">+</Text>
        </TouchableOpacity>
      </View>

      {isEditMode && (
        <View className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-full">
          <View className="w-40 bg-white rounded-full border border-primary-100 p-3">
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
                      deleteNotesByIds(idsToDelete, userOnline),
                        setIsEditMode(false);
                      setIdsToDelete([]);
                      setTimeout(() => {
                        fetchNotes();
                      }, 500);
                    },
                  },
                ]);
              }}>
              {/* Image can be used instead of text 'Delete' */}
              <Text className="text-lg font-rubik p-2 text-center text-danger border-b border-primary-100 pb-4">
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsEditMode(false);
                setIdsToDelete(() => []);
              }}
              className="pt-2">
              <Text className="text-lg font-rubik p-2 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Notes;
