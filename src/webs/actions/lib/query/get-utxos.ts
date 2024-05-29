import { fetchUtxos } from "@/queries/utxos";
import { Chain } from "@metalet/utxo-wallet-service";
import useWalletStore from "@/stores/useWalletStore";

export async function process() {
  if (!useWalletStore.getState().mvcWallet) {
    return {
      error: "MVC Wallet is not initialized.",
    };
  }
  const address = useWalletStore.getState().mvcWallet.getAddress();
  return fetchUtxos(Chain.MVC, address);
}
