import {
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  NativeModules,
  Modal,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { navigate } from "../base/NavigationService";
import { metaStyles } from "../constant/Constants";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomTabBar,
  GradientAvatar,
  LoadingModal,
  LoadingNoticeModal,
} from "../constant/Widget";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import WelcomeWalletPage from "./WelcomeWalletPage";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import AssetsPage from "./AssetsPage";
import FtPage from "./FtPage";
import NftPage from "./NftPage";
import {
  get,
  BASE_MVC_API_URL,
  BALANCE_PRICE_URL,
  BASE_METALET_URL,
} from "../utils/Api";
import { useData } from "../hooks/MyProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  
  network_all,
  network_btc,
  network_key,
  network_mvc,
  wallets_key,
  createStorage,
} from "../utils/AsyncStorageUtil";
import { AddressType, CoinType } from "@metalet/utxo-wallet-service";
import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-sdk";
import { RootPriceObject } from "../bean/PriceBean";
import { RootBtcBalanceObject } from "../bean/BtcBalanceBean";
import * as Clipboard from "expo-clipboard";
import { WalletBean } from "../bean/WalletBean";
import {
  EventBus,
  eventBus,
  refreshBtcFtEvent,
  refreshHomeLoadingEvent,
  refreshMvcFtEvent,
} from "../utils/EventBus";
import FtParentPage from "./nft/FtParentPage";
import FtMvcPage from "./nft/FtMvcPage";
import FtBtcPage from "./nft/FtBtcPage";
import NftParentPage from "./nft/NftParentPage";
import NftBtcPage from "./nft/NftBtcPage";
import NftMvcPage from "./nft/NftMvcPage";
import {
  fetchAssetsPrice,
  fetchBtcActivityRecord,
  fetchBtcBalance,
  fetchMvcActivityComfird,
} from "../api/metaletservice";
import {
  btc_network,
  getCurrentBtcWallet,
  getCurrentMvcWallet,
  net_network,
} from "../wallet/wallet";
import { Buffer } from "buffer";
import { getCurrentWalletSeed, getStorageWallets } from "../utils/WalletUtils";

const storage = createStorage();

// import RNFS from "react-native-fs";

// Home 开发
const TabsTop = createMaterialTopTabNavigator();

type Balance = {
  // {"address": "1C2XjqoXHRegJNnmJqGDMt3rbAcrYLX4L9", "confirmed": 17190, "unconfirmed": 0}
  address: string;
  confirmed: number;
  unconfirmed: number;
};

