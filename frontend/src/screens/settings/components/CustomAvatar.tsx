import {View, Text} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-elements';
import {useTheme} from '../../../themes/ThemeProvider';

const getColorForLetter = (letter: string): string => {
  const colors: Record<string, string> = {
    A: '#FF5733',
    B: '#33FF57',
    C: '#5733FF',
    D: '#FFD700',
    E: '#40E0D0',
    F: '#FF6347',
    G: '#4682B4',
    H: '#8A2BE2',
    I: '#DC143C',
    J: '#00CED1',
    K: '#FF4500',
    L: '#7CFC00',
    M: '#FF69B4',
    N: '#1E90FF',
    O: '#D2691E',
    P: '#FF1493',
    Q: '#32CD32',
    R: '#8B0000',
    S: '#B22222',
    T: '#FF8C00',
    U: '#6A5ACD',
    V: '#ADFF2F',
    W: '#8FBC8F',
    X: '#20B2AA',
    Y: '#FF00FF',
    Z: '#A52A2A',
  };

  return colors[letter] || 'gray';
};

interface CustomAvatarProps {
  username?: string;
  isUsernameShown?: boolean;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  username,
  isUsernameShown,
}) => {
  const firstLetter = username ? username.charAt(0).toUpperCase() : '?';
  const backgroundColor = getColorForLetter(firstLetter);
  const {colors} = useTheme();

  return (
    <View className="flex flex-col items-center relative">
      <Avatar
        size="large"
        rounded
        title={firstLetter}
        containerStyle={{backgroundColor}}
      />
      {isUsernameShown && (
        <Text
          className="text-2xl font-rubik mt-3"
          style={{color: colors.text.primary}}>
          {username || 'Unknown'}
        </Text>
      )}
    </View>
  );
};

export default CustomAvatar;
