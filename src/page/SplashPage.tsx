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

import { AddressType, Chain, CoinType } from "@metalet/utxo-wallet-service";
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
import useWalletManager from "@/hooks/useWalletManager";
import { goBack, navigate, reSets } from "../base/NavigationService";

export default function SplashPage(props) {
  const { myWallet, updateMyWallet } = useData();
  const { walletManager, updateWalletManager } = useData();
  const { metaletWallet, updateMetaletWallet } = useData();

  useEffect(() => {
    initDataBase();
  }, []);

  async function initDataBase() {
    const walletBean = await getStorageCurrentWallet();
    const account = await getCurrentWalletAccount();
    // console.log("walletBean", walletBean);
    // console.log("account", account);

    if (walletBean && account) {
      updateMyWallet(walletBean);
      const btcWallet = await getCurrentBtcWallet();
      const mvcWallet = await getCurrentMvcWallet();
      let metaletWallet = new MetaletWallet();
      metaletWallet.currentBtcWallet = btcWallet;
      metaletWallet.currentMvcWallet = mvcWallet;
      updateMetaletWallet(metaletWallet);
      // props.navigation.navigate("Tabs");
      // reSets()
      // navigate("Tabs",{destory:true});
      reSets("Tabs");
    } else {
      props.navigation.navigate("WelcomeWalletPage");
    }
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
