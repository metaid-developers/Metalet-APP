import {
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  NativeModules,
} from "react-native";
import React, { useEffect } from "react";
import { navigate } from "../base/NavigationService";
import { metaStyles } from "../constant/Constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomTabBar, GradientAvatar } from "../constant/Widget";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SplacePage from "./SplacePage";
import WelcomeWalletPage from "./WelcomeWalletPage";
import { NavigationContainer } from "@react-navigation/native";
import AssetsPage from "./AssetsPage";
import FtPage from "./FtPage";
import NftPage from "./NftPage";
import { get, BASE_MVC_API_URL } from "../utils/Api";
import { useData } from "../hooks/MyProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageUtil } from "../utils/AsyncStorageUtil";
import { AddressType, BtcWallet, CoinType } from "@metalet/utxo-wallet-service";

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

  // const walletId = "1111";
  // const accountId = "22222";

  // const walletManager = new WalletManager({
  //   network: 'mainnet',
  //   walletsOptions: [
  //     {
  //       id: walletId,
  //       mnemonic:
  //         'net turn first rare glide patient mask hungry damp cabbage umbrella ostrich',
  //       // name: "walletName",
  //       mvcTypes: [ 236],
  //       accountsOptions: [{addressIndex: 0, id: accountId},{addressIndex: 1, id: "33333"}],
  //     },
  //   ],
  // });

  // const data = walletManager.getWallets();
  // console.log(JSON.stringify(data));

  // walletManager.addWallet({
  //   id: walletId,
  //   mnemonic:
  //     "dream mammal settle donkey rich crew chicken sign guitar assault poem radio",
  //   // name: "walletName",
  //   mvcTypes: [10001, 236],
  //   accountsOptions: [{ addressIndex: 0, id: accountId }],
  // });

  // walletManager.addAccount(walletId, { addressIndex: 1, id: "3333" });

  // const chainWallets = walletManager.getAccountChainWallets(
  //   walletId,
  //   accountId
  // );
  // const mvcCustomWallet = chainWallets.mvc.find(
  //   (wallet) => wallet.getAddressType() === AddressType.LegacyMvcCustom
  // )!;
  // console.log("address", mvcCustomWallet.getAddress());

  // const data = walletManager.getWallets();
  // console.log(data);

  async function getMVCBalance() {
    // let data: Balance = await get(
    //   BASE_MVC_API_URL + "/address/1C2XjqoXHRegJNnmJqGDMt3rbAcrYLX4L9/balance"
    // );
    // console.log("请求结果是11： ", data.address);
    // const dataflutter = await FlutterDatabase.getDatabaseData();
    // console.log(dataflutter);
  }

  useEffect(() => {
    getMVCBalance();
    // const walletManager = new WalletManager({
    //     network: "mainnet",
    //     walletsOptions: [
    //       {
    //         id: walletId,
    //         mnemonic:
    //           "net turn first rare glide patient mask hungry damp cabbage umbrella ostrich",
    //         // name: "walletName",
    //         // mvcTypes: [10001, 236],
    //         accountsOptions: [{ addressIndex: 0, id: accountId }],
    //       },
    //       ,
    //     ],
    //   });

    initCurrentWallet();
  }, []);

  async function initCurrentWallet() {
    console.log("当前" + JSON.stringify(myWallet));
    const btcTaprootWallet = new BtcWallet({
      network: "mainnet",
      mnemonic: myWallet.mnemonic,
      addressIndex: 0,
      addressType: AddressType.Taproot,
      coinType: CoinType.BTC,
    });
    metaletWallet.btcTaprootWallet = btcTaprootWallet;

    const btcNativeSegwitWallet = new BtcWallet({
      network: "mainnet",
      mnemonic: myWallet.mnemonic,
      addressIndex: 0,
      addressType: AddressType.NativeSegwit,
      coinType: CoinType.BTC,
    });
    metaletWallet.btcNativeSegwitWallet = btcNativeSegwitWallet;

    const btcNestedSegwitWallet = new BtcWallet({
      network: "mainnet",
      mnemonic: myWallet.mnemonic,
      addressIndex: 0,
      addressType: AddressType.NestedSegwit,
      coinType: CoinType.BTC,
    });
    metaletWallet.btcNestedSegwitWallet = btcNestedSegwitWallet;

    const btcLegacyWallet = new BtcWallet({
      network: "mainnet",
      mnemonic: myWallet.mnemonic,
      addressIndex: 0,
      addressType: AddressType.Legacy,
      coinType: CoinType.BTC,
    });
    metaletWallet.btcLegacyWallet = btcLegacyWallet;

    updateMetaletWallet(metaletWallet);
  }

  const { userData, updateUserData } = useData();


  let  userAvater
  myWallet.accountsOptions.find((account)=>{
    if(account.isSelect){
      userAvater=account.defaultAvatarColor
    }
   })

  return (
    <SafeAreaView style={metaStyles.parentContainer}>
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
        <Image
          source={require("../../image/meta_btc_icon.png")}
          style={{ width: 24, height: 24 }}
        />
        <Image
          source={require("../../image/meta_last_icon.png")}
          style={{ width: 8, height: 6, marginLeft: 5 }}
        />
      </View>

      <View style={[metaStyles.varContainer, { marginHorizontal: 30 }]}>
        <View style={[metaStyles.rowContainer, { alignItems: "center" }]}>
          <GradientAvatar
            isRand={false}
            defaultAvatarColor={userAvater}
          />
          <View style={{ marginLeft: 10 }}>
            <View style={[metaStyles.rowCenterContainer, { height: 20 }]}>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigate("WalletsPage");
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={metaStyles.grayTextdefault66}>Wallet A-</Text>
                  <Text style={metaStyles.defaultText}>Account 01</Text>
                </View>
              </TouchableWithoutFeedback>

              <Image
                source={require("../../image/meta_last_icon.png")}
                style={{ width: 8, height: 6, marginLeft: 5 }}
              />
              <Image
                source={require("../../image/meta_copy_icon.png")}
                style={{ width: 14, height: 14, marginLeft: 10 }}
              />
            </View>
            <Text style={[metaStyles.bigLargeDefaultText, { marginTop: 3 }]}>
              $82,352.31
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
              updateUserData({ ...userData, name: "校长" });
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
              console.log("click");
              navigate("SetPasswordPage");
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
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
              updateAccountIndex(1);
              AsyncStorageUtil.setItem("account_select", 0);
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
            onPress={() => {
              console.log(
                "click   " + metaletWallet.btcTaprootWallet.getAddress()
              );
              console.log(
                "click   " + metaletWallet.currentBtcWallet.getAddress()
              );

              console.log(
                "click   " + metaletWallet.btcNestedSegwitWallet.getAddress()
              );
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

        <MyTabs />
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
