
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '../types/Student';

const STUDENTS_KEY = 'students_data';

export const saveStudents = async (students: Student[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(students);
    await AsyncStorage.setItem(STUDENTS_KEY, jsonValue);
    console.log('Students saved successfully');
  } catch (error) {
    console.error('Error saving students:', error);
    throw error;
  }
};

export const loadStudents = async (): Promise<Student[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STUDENTS_KEY);
    if (jsonValue != null) {
      const students = JSON.parse(jsonValue);
      console.log('Students loaded successfully');
      return students;
    }
    return [];
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};

export const clearStudents = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STUDENTS_KEY);
    console.log('Students data cleared');
  } catch (error) {
    console.error('Error clearing students:', error);
    throw error;
  }
};
