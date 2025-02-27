type NotesStackParamList = {
  Notes: any;
  Note: {noteId: string};
};

type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Preferences: undefined;
  Reminders: undefined;
  Security: undefined;
  Language: undefined;
};

type RootStackParamList = {
  Notes: any; // TO DO what is the difference between any and undefined here?
  ToDo: undefined;
  Settings: undefined;
};

type AppStackParamList = {
  Launch: undefined;
  Login: undefined;
  App: NavigatorScreenParams<RootStackParamList>;
};

type NotesScreenNavigationProp = NativeStackNavigationProp<NotesStackParamList>;

type SettingsScreenNavigationProp =
  NativeStackNavigationProp<SettingsStackParamList>;

type RootScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type AppScreenNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// type NotesScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Notes'
// >;

// type ToDoScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'ToDo'
// >;

// type SettingsScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Settings'
// >;

// type LaunchScreenNavigationProp = NativeStackNavigationProp<
//   AppStackParamList,
//   'Launch'
// >;

// type LoginScreenNavigationProp = NativeStackNavigationProp<
//   AppStackParamList,
//   'Login'
// >;

// type AppScreenNavigationProp = NativeStackNavigationProp<
//   AppStackParamList,
//   'App'
// >;
