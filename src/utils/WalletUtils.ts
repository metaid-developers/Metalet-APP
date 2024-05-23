import {
  AddressType,
  BtcWallet,
  CoinType,
  MvcWallet,
} from "@metalet/utxo-wallet-service";
import { WalletBean } from "../bean/WalletBean";
import { useData } from "../hooks/MyProvider";
import {
  AsyncStorageUtil,
  wallet_password_key,
  wallets_key,
} from "./AsyncStorageUtil";
import MetaletWallet from "../wallet/MetaletWallet";

//当前缓存钱包数据
const { myWallet, updateMyWallet } = useData();
//当前使用钱包实例
const { metaletWallet, updateMetaletWallet } = useData();

export const chooseMyWallet = async (wallet: WalletBean) => {
  await AsyncStorageUtil.getItem(wallets_key).then(async (wallets) => {
    wallets.forEach((wallet) => {
      wallet.accountsOptions.forEach((account) => {
        if (account.isSelected) {
          updateMyWallet(wallet);

          const btcWallet = new BtcWallet({
            network: "mainnet",
            mnemonic: wallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: wallet.addressTpye,
            //选中跟mvc 路径一致
            coinType: wallet.mvcTypes,
          });

     
          //   setLegacyAddress(btcLegacyWallet.getAddress());
          //   setMvcAddress(metaletWallet.currentMvcWallet.getAddress());
          updateMetaletWallet(metaletWallet);
        }
      });
    });
  });
};

export async function verifyPassword(password: string): Promise<boolean> {
  const passwordLocal = await AsyncStorageUtil.getItem(wallet_password_key);
  if (passwordLocal == password) {
    return true;
  } else {
    return false;
  }
}