export default function HomePage(props: any) {
  const { accountIndex, updateAccountIndex } = useData();

  const { metaletWallet, updateMetaletWallet } = useData();
  const { myWallet, updateMyWallet } = useData();
  // const [sumBalance, setSumBalance] = useState<string>("0.0");
  const { currentSumBalance, updateCurrentSumBalance } = useData();

  //提示
  const [isShowNotice, setIsShowNotice] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [noticeContent, setNoticeContent] = useState("Successful");

  //复制地址
  const [isShowCopy, setIsShowCopy] = useState(false);
  const [legacyAddress, setLegacyAddress] = useState<string>();
  const [taprootAddress, setTaprootAddress] = useState<string>();
  const [nestedSegwitAddress, setNestedSegwitAddress] = useState<string>();
  const [nativeSegwitAddress, setNativeSegwitAddress] = useState<string>();
  const [sameBtcAsMvcAddress, setSameBtcAsMvcAddress] = useState<string>();

  // const [mvcAddress, setMvcAddress] = useState<string>();

  // 当前网络
  const { netWork, updateNetWork } = useData();
  //当前网络地址
  const { mvcAddress, updateMvcAddress } = useData();
  const { btcAddress, updateBtcAddress } = useData();

  const getMVCBalance = async () => {
    // console.log("请求结果是11： ", data.address);
    // const dataflutter = await FlutterDatabase.getDatabaseData();
    // console.log(dataflutter);
    // let data: RootPriceObject = await get(BALANCE_PRICE_URL);
    // metaletWallet.currentBtcPrice = data.data.priceInfo.btc;
    // metaletWallet.currentMVCPrice = data.data.priceInfo.space;

    const assertPrice = await fetchAssetsPrice();
    metaletWallet.currentBtcPrice = assertPrice.data.priceInfo.btc;
    metaletWallet.currentMVCPrice = assertPrice.data.priceInfo.space;

    // console.log("请求结果是11： ", data);

    let dataMvcBalance: Balance = await get(
      BASE_MVC_API_URL +
        "/address/" +
        metaletWallet.currentMvcWallet.getAddress() +
        "/balance"
    );

    metaletWallet.currentMvcBalance = dataMvcBalance.confirmed;
    // console.log("mvc余额 ", dataMvcBalance);

    console.log("请求结果是： ", btcAddress);

    let dataBtcBalance: RootBtcBalanceObject =
      await fetchBtcBalance(btcAddress);
    console.log("btc余额 ", dataBtcBalance);

    metaletWallet.currentBtcBalance = dataBtcBalance.data.balance;

    metaletWallet.currentSumBalance =
      (metaletWallet.currentMvcBalance * metaletWallet.currentMVCPrice) /
        100000000 +
      metaletWallet.currentBtcBalance * metaletWallet.currentBtcPrice;
    // console.log("当前btc", metaletWallet.currentBtcBalance);
    // console.log("当前btc价格", metaletWallet.currentBtcPrice);
    // console.log("当前mvc", metaletWallet.currentMvcBalance);
    // console.log("当前mvc价格", metaletWallet.currentMVCPrice);
    // console.log("当前mvc+btc", metaletWallet.currentSumBalance.toFixed(2));
    updateCurrentSumBalance(metaletWallet.currentSumBalance.toFixed(2));
    updateMetaletWallet(metaletWallet);
  };

  useEffect(() => {
    console.log("HomePage useEffect");

    initCurrentWallet();

    eventBus.subscribe(refreshHomeLoadingEvent, (message) => {
      initCurrentWallet();
      setIsShowLoading(true);
      console.log("in eventBus");
      setTimeout(() => {
        setIsShowLoading(false);
      }, 1000);
    });
  }, []);

  useEffect(() => {
    console.log("HomePage useEffect  btc 地址变化");

    getMVCBalance();

    setIsShowLoading(true);
    setTimeout(() => {
      setIsShowLoading(false);
    }, 1000);
  }, [btcAddress]);

  // useFocusEffect(
  //   useCallback(() => {
  //     // initCurrentWallet();
  //     // console.log("HomePage useFocusEffect");
  //     // eventBus.publish(refreshMvcFtEvent, {
  //     //   data: metaletWallet.currentMvcWallet.getAddress(),
  //     // });
  //     // changeNetwork();

  //     eventBus.publish(refreshMvcFtEvent, {
  //       data: metaletWallet.currentMvcWallet.getAddress(),
  //     });
  //     eventBus.publish(refreshBtcFtEvent, {
  //       data: metaletWallet.currentBtcWallet.getAddress(),
  //     });

  //   }, [])
  // );

  function ShowNotice(notice) {
    setIsShowCopy(false);
    Clipboard.setString(notice);
    setNoticeContent("Copy Successful");
    setIsShowNotice(true);
    setTimeout(() => {
      setIsShowNotice(false);
    }, 800);
  }

  let userAvater;
  let accountName;
  //初始化所有钱包
  async function initCurrentWallet() {
    let wallets = await getStorageWallets();
    // let wallets = await AsyncStorageUtil.getItem(wallets_key);
    for (let i = 0; i < wallets.length; i++) {
      let wallet: WalletBean = wallets[i];
      for (let q = 0; q < wallet.accountsOptions.length; q++) {
        let account = wallet.accountsOptions[q];
        if (account.isSelect == true) {
          myWallet!.accountsOptions!.find((account) => {
            if (account.isSelect) {
              userAvater = account.defaultAvatarColor;
            }
          });

          myWallet!.accountsOptions!.forEach((element) => {
            if (element.isSelect) {
              accountName = element.name;
            }
          });

          updateMyWallet(wallet);
          let seed = await getCurrentWalletSeed();

          const btcTaprootWallet = new BtcWallet({
            network: btc_network,
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.Taproot,
            coinType: CoinType.BTC,
            seed,
          });

          // const seed = btcTaprootWallet.getSeed();

          metaletWallet.btcTaprootWallet = btcTaprootWallet;
          setTaprootAddress(btcTaprootWallet.getAddress());

          const btcNativeSegwitWallet = new BtcWallet({
            network: btc_network,
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.NativeSegwit,
            coinType: CoinType.BTC,
            seed,
          });
          metaletWallet.btcNativeSegwitWallet = btcNativeSegwitWallet;
          setNativeSegwitAddress(btcNativeSegwitWallet.getAddress());

          const btcNestedSegwitWallet = new BtcWallet({
            network: btc_network,
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.NestedSegwit,
            coinType: CoinType.BTC,
            seed,
          });
          metaletWallet.btcNestedSegwitWallet = btcNestedSegwitWallet;
          setNestedSegwitAddress(btcNestedSegwitWallet.getAddress());

          const btcLegacyWallet = new BtcWallet({
            network: btc_network,
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.Legacy,
            coinType: CoinType.BTC,
            seed,
          });
          metaletWallet.btcLegacyWallet = btcLegacyWallet;
          setLegacyAddress(btcLegacyWallet.getAddress());

          const btcSameAsLegacyWallet = new BtcWallet({
            network: btc_network,
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.LegacyMvc,
            coinType: wallet.mvcTypes,
            seed,
          });

          metaletWallet.btcSameAsWallet = btcSameAsLegacyWallet;
          setSameBtcAsMvcAddress(btcSameAsLegacyWallet.getAddress());
          // console.log(
          //   "切换后的btc地址btSameAsLegacyWallet  ",
          //   btcSameAsLegacyWallet.getAddress()
          // );

          const mvcWallet = new MvcWallet({
            network: "mainnet",
            mnemonic: wallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: AddressType.LegacyMvc,
            coinType: wallet.mvcTypes,
            seed,
          });

          const nowBtcWallet = new BtcWallet({
            network: btc_network,
            mnemonic: myWallet.mnemonic,
            addressIndex: account.addressIndex,
            addressType: wallet.addressTpye,
            coinType:
              wallet.addressTpye == AddressType.SameAsMvc
                ? wallet.mvcTypes
                : CoinType.BTC,
            seed,
          });
          updateMvcAddress(mvcWallet.getAddress());
          updateBtcAddress(nowBtcWallet.getAddress());
          console.log(wallet.addressTpye);

          console.log("updateBtcAddress" + nowBtcWallet.getAddress());

          metaletWallet.currentBtcWallet = nowBtcWallet;
          metaletWallet.currentMvcWallet = mvcWallet;
          updateMetaletWallet(metaletWallet);

          getMVCBalance();

          // myTestMvc= mvcWallet.getAddress();

          // //通知更新
          // eventBus.publish(refreshMvcFtEvent, {
          //   data: metaletWallet.currentMvcWallet.getAddress(),
          // });
          // eventBus.publish(refreshBtcFtEvent, {
          //   data: metaletWallet.currentBtcWallet.getAddress(),
          // });
        }
      }
    }

    await storage.get(network_key).then(async (saveNet) => {
      // await AsyncStorageUtil.getItem(network_key).then(async (saveNet) => {
      if (saveNet == null) {
        console.log("saveNet is null" + saveNet);
        await storage.set(network_key, network_all);
        // await AsyncStorageUtil.setItem(network_key, network_all);
        updateNetWork(network_all);
      } else {
        console.log(saveNet);

        updateNetWork(saveNet);
      }
    });
  }

  const { userData, updateUserData } = useData();

  return (
    <SafeAreaView style={metaStyles.parentContainer}>
      <LoadingModal
        isShow={isShowLoading}
        isCancel={true}
        event={() => {
          setIsShowLoading(false);
        }}
      />
      <LoadingNoticeModal title={noticeContent} isShow={isShowNotice} />

      {/* 底部地址 */}
      <Modal transparent={true} visible={isShowCopy}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,

              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
              paddingBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                Select Wallet Address
              </Text>

              <TouchableWithoutFeedback
                onPress={() => {
                  setIsShowCopy(false);
                }}
              >
                <Image
                  source={require("../../image/metalet_close_big_icon.png")}
                  style={{ width: 15, height: 15 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* btc Legacy */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../image/logo_btc.png")}
                style={{ width: 35, height: 35, marginLeft: 20 }}
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Bitcoin
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 5,
                      backgroundColor: "#F5F7F9",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      Legacy
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginTop: 5, fontSize: 10, color: "#666" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {legacyAddress}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  ShowNotice(legacyAddress);
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* btc nested segwit */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../image/logo_btc.png")}
                style={{ width: 35, height: 35, marginLeft: 20 }}
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Bitcoin
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 5,
                      backgroundColor: "#F5F7F9",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      Nested SegWit
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginTop: 5, fontSize: 10, color: "#666" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {nestedSegwitAddress}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  ShowNotice(nestedSegwitAddress);
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* native segwit */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../image/logo_btc.png")}
                style={{ width: 35, height: 35, marginLeft: 20 }}
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Bitcoin
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 5,
                      backgroundColor: "#F5F7F9",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      Native SegWit
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginTop: 5, fontSize: 10, color: "#666" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {nativeSegwitAddress}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  ShowNotice(nativeSegwitAddress);
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>
            {/* taproot */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../image/logo_btc.png")}
                style={{ width: 35, height: 35, marginLeft: 20 }}
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Bitcoin
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 5,
                      backgroundColor: "#F5F7F9",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      Taproot
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginTop: 5, fontSize: 10, color: "#666" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {taprootAddress}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  if (
                    metaletWallet.btcTaprootWallet &&
                    metaletWallet.btcTaprootWallet.getAddress()
                  ) {
                    ShowNotice(taprootAddress);
                  }
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* sameAsMvc */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../image/logo_btc.png")}
                style={{ width: 35, height: 35, marginLeft: 20 }}
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Bitcoin
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 5,
                      backgroundColor: "#F5F7F9",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      Same as MVC
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginTop: 5, fontSize: 10, color: "#666" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {sameBtcAsMvcAddress}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  ShowNotice(sameBtcAsMvcAddress);
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* mvc */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../image/logo_space.png")}
                style={{ width: 35, height: 35, marginLeft: 20 }}
              />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>MVC</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 5,
                      backgroundColor: "#F5F7F9",
                      paddingHorizontal: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#666",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      MVC
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ marginTop: 5, fontSize: 10, color: "#666" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {mvcAddress}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  ShowNotice(mvcAddress);
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* over */}
          </View>
        </View>
      </Modal>

      {/* 中部 */}
      <View
        style={[
          metaStyles.rowMarginContainer,
          { height: 45, alignItems: "center" },
        ]}
      >
        {/* <Image source={require('../assets/images/logo.png')} style={metaStyles.logo}/> */}
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 44, height: 44 }}
        />
        <View style={{ flex: 1 }} />
        {netWork == null ||
          (netWork == network_all && (
            <TouchableWithoutFeedback
              onPress={() => {
                navigate("NetWorkPage");
              }}
            >
              <Image
                source={require("../../image/metalet_network_all_icon.png")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableWithoutFeedback>
          ))}

        {netWork == network_btc && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigate("NetWorkPage");
            }}
          >
            <Image
              source={require("../../image/meta_btc_icon.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableWithoutFeedback>
        )}

        {netWork == network_mvc && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigate("NetWorkPage");
            }}
          >
            <Image
              source={require("../../image/logo_space.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableWithoutFeedback>
        )}
        <Image
          source={require("../../image/meta_last_icon.png")}
          style={{ width: 8, height: 6, marginLeft: 5 }}
        />
      </View>

      <View style={[metaStyles.varContainer, { marginHorizontal: 30 }]}>
        <View style={[metaStyles.rowContainer, { alignItems: "center" }]}>
          <GradientAvatar isRand={false} defaultAvatarColor={userAvater} />
          <View style={{ marginLeft: 10 }}>
            <View style={[metaStyles.rowCenterContainer, { height: 20 }]}>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigate("WalletsPage");
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={metaStyles.grayTextdefault66}>
                    {myWallet.name}-
                  </Text>
                  <Text style={metaStyles.defaultText}>{accountName}</Text>
                </View>
              </TouchableWithoutFeedback>

              <Image
                source={require("../../image/meta_last_icon.png")}
                style={{ width: 8, height: 6, marginLeft: 5 }}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  if (metaletWallet.currentMvcWallet != null)
                    setIsShowCopy(true);
                }}
              >
                <Image
                  source={require("../../image/meta_copy_icon.png")}
                  style={{ width: 14, height: 14, marginLeft: 10 }}
                />
              </TouchableWithoutFeedback>
            </View>
            <Text style={[metaStyles.bigLargeDefaultText, { marginTop: 3 }]}>
              {"$ " + currentSumBalance}
            </Text>
          </View>
        </View>

        <View
          style={[
            metaStyles.rowContainer,
            { justifyContent: "space-between", marginTop: 10 },
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              // updateUserData({ ...userData, name: "校长" });
              //  AsyncStorage.removeItem(network_key);
              // console.log(metaletWallet.btcLegacyWallet.getAddress());
              // navigate("SendSelectAssertPage");
              navigate("PasswordPage");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_send_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Send
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              navigate("SelectReceivePage");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_receive_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Receive
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {/* 
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
              AsyncStorageUtil.clear();
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_record_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Record
              </Text>
            </View>
          </TouchableWithoutFeedback> */}

          <TouchableWithoutFeedback
            onPress={() => {
              // updateAccountIndex(1);
              // AsyncStorageUtil.setItem("account_select", 0);
              navigate("WebsPage");
              // navigate("WebPageTest");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_swap_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Swap
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={async () => {
              // getCurrentMvcWallet().then((wallet) => {
              //   console.log(" 获取的封装mvc 地址是： "+wallet.getAddress());
              // });
              // getCurrentBtcWallet().then((wallet) => {
              //   console.log(" 获取的封装btc 地址是： "+wallet.getAddress());
              //   console.log(" 获取的封装btc 地址是： "+wallet.getPath());
              // });

              // fetchBtcActivityRecord("bc1qxwul4ktslh9zumv8nvp2seyukz0jcmdxzq8kx6").then((res) => {

              //   console.log(" 获取的封装btc 地址是： "+res);

              // });

              // navigate("WebPageTest");
              // navigate("WebPage");

              AsyncStorageUtil.clear();
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_bridge_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Bridge
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* <MyTabs /> */}
        {/* {[network_all].includes(netWork) && <MyTabs01 />}
        {[, network_btc].includes(netWork) && <MyTabs02 />}
        {[, network_mvc].includes(netWork) && <MyTabs03 />} */}

        {netWork == network_all && <MyTabs01 />}

        {netWork == network_btc && <MyTabs02 />}

        {netWork == network_mvc && <MyTabs03 />}
      </View>
    </SafeAreaView>
  );
}

function MyTabs() {
  return (
    <TabsTop.Navigator
      tabBarPosition="top"
      tabBar={(props) => <CustomTabBar {...props} />}
      style={{ flex: 1, marginBottom: 20, marginTop: 10 }}
      screenOptions={{
        tabBarScrollEnabled: true,
        swipeEnabled: false,
      }}

      // screenOptions={{
      //   tabBarLabelStyle:{fontSize:15,fontWeight:'bold',textTransform: 'none',},
      //   tabBarInactiveTintColor:'#666666',
      //   tabBarActiveTintColor:'#000000',
      //   tabBarStyle:{backgroundColor:'#fff',height:50,elevation: 0 },
      //   tabBarIndicatorStyle:{backgroundColor:'#1F2CFF',height:3,width:20,marginLeft:40},
      //   tabBarItemStyle:{height:50,width:100,},//每个item 宽度
      // }}
      // style={{ flex: 1, marginBottom: 20,marginTop: 10 }}
    >
      <TabsTop.Screen
        name="Assets"
        options={{ title: "Assets" }}
        component={AssetsPage}
      />
      <TabsTop.Screen name="FT" options={{ title: "FTs" }} component={FtPage} />
      <TabsTop.Screen
        name="NFT"
        options={{ title: "NFTs" }}
        component={NftPage}
      />
    </TabsTop.Navigator>
  );
}

function MyTabs01() {
  return (
    <TabsTop.Navigator
      tabBarPosition="top"
      tabBar={(props) => <CustomTabBar {...props} />}
      style={{ flex: 1, marginBottom: 20, marginTop: 20 }}
    >
      <TabsTop.Screen
        name="Assets"
        options={{ title: "Assets" }}
        component={AssetsPage}
      />

      <TabsTop.Screen
        name="FT1"
        options={{ title: "FTs" }}
        component={FtParentPage}
      />
      <TabsTop.Screen
        name="NFT1"
        options={{ title: "NFTs" }}
        component={NftParentPage}
      />
    </TabsTop.Navigator>
  );
}

function MyTabs02() {
  return (
    <TabsTop.Navigator
      tabBarPosition="top"
      tabBar={(props) => <CustomTabBar {...props} />}
      style={{ flex: 1, marginBottom: 20, marginTop: 20 }}
    >
      <TabsTop.Screen
        name="Assets"
        options={{ title: "Assets" }}
        component={AssetsPage}
      />

      <TabsTop.Screen
        name="FT2"
        options={{ title: "FTs" }}
        component={FtBtcPage}
      />
      <TabsTop.Screen
        name="NFT2"
        options={{ title: "NFTs" }}
        component={NftBtcPage}
      />
    </TabsTop.Navigator>
  );
}

function MyTabs03() {
  return (
    <TabsTop.Navigator
      tabBarPosition="top"
      tabBar={(props) => <CustomTabBar {...props} />}
      style={{ flex: 1, marginBottom: 20, marginTop: 20 }}
    >
      <TabsTop.Screen
        name="Assets3"
        options={{ title: "Assets" }}
        component={AssetsPage}
      />

      <TabsTop.Screen
        name="FT3"
        options={{ title: "FTs" }}
        component={FtMvcPage}
      />
      <TabsTop.Screen
        name="NFT3"
        options={{ title: "NFTs" }}
        component={NftMvcPage}
      />
    </TabsTop.Navigator>
  );
}
