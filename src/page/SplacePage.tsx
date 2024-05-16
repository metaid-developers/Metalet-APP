import { View, Text, Image, TextInput, ImageBackground, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { metaStyles } from "../constant/Constants";
import { useData } from "../hooks/MyProvider";
import {
  AsyncStorageUtil,
  account_select_key,
  wallets_key,
} from "../utils/AsyncStorageUtil";

import {
  BtcWallet,
  AddressType,
  CoinType,
  MvcWallet,
} from "@metalet/utxo-wallet-service";

import { MetaletWalletManager } from "../wallet/MetaletWalletManager";
import { TypeTest } from "../wallet/TypeTest";
import MetaletWallet from "../wallet/MetaletWallet";
import { WalletBean } from "../bean/WalletBean";


export default function SplacePage(props) {
  const { myWallet, updateMyWallet } = useData();
  const { walletManager, updateWalletManager } = useData();
  const { accountIndex, updateAccountIndex } = useData();
  const {width,height} =Dimensions.get('window');


  //钱包
  const { metaletWallet, updateMetaletWallet } = useData();

  useEffect(() => {
    initDataBase();
  }, []);

  async function initDataBase() {
    await AsyncStorageUtil.getItem(account_select_key).then((value) => {
      if (value == null) {
        AsyncStorageUtil.setItem(account_select_key, 0);
        updateAccountIndex(0);
      } else {
        updateAccountIndex(value);
      }
    });

    AsyncStorageUtil.getItem(wallets_key).then((value) => {
      if (value != null&&value.length>0) {
        // console.log("value", value);
        for (let i = 0; i < value.length; i++) {
          let wallet : WalletBean = value[i];
          for (let q = 0; q < wallet.accountsOptions.length; q++) {
            let account = wallet.accountsOptions[q];
            // console.log("account", account);
            if (account.isSelect == true) {
              updateMyWallet(wallet);
              // console.log("初始化头像是："+wallet.);

              // const myWalletManager = new MetaletWalletManager({
              //   network: "mainnet",
              //   walletsOptions: [
              //     {
              //       id: wallet.id,
              //       mnemonic: wallet.mnemonic,
              //       name: wallet.name,
              //       mvcTypes: [wallet.mvcTypes],
              //       accountsOptions: wallet.accountsOptions,
              //     },
              //   ],
              // });
              // updateWalletManager(myWalletManager);

              const btcWallet = new BtcWallet({
                network: "mainnet",
                mnemonic: wallet.mnemonic,
                addressIndex: account.addressIndex,
                addressType: wallet.addressTpye,
                //选中跟mvc 路径一致
                coinType: wallet.mvcTypes,
              });
              // console.log(btcWallet.getAddress());
              console.log(
                "对应的BTC 地址 ：" + btcWallet.getAddress(),
                btcWallet.getPath()
              );
              // const btcWallet1 = new BtcWallet({
              //   network: "mainnet",
              //   mnemonic: wallet.mnemonic,
              //   addressIndex: 0,
              //   addressType: AddressType.NativeSegwit,
              //   coinType: CoinType.BTC,
              // });
              // console.log(btcWallet1.getAddress());
              // const btcWallet2 = new BtcWallet({
              //   network: "mainnet",
              //   mnemonic: wallet.mnemonic,
              //   addressIndex: 0,
              //   addressType: AddressType.NestedSegwit,
              //   coinType: CoinType.BTC,
              // });
              // console.log(btcWallet2.getAddress());
              // const btcWallet3 = new BtcWallet({
              //   network: "mainnet",
              //   mnemonic: wallet.mnemonic,
              //   addressIndex: 0,
              //   addressType: AddressType.Taproot,
              //   coinType: CoinType.BTC,
              // });
              // console.log(btcWallet3.getAddress());

              // const btcWallet4 = new BtcWallet({
              //   network: "mainnet",
              //   mnemonic: wallet.mnemonic,
              //   addressIndex: 0,
              //   addressType: AddressType.SameAsMvc,
              //   coinType: CoinType.MVC,
              // });
              // console.log(btcWallet4.getAddress());

              const mvcWallet = new MvcWallet({
                network: "mainnet",
                mnemonic: wallet.mnemonic,
                addressIndex: account.addressIndex,
                addressType: AddressType.LegacyMvc,
                coinType: wallet.mvcTypes,
              });
            
              // mvcWallet.send({

              //   toAddress: "MvC1LJK2K3yJJYQVzQKZ3vZgV1vKJZgKV",
              //   amount: 0.0001,
              //   feeRate: 1,
              // });

              let metaletWallet = new MetaletWallet();
              metaletWallet.currentBtcWallet = btcWallet;
              metaletWallet.currentMvcWallet = mvcWallet;

              updateMetaletWallet(metaletWallet);

              props.navigation.navigate("Tabs");
            }
          }
        }
      } else {
        props.navigation.navigate("WelcomeWalletPage");
      }
    });
  }

  function goToHome() {
    setTimeout(() => {
      // props.navigation.navigate("SetPasswordPage");
      if (myWallet == null) {
        props.navigation.navigate("WelcomeWalletPage");
      } else {
        console.log("myWallet 当前的选中钱包：", myWallet);
        props.navigation.navigate("Tabs");
      }
    }, 200);
  }

  return (
    // <ImageBackground source={require("../../assets/splash.png")}>

    // <View style={{ flex: 1 }} />
    // </ImageBackground>
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../../assets/splash.png")}
        style={{width:'100%',height:'100%'}}

      />
      {/* <Text
        style={[{ marginTop: 10 }, { fontWeight: "bold" }, { fontSize: 22 }]}
      >
        METALET
      </Text> */}
    </View>
  );
}
