import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Notes from '../screens/notes/Notes';
import Options from '../screens/settings/Settings';
import ToDo from '../screens/todo/ToDo';
import React from 'react';
import {Image, ImageSourcePropType, Text, View} from 'react-native';
import icons from '../constants/icons';
import CustomHeader from '../components/CustomHeader';
import Settings from '../screens/settings/Settings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import '../../global.css';
import Security from '../screens/settings/Security';
import Reminders from '../screens/settings/Reminders';
import Language from '../screens/settings/Language';
import Preferences from '../screens/settings/Preferences';
import Profile from '../screens/settings/Profile';
import Note from '../screens/notes/Note';
const Tab = createBottomTabNavigator();

const SettingsNativeStack =
  createNativeStackNavigator<SettingsStackParamList>();

const NotesNativeStack = createNativeStackNavigator<NotesStackParamList>();

function NotesStack() {
  return (
    <NotesNativeStack.Navigator initialRouteName="Notes">
      <NotesNativeStack.Screen
        name="Notes"
        component={Notes}
        options={{
          headerShown: false,
          header: () => (
            <CustomHeader
              title={'Notes'}
              icon={icons.notes}
              className="border-primary-300"
            />
          ),
        }}
      />
      <NotesNativeStack.Screen
        name="Note"
        component={Note}
        options={{
          headerShown: false,
          header: () => (
            <CustomHeader
              title={''}
              icon={icons.notes}
              className="border-primary-300"
              backArrowEnable={true}
            />
          ),
        }}
      />
    </NotesNativeStack.Navigator>
  );
}

function SettingsStack() {
  return (
    <SettingsNativeStack.Navigator initialRouteName="Settings">
      <SettingsNativeStack.Screen
        name="Settings"
        component={Settings}
        options={{
          header: () => (
            <CustomHeader
              title={'Settings'}
              icon={icons.settings}
              className="border-primary-300"
            />
          ),
        }}
      />
      <SettingsNativeStack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: () => (
            <CustomHeader
              title={'Profile'}
              icon={icons.person}
              className="border-primary-300"
              backArrowEnable={true}
            />
          ),
        }}
      />
      <SettingsNativeStack.Screen
        name="Preferences"
        component={Preferences}
        options={{
          header: () => (
            <CustomHeader
              title={'Preferences'}
              icon={icons.preferences}
              className="border-primary-300"
              backArrowEnable={true}
            />
          ),
        }}
      />
      <SettingsNativeStack.Screen
        name="Reminders"
        component={Reminders}
        options={{
          header: () => (
            <CustomHeader
              title={'Reminders'}
              icon={icons.reminder}
              className="border-primary-300"
              backArrowEnable={true}
            />
          ),
        }}
      />
      <SettingsNativeStack.Screen
        name="Security"
        component={Security}
        options={{
          header: () => (
            <CustomHeader
              title={'Security'}
              icon={icons.shield}
              className="border-primary-300"
              backArrowEnable={true}
            />
          ),
        }}
      />
      <SettingsNativeStack.Screen
        name="Language"
        component={Language}
        options={{
          header: () => (
            <CustomHeader
              title={'Language'}
              icon={icons.language}
              className="border-primary-300"
              backArrowEnable={true}
            />
          ),
        }}
      />
    </SettingsNativeStack.Navigator>
  );
}

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? '#0061FF' : '#666876'}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused
          ? 'text-primary-300 font-rubik-medium'
          : 'text-black-200 font-rubik'
      } text-xs w-full text-center mt-1`}>
      {title}
    </Text>
  </View>
);

export function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          borderTopColor: '#0061FF1A',
          borderTopWidth: 1,
          minHeight: 60,
        },
      }}>
      <Tab.Screen
        name="Notes"
        component={NotesStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.notes} title="Notes" />
          ),
        }}
      />
      <Tab.Screen
        name="To Do"
        component={ToDo}
        options={{
          header: () => (
            <CustomHeader
              title={'To Do'}
              icon={icons.todo}
              className="border-emerald-500"
            />
          ),
          title: 'To Do',
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.todo} title="To Do" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.settings} title="Settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
