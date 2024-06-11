import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-service";

class MetaletWallet {
  //当前钱包部分
  id: string;
  currentMvcWallet: MvcWallet;
  currentBtcWallet: BtcWallet;

  //支持钱包
  btcLegacyWallet: BtcWallet; //1  84 86 49
  btcNativeSegwitWallet: BtcWallet;
  btcNestedSegwitWallet: BtcWallet;
  btcTaprootWallet: BtcWallet;
  btcSameAsWallet: BtcWallet;

  //当前钱包余额
  currentSumAssert: string;
  currentMvcBalance: string;
  currentBtcBalance: string;
  currentSpaceAssert: string;
  currentBtcAssert: string;

  currentMVCPrice: number;
  currentBtcPrice: number;
}

export default MetaletWallet;
