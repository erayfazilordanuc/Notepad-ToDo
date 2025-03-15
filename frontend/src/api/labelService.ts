import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLabels = async () => {
  const labels = await AsyncStorage.getItem('labels');
  return labels;
};

export const getLabelById = async () => {
  const labels = await AsyncStorage.getItem('labels');
  return labels;
};

export const getLabelsByAuthorId = async () => {};

export const createLabel = async () => {};

export const updateLabel = async () => {};
