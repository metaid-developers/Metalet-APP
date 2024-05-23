import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { metaStyles, themeColor } from "../constant/Constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { RoundSimButton } from "../constant/Widget";
import Index from "../page/Index";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { navigate } from "../base/NavigationService";
import { isNoWalletPassword } from "../utils/WalletUtils";
import { wordlist } from '@scure/bip39/wordlists/english'
import * as bip39 from '@scure/bip39'


// type Props={
//   navigation:StackNavigationProp<any,''/>;
// };
type Props = {
  navigation: NativeStackScreenProps<any, "Home">; // 替换any为你的StackNavigator路由类型
};

export default function WelcomeWalletPage(props) {
  return (
    <SafeAreaView style={styles.container}>
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
          const noPassword= await isNoWalletPassword();
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
            //TODO create wallet
            // props.navigation.navigate('Tabs');
            const menmoic= bip39.generateMnemonic(wordlist).split(" ");
            console.log("menmoic",menmoic);
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
