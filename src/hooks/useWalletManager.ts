import { getCurrentAccountId } from "@/lib/account";
import useNetworkStore from "@/store/useNetworkStore";
import { useState, useCallback, useEffect } from "react";
import {
  Chain,
  BtcWallet,
  MvcWallet,
  AddressType,
  WalletManager,
} from "@metalet/utxo-wallet-service";
import {
  getBtcAddressType,
  getCurrentWalletId,
  getWalletOnlyAccount,
  getWalletOtherAccounts,
  getActiveWalletOnlyAccount,
  getActiveWalletOtherAccounts,
} from "@/lib/wallet";

interface WalletMap {
  [Chain.BTC]: BtcWallet;
  [Chain.MVC]: MvcWallet;
}

const useWalletManager = () => {
  const { network } = useNetworkStore();
  const [walletManager, setWalletManager] = useState<WalletManager>(null);

  const initWalletManager: () => Promise<WalletManager> =
    useCallback(async () => {
      try {
        // console.log("network", network);

        // const t1 = performance.now();
        const activeWallet = await getActiveWalletOnlyAccount();
        // const t2 = performance.now();
        // console.log("getActiveWalletOnlyAccount", t2 - t1);

        // const t3 = performance.now();
        const walletsOptions = [
          {
            id: activeWallet.id,
            name: activeWallet.name,
            mnemonic: activeWallet.mnemonic,
            mvcTypes: [activeWallet.mvcTypes],
            seed: activeWallet.seed
              ? Buffer.from(activeWallet.seed, "hex")
              : undefined,
            accountsOptions: activeWallet.accountsOptions.map(
              ({ id, name, addressIndex }) => ({ id, name, addressIndex })
            ),
          },
        ];
        const walletManager = new WalletManager({ network, walletsOptions });

        // const t4 = performance.now();
        // console.log("walletManager", t4 - t3);

        setWalletManager(walletManager);
        loadActiveWalletOtherAccounts(walletManager);
        return walletManager;
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    }, [network]);

  useEffect(() => {
    // console.log("useWalletManager", network);

    initWalletManager();
    // .then((walletManager) => {
    //   console.log("wallets", walletManager.getWallets());
    // });
  }, [network, initWalletManager]);

  const loadActiveWalletOtherAccounts = useCallback(
    async (walletManager: WalletManager) => {
      const activeWallet = await getActiveWalletOtherAccounts();
      for (const account of activeWallet.accountsOptions) {
        walletManager.addAccount(activeWallet.id, {
          id: account.id,
          name: account.name,
          addressIndex: account.addressIndex,
        });
      }
    },
    []
  );

  const addWalletOnlyAccount = useCallback(
    async (walletId, accountId) => {
      const wallet = await getWalletOnlyAccount(walletId, accountId);
      walletManager.addWallet({
        id: wallet.id,
        name: wallet.name,
        mnemonic: wallet.mnemonic,
        mvcTypes: [wallet.mvcTypes],
        accountsOptions: wallet.accountsOptions.map(
          ({ id, name, addressIndex }) => ({
            id,
            name,
            addressIndex,
          })
        ),
      });
    },
    [walletManager]
  );

  const loadWalletOtherAccounts = useCallback(
    async (walletId, accountId) => {
      const wallet = await getWalletOtherAccounts(walletId, accountId);
      if (!wallet) {
        throw new Error("No wallet found. Please select a wallet.");
      }
      if (walletManager === null) {
        throw new Error("Wallet manager not initialized.");
      }

      for (let account of wallet.accountsOptions) {
        walletManager.addAccount(wallet.id, {
          id: account.id,
          name: account.name,
          addressIndex: account.addressIndex,
        });
      }
    },
    [walletManager]
  );

  const getAccountChainWallets = useCallback(async () => {
    try {
      const currentWalletId = await getCurrentWalletId();
      const currentAccountId = await getCurrentAccountId();

      if (walletManager === null) {
        throw new Error("Wallet manager not initialized.");
      }

      return (
        walletManager.getAccountChainWallets(
          currentWalletId,
          currentAccountId
        ) || {}
      );
    } catch (error) {
      console.error("getAccountChainWallets Error :", error);
      throw error;
    }
  }, [walletManager]);

  const getCurrentChainWallet: <T extends Chain>(
    chain: T
  ) => Promise<WalletMap[T]> = useCallback(
    async (chain: Chain) => {
      const accountChainWallets = await getAccountChainWallets();
      const chainWallets = accountChainWallets[chain];

      if (!chainWallets) {
        throw new Error("No chain wallets found.");
      }
      const currentWalletId = await getCurrentWalletId();
      const addressType =
        chain === Chain.MVC
          ? AddressType.LegacyMvc
          : await getBtcAddressType(currentWalletId);

      const chainWallet = chainWallets.find(
        (wallet) => wallet.getAddressType() === addressType
      );

      if (!chainWallet) {
        throw new Error(`No ${addressType} wallet found.`);
      }
      return chainWallet;
    },
    [getAccountChainWallets]
  );

  const getWallets = useCallback(async () => {
    if (walletManager === null) {
      throw new Error("Wallet manager not initialized.");
    }
    console.log("wallets", JSON.stringify(walletManager.getWallets()));
  }, [walletManager]);

  return {
    getWallets,
    walletManager,
    initWalletManager,
    addWalletOnlyAccount,
    getCurrentChainWallet,
    getAccountChainWallets,
    loadWalletOtherAccounts,
  };
};

export default useWalletManager;
