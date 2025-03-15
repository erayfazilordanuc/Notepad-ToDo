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
  ToastAndroid,
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
import SortOption from '../../components/SortOption';
import MasonryList from '@react-native-seoul/masonry-list';
import {useTheme} from '../../themes/ThemeProvider';
import {themes} from '../../themes/themes';
import {BackHandler} from 'react-native';
import CustomAlert from '../../components/CustomAlert';

function Notes() {
  const navigation = useNavigation<NotesScreenNavigationProp>();

  const appNavigation = useNavigation<AppScreenNavigationProp>();

  const {theme, colors, setTheme} = useTheme();

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

  const [isAlertVisible, setIsAlertVisible] = useState(false);

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
    const areAllSelected = idsToDelete.length === allNotes.length;
    if (areAllSelected) setAllSelected(true);
    if (idsToDelete.length === 0) setAllSelected(false);
  }, [idsToDelete]);

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

  const handleDeleteNotes = async () => {
    if (idsToDelete.length > 0) {
      deleteNotesByIds(idsToDelete, userOnline), setIsEditMode(false);
      setIdsToDelete([]);
      setAllSelected(false);
      setIsAlertVisible(false);
      setTimeout(() => {
        fetchNotes();
      }, 500);
    } else {
      ToastAndroid.show(
        'There is no notes selected to delete',
        ToastAndroid.SHORT,
      );
      setIsAlertVisible(false);
    }
  };
  // const memoizedSearchBar = useMemo(() => {
  //   return <SearchBar search={search} setSearch={setSearch} />;
  // }, [search]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (isEditMode) {
          setIsEditMode(false);
          setIdsToDelete([]);
          return true;
        }
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove(); // Ekrandan çıkınca event listener'ı kaldır
    }, [isEditMode]),
  );

  return (
    <SafeAreaView
      className="h-full"
      style={{backgroundColor: colors.background.secondary}}>
      <View
        className="pl-3 pr-4 pt-5"
        style={{backgroundColor: colors.background.secondary}}>
        <View className="flex flex-row justify-center items-center mb-3">
          <TouchableOpacity
            className="flex flex-row items-center rounded-full px-3 h-12 w-12 border border-primary-250 ml-2"
            style={{backgroundColor: colors.background.primary}}
            onPress={() => {
              setSortModalVisible(!sortModalVisible);
            }}>
            <Image
              source={icons.sort}
              className="size-5"
              tintColor={colors.text.primary}
            />
          </TouchableOpacity>
          <View
            className="flex flex-row items-center justify-between w-2/3 px-4 rounded-full  border border-primary-250 ml-2"
            style={{backgroundColor: colors.background.primary}}>
            <View className="flex-1 flex flex-row items-center justify-start z-50">
              <Image
                source={icons.search}
                className="size-5"
                tintColor={colors.text.primary}
              />
              <TextInput
                selectionColor={'#7AADFF'}
                placeholderTextColor={'gray'}
                placeholder="Search for notes"
                value={search}
                onChangeText={(value: string) => {
                  setSearch(value);
                }}
                style={{color: colors.text.primary}}
                className="text-sm font-rubik ml-2 flex-1 mt-1 h-12"
              />
            </View>
            {/* TO DO buraya profil avatarı eklenebilir */}
          </View>

          {/* TO DO ERROR çok item olunca tek elemanlı satırda bug oluşutyor*/}
          <TouchableOpacity
            className="flex flex-row items-center rounded-full px-3 h-12 border border-primary-250 ml-2"
            style={{backgroundColor: colors.background.primary}}
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
              tintColor={colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <MasonryList
        className="self-stretch px-2"
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
        ListEmptyComponent={<NoResults isNote={true} />}
        ListHeaderComponent={
          <View className="px-5 mb-2">
            {isEditMode && (
              <View className="flex flex-row items-center justify-center">
                <TouchableOpacity
                  className="py-2 pb-3 shadow-md shadow-zinc-350 rounded-full w-1/3"
                  style={{backgroundColor: colors.background.primary}}
                  onPress={handleSelectAll}>
                  <Text
                    className="text-center text-base font-rubik-bold mt-1"
                    style={{
                      color:
                        theme.name === 'Primary Light'
                          ? colors.primary[300]
                          : colors.primary[250],
                    }}>
                    {allSelected ? 'Deselect All' : 'Select All'}
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
          <View className="flex-1 justify-start items-start p-5 mt-2 ml-2">
            <View
              className="z-50 rounded-2xl pb-1 justify-center items-center border-2"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.background.secondary,
              }}>
              <Text
                className="text-lg text-gray-700 mt-3 pb-2 px-8 border-b mb-1"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.text.secondary,
                  borderColor:
                    theme.name === 'Primary Light'
                      ? colors.primary[300]
                      : colors.primary[250],
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Sort by
              </Text>

              <SortOption
                title={'Date'}
                color={
                  theme.name === 'Primary Light'
                    ? colors.primary[300]
                    : colors.primary[250]
                }
                sortType={sortType}
                sortTypeASC={SortType.DATE_ASCENDING}
                sortTypeDESC={SortType.DATE_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Alphabetic'}
                color={
                  theme.name === 'Primary Light'
                    ? colors.primary[300]
                    : colors.primary[250]
                }
                sortType={sortType}
                sortTypeASC={SortType.ALPHABETICAL_ASCENDING}
                sortTypeDESC={SortType.ALPHABETICAL_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Length'}
                color={
                  theme.name === 'Primary Light'
                    ? colors.primary[300]
                    : colors.primary[250]
                }
                sortType={sortType}
                sortTypeASC={SortType.LENGTH_ASCENDING}
                sortTypeDESC={SortType.LENGTH_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Favorite'}
                color={
                  theme.name === 'Primary Light'
                    ? colors.primary[300]
                    : colors.primary[250]
                }
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

      {!isEditMode && (
        <View className="absolute bottom-28 right-5">
          <TouchableOpacity
            className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center" // shadow-lg shadow-zinc-400"
            onPress={handleCreateNote}>
            <Text
              className="font-rubik-light text-4xl "
              style={{color: colors.background.secondary}}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditMode && (
        <View
          className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 rounded-3xl border-2 p-3"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.background.secondary,
          }}>
          <CustomAlert
            message={'Are you sure to delete?'}
            visible={isAlertVisible}
            onYes={handleDeleteNotes}
            onCancel={() => {
              setIsAlertVisible(false);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setIsAlertVisible(true);
            }}>
            {/* Image can be used instead of text 'Delete' */}
            <Text className="text-lg font-rubik p-2 text-center text-danger pb-2">
              Delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsEditMode(false);
              setAllSelected(false);
              setIdsToDelete(() => []);
            }}
            className="pt-2">
            <Text
              className="text-lg font-rubik p-2 text-center"
              style={{color: colors.text.primary}}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Notes;
