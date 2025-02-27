import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const Preferences = () => {
  return (
    <SafeAreaView className="flex-1 bg-white pb-32 px-7">
      <ScrollView className="p-2 mt-4">
        <View className="mb-4">
          <Text className="text-2xl font-rubik-medium border-b border-primary-200 pb-3">
            Theme:{'  '}
            <Text selectable className="text-xl font-rubik">
              Default
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Preferences;
