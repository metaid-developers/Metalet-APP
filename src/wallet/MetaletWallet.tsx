import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-service";

class MetaletWallet{
  
  //当前钱包部分
  id:string
  currentMvcWallet:MvcWallet
  currentBtcWallet:BtcWallet



  //支持钱包
  btcLegacyWallet:BtcWallet  //1  84 86 49
  btcNativeSegwitWallet:BtcWallet  
  btcNestedSegwitWallet:BtcWallet
  btcTaprootWallet:BtcWallet
  btcSameAsWallet:BtcWallet

  
  //当前钱包余额
  currentSumBalance:number
  currentMvcBalance:number
  currentBtcBalance:number
  currentMVCPrice:number
  currentBtcPrice:number



 

  






}

export default MetaletWallet;