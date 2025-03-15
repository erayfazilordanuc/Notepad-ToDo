import {useNetInfo} from '@react-native-community/netinfo';
import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const netInfo = useNetInfo();

// TO DO burada fonksiyonları offline ve online olarak değiştir ve çağrılma işlemlerini ana component halletsin
// yani netInfo ile baksın offline ya da online olma durumuna göre fonksiyonları çağırsın

// TO DO buraya error handler lazım

export const createToDo = async (
  userOnline: boolean,
  todoPayload?: ToDoRequestPayload,
): Promise<ToDo | null> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  const newToDoPayload: ToDoRequestPayload = {
    title: todoPayload?.title || '',
    content: todoPayload?.content || '',
    authorId: user.id,
    isDone: todoPayload!.isDone,
    isFavorited: false,
  };

  let todo;

  const jsonToDos = await AsyncStorage.getItem('todos');
  let todos: ToDo[];
  if (jsonToDos) {
    todos = jsonToDos ? JSON.parse(jsonToDos) : null;
  } else {
    todos = [];
  }

  // If user.id is bigger than 0 it is normal user otherwise it is local guest user
  if (userOnline && user.id! > 0) {
    const response = await apiClient.post(`/todo`, newToDoPayload);

    todo = response.data;
  } else {
    const maxToDoId =
      todos.length > 0
        ? todos.reduce((maxToDo, todo) =>
            todo.id! > maxToDo.id! ? todo : maxToDo,
          )
        : null;

    todo = {
      // TO DO bu idnin, online olunduğunda sunucuda veritabanında belirlenmesi lazım
      id: maxToDoId ? maxToDoId.id! + 1 : 0,
      title: newToDoPayload.title,
      content: newToDoPayload.content,
      authorId: newToDoPayload.authorId,
      isFavorited: newToDoPayload.isFavorited,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  todos.push(todo);

  await AsyncStorage.setItem('todos', JSON.stringify(todos));

  return todo;
};

export const getToDosByAuthorId = async (
  id: number,
  userOnline: boolean,
): Promise<ToDo[]> => {
  // Burada önce localdeki notlar ile sunucudakileri eşlesin
  // Created at değeri localdeki değer olsun
  let todos = [];

  if (userOnline && id > 0) {
    const response = await apiClient.get(`/todo/author/${id}`);
    todos = response.data;
    await AsyncStorage.setItem('todos', JSON.stringify(todos));
  } else {
    const jsonToDos = await AsyncStorage.getItem('todos');
    if (jsonToDos) {
      todos = JSON.parse(jsonToDos);
    }

    todos = todos.filter((todo: ToDo) => todo.authorId === id);

    todos = [...todos].sort((a: ToDo, b: ToDo) => {
      return (
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
    });
  }

  return todos;
};

export const getToDo = async (
  id: number,
  userOnline: boolean,
): Promise<ToDo | null> => {
  let todo;

  if (userOnline && id > 0) {
    const response = await apiClient.get(`/todo/${id}`);
    todo = response.data;
  } else {
    const jsonToDos = await AsyncStorage.getItem('todos');
    const todos: ToDo[] = jsonToDos ? JSON.parse(jsonToDos) : null;

    todo = todos.find(n => n.id === id);
  }

  return todo;
};

export const updateToDo = async (
  todoId: number,
  todoPayload: ToDoRequestPayload,
  userOnline: boolean,
): Promise<ToDo | null> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  todoPayload = {
    title: todoPayload!.title,
    content: todoPayload!.content,
    authorId: user.id,
    isDone: todoPayload!.isDone,
    isFavorited: todoPayload.isFavorited,
  };

  const jsonToDos = await AsyncStorage.getItem('todos');
  let todos: ToDo[] = jsonToDos ? JSON.parse(jsonToDos) : [];

  const todoToUpdate = todos.find(n => n.id === todoId) || null;

  let updatedToDo: ToDo;

  if (userOnline && user.id! > 0) {
    const response = await apiClient.post(`/todo/${todoId}`, todoPayload);
    updatedToDo = response.data;
  } else {
    updatedToDo = {
      id: todoId,
      title: todoPayload.title,
      content: todoPayload.content,
      authorId: todoPayload.authorId,
      isDone: todoPayload!.isDone,
      isFavorited: todoPayload.isFavorited,
      createdAt: todoToUpdate!.createdAt,
      updatedAt: new Date(),
    };
  }

  todos = todos.map(todo => (todo.id === todoId ? updatedToDo : todo));

  await AsyncStorage.setItem('todos', JSON.stringify(todos));

  return updatedToDo;
};

export const updateToDos = async (todos: ToDo[]) => {
  await AsyncStorage.setItem('todos', JSON.stringify(todos));
};

export const deleteToDoById = async (
  id: number,
  userOnline: boolean,
): Promise<void> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  if (userOnline && user.id! > 0) {
    await apiClient.delete(`/todo/${id}`);
  }

  const jsonToDos = await AsyncStorage.getItem('todos');
  let todos: ToDo[] = jsonToDos ? JSON.parse(jsonToDos) : [];

  todos = todos.filter(todo => todo.id !== id);

  await AsyncStorage.setItem('todos', JSON.stringify(todos));
};

export const deleteToDosByIds = async (
  ids: number[],
  userOnline: boolean,
): Promise<void> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  if (userOnline && user.id! > 0) {
    await apiClient.delete(`/todo`, {data: ids});
  }

  const jsonToDos = await AsyncStorage.getItem('todos');
  let todos: ToDo[] = jsonToDos ? JSON.parse(jsonToDos) : [];

  todos = todos.filter(todo => !ids.includes(todo!.id!));

  await AsyncStorage.setItem('todos', JSON.stringify(todos));
};
