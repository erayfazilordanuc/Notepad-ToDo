import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://localhost:8080/api'; // When I use localhost this error appears; "Axios Error: Network Error"
const API_BASE_URL = 'http://192.168.111.54:8080/api';
// const API_BASE_URL = 'http://172.20.10.4:8080/api';
// const API_BASE_URL = process.env.API_URL || 'https://your-backend.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getApiBaseUrl = async () => {
  return API_BASE_URL;
};

const noAuthRequired = ['/auth/login', '/auth/register', '/auth/guest'];

apiClient.interceptors.request.use(async config => {
  if (!noAuthRequired.some(url => config.url?.includes(url))) {
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
  }

  return config;
});

export default apiClient;
export {getApiBaseUrl};

// Changeable Api Base Url

// import {getApiBaseUrl, updateApiBaseUrl} from '../../api/apiClient';
// const [currentApiBaseUrl, setCurrentApiBaseUrl] = useState('');

//   const [ipEditEnabled, setIpEditEnabled] = useState(false);

//   const [apiBaseUrlInputValue, setApiBaseUrlInputValue] =
//     useState(currentApiBaseUrl);

//   const inputRef = useRef<TextInput     placeholderTextColor={'gray'}t selectionColor={'#7AADFF'}>(null);

//   const handleEditPress = async () => {
//     setIpEditEnabled(true);
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 100);
//   };

//   const handleSavePress = async () => {
//     Alert.alert(
//       'Are you sure to save?',
//       'This change may lead to runtime issues due to potential loss of connectivity with the backend (api)',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Yes',
//           onPress: async () => {
//             await updateApiBaseUrl(apiBaseUrlInputValue);
//             setIpEditEnabled(false);
//           },
//         },
//       ],
//     );
//   };

//   const handleCancelPress = async () => {
//     setIpEditEnabled(false);
//     setApiBaseUrlInputValue(currentApiBaseUrl);
//   };

// useEffect(() => {
//     const fetchApiUrl = async () => {
//       const url = await getApiBaseUrl(); // Asenkron veriyi al
//       setCurrentApiBaseUrl(url); // State'e kaydet
//     };

//     fetchApiUrl();
//   }, []);

//   useEffect(() => {
//     setApiBaseUrlInputValue(currentApiBaseUrl);
//   }, [currentApiBaseUrl]);

//   useEffect(() => {
//     console.log(currentApiBaseUrl);
//   }, []);

// <View className="mb-4 pb-4 border-b border-primary-200">
//           <Text className="text-lg font-rubik-bold">
//             IPv4 Adress:{'  '}
//             <Text selectable className="text-md font-rubik">
//               {String(currentApiBaseUrl.match(/\d+\.\d+\.\d+\.\d+/))}
//             </Text>
//           </Text>
//         </View>

//         <View className="pb-2 border-b border-primary-200">
//           <Text className="text-lg font-rubik-bold">Api Base URL:</Text>
//           <View className="flex flex-row justify-between items-center">
//             <TextInput     placeholderTextColor={'gray'}t selectionColor={'#7AADFF'}
//               ref={inputRef}
//               editable={ipEditEnabled}
//               className="text-lg font-rubik flex-shrink"
//               value={apiBaseUrlInputValue}
//               onChangeText={(value: string) => {
//                 setApiBaseUrlInputValue(value);
//               }}
//               multiline
//               scrollEnabled={false}
//             />
//             <View className="flex flex-col items-center justify-center">
//               {!ipEditEnabled ? (
//                 <TouchableOpacity onPress={handleEditPress}>
//                   <Image source={icons.pencil} className="size-6" />
//                   {/* {ipEditEnabled && <Text>Save</Text>} */}
//                 </TouchableOpacity>
//               ) : (
//                 <View className="flex flex-row justify-between items-center">
//                   <TouchableOpacity
//                     onPress={handleCancelPress}
//                     className="mr-2">
//                     <Image source={icons.cross} className="size-4" />
//                     {/* {ipEditEnabled && <Text>Save</Text>} */}
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={handleSavePress} className="ml-2">
//                     <Image source={icons.todo} className="size-7" />
//                     {/* {ipEditEnabled && <Text>Save</Text>} */}
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>

// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const DEFAULT_API_BASE_URL = 'http://192.168.111.54:8080/api';

// let apiClient = axios.create({
//   baseURL: DEFAULT_API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const getApiBaseUrl = async () => {
//   const storedUrl = await AsyncStorage.getItem('apiBaseUrl');
//   return storedUrl || DEFAULT_API_BASE_URL;
// };

// const updateApiBaseUrl = async (newUrl: string) => {
//   await AsyncStorage.setItem('apiBaseUrl', newUrl);
//   apiClient = axios.create({
//     // Yeni instance oluştur
//     baseURL: newUrl,
//     timeout: 10000,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// };

// const noAuthRequired = ['/auth/login', '/auth/register', '/auth/guest'];

// apiClient.interceptors.request.use(async config => {
//   if (!noAuthRequired.some(url => config.url?.includes(url))) {
//     const accessToken = await AsyncStorage.getItem('accessToken');
//     if (accessToken) {
//       config.headers.Authorization = accessToken;
//     }
//   }
//   return config;
// });

// export default apiClient;
// export {updateApiBaseUrl, getApiBaseUrl};

// // Provider Usage
// // import React, { createContext, useState, useEffect } from 'react';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const ApiContext = createContext({ apiClient: axios.create(), updateApiBaseUrl: (url: string) => {} });

// // export const ApiProvider = ({ children }) => {
// //   const [apiBaseUrl, setApiBaseUrl] = useState('http://192.168.111.54:8080/api');

// //   useEffect(() => {
// //     const loadBaseUrl = async () => {
// //       const storedUrl = await AsyncStorage.getItem('apiBaseUrl');
// //       if (storedUrl) {
// //         setApiBaseUrl(storedUrl);
// //       }
// //     };
// //     loadBaseUrl();
// //   }, []);

// //   const updateApiBaseUrl = async (newUrl: string) => {
// //     await AsyncStorage.setItem('apiBaseUrl', newUrl);
// //     setApiBaseUrl(newUrl);
// //   };

// //   const apiClient = axios.create({
// //     baseURL: apiBaseUrl,
// //     timeout: 10000,
// //     headers: { 'Content-Type': 'application/json' },
// //   });

// //   return (
// //     <ApiContext.Provider value={{ apiClient, updateApiBaseUrl }}>
// //       {children}
// //     </ApiContext.Provider>
// //   );
// // };

// // export { ApiContext };
