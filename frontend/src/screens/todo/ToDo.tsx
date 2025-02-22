import * as React from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@react-navigation/elements';

function ToDo() {
  const navigation = useNavigation<RootScreenNavigationProp>();

  return (
    <View
      className="bg-emerald-50"
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text className="bg-lime-100 rounded-full p-3 px-4 mb-2">
        To Do Screen
      </Text>
      {/* Pop to top kullanılabilir */}
    </View>
  );
}

export default ToDo;
