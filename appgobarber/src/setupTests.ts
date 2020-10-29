import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
// check a way to type module above
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
