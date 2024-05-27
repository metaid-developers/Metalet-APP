import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Storage {
  get<T = string>(key: string): Promise<T | undefined | null>;
  get<T = string>(key: string, option: { defaultValue: T }): Promise<T>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
}

let globalStorage: Storage;

export function createStorage(): Storage {
  if (globalStorage) {
    return globalStorage;
  }

  const storage = {
    get: async (key: string) => {
      return await AsyncStorage.getItem(key);
    },

    set: async (key: string, value: string) => {
      await AsyncStorage.setItem(key, value);
    },

    delete: async (key: string) => {
      await AsyncStorage.removeItem(key);
    },
  };

  globalStorage = {
    async get<T>(
      key: string,
      option?: { defaultValue: T }
    ): Promise<T | string | undefined | null> {
      const value = await storage.get(key);
      if (value === null || value === undefined) {
        return option?.defaultValue;
      }
      if (typeof value === "string") {
        try {
          return JSON.parse(value) as T;
        } catch (error) {
          return value;
        }
      }
      return value as T;
    },
    async set(key: string, value: object | string) {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      return await storage.set(key, value);
    },
    async delete(key: string) {
      return await storage.delete(key);
    },
  };

  return globalStorage;
}

export const wallets_key = "wallets";
export const account_select_key = "account_select";
export const network_key = "network";
export const network_btc = "network_btc";
export const network_mvc = "network_mvc";
export const network_all = "network_all";

export const walllet_address_type_key = "walllet_address_type";

export const wallet_password_key = "wallet_password";

// current
export const CurrentWalletIDKey = "CurrentWalletID_key";
export const CurrentAccountIDKey = "CurrentAccountID_key";
