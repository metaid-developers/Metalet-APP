import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-service";

class MetaletWallet{
  
  id:string
  currentMvcWallet:MvcWallet
  currentBtcWallet:BtcWallet



  btcLegacyWallet:BtcWallet  //1  84 86 49
  btcNativeSegwitWallet:BtcWallet  
  btcNestedSegwitWallet:BtcWallet
  btcTaprootWallet:BtcWallet

  


 

  


  constructor(){
   
  }

 





}

export default MetaletWallet;