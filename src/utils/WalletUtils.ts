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

          const mvcWallet = new MvcWallet({
            network: "mainnet",
            mnemonic: wallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.LegacyMvc,
            coinType: wallet.mvcTypes,
          });

          let metaletWallet = new MetaletWallet();
          metaletWallet.currentBtcWallet = btcWallet;
          metaletWallet.currentMvcWallet = mvcWallet;

          updateMetaletWallet(metaletWallet);

          const btcTaprootWallet = new BtcWallet({
            network: "mainnet",
            mnemonic: wallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.Taproot,
            coinType: CoinType.BTC,
          });
          metaletWallet.btcTaprootWallet = btcTaprootWallet;
          //   setTaprootAddress(btcTaprootWallet.getAddress());

          const btcNativeSegwitWallet = new BtcWallet({
            network: "mainnet",
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.NativeSegwit,
            coinType: CoinType.BTC,
          });
          metaletWallet.btcNativeSegwitWallet = btcNativeSegwitWallet;
          //   setNativeSegwitAddress(btcNativeSegwitWallet.getAddress());

          const btcNestedSegwitWallet = new BtcWallet({
            network: "mainnet",
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.NestedSegwit,
            coinType: CoinType.BTC,
          });
          metaletWallet.btcNestedSegwitWallet = btcNestedSegwitWallet;
          //   setNestedSegwitAddress(btcNestedSegwitWallet.getAddress());

          const btcLegacyWallet = new BtcWallet({
            network: "mainnet",
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.Legacy,
            coinType: CoinType.BTC,
          });
          metaletWallet.btcLegacyWallet = btcLegacyWallet;
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
