import { AddressType, CoinType } from "@metalet/utxo-wallet-service";
import { WalletBean } from "../bean/WalletBean";
import { AsyncStorageUtil, wallet_password_key, wallets_key, walllet_address_type_key } from "../utils/AsyncStorageUtil";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getCurrentWalletSeed, getStorageCurrentWallet } from "../utils/WalletUtils";
import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-sdk";

// READY
// export const btc_network = "mainnet";
// export const net_network = "livenet";



export const btc_network = "testnet";
export const net_network = "testnet";





/**
 * 获取当前选中的mvc钱包
 */
export async function getCurrentMvcWallet():Promise<MvcWallet> {
  const wallet = await getStorageCurrentWallet();
  const seed=await getCurrentWalletSeed()

  const mvcWallet = new MvcWallet({
    network: btc_network,
    mnemonic: wallet.mnemonic,
    addressIndex: wallet.isCurrentPathIndex,
    addressType: AddressType.LegacyMvc,
    coinType: wallet.mvcTypes,
    seed:seed
  });
  return mvcWallet;
}


export async function getCurrentBtcWallet():Promise<BtcWallet> {
    const wallet = await getStorageCurrentWallet();
    const addressType=wallet.addressTpye;
    const seed=await getCurrentWalletSeed()

    let coinType = addressType === AddressType.SameAsMvc ? wallet.mvcTypes : CoinType.BTC

    const btcWallet = new BtcWallet({
      network: btc_network,
      mnemonic: wallet.mnemonic,
      addressIndex: wallet.isCurrentPathIndex,
      addressType: addressType,
      coinType: coinType,
      seed
    //   coinType: wallet.mvcTypes,
    });
    return btcWallet;
  }




