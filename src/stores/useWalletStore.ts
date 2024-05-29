import { create } from "zustand";
import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-service";

interface WalletState {
  btcWallet: BtcWallet | null;
  mvcWallet: MvcWallet | null;
  setCurrentWallet: (wallets: {
    btcWallet: BtcWallet;
    mvcWallet: MvcWallet;
  }) => void;
}

const useWalletStore = create<WalletState>((set) => ({
  btcWallet: null,
  mvcWallet: null,
  setCurrentWallet: ({
    btcWallet,
    mvcWallet,
  }: {
    btcWallet: BtcWallet;
    mvcWallet: MvcWallet;
  }) => set({ btcWallet, mvcWallet }),
}));

export default useWalletStore;
