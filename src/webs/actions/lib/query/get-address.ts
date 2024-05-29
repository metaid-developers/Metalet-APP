import useWalletStore from "@/stores/useWalletStore";

export async function process() {
  if (!useWalletStore.getState().mvcWallet) {
    return {
      error: "MVC Wallet is not initialized.",
    };
  }
  return useWalletStore.getState().mvcWallet.getAddress();
}
