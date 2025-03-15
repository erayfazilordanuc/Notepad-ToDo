type NotesStackParamList = {
  Notes: any;
  Note: {noteId: string};
};

type ToDosStackParamList = {
  ToDos: any;
  ToDo: {todoId: string};
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
  ToDos: undefined;
  Settings: undefined;
};

type AppStackParamList = {
  Launch: undefined;
  Login: undefined;
  App: NavigatorScreenParams<RootStackParamList>;
};

type NotesScreenNavigationProp = NativeStackNavigationProp<NotesStackParamList>;

type ToDosScreenNavigationProp = NativeStackNavigationProp<ToDosStackParamList>;

type SettingsScreenNavigationProp =
  NativeStackNavigationProp<SettingsStackParamList>;

type RootScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type AppScreenNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// type NotesScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Notes'
// >;

// type ToDosScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'ToDos'
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
