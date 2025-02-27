import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import icons from '../../constants/icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import '../../../global.css';
import {guestLogin, login, register} from '../../api/authService';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';

function Login() {
  const navigation = useNavigation<RootScreenNavigationProp>();

  const [versatileError, setVersatileError] = useState('');

  const [loading, setLoading] = useState(false);

  enum LoginMethod {
    'default',
    'registration',
    'guest',
  }

  const [loginMethod, setLoginMethod] = useState<LoginMethod>(
    LoginMethod.default,
  );

  const [multipleCredential, setMultipleCredential] = useState('');

  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const netInfo = useNetInfo();

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleGoogleLogin = async () => {};

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMultipleCredential(multipleCredential.trim());

      if (!(multipleCredential && password)) {
        // Alert
        ToastAndroid.show('Please fill in all the fields', ToastAndroid.SHORT);
        return;
      }

      if (
        !usernameRegex.test(multipleCredential) &&
        !emailRegex.test(multipleCredential)
      ) {
        ToastAndroid.show(
          'Please enter username or email in valid format',
          ToastAndroid.SHORT,
        );
        return;
      }

      const isEmailLogin = emailRegex.test(multipleCredential);

      const loginPayload: LoginRequestPayload = {
        username: isEmailLogin ? undefined : multipleCredential,
        email: isEmailLogin ? multipleCredential : undefined,
        password,
      };

      const loginResponse = await login(loginPayload);
      // TO DO burada hata kodlarına göre hata mesajları eklenbilir

      if (loginResponse && loginResponse.status === 200 && loginResponse.data) {
        // Şimdilik
        navigation.navigate('App');
        // TO DO burada App e user bilgileri AsyncStorage üzerinden taşınabilir
      }
    } catch (error) {
      console.error('Error occured while login: ', error);
      ToastAndroid.show(
        error instanceof Error ? error.message : 'An error occurred',
        ToastAndroid.SHORT,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      setEmail(email.trim());
      setUsername(username.trim());

      if (!(username && email && password)) {
        ToastAndroid.show('Please fill in all the fields', ToastAndroid.SHORT);
        return;
      }

      if (!usernameRegex.test(username)) {
        ToastAndroid.show(
          'Please enter username in valid format',
          ToastAndroid.SHORT,
        );
        return;
      }

      if (!emailRegex.test(email)) {
        ToastAndroid.show(
          'Please enter email in valid format',
          ToastAndroid.SHORT,
        );
        return;
      }

      if (password.length < 8) {
        ToastAndroid.show(
          'Please enter password with at least 8 characters',
          ToastAndroid.SHORT,
        );
        return;
      }

      const registerPayload: RegisterRequestPayload = {
        username: username,
        email: email,
        password: password,
      };

      const registerResponse = await register(registerPayload);
      // TO DO burada hata kodlarına göre hata mesajları eklenbilir

      if (
        registerResponse &&
        registerResponse.status === 200 &&
        registerResponse.data
      ) {
        // Şimdilik
        navigation.navigate('App');
        // TO DO burada App e user bilgileri AsyncStorage üzerinden taşınabilir
      }
    } catch (error) {
      console.error('Error occured while login: ', error);

      ToastAndroid.show(
        error instanceof Error ? error.message : 'An error occurred',
        ToastAndroid.SHORT,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      // TO DO guest login için local username password ikilisi alınsın
      if (username) {
        await guestLogin(username, password);
        // TO DO MİSAFİR OLARAK DEVAM ET DENDİĞİNDE İSİM GİRME KISMI OLSUN
        navigation.navigate('App');
      } else {
        ToastAndroid.show('Please fill in all the blanks ', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error occured while login: ', error);
      ToastAndroid.show(
        error instanceof Error ? error.message : 'An error occurred',
        ToastAndroid.SHORT,
      );
    }
  };

  const clearInputs = () => {
    setMultipleCredential('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="pb-12">
        <View
          className={`px-10 mt-${
            loginMethod === LoginMethod.registration ? '' : '12'
          }`}>
          <Text className="text-3xl text-center uppercase font-rubik-bold text-black-300 mt-12 mb-4">
            Welcome to {'\n'}
            <Text className="text-center text-primary-300">
              Notepad - To Do
            </Text>
          </Text>
          <Text
            className={`text-3xl font-rubik-medium text-black-300 text-center ${
              loginMethod === LoginMethod.default ? 'mb-4 mt-6' : 'mb-2 mt-8'
            }`}>
            {loginMethod === LoginMethod.default && 'Login'}
            {loginMethod === LoginMethod.registration && 'Account Creation'}
            {loginMethod === LoginMethod.guest && 'Guest Login'}
          </Text>

          {loginMethod === LoginMethod.default && (
            <View className="flex flex-row items-center justify-start z-50 rounded-full bg-accent-100 border border-blue-200 py-2 bg-primary-100">
              {/* Email pattern check is essential */}
              <TextInput
                placeholderTextColor={'gray'}
                selectionColor={'#7AADFF'}
                value={multipleCredential}
                onChangeText={(value: string) => {
                  setMultipleCredential(value);
                }}
                placeholder="Username or Email"
                className="text-lg font-rubik text-black-300 ml-5 flex-1"
              />
            </View>
          )}
          {(loginMethod === LoginMethod.registration ||
            loginMethod === LoginMethod.guest) && (
            <View className="flex flex-row items-center justify-start z-50 rounded-full bg-accent-100 border border-blue-200 mt-2 py-2 bg-primary-100">
              <TextInput
                placeholderTextColor={'gray'}
                selectionColor={'#7AADFF'}
                value={username}
                onChangeText={(value: string) => {
                  setUsername(value);
                }}
                placeholder="Username"
                className="text-lg font-rubik text-black-300 ml-5 flex-1"
              />
            </View>
          )}
          {loginMethod === LoginMethod.registration && (
            <View>
              <View className="flex flex-row items-center justify-start z-50 rounded-full bg-accent-100 border border-blue-200 py-2 bg-primary-100 mt-2">
                {/* Email pattern check is essential */}
                <TextInput
                  placeholderTextColor={'gray'}
                  selectionColor={'#7AADFF'}
                  value={email}
                  onChangeText={(value: string) => {
                    setEmail(value);
                  }}
                  placeholder="Email"
                  className="text-lg font-rubik text-black-300 ml-5 flex-1"
                />
              </View>
            </View>
          )}
          <View className="flex flex-row items-center justify-start z-50 rounded-full bg-accent-100 border border-blue-200 mt-2 py-2 bg-primary-100">
            <TextInput
              placeholderTextColor={'gray'}
              selectionColor={'#7AADFF'}
              value={password}
              onChangeText={(value: string) => {
                setPassword(value);
              }}
              placeholder="Password"
              className="text-lg font-rubik text-black-300 ml-5 flex-1"
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-5">
              {/* TO DO icon can be changed */}
              <Image
                source={showPassword ? icons.show : icons.hide}
                className="size-7 mr-2"
              />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row justify-center">
            {loginMethod === LoginMethod.default && (
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-white shadow-md shadow-zinc-350 rounded-full w-1/2 py-3 mt-3">
                <Text className="text-xl font-rubik text-black-300 text-center mt-1">
                  Login
                </Text>
              </TouchableOpacity>
            )}
            {loginMethod === LoginMethod.registration && (
              <TouchableOpacity
                onPress={() => {
                  handleCreateAccount();
                }}
                className="bg-white shadow-md shadow-zinc-350 rounded-full w-1/2 py-3 mt-3">
                <Text className="text-xl font-rubik text-black-300 text-center mt-1">
                  Create Account
                </Text>
              </TouchableOpacity>
            )}
            {loginMethod === LoginMethod.guest && (
              <TouchableOpacity
                onPress={() => {
                  handleGuestLogin();
                }}
                className="bg-white shadow-md shadow-zinc-350 rounded-full w-1/2 py-3 mt-3">
                <Text className="text-xl font-rubik text-black-300 text-center mt-1">
                  Login as Guest
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loginMethod !== LoginMethod.default && (
            <Text className="text-lg font-rubik text-black-200 text-center mt-4">
              if you have an account {'\n'}
              <TouchableOpacity
                onPress={() => {
                  clearInputs();
                  setLoginMethod(LoginMethod.default);
                }}>
                <Text className="text-xl font-rubik text-primary-300 text-center">
                  Login
                </Text>
              </TouchableOpacity>
            </Text>
          )}
          {loginMethod !== LoginMethod.registration && (
            <Text className="text-lg font-rubik text-black-200 text-center mt-4">
              if you don't have an account {'\n'}
              <TouchableOpacity
                onPress={() => {
                  clearInputs();
                  setLoginMethod(LoginMethod.registration);
                }}>
                <Text className="text-xl font-rubik text-primary-300 text-center">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Text>
          )}
          <Text className="text-lg font-rubik text-black-200 text-center mt-1">
            or
          </Text>
          <View className="flex flex-row justify-center">
            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="bg-white shadow-md shadow-zinc-350 rounded-full w-5/6 py-4 mt-2">
              <View className="flex flex-row items-center justify-center">
                <Image
                  source={icons.google}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {loginMethod !== LoginMethod.guest && (
            <View>
              <Text className="text-lg font-rubik text-black-200 text-center mt-4">
                also you can
              </Text>
              <TouchableOpacity
                onPress={() => {
                  clearInputs();
                  setLoginMethod(LoginMethod.guest);
                }}>
                <Text className="text-xl font-rubik text-black-300 text-center">
                  Continue As Guest
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default Login;
