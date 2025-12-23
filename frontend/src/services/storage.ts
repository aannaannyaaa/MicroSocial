import * as SecureStore from 'expo-secure-store';

export const storageService = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`Failed to save ${key}:`, error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`Failed to get ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`Failed to remove ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = ['authToken', 'user'];
      for (const key of keys) {
        await this.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  },
};
