import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys can be used for cleaning the code
// const USER_KEY = 'user';

export const login = async (credentials: LoginRequestPayload) => {
  const response = await apiClient.post('/auth/login', credentials);
  const user = response.data.user as User;
  const accessToken = response.data.accessToken;

  await AsyncStorage.setItem('accessToken', accessToken);
  // await AsyncStorage.setItem('refreshToken', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));

  return response;
};

export const guestLogin = async (username: string, password: string) => {
  // If there is an user return it otherwise create a new one
  // Password have to be hashed before the save
  let localUsersJson = await AsyncStorage.getItem('users');

  let user: GuestUser | null = null;

  let newUserId = 0;

  let newLocalUsers: GuestUser[] = [];

  if (localUsersJson) {
    const localUsers = JSON.parse(localUsersJson);
    if (localUsers && localUsers.length > 0) {
      const existingUser = localUsers.find(
        (user: GuestUser) =>
          user.username === username && user.password === password,
        // TO DO burada hep yeni kullanıcı oluşturuyor ama böyle olmaması lazım
      );

      if (existingUser) {
        user = existingUser;
      } else {
        const minUserId = localUsers.reduce((a: GuestUser, b: GuestUser) =>
          a.id! < b.id! ? a : b,
        );

        newUserId = minUserId ? minUserId.id! - 1 : 0;
        user = {id: newUserId, username: username, password: password};

        localUsers.push(user!);
        await AsyncStorage.setItem('users', JSON.stringify(localUsers));
      }
    }
  } else {
    user = {id: newUserId, username: username, password: password};
    newLocalUsers.push(user!);
    await AsyncStorage.setItem('users', JSON.stringify(newLocalUsers));
  }

  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const register = async (userData: RegisterRequestPayload) => {
  const response = await apiClient.post('/auth/register', userData);
  const user = response.data.user as User;
  const accessToken = response.data.accessToken;

  await AsyncStorage.setItem('accessToken', accessToken);
  // await AsyncStorage.setItem('refreshToken', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));

  return response;
};

export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  // await AsyncStorage.removeItem('refershToken');
  await AsyncStorage.removeItem('user');
};
