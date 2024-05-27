import {
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import { metaStyles } from "../constant/Constants";
import { useData } from "../hooks/MyProvider";
import {
  account_select_key,
  wallet_password_key,
  wallets_key,
} from "../utils/AsyncStorageUtil";

import { AddressType, CoinType } from "@metalet/utxo-wallet-service";
import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-sdk";
import { MetaletWalletManager } from "../wallet/MetaletWalletManager";
import { TypeTest } from "../wallet/TypeTest";
import MetaletWallet from "../wallet/MetaletWallet";
import { WalletBean } from "../bean/WalletBean";
import { Buffer } from "buffer";
import {
  btc_network,
  getCurrentBtcWallet,
  getCurrentMvcWallet,
} from "../wallet/wallet";
import {
  getCurrentWalletAccount,
  getStorageCurrentWallet,
  getWalletBeans,
} from "../utils/WalletUtils";
import { test } from "@/lib/test";
import { getAccount } from "@/lib/account";

export default function SplashPage(props) {
  const { myWallet, updateMyWallet } = useData();
  const { walletManager, updateWalletManager } = useData();
  const { metaletWallet, updateMetaletWallet } = useData();

  test();
  getAccount();

  useEffect(() => {
    initDataBase();
  }, []);

  async function initDataBase() {
    const walletBean = await getStorageCurrentWallet();
    const account = await getCurrentWalletAccount();
    console.log("walletBean", walletBean);
    console.log("account", account);

    if (walletBean && account) {
      updateMyWallet(walletBean);
      const btcWallet = await getCurrentBtcWallet();
      const mvcWallet = await getCurrentMvcWallet();
      let metaletWallet = new MetaletWallet();
      metaletWallet.currentBtcWallet = btcWallet;
      metaletWallet.currentMvcWallet = mvcWallet;
      updateMetaletWallet(metaletWallet);
      props.navigation.navigate("Tabs");
    } else {
      props.navigation.navigate("WelcomeWalletPage");
    }

    // AsyncStorageUtil.getItem(wallets_key).then(async (value) => {
    //   if (value != null && value.length > 0) {
    //     // console.log("value", value);
    //     for (let i = 0; i < value.length; i++) {
    //       let wallet: WalletBean = value[i];
    //       for (let q = 0; q < wallet.accountsOptions.length; q++) {
    //         let account = wallet.accountsOptions[q];
    //         // console.log("account", account);
    //         if (account.isSelect == true) {
    //           updateMyWallet(wallet);

    //           let seed = await AsyncStorageUtil.getItem(walllet_seed_key);
    //           if (!seed) {
    //             seed = undefined;
    //           }else{
    //             seed = Buffer.from(seed, "hex");
    //           }

    //           const btcWallet = new BtcWallet({
    //             network: btc_network,
    //             mnemonic: wallet.mnemonic,
    //             addressIndex: account.addressIndex,
    //             addressType: wallet.addressTpye,
    //             //选中跟mvc 路径一致
    //             coinType: wallet.mvcTypes,
    //             seed,
    //           });

    //           if (!seed) {
    //             seed = btcWallet.getSeed();
    //             const saveSeed=seed.toString("hex")
    //             console.log("saveSeed",saveSeed);
    //             await AsyncStorageUtil.setItem(walllet_seed_key, saveSeed);
    //           }

    //           // console.log(btcWallet.getAddress());
    //           console.log(
    //             "对应的BTC 地址 ：" + btcWallet.getAddress(),
    //             btcWallet.getPath()
    //           );

    //           const mvcWallet = new MvcWallet({
    //             network: "mainnet",
    //             mnemonic: wallet.mnemonic,
    //             addressIndex: account.addressIndex,
    //             addressType: AddressType.LegacyMvc,
    //             coinType: wallet.mvcTypes,
    //             seed: seed,
    //           });

    //           let metaletWallet = new MetaletWallet();
    //           metaletWallet.currentBtcWallet = btcWallet;
    //           metaletWallet.currentMvcWallet = mvcWallet;
    //           updateMetaletWallet(metaletWallet);

    //           props.navigation.navigate("Tabs");
    //         }
    //       }
    //     }
    //   } else {
    //     props.navigation.navigate("WelcomeWalletPage");
    //   }
    // });
  }

  function goToHome() {
    setTimeout(() => {
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
        style={{ width: "100%", height: "100%" }}
      />
      {/* <Text
        style={[{ marginTop: 10 }, { fontWeight: "bold" }, { fontSize: 22 }]}
      >
        METALET
      </Text> */}
    </View>
  );
}
