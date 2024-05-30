// import { getNet } from './network'
// import useStorage from '@/lib/storage'
// import { type V3Wallet } from './types'
import { getCurrentAccountId } from "./account";
import useWalletStore from "@/stores/useWalletStore";
import { Chain, AddressType } from "@metalet/utxo-wallet-service";

import { Wallet } from "./types/wallet";
import {
  createStorage,
  wallets_key,
  CurrentWalletIDKey,
} from "@/utils/AsyncStorageUtil";

const storage = createStorage();

export async function hasWallets(): Promise<boolean> {
  return !!(await storage.get<Wallet[]>(wallets_key));
}

export async function getWallets() {
  return await storage.get<Wallet[]>(wallets_key, {
    defaultValue: [],
  });
}

export async function getBtcAddressType(walletId: string) {
  const wallets = await storage.get<Wallet[]>(wallets_key, {
    defaultValue: [],
  });
  if (wallets.length === 0) {
    throw new Error("no wallets");
  }
  const wallet = wallets.find((w) => w.id === walletId);
  if (wallet) {
    return wallet.addressType || AddressType.SameAsMvc;
  }
  return AddressType.SameAsMvc;
}

// const Wallet_Num = 'wallet_num'
// const CURRENT_WALLET_ID = 'currentWalletId'
// export const V3_WALLETS_STORAGE_KEY = 'wallets_v3'

// const storage = useStorage()

// export async function getV3WalletsNum() {
//   const wallets = await getV3Wallets()
//   return await storage.get<number>(Wallet_Num, {
//     defaultValue: wallets.length,
//   })
// }

// export async function setV3WalletsNum(num: number) {
//   return await storage.set(Wallet_Num, num)
// }

// export async function addV3Wallet(wallet: V3Wallet) {
//   const v3Wallet = await getV3Wallets()
//   if (v3Wallet.find((w) => w.mnemonic === wallet.mnemonic)) {
//     throw new Error('Wallet already exists')
//   }
//   const wallets = await getV3WalletsStorage()
//   wallets[wallet.id] = wallet
//   await setV3WalletsStorage(wallets)
// }

// export async function setV3WalletsStorage(wallets: Record<string, V3Wallet>) {
//   await storage.set(V3_WALLETS_STORAGE_KEY, JSON.stringify(wallets))
// }

export async function getCurrentWalletId() {
  const currentWalletId = await storage.get(CurrentWalletIDKey);
  if (!currentWalletId) {
    throw new Error("No current wallet found. Please select a wallet.");
  }
  return currentWalletId;
}

// export async function setCurrentWalletId(walletId: string) {
//   return await storage.set(CURRENT_WALLET_ID, walletId)
// }

// export async function getV3CurrentWallet() {
//   const walletId = await getCurrentWalletId()
//   if (!walletId) {
//     throw new Error('current wallet id not found')
//   }
//   const wallets = await getV3Wallets()
//   if (!wallets.length) {
//     throw new Error('wallets not found')
//   }
//   const wallet = wallets.find((wallet) => wallet.id === walletId)
//   if (!wallet) {
//     throw new Error('wallet not found')
//   }
//   return wallet
// }

export async function getWalletOnlyAccount(
  walletId: string,
  accountId: string
) {
  if (!walletId) {
    throw new Error("wallet id not found");
  }
  const wallets = await getWallets();
  if (!wallets.length) {
    throw new Error("wallets not found");
  }
  const wallet = wallets.find((wallet) => wallet.id === walletId);
  if (!wallet) {
    throw new Error("Plese select a wallet first.");
  }

  const { accountsOptions: accounts } = wallet;
  if (!accounts || !accounts.length) {
    throw new Error("wallet does not have any accounts");
  }

  if (!accountId) {
    throw new Error("account id not found");
  }
  const account = accounts.find((account) => account.id === accountId);
  if (!account) {
    throw new Error("current account not found");
  }
  wallet.accountsOptions = [account];
  return wallet;
}

export async function getActiveWalletOnlyAccount() {
  const currentWalletId = await getCurrentWalletId();
  if (!currentWalletId) {
    throw new Error("current wallet id not found");
  }
  const currentAccountId = await getCurrentAccountId();
  if (!currentAccountId) {
    throw new Error("current account id not found");
  }
  return getWalletOnlyAccount(currentWalletId, currentAccountId);
}

