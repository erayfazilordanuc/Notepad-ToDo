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
  Keyboard,
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
import MasonryList from '@react-native-seoul/masonry-list';

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

      // Info: it isn't possible to use fetchUser and fetchNotes together because of the async user object
      // Also fetchUser cant return user to use in useEffect because async operations are not allowed in useEffect

      const notesData = await getNotesByAuthorId(user!.id!, userOnline);
      setAllNotes(notesData!);
      setNotesToShow(notesData!);
    };

    initialFetch();
  }, []);

  const fetchNotes = async () => {
    if (notesToShow) {
      const notes = await getNotesByAuthorId(user!.id!, userOnline);

      const sortedNotes = [...notes].sort((a: Note, b: Note) => a.id - b.id);
      const sortedAllNotes = [...allNotes].sort(
        (a: Note, b: Note) => a.id - b.id,
      );

      if (JSON.stringify(sortedNotes) === JSON.stringify(sortedAllNotes)) {
        return;
      }

      setSortType(SortType.DATE_DESCENDING);

      setAllNotes(notes!);
      setNotesToShow(notes!);
    }
  };

  useFocusEffect(() => {
    // useCallback has caused some asynchronous issues
    fetchNotes();
  });

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

  const sortNotes = (notes: Note[], sortTypeParam?: SortType) => {
    notes.sort((a: Note, b: Note) => {
      switch (sortTypeParam ? sortTypeParam : sortType) {
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
          return (
            a.title.length +
            a.content.length -
            (b.title.length + b.content.length)
          );
        case SortType.LENGTH_DESCENDING:
          return (
            b.title.length +
            b.content.length -
            (a.title.length + a.content.length)
          );
        case SortType.FAVORITE_FIRST:
          return (b.isFavorited ? 1 : 0) - (a.isFavorited ? 1 : 0);
        case SortType.FAVORITE_LAST:
          return (a.isFavorited ? 1 : 0) - (b.isFavorited ? 1 : 0);
        default:
          return 0;
      }
    });

    setNotesToShow(notes);
  };

  useEffect(() => {
    sortNotes(notesToShow);
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
      <MasonryList
        className="self-stretch px-3"
        data={notesToShow}
        onRefresh={() => {
          setSearch('');
          setSortType(SortType.DATE_DESCENDING);
          sortNotes(notesToShow, SortType.DATE_DESCENDING);
          Keyboard.dismiss();
        }}
        numColumns={layoutMode === 1 ? 1 : 2}
        key={layoutMode === 1 ? 'layout1' : 'layout2'}
        renderItem={({item}) => (
          <View className="px-2">
            <NoteCard
              note={item}
              isEditMode={isEditMode}
              allSelected={allSelected}
              searchValue={search}
              onPress={() => {
                if (!isEditMode) {
                  handleNoteCardPress((item as Note).id!);
                  return false;
                } else {
                  if (!(item as Note).id) {
                    return false;
                  }
                  if (idsToDelete.includes((item as Note).id)) {
                    setIdsToDelete(
                      idsToDelete.filter(id => id !== (item as Note).id),
                    );
                    return false;
                  } else {
                    setIdsToDelete([...idsToDelete, (item as Note).id]);
                    return true;
                  }
                }
              }}
              onLongPress={(id: number) => {
                setIsEditMode(true);
                setIdsToDelete(prev => [...prev, id]);
              }}
            />
          </View>
        )}
        keyExtractor={item => String(item.id)}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoResults />}
        ListHeaderComponent={
          <View className="px-5 mt-20">
            {isEditMode && (
              <View className="flex flex-row items-center justify-center mt-5">
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
        }
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
              <SortOption
                title={'Favorite'}
                sortType={sortType}
                sortTypeASC={SortType.FAVORITE_FIRST}
                sortTypeDESC={SortType.FAVORITE_LAST}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View className="absolute bottom px-5 py-5 bg-opacity-100 bg-white">
        <View className="flex flex-row justify-center items-center">
          <TouchableOpacity
            className="flex flex-row items-center rounded-full px-3 h-12 bg-primary-200 border border-primary-250 ml-4"
            onPress={() => {
              setSortModalVisible(!sortModalVisible);
            }}>
            <Image source={icons.sort} className="size-5" />
          </TouchableOpacity>
          <View className="flex flex-row items-center justify-between w-2/3 px-4 rounded-full bg-primary-200 border border-primary-250 ml-2">
            <View className="flex-1 flex flex-row items-center justify-start z-50">
              <Image source={icons.search} className="size-5" />
              <TextInput
                selectionColor={'#7AADFF'}
                placeholderTextColor={'gray'}
                placeholder="Search for notes"
                value={search}
                onChangeText={(value: string) => {
                  setSearch(value);
                }}
                className="text-sm font-rubik text-black-300 ml-2 flex-1 mt-1 h-12"
              />
            </View>
            {/* TO DO buraya profil avatarı eklenebilir */}
          </View>

          {/* TO DO ERROR çok item olunca tek elemanlı satırda bug oluşutyor*/}
          <TouchableOpacity
            className="flex flex-row items-center rounded-full px-3 h-12 bg-primary-200 border border-primary-250 ml-2"
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

      {!isEditMode && (
        <View className="absolute bottom-20 right-5">
          <TouchableOpacity
            className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-zinc-400"
            onPress={handleCreateNote}>
            <Text className="text-3xl text-white">+</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditMode && (
        <View className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-primary-200 rounded-full">
          <View className="w-36 bg-white rounded-full border border-primary-100 p-3">
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
