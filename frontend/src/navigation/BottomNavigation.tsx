import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Notes from '../screens/notes/Notes';
import Options from '../screens/settings/Settings';
import ToDos from '../screens/todos/ToDos';
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
import {useTheme} from '../themes/ThemeProvider';
import {themes} from '../themes/themes';
import ToDo from '../screens/todos/ToDo';

const Tab = createBottomTabNavigator();

const SettingsNativeStack =
  createNativeStackNavigator<SettingsStackParamList>();

const NotesNativeStack = createNativeStackNavigator<NotesStackParamList>();

const ToDosNativeStack = createNativeStackNavigator<ToDosStackParamList>();

function NotesStack() {
  const {theme, colors, setTheme} = useTheme();

  return (
    <>
      <NotesNativeStack.Navigator
        initialRouteName="Notes"
        screenOptions={{
          animation: 'none',
        }}>
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
    </>
  );
}

function ToDosStack() {
  const {theme, colors, setTheme} = useTheme();

  return (
    <>
      <ToDosNativeStack.Navigator
        initialRouteName="ToDos"
        screenOptions={{
          animation: 'none',
        }}>
        <ToDosNativeStack.Screen
          name="ToDos"
          component={ToDos}
          options={{
            headerShown: false,
            header: () => (
              <CustomHeader
                title={'ToDos'}
                icon={icons.todo}
                className="border-primary-300"
              />
            ),
          }}
        />
        <ToDosNativeStack.Screen
          name="ToDo"
          component={ToDo}
          options={{
            headerShown: false,
            header: () => (
              <CustomHeader
                title={''}
                icon={icons.todo}
                className="border-primary-300"
                backArrowEnable={true}
              />
            ),
          }}
        />
      </ToDosNativeStack.Navigator>
    </>
  );
}

function SettingsStack() {
  const {theme, colors, setTheme} = useTheme();

  return (
    <SettingsNativeStack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        animation: 'none',
      }}>
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
}) => {
  const {theme, colors, setTheme} = useTheme();

  return (
    <View className="flex-1 mt-2 flex flex-col items-center">
      <Image
        source={icon}
        tintColor={
          focused
            ? title === "To Do's"
              ? '#10b981'
              : theme.name === 'Primary Light'
              ? colors.primary[300]
              : colors.primary[250]
            : colors.text.secondary
        }
        resizeMode="contain"
        className="size-6"
      />
      <Text
        className={`${
          focused ? 'font-rubik-medium' : 'font-rubik'
        } text-xs w-full text-center mt-1`}
        style={{
          color: focused
            ? title === "To Do's"
              ? '#10b981'
              : theme.name === 'Primary Light'
              ? colors.primary[300]
              : colors.primary[250]
            : colors.text.secondary,
        }}>
        {title}
      </Text>
    </View>
  );
};

export function BottomNavigator() {
  const {theme, colors, setTheme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderColor: colors.background.primary,
          position: 'absolute',
          minHeight: 80,
          borderTopWidth: 0,
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
        name="To Do's"
        component={ToDosStack}
        options={{
          headerShown: false,
          header: () => (
            <CustomHeader
              title={"To Do's"}
              icon={icons.todo}
              className="border-emerald-500"
            />
          ),
          title: 'To Do',
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.todo} title="To Do's" />
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
