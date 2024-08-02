import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RoundSimButton, TitleBar } from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { navigate } from "../base/NavigationService";
import { useData } from "@/hooks/MyProvider";
import { getRandomID, getStorageCurrentWallet, getWalletBeans } from "@/utils/WalletUtils";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function CongratulationsPage({ route, props }) {
  const { type } = route.params;

  useEffect(() => {
    // test();
  }, []);

  async function test() {
    // await const wallets=getWalletBeans();
    const wallets=await getWalletBeans();
    console.log("wallets: ",JSON.stringify(wallets));

    const wallet=await getStorageCurrentWallet();
    console.log("wallet: ",wallet);
    
    
  }


  return (
    <SafeAreaView style={metaStyles.parentContainer}>
      <TitleBar />
      <View style={metaStyles.centerContainer}>
        <Image
          source={require("../../image/meta_congratulations_icon.png")}
          style={{ width: 200, height: 200, marginTop: 50 }}
        />

        <Text style={[metaStyles.largeDefaultText, { marginTop: 20 }]}>
          {type}
        </Text>
        <Text style={[metaStyles.defaultText, { marginTop: 20 }]}>
          Metalet currently supports the Bitcoin network and MicrovisionChain.
        </Text>

        <View style={{ flex: 1 }} />

        <RoundSimButton
          title="Start Metalet"
          textColor="#fff"
          event={() => {
            navigate("Tabs");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
