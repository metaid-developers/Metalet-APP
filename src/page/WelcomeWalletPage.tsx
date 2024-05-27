import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { metaStyles, themeColor } from "../constant/Constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { LoadingModal, RoundSimButton } from "../constant/Widget";
import Index from "../page/Index";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { navigate } from "../base/NavigationService";
import { getStorageWallets, isNoStorageWallet, isNoWalletPassword } from "../utils/WalletUtils";
import { wordlist } from "@scure/bip39/wordlists/english";
import * as bip39 from "@scure/bip39";
import { useData } from "../hooks/MyProvider";
import { createMetaletWallet } from "../wallet/wallet";
import MetaletWallet from "../wallet/MetaletWallet";
import { AsyncStorageUtil, CurrentAccountIDKey, CurrentWalletIDKey, wallets_key } from "../utils/AsyncStorageUtil";

// type Props={
//   navigation:StackNavigationProp<any,''/>;
// };
type Props = {
  navigation: NativeStackScreenProps<any, "Home">; // 替换any为你的StackNavigator路由类型
};

export default function WelcomeWalletPage(props) {
  //create
  const { myWallet, updateMyWallet } = useData();
  const { metaletWallet, updateMetaletWallet } = useData();
  const { mvcAddress, updateMvcAddress } = useData();
  const { btcAddress, updateBtcAddress } = useData();
  const [isShowLoading, setIsShowLoading] = useState(false);

  async function createWallet() {
    
    setIsShowLoading(true);
    const { btcWallet, mvcWallet, walletBean } =
      await createMetaletWallet(10001);
    const wallets = await getStorageWallets();
    const hasNoWallets = await isNoStorageWallet();

    let metaletWallet = new MetaletWallet();
    updateMvcAddress(mvcWallet.getAddress());
    updateBtcAddress(btcWallet.getAddress());
    metaletWallet.currentBtcWallet = btcWallet;
    metaletWallet.currentMvcWallet = mvcWallet;
    updateMetaletWallet(metaletWallet);

    if (hasNoWallets) {
      await AsyncStorageUtil.updateItem(wallets_key, [walletBean]);
    } else {
      const newWallets = [...wallets, walletBean];
      await AsyncStorageUtil.updateItem(wallets_key, newWallets);
    }
    updateMyWallet(walletBean);
    await AsyncStorageUtil.setItem(CurrentWalletIDKey, walletBean.id);
    await AsyncStorageUtil.setItem(
      CurrentAccountIDKey,
      walletBean.accountsOptions[0].id
    );
    setIsShowLoading(false);
    navigate("CongratulationsPage", {
      type: "Successfully created",
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal
        isShow={isShowLoading}
        isCancel={true}
        event={() => {
          setIsShowLoading(false);
        }}
      />

      <Image
        source={require("../../image/me_first_choose_wallet.png")}
        style={styles.img}
      />
      <Text
        style={[{ marginTop: 20 }, { fontWeight: "bold" }, { fontSize: 22 }]}
      >
        Welcome To Metalet Wallet
      </Text>

      <View style={{ flex: 1 }} />

      <RoundSimButton
        title={"Import Wallet"}
        event={async () => {
          const noPassword = await isNoWalletPassword();
          if (noPassword) {
            navigate("SetPasswordPage", { type: "import" });
          } else {
            navigate("ImportWalletPage", { destory: true });
          }
        }}
        color="#F3F3FF"
      />
      <View style={{ height: 20 }} />
      <RoundSimButton
        title={"Create Wallet"}
        event={() => {
          // props.navigation.navigate("TabNavigator",{screen: "Home"});
          // props.navigation.navigate('TabNavigator', { screen: 'Home' });

          // navigate('Home')
          

          if (isNoWalletPassword()) {
            // navigate("ImportWalletPage", { destory: true });
            navigate("SetPasswordPage", { type: "create" });
          } else {
            createWallet();
          }
        }}
        textColor="white"
      />

      <View style={{ height: 30 }} />
      <Text style={metaStyles.grayText99}>
        By using Metalet,you agree and consent to our:
      </Text>
      <View style={[styles.row, { marginBottom: 40 }]}>
        {/* <Text style={metaStyles.blueText}>User Agreement</Text> */}
        <Text style={metaStyles.grayText99}> Metalet's </Text>
        <Text style={metaStyles.blueText}>Terms of Service</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 50,
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
  },
  img: {
    width: 300,
    height: 253,
    marginTop: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
