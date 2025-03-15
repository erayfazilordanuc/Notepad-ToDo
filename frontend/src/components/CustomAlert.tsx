import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {useTheme} from '../themes/ThemeProvider';

interface CustomAlertProps {
  message: string;
  visible: boolean;
  onYes: () => void;
  onCancel: () => void;
}

const CustomAlert = ({message, visible, onYes, onCancel}: CustomAlertProps) => {
  const {theme, colors, setTheme} = useTheme();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="w-4/5 rounded-lg p-5 py-6 items-center"
          style={{backgroundColor: colors.background.primary}}>
          <Text
            className="text-lg font-bold mb-6"
            style={{color: colors.text.primary}}>
            {message ? message : 'Are you sure?'}
          </Text>
          <View className="flex-row justify-between w-full">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 p-2 rounded-md items-center mx-1"
              style={{backgroundColor: colors.background.secondary}}>
              <Text
                className="text-base font-bold"
                style={{color: colors.text.primary}}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onYes}
              className="flex-1 p-2 bg-red-500 rounded-md items-center mx-1">
              <Text className="text-base font-bold text-white">Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
