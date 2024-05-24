import {
  AddressType,
  BtcWallet,
  CoinType,
  MvcWallet,
} from "@metalet/utxo-wallet-service";
import { AccountsOptions, WalletBean } from "../bean/WalletBean";
import { useData } from "../hooks/MyProvider";
import {
  AsyncStorageUtil,
  CurrentAccountIDKey,
  CurrentWalletIDKey,
  wallet_password_key,
  wallets_key,
} from "./AsyncStorageUtil";
import MetaletWallet from "../wallet/MetaletWallet";

export async function isNoWalletPassword(): Promise<boolean> {
  const password = await AsyncStorageUtil.getItem(wallet_password_key);
  console.log("isNoWalletPassword", password);

  if (password == null) {
    return true;
  } else {
    return false;
  }
}

export async function isNoStorageWallet(): Promise<boolean> {
  const wallets = await AsyncStorageUtil.getItem(wallets_key);
  if (wallets) {
    return false;
  }
  return true;
}

export async function getStorageWallets(): Promise<WalletBean[]> {
  const wallets = await AsyncStorageUtil.getItem(wallets_key);
  return wallets;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const passwordLocal = await AsyncStorageUtil.getItem(wallet_password_key);
  if (passwordLocal == password) {
    return true;
  } else {
    return false;
  }
}

export function parseShowSpace(space: string) {
  return (parseFloat(space) / 100000000).toFixed(8);
}

export async function parseSatSpace(space: string) {
  return Math.floor(parseFloat(space) * 100000000);
}

//storage
export async function getCurrentWalletID(): Promise<string> {
  const walletID = await AsyncStorageUtil.getItem(CurrentWalletIDKey);
  return walletID;
}

export async function setCurrentWalletID(walletID:string) {
  await AsyncStorageUtil.setItem(CurrentWalletIDKey,walletID);
  }




export async function getCurrentAccountID(): Promise<string> {
  const accountID = await AsyncStorageUtil.getItem(CurrentAccountIDKey);
  return accountID;
}

export async function setCurrentAccountID(accountID:string) {
  await AsyncStorageUtil.setItem(CurrentAccountIDKey, accountID)
}




export async function getCurrentWalletAccount(): Promise<AccountsOptions> {
  const wallet = await getStorageCurrentWallet();
  const accountID = await getCurrentAccountID();
  if (!wallet || !accountID) {
    return null;
  }
  return wallet.accountsOptions.find((account) => account.id == accountID);
}
export async function getStorageCurrentWallet(): Promise<WalletBean> {
  const wallets = await AsyncStorageUtil.getItem(wallets_key);
  if (wallets) {
    const walletID = await getCurrentWalletID();
    const wallet = wallets.find((wallet) => {
      if (wallet) {
        if (wallet.id == walletID) {
          return wallet;
        }
      } else {
        return null;
      }
    });
    return wallet;
  } else {
    return null;
  }
}

// export async function setCurrentWallet(walletBean:WalletBean) {
//   await AsyncStorageUtil.setItem(CurrentWalletIDKey,walletBean);
//   }
  
//   export async function setCurrentAccount(account:AccountsOptions) {
//      await AsyncStorageUtil.setItem(CurrentAccountIDKey,account);
//   }
  

export async function getWalletBeans() {
  return await AsyncStorageUtil.getItem(wallets_key);
}

export async function getCurrentWalletSeed() {
  const wallet: WalletBean = await getStorageCurrentWallet();
  if (wallet.seed == null) {
    return null;
  }
  const seed = Buffer.from(wallet.seed, "hex");
  return seed;
}

//change
export async function changeCurrentWalletAddressType(
  changeAddressType: AddressType
) {
  const wallets: WalletBean[] = await getWalletBeans();
  const walletID = await getCurrentWalletID();
  const wallet = wallets.find((wallet) => wallet.id == walletID);
  wallet.addressTpye = changeAddressType;
  await AsyncStorageUtil.updateItem(wallets_key, [...wallets, wallet]);
}
