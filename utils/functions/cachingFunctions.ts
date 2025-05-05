import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLocalData(
  key: string,
): Promise<string | null | undefined> {
  try {
    return (await AsyncStorage.getItem(`${key}`)) || null;
  } catch (e) {
    console.warn(`Error fetching data; KEY: ${key}; ERROR: ${e}`);
  }
}

export async function setLocalData(
  key: string | undefined,
  value: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(`${key}`, value);
  } catch (e) {
    console.warn(`Error storing data; KEY: ${key}; ERROR: ${e}`);
  }
}

export async function clearLocalData(key: string | undefined): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${key}`);
  } catch (e) {
    console.warn(`Error removing data; KEY: ${key}; ERROR: ${e}`);
  }
}