// export async function getInactiveWallets() {
//   const currentWalletId = await getCurrentWalletId()
//   if (!currentWalletId) {
//     throw new Error('Current wallet id not found.')
//   }
//   const wallets = await getV3Wallets()
//   if (!wallets.length) {
//     throw new Error('No wallets found. Please create a wallet first.')
//   }
//   return wallets.filter((wallet) => wallet.id !== currentWalletId)
// }

export async function getWalletOtherAccounts(
  walletId: string,
  accountId: string
) {
  if (!walletId) {
    throw new Error("wallet id not found");
  }
  const wallets = await getWallets();
  if (!wallets.length) {
    throw new Error("wallets not found");
  }
  const wallet = wallets.find((wallet) => wallet.id === walletId);
  if (!wallet) {
    throw new Error("wallet not found");
  }

  const { accountsOptions: accounts } = wallet;
  if (!accounts || !accounts.length) {
    throw new Error("wallet does not have any accounts");
  }

  if (!accountId) {
    throw new Error("current account id not found");
  }
  wallet.accountsOptions = accounts.filter(
    (account) => account.id !== accountId
  );
  return wallet;
}

export async function getActiveWalletOtherAccounts() {
  const walletId = await getCurrentWalletId();
  if (!walletId) {
    throw new Error("current wallet id not found");
  }
  const currentAccountId = await getCurrentAccountId();
  if (!currentAccountId) {
    throw new Error("current account id not found");
  }
  return getWalletOtherAccounts(walletId, currentAccountId);
}

// export async function getV3CurrentAccount() {
//   const walletId = await getCurrentWalletId()
//   const wallets = await getV3Wallets()
//   if (!walletId || !wallets.length) {
//     throw new Error('current wallet id not found')
//   }
//   const wallet = wallets.find((wallet) => wallet.id === walletId)
//   if (!wallet) {
//     throw new Error('wallet not found')
//   }

//   const { accounts } = wallet
//   if (!accounts || !accounts.length) {
//     throw new Error('wallet does not have any accounts')
//   }
//   const currentAccountId = await getCurrentAccountId()
//   if (!currentAccountId) {
//     throw new Error('current account id not found')
//   }
//   const account = accounts.find((account) => account.id === currentAccountId)
//   if (!account) {
//     throw new Error('current account not found')
//   }
//   return account
// }

// export async function updateWalletName(walletId: string, name: string) {
//   const walletsMap = await getV3WalletsStorage()
//   if (!walletsMap) {
//     throw new Error('V3 wallets storage not found.')
//   }
//   const wallet = walletsMap[walletId]
//   if (!wallet) {
//     throw new Error(`Wallet not found with id ${walletId}.`)
//   }
//   wallet.name = name
//   await setV3WalletsStorage(walletsMap)
// }

// export async function updateAccountName(walletId: string, accountId: string, name: string) {
//   const walletsMap = await getV3WalletsStorage()
//   if (!walletsMap) {
//     throw new Error('V3 wallets storage not found.')
//   }
//   const wallet = walletsMap[walletId]
//   if (!wallet) {
//     throw new Error(`Wallet not found with id ${walletId}.`)
//   }
//   const accounts = wallet.accounts
//   if (!accounts) {
//     throw new Error(`Wallet acounts not found with id ${walletId}.`)
//   }
//   const account = accounts.find((account) => account.id === accountId)
//   if (!account) {
//     throw new Error(`Account not found with id ${accountId}.`)
//   }
//   account.name = name
//   await setV3WalletsStorage(walletsMap)
// }

// export async function hasWallets() {
//   const wallets = await getV3Wallets()
//   return !!wallets.length
// }

// export async function deleteV3Wallet(walletId: string) {
//   const walletsMap = await getV3WalletsStorage()
//   if (!walletsMap) {
//     throw new Error('V3 wallets storage not found.')
//   }
//   delete walletsMap[walletId]
//   await setV3WalletsStorage(walletsMap)
// }

export function getCurrentWallet(chain: Chain) {
  if (chain === Chain.MVC) {
    if (!useWalletStore.getState().mvcWallet) {
      throw new Error("MVC Wallet is not initialized.");
    }
    return useWalletStore.getState().mvcWallet;
  } else if (chain === Chain.BTC) {
    if (!useWalletStore.getState().btcWallet) {
      throw new Error("BTC Wallet is not initialized.");
    }
    return useWalletStore.getState().btcWallet;
  }
  throw new Error(`Chain ${chain} is not supported`);
}
