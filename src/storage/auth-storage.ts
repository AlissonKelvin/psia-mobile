import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@psia:token";
const USER_KEY = "@psia:user";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveUser(user: unknown) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser<T>() {
  const user = await AsyncStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user) as T;
}

export async function clearAuthStorage() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
