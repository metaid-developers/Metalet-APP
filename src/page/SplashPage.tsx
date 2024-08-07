import {
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { metaStyles, setShowPayCode } from "../constant/Constants";
import { useData } from "../hooks/MyProvider";
import {
  AsyncStorageUtil,
  account_select_key,
  wallet_mode_cold,
  wallet_mode_hot,
  wallet_password_key,
  wallets_key,
} from "../utils/AsyncStorageUtil";

import {
  AddressType,
  Chain,
  CoinType,
  Net,
} from "@metalet/utxo-wallet-service";
// import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-sdk";
import { MetaletWalletManager } from "../wallet/MetaletWalletManager";
import { TypeTest } from "../wallet/TypeTest";
import MetaletWallet from "../wallet/MetaletWallet";
import { WalletBean } from "../bean/WalletBean";
import { Buffer } from "buffer";
import { getCurrentBtcWallet, getCurrentMvcWallet } from "../wallet/wallet";
import {
  getCurrentWalletAccount,
  getStorageCurrentWallet,
  getWalletBeans,
  getWalletNetwork,
  isColdWalletMode,
  setWalletNetwork,
} from "../utils/WalletUtils";
import { goBack, navigate, reSets } from "../base/NavigationService";
import useNetworkStore from "@/stores/useNetworkStore";
import { BTC_NETWORK } from "./SettingsPage";
import { UpdateData } from "@/api/type/Update";
import { fetchCheckUpgrade } from "@/api/metaletservice";

export default function SplashPage(props) {
  const { myWallet, updateMyWallet } = useData();
  const { walletManager, updateWalletManager } = useData();
  const { metaletWallet, updateMetaletWallet } = useData();
  const { network, switchNetwork } = useNetworkStore();
  const { walletMode, updateWalletMode } = useData();
  const { isShowPay, updateIsShowPay } = useData();
  const platformNow = Platform.OS;

  useEffect(() => {
    try {
      checkUpgrade();
      initDataBase();
    } catch (e) {
      console.log("initDataBase error", e);
    }
  }, []);

  async function initDataBase() {
    const network = await getWalletNetwork();
    if (network) {
      switchNetwork(network as Net);
    } else {
      await setWalletNetwork(BTC_NETWORK);
      switchNetwork(BTC_NETWORK);
    }

    const walletBean = await getStorageCurrentWallet();
    const account = await getCurrentWalletAccount();
    // console.log("walletBean", walletBean);
    // console.log("account", account);

    if (walletBean && account) {
      updateMyWallet(walletBean);
      const isCold = await isColdWalletMode();

      if (!isCold) {
        const btcWallet = await getCurrentBtcWallet();
        const mvcWallet = await getCurrentMvcWallet();
        let metaletWallet = new MetaletWallet();
        metaletWallet.currentBtcWallet = btcWallet;
        metaletWallet.currentMvcWallet = mvcWallet;
        updateMetaletWallet(metaletWallet);
        updateWalletMode(wallet_mode_hot);
      } else {
        updateWalletMode(wallet_mode_cold);
      }

      // props.navigation.navigate("Tabs");
      // reSets()
      // navigate("Tabs",{destory:true});
      reSets("Tabs");
    } else {
      props.navigation.navigate("WelcomeWalletPage");
    }

    const password = await AsyncStorageUtil.getItem(wallet_password_key);
    if (password && password == "199333") {
      setShowPayCode(0);
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

  async function checkUpgrade() {
    if (platformNow === "android") {
      const check: UpdateData = await fetchCheckUpgrade("android");
      // console.log(JSON.stringify(check));
      const showCode = check.data.android;
      updateIsShowPay(showCode);
    } else {
      const check: UpdateData = await fetchCheckUpgrade("ios");
      // console.log(JSON.stringify(check));
      const codeVersion = check.data.ios;
      const showCode = check.data.android;
      updateIsShowPay(showCode);
    }
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
