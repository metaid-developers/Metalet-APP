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
import Index from '../page/Index';
import  { NativeStackScreenProps } from '@react-navigation/native-stack';

import {navigate} from '../base/NavigationService'

// type Props={
//   navigation:StackNavigationProp<any,''/>;
// };
type Props = {
  navigation: NativeStackScreenProps<any, 'Home'>; // 替换any为你的StackNavigator路由类型
};

export default function WelcomeWalletPage(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../image/me_first_choose_wallet.png")}
        style={styles.img}
      />
      <Text
        style={[{ marginTop: 10 }, { fontWeight: "bold" }, { fontSize: 22 }]}
      >
        Welcome To Metalet Wallet
      </Text>
      <View style={{ flex: 1 }} />

      <RoundSimButton
        title={"Import Wallet"}
        event={() => {
          console.log("import wallet");
        }}
        color="#F3F3FF"
      />
      <View style={{ height: 20 }} />
      <RoundSimButton
        title={"Create Wallet"}
        event={() => {
          console.log("create wallet");
          // props.navigation.navigate("TabNavigator",{screen: "Home"});
          // props.navigation.navigate('TabNavigator', { screen: 'Home' }); 
          props.navigation.navigate('Tabs'); 
          // navigate('Home')
        }}
        textColor="white"
      />

      <View style={{ height: 30 }} />
      <Text style={metaStyles.grayText}>
        By using Metalet,you agree and consent to our:
      </Text>
      <View style={[styles.row, { marginBottom: 40 }]}>
        <Text style={metaStyles.blueText}>Terms of Service</Text>
        <Text style={metaStyles.grayText}> and </Text>
        <Text style={metaStyles.blueText}>Privacy Policy</Text>
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
