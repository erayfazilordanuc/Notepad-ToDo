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
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Button} from '@react-navigation/elements';
import {getUser} from '../../api/userService';
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
// import ToDo from './ToDo';
import icons from '../../constants/icons';
import {
  deleteToDosByIds,
  getToDosByAuthorId,
  updateToDos,
} from '../../api/todoService';
import NoResults from '../../components/NoResults';
import {useNetInfo} from '@react-native-community/netinfo';
import {addEventListener} from '@react-native-community/netinfo';
// import SortOption from './components/SortOption';
import MasonryList from '@react-native-seoul/masonry-list';
import {useTheme} from '../../themes/ThemeProvider';
import {themes} from '../../themes/themes';
import {BackHandler} from 'react-native';
import SortOption from '../../components/SortOption';
import ToDoCard from './components/ToDoCard';
import CustomAlert from '../../components/CustomAlert';

function ToDos() {
  const navigation = useNavigation<ToDosScreenNavigationProp>();

  const appNavigation = useNavigation<AppScreenNavigationProp>();

  const {theme, colors, setTheme} = useTheme();

  const [user, setUser] = useState<User | null>(null);

  const [userOnline, setUserOnline] = useState(false);

  const [allToDos, setAllToDos] = useState<ToDo[]>([]);

  const [todosToShow, setToDosToShow] = useState<ToDo[]>([]);

  const [compeletedToDos, setCompeletedToDos] = useState<ToDo[]>([]);

  const [showCompeletedToDos, setShowCompeletedToDos] = useState(false);

  const [search, setSearch] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);

  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

  const [allSelected, setAllSelected] = useState(false);

  const [sortModalVisible, setSortModalVisible] = useState(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [isCompeletedAlertVisible, setIsCompeletedAlertVisible] =
    useState(false);

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
  }, [todosToShow]);

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

      // Info: it isn't possible to use fetchUser and fetchToDos together because of the async user object
      // Also fetchUser cant return user to use in useEffect because async operations are not allowed in useEffect

      const todosData = await getToDosByAuthorId(user!.id!, userOnline);
      setAllToDos(todosData!);
      setToDosToShow(todosData!);
    };

    initialFetch();
  }, []);

  const fetchToDos = async () => {
    if (todosToShow) {
      const todos = await getToDosByAuthorId(user!.id!, userOnline);

      const sortedToDos = [...todos].sort((a: ToDo, b: ToDo) => a.id - b.id);
      const sortedAllToDos = [...allToDos].sort(
        (a: ToDo, b: ToDo) => a.id - b.id,
      );

      if (JSON.stringify(sortedToDos) === JSON.stringify(sortedAllToDos)) {
        return;
      }

      const filteredTodos = todos.filter(todo => todo.id);
      setAllToDos(filteredTodos!);

      await updateToDos(filteredTodos);

      const compeletedToDos = filteredTodos.filter(todo => todo.isDone);
      setCompeletedToDos(compeletedToDos);

      const activeTodos = filteredTodos.filter(todo => !todo.isDone);
      setToDosToShow(activeTodos!);

      setSortType(SortType.DATE_DESCENDING);

      // bunun amacı bir note compeleted olunca listeyi açmak
      // fakat sayfa her render olduğunda burası tekrar açılacağından bu kısımda kullanılamaz
      // setShowCompeletedToDos(true);
    }
  };

  useFocusEffect(() => {
    // useCallback has caused some asynchronous issues
    fetchToDos();
  });

  useEffect(() => {
    if (search && search.length > 0) {
      let searchedValue = search.trim().toLocaleLowerCase();
      let searchedParams = searchedValue.split(' ');
      searchedParams = searchedParams.filter(
        param => param.length > 0 && param !== ' ',
      );
      const filteredToDos = allToDos.filter(
        note =>
          note.title.toLowerCase().includes(searchedValue) ||
          note.content.toLowerCase().includes(searchedValue),
      );

      setToDosToShow(filteredToDos);
    } else {
      setToDosToShow(allToDos);
    }
  }, [search]);

  const sortToDos = (
    todos: ToDo[],
    onCallback: (todos: ToDo[]) => void,
    sortTypeParam?: SortType,
  ) => {
    todos.sort((a: ToDo, b: ToDo) => {
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

    onCallback(todos);
  };

  useEffect(() => {
    const areAllSelected = idsToDelete.length === allToDos.length;
    if (areAllSelected) setAllSelected(true);
    if (idsToDelete.length === 0) setAllSelected(false);
  }, [idsToDelete]);

  useEffect(() => {
    sortToDos(todosToShow, setToDosToShow);
    sortToDos(compeletedToDos, setCompeletedToDos);
  }, [sortType]);

  const handleSelectAll = () => {
    if (!allSelected) {
      setIdsToDelete(allToDos.map(note => note.id!));
    } else {
      setIdsToDelete([]);
    }

    setAllSelected(!allSelected);
  };

  const handleToDoPress = (id: number) => {
    navigation.navigate('ToDo', {todoId: id});
  };

  const handleCreateToDo = async () => {
    navigation.navigate('ToDo', {todoId: null});
  };

  const handleDeleteToDos = async () => {
    if (idsToDelete.length > 0) {
      deleteToDosByIds(idsToDelete, userOnline), setIsEditMode(false);
      setIdsToDelete([]);
      setAllSelected(false);
      setIsAlertVisible(false);
      setTimeout(() => {
        fetchToDos();
      }, 500);
    } else {
      ToastAndroid.show(
        'There is no to dos selected to delete',
        ToastAndroid.SHORT,
      );
      setIsAlertVisible(false);
    }
  };

  const handleDeleteCompeletedToDos = async () => {
    const compeletedIdsToDelete = compeletedToDos.map(todo => todo.id!);
    if (compeletedIdsToDelete.length > 0) {
      deleteToDosByIds(compeletedIdsToDelete, userOnline), setIsEditMode(false);
      setIdsToDelete([]);
      setShowCompeletedToDos(false);
      setIsCompeletedAlertVisible(false);
      setTimeout(() => {
        fetchToDos();
      }, 500);
    }
  };

  // const memoizedSearchBar = useMemo(() => {
  //   return <SearchBar search={search} setSearch={setSearch} />;
  // }, [search]);

  return (
    <SafeAreaView
      className="h-full"
      style={{backgroundColor: colors.background.secondary}}>
      <View
        className="pl-3 pr-4 pt-5"
        style={{backgroundColor: colors.background.secondary}}>
        <View className="flex flex-row justify-center items-center mb-3">
          <TouchableOpacity
            className="flex flex-row items-center rounded-full px-3 h-12 w-12 border border-emerald-500 ml-2"
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
            className="flex flex-row items-center justify-between w-2/3 px-4 rounded-full  border border-emerald-500 ml-2"
            style={{backgroundColor: colors.background.primary}}>
            <View className="flex-1 flex flex-row items-center justify-start z-50">
              <Image
                source={icons.search}
                className="size-5"
                tintColor={colors.text.primary}
              />
              <TextInput
                selectionColor={'#64cc95'}
                placeholderTextColor={'gray'}
                placeholder="Search for todo's"
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
        </View>
      </View>

      {isEditMode && (
        <View className="flex flex-row items-center justify-center mb-1">
          <TouchableOpacity
            className="py-2 pb-3 shadow-md shadow-zinc-350 rounded-full w-1/4"
            style={{backgroundColor: colors.background.primary}}
            onPress={handleSelectAll}>
            <Text
              className="text-center text-base font-rubik-bold mt-1"
              style={{
                color: '#10b981',
              }}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/** No result component */}

      <ScrollView className="px-4 mb-20 mt-2">
        {(todosToShow.length === 0 || compeletedToDos.length === 0) && (
          <NoResults isNote={false} />
        )}
        {todosToShow.map((item, index) => (
          <ToDoCard
            key={item.id}
            todo={item}
            isEditMode={isEditMode}
            allSelected={allSelected}
            searchValue={search}
            refresh={() => {
              fetchToDos();
              setShowCompeletedToDos(true);
            }}
            onPress={() => {
              if (!isEditMode) {
                handleToDoPress((item as ToDo).id!);
                return false;
              } else {
                if (!(item as ToDo).id) {
                  return false;
                }
                if (idsToDelete.includes((item as ToDo).id)) {
                  setIdsToDelete(
                    idsToDelete.filter(id => id !== (item as ToDo).id),
                  );
                  return false;
                } else {
                  setIdsToDelete([...idsToDelete, (item as ToDo).id]);
                  return true;
                }
              }
            }}
            onLongPress={(id: number) => {
              setIsEditMode(true);
              setIdsToDelete(prev => [...prev, id]);
            }}
          />
        ))}
        {compeletedToDos.length > 0 && (
          <View className="flex flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => {
                setShowCompeletedToDos(!showCompeletedToDos);
              }}
              className="w-5/6">
              <View
                className="flex flex-row justify-start items-center p-3 rounded-2xl"
                style={{
                  backgroundColor: colors.background.primary,
                }}>
                <Image
                  source={showCompeletedToDos ? icons.arrowDown : icons.arrow}
                  className="size-6"
                  tintColor={colors.text.todo}
                />
                <Text
                  className="ml-2 font-rubik-medium text-lg"
                  style={{color: colors.text.secondary}}>
                  Comepeleted
                </Text>
              </View>
            </TouchableOpacity>
            <CustomAlert
              message={'Are you sure to clean dones?'}
              visible={isCompeletedAlertVisible}
              onYes={handleDeleteCompeletedToDos}
              onCancel={() => {
                setIsCompeletedAlertVisible(false);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsCompeletedAlertVisible(true);
              }}>
              <View
                className="flex flex-row justify-start items-center p-3 rounded-2xl"
                style={{
                  backgroundColor: colors.background.primary,
                }}>
                <Image
                  source={icons.trash}
                  tintColor={'#F75555'}
                  className="size-6"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {showCompeletedToDos &&
          compeletedToDos.map((item, index) => (
            <ToDoCard
              key={item.id}
              todo={item}
              isEditMode={isEditMode}
              allSelected={allSelected}
              searchValue={search}
              refresh={() => {
                fetchToDos();
                setShowCompeletedToDos(true);
              }}
              onPress={() => {
                if (!isEditMode) {
                  handleToDoPress((item as ToDo).id!);
                  return false;
                } else {
                  if (!(item as ToDo).id) {
                    return false;
                  }
                  if (idsToDelete.includes((item as ToDo).id)) {
                    setIdsToDelete(
                      idsToDelete.filter(id => id !== (item as ToDo).id),
                    );
                    return false;
                  } else {
                    setIdsToDelete([...idsToDelete, (item as ToDo).id]);
                    return true;
                  }
                }
              }}
              onLongPress={(id: number) => {
                setIsEditMode(true);
                setIdsToDelete(prev => [...prev, id]);
              }}
            />
          ))}
      </ScrollView>

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
                borderColor: colors.background.third,
              }}>
              <Text
                className="text-lg text-gray-700 mt-3 pb-2 px-8 border-b mb-1"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.text.secondary,
                  borderColor: colors.text.todoV2,
                  width: '50%',
                  alignSelf: 'center',
                }}>
                Sort by
              </Text>

              <SortOption
                title={'Date'}
                color={'#10b981'}
                sortType={sortType}
                sortTypeASC={SortType.DATE_ASCENDING}
                sortTypeDESC={SortType.DATE_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Alphabetic'}
                color={'#10b981'}
                sortType={sortType}
                sortTypeASC={SortType.ALPHABETICAL_ASCENDING}
                sortTypeDESC={SortType.ALPHABETICAL_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Length'}
                color={'#10b981'}
                sortType={sortType}
                sortTypeASC={SortType.LENGTH_ASCENDING}
                sortTypeDESC={SortType.LENGTH_DESCENDING}
                setSortType={setSortType}
                setSortModalVisible={setSortModalVisible}
              />
              <SortOption
                title={'Favorite'}
                color={'#10b981'}
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
            className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center" // shadow-lg shadow-zinc-400"
            onPress={handleCreateToDo}>
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
            borderColor: colors.background.third,
          }}>
          <CustomAlert
            message={'Are you sure to delete?'}
            visible={isAlertVisible}
            onYes={handleDeleteToDos}
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

export default ToDos;

// () => {
//   Alert.alert('Are you sure to delete?', '', [
//     {
//       text: 'Cancel',
//       style: 'cancel',
//     },
//     {
//       text: 'Yes',
//       onPress: async () => {
//         deleteToDosByIds(idsToDelete, userOnline),
//           setIsEditMode(false);
//         setIdsToDelete([]);
//         setTimeout(() => {
//           fetchToDos();
//         }, 500);
//       },
//     },
//   ]);
// }
