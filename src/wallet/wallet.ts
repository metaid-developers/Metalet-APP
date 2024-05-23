import { AddressType, BtcWallet, CoinType, MvcWallet } from "@metalet/utxo-wallet-service";
import { WalletBean } from "../bean/WalletBean";
import { AsyncStorageUtil, wallet_password_key, wallets_key, walllet_address_type_key } from "../utils/AsyncStorageUtil";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// READY
// export const btc_network = "mainnet";
// export const net_network = "livenet";



export const btc_network = "testnet";
export const net_network = "testnet";



export async function getStorageCurrentWallet() {
  const wallets = await AsyncStorageUtil.getItem(wallets_key);
  for (let i = 0; i < wallets.length; i++) {
    let wallet : WalletBean = wallets[i];
    for (let q = 0; q < wallet.accountsOptions.length; q++) {
      let account = wallet.accountsOptions[q];
      if (account.isSelect == true) {
       return wallet;
      }
    }
  }
}

/**
 * 获取当前选中的mvc钱包
 */
export async function getCurrentMvcWallet():Promise<MvcWallet> {
  const wallet = await getStorageCurrentWallet();
//   console.log("wallet 获取当前硬件钱包信息是： ",wallet);
  const mvcWallet = new MvcWallet({
    network: btc_network,
    mnemonic: wallet.mnemonic,
    addressIndex: wallet.isCurrentPathIndex,
    addressType: AddressType.LegacyMvc,
    coinType: wallet.mvcTypes,
  });
  return mvcWallet;
}

/**
 * 获取当前选中的btc钱包
 * 通过 addressType 来控制 CoinType 
 */
export async function getCurrentBtcWallet():Promise<BtcWallet> {
    const wallet = await getStorageCurrentWallet();
    const addressType=await getStorageAddressType();

    let coinType = addressType === AddressType.SameAsMvc ? wallet.mvcTypes : CoinType.BTC

    const btcWallet = new BtcWallet({
      network: btc_network,
      mnemonic: wallet.mnemonic,
      addressIndex: wallet.isCurrentPathIndex,
      addressType: addressType,
      coinType: coinType,
    //   coinType: wallet.mvcTypes,
    });
    return btcWallet;
  }



  export async function getStorageAddressType() {
    const addressType=await AsyncStorageUtil.getItem(walllet_address_type_key);
    return addressType
  }

  export async function isNoWalletPassword():Promise<boolean>{
    const  password = await AsyncStorageUtil.getItem(wallet_password_key);
    if(password==null){
      return true
    }else{
      return false
    }
  }