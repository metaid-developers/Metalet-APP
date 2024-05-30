import { AddressType, CoinType } from "@metalet/utxo-wallet-service";
import { AccountsOptions, WalletBean } from "../bean/WalletBean";
import { useData } from "../hooks/MyProvider";
import {
  CurrentAccountIDKey,
  CurrentWalletIDKey,
  wallet_password_key,
  wallets_key,
  createStorage,
  network_btc,
  AsyncStorageUtil,
} from "./AsyncStorageUtil";
import MetaletWallet from "../wallet/MetaletWallet";
import { removeTrailingZeros } from "./StringUtils";
import { fetchMvcFtPrice } from "../api/metaletservice";
import { MvcFtData } from "../api/type/MvcFtData";
import { Linking } from "react-native";

const storage = createStorage();

//storage
export async function getCurrentWalletID(): Promise<string> {
  const walletID = await storage.get(CurrentWalletIDKey);
  return walletID;
}

export async function setCurrentWalletID(walletID: string) {
  await storage.set(CurrentWalletIDKey, walletID);
}

export async function getCurrentAccountID(): Promise<string> {
  const accountID = await storage.get(CurrentAccountIDKey);
  return accountID;
}

export async function setCurrentAccountID(accountID: string) {
  await storage.set(CurrentAccountIDKey, accountID);
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
  const wallets = await storage.get<WalletBean[]>(wallets_key);
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
  return await storage.get<WalletBean[]>(wallets_key);
}

export async function getCurrentWalletSeed() {
  const wallet: WalletBean = await getStorageCurrentWallet();
  if (wallet.seed == null) {
    return null;
  }
  const seed = Buffer.from(wallet.seed, "hex");
  return seed;
}

export async function isNoWalletPassword(): Promise<boolean> {
  const password = await storage.get(wallet_password_key);
  // const password = await AsyncStorageUtil.getItem(wallet_password_key);
  console.log("isNoWalletPassword", password);

  if (password == null) {
    return true;
  } else {
    return false;
  }
}

export async function isNoStorageWallet(): Promise<boolean> {
  const wallets = await storage.get(wallets_key);
  // const wallets = await AsyncStorageUtil.getItem(wallets_key);
  if (wallets) {
    return false;
  }
  return true;
}

export async function getStorageWallets() {
  return await storage.get<WalletBean[]>(wallets_key, { defaultValue: [] });
}

export async function verifyPassword(password: string): Promise<boolean> {
  const passwordLocal = await storage.get(wallet_password_key);
  // const passwordLocal = await AsyncStorageUtil.getItem(wallet_password_key);
  if (passwordLocal == password) {
    return true;
  } else {
    return false;
  }
}

/////////////change
export async function changeCurrentWalletAddressType(
  changeAddressType: AddressType
) {
  const wallets: WalletBean[] = await getWalletBeans();
  const walletID = await getCurrentWalletID();
  const wallet = wallets.find((wallet) => wallet.id == walletID);
  wallet.addressType = changeAddressType;
  await storage.set(wallets_key, wallets);
  // await AsyncStorageUtil.updateItem(wallets_key, [...wallets, wallet]);
  // await AsyncStorageUtil.updateItem(wallets_key, wallets);

}

///////////utils
export function parseToSpace(space: string) {
  return (parseFloat(space) / 100000000).toFixed(8);
}

export function parseToSat(space: string) {
  return Math.floor(parseFloat(space) * 100000000);
}

export function getRandomID() {
  return Math.random().toString(36).substr(2, 8);
}

//sat to space
export function formatToDecimal(amount: number, precision: number) {
  // 将整数转换为浮点数并除以10的精度次方
  const divisor = Math.pow(10, precision);
  const formattedAmount = (amount / divisor).toFixed(precision);
  return removeTrailingZeros(formattedAmount);
}

//space to sat
export function caculateToSatDecimal(amount: number, precision: number) {
  const divisor = Math.pow(10, precision);
  const formattedAmount = (amount * divisor).toFixed(precision);
  return removeTrailingZeros(formattedAmount);
}

/////////// fuction
export async function goToWebScan(chain: string, linkTx: string,network:string) {
  let url;
  if (chain == "mvc") {
    url = "https://www.mvcscan.com/tx/" + linkTx;
  } else if (chain == "btc") {
    if (network == "testnet") {
      url = "https://mempool.space/zh/tx/" + linkTx;
    } else {
      url = "https://mempool.space/tx/" + linkTx;
    }
  }


  console.log("url",url);
  
  if(url){
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  }

}
