import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React from "react";
import { GradientAvatar, TitleBar } from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { useData } from "../hooks/MyProvider";
import {
  
  network_all,
  network_btc,
  network_key,
  network_mvc,
  createStorage,
} from "../utils/AsyncStorageUtil";
import { eventBus, refreshHomeLoadingEvent } from "../utils/EventBus";
import { navigate } from "../base/NavigationService";
import { SafeAreaView } from "react-native-safe-area-context";

const storage = createStorage();

export default function NetWorkPage() {
  const { netWork, updateNetWork } = useData();

  async function changeNetwork(changeNetwork: string) {
    if (changeNetwork == network_mvc) {
      await storage.set(network_key, network_mvc);
      // await AsyncStorageUtil.setItem(network_key, network_mvc);
    } else if (changeNetwork == network_btc) {
      await storage.set(network_key, network_btc);
      // await AsyncStorageUtil.setItem(network_key, network_btc);
    } else if (changeNetwork == network_all) {
      await storage.set(network_key, network_all);
      // await AsyncStorageUtil.setItem(network_key, network_all);
    }
    // eventBus.publish(refreshHomeLoadingEvent,{data:''})
    navigate("Tabs");
    updateNetWork(changeNetwork);

    //
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TitleBar title="Select Network" />

        <TouchableWithoutFeedback
          onPress={() => {
            changeNetwork(network_all);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <Image
              source={require("../../image/metalet_network_all_icon.png")}
              style={{ width: 30, height: 30 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={metaStyles.defaultText}> All Networks</Text>
              {/* <Text style={{ marginTop: 10 }}>{}</Text> */}
            </View>

            <View style={{ flex: 1 }} />

            {network_all == netWork && (
              <Image
                source={require("../../image/wallets_select_icon.png")}
                style={{ padding: 8, width: 15, height: 15 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            changeNetwork(network_btc);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 25,
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <Image
              source={require("../../image/meta_btc_icon.png")}
              style={{ width: 30, height: 30 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={metaStyles.defaultText}> Bitcoin</Text>
              {/* <Text style={{ marginTop: 10 }}>{}</Text> */}
            </View>

            <View style={{ flex: 1 }} />

            {netWork == network_btc && (
              <Image
                source={require("../../image/wallets_select_icon.png")}
                style={{ padding: 8, width: 15, height: 15 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            changeNetwork(network_mvc);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 25,
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <Image
              source={require("../../image/logo_space.png")}
              style={{ width: 30, height: 30 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={metaStyles.defaultText}> Microvisionchain</Text>
              {/* <Text style={{ marginTop: 10 }}>{}</Text> */}
            </View>

            <View style={{ flex: 1 }} />

            {network_mvc == netWork && (
              <Image
                source={require("../../image/wallets_select_icon.png")}
                style={{ padding: 8, width: 15, height: 15 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}
