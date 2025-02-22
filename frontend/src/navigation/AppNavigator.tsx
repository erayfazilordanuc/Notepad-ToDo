import * as React from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import '../../global.css';
import Launch from '../screens/launch/Launch';
import Login from '../screens/login/Login';
import Notes from '../screens/notes/Notes';
import CustomHeader from '../components/CustomHeader';
import ToDo from '../screens/todo/ToDo';
import Options from '../screens/settings/Settings';
import {BottomNavigator} from './BottomNavigation';
import Settings from '../screens/settings/Settings';
import icons from '../constants/icons';
import Security from '../screens/settings/Security';
import Notifications from '../screens/settings/Notifications';
import Language from '../screens/settings/Language';
import Preferences from '../screens/settings/Preferences';

const RootNativeStack = createNativeStackNavigator<RootStackParamList>();
const AppNativeStack = createNativeStackNavigator<AppStackParamList>(); // This one works
// const Stack = createStackNavigator<RootStackParamList>(); // This one not works

function RootStack() {
  return (
    <RootNativeStack.Navigator initialRouteName="Notes">
      <RootNativeStack.Screen
        name="Notes"
        component={Notes}
        options={{
          header: () => (
            <CustomHeader title={'Notes'} backgroundColor={'blue-500'} />
          ),
        }}
      />
      <RootNativeStack.Screen
        name="ToDo"
        component={ToDo}
        options={{
          // title: 'To Do',
          // headerStyle: {
          //   backgroundColor: '#b6f982',
          // },
          header: () => (
            <CustomHeader title={'To Do'} backgroundColor={'green-500'} />
          ),
        }}
      />
      <RootNativeStack.Screen
        name="Settings"
        component={Settings}
        options={{
          // headerStyle: {
          //   backgroundColor: '#ff6751',
          // },
          header: () => (
            <CustomHeader title={'Settings'} backgroundColor={'red-500'} />
          ),
        }}
      />
    </RootNativeStack.Navigator>
  );
}

function AppStack() {
  return (
    <AppNativeStack.Navigator initialRouteName="Launch">
      <AppNativeStack.Screen
        name="Launch"
        component={Launch}
        options={{
          headerShown: false,
        }}
      />
      <AppNativeStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <AppNativeStack.Screen
        name="App"
        component={BottomNavigator}
        options={{
          headerShown: false,
        }}
      />
    </AppNativeStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
