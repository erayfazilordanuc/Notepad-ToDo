import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from 'react-native-elements';
import CustomAvatar from './components/CustomAvatar';
import {useTheme} from '../../themes/ThemeProvider';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const {colors} = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const user: User = JSON.parse(userData!);
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView
      className="flex flex-col h-full pb-32 px-1"
      style={{backgroundColor: colors.background.secondary}}>
      <View className="flex flex-col justify-center px-4 rounded-2xl">
        {/* <View className="flex flex-row items-center border-b border-primary-200 mb-4">
          <Text className="text-2xl font-rubik-medium mb-2">Avatar: </Text>
          <Image
              source={{uri: 'default-image-url'}}
              className="size-12 rounded-full mb-2"
            />
        </View> */}
        <View
          className="flex flex-col justify-center items-center mb-2 p-4 rounded-2xl"
          style={{
            backgroundColor: colors.background.primary,
          }}>
          <Text
            className="text-xl font-rubik-medium mb-1"
            style={{color: colors.text.primary}}>
            Avatar:
          </Text>
          <View className="flex flex-col items-center relative">
            <CustomAvatar username={user?.username} isUsernameShown={false} />
          </View>
        </View>
        <Text
          className="text-xl font-rubik-medium mb-2 p-4 rounded-2xl"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
          }}>
          Id: <Text className="text-xl font-rubik mb-2">{user?.id}</Text>
        </Text>
        <Text
          className="text-xl font-rubik-medium p-4 rounded-2xl"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
          }}>
          Username:{'  '}
          <Text className="text-xl font-rubik mb-2">{user?.username}</Text>
        </Text>
        {user?.email && (
          <Text
            className="text-2xl font-rubik-medium mb-2 border-b border-primary-200 pb-4"
            style={{color: colors.text.primary}}>
            Email: <Text className="text-xl font-rubik mb-2">{user.email}</Text>
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;

// import {View, Text, Image} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import icons from '../../constants/icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Avatar} from 'react-native-elements';
// import CustomAvatar from './components/CustomAvatar';
// import {useTheme} from '../../themes/ThemeProvider';

// const Profile = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const {colors} = useTheme();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userData = await AsyncStorage.getItem('user');
//       const user: User = JSON.parse(userData!);
//       setUser(user);
//     };

//     fetchUser();
//   }, []);

//   return (
//     <SafeAreaView
//       className="flex flex-col h-full pb-32 px-7"
//       style={{backgroundColor: colors.background.secondary}}>
//       <View
//         className="flex flex-col justify-center mt-8 py-2 px-4 rounded-2xl"
//         style={{backgroundColor: colors.background.primary}}>
//         {/* <View className="flex flex-row items-center border-b border-primary-200 mb-4">
//           <Text className="text-2xl font-rubik-medium mb-2">Avatar: </Text>
//           <Image
//               source={{uri: 'default-image-url'}}
//               className="size-12 rounded-full mb-2"
//             />
//         </View> */}
//         <View
//           className="flex flex-col justify-center items-center border-b pb-4 mb-4"
//           style={{borderColor: colors.background.secondary}}>
//           <Text
//             className="text-2xl font-rubik-medium mb-1"
//             style={{color: colors.text.primary}}>
//             Avatar:
//           </Text>
//           <View className="flex flex-col items-center relative">
//             <CustomAvatar username={user?.username} isUsernameShown={false} />
//           </View>
//         </View>
//         <Text
//           className="text-2xl font-rubik-medium mb-4 border-b pb-4"
//           style={{
//             borderColor: colors.background.secondary,
//             color: colors.text.primary,
//           }}>
//           Id: <Text className="text-xl font-rubik mb-2">{user?.id}</Text>
//         </Text>
//         <Text
//           className="text-2xl font-rubik-medium mb-4 border-b pb-4"
//           style={{
//             borderColor: colors.background.secondary,
//             color: colors.text.primary,
//           }}>
//           Username:{'  '}
//           <Text className="text-xl font-rubik mb-2">{user?.username}</Text>
//         </Text>
//         {user?.email && (
//           <Text
//             className="text-2xl font-rubik-medium mb-2 border-b pb-4"
//             style={{
//               borderColor: colors.background.secondary,
//               color: colors.text.primary,
//             }}>
//             Email: <Text className="text-xl font-rubik mb-2">{user.email}</Text>
//           </Text>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Profile;
