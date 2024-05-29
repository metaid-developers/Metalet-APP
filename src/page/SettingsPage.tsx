import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { useData } from "../hooks/MyProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title } from "react-native-paper";
import { TitleBar, VerifyModal } from "@/constant/Widget";
import { metaStyles } from "@/constant/Constants";
import Constants from "expo-constants";
import { navigate } from "@/base/NavigationService";

export default function SettingsPage(props: any) {
  const [isShowVerify, setIsShowVerify] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VerifyModal
        isShow={isShowVerify}
        eventCancel={() => {
          setIsShowVerify(false);
        }}
        event={() => {
          setIsShowVerify(false);

        }}
      />
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ margin: 20, flex: 1 }}>
          <Text
            style={[
              { textAlign: "left", marginRight: 20, marginTop: 20 },
              metaStyles.titleText,
            ]}
          >
            Setting 
          </Text>

          <TouchableWithoutFeedback
            onPress={() => {
              navigate("WalletsPage");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../image/settings_wallet_icon.png")}
                style={{ width: 45, height: 45 }}
              />
              <Text style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}>
                Management
              </Text>
              <View style={{ flex: 1 }} />
              <Image
                source={require("../../image/list_icon_ins.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../image/settings_backup_icon.png")}
                style={{ width: 45, height: 45 }}
              />
              <Text style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}>
                Backup{" "}
              </Text>
              <View style={{ flex: 1 }} />
              <Image
                source={require("../../image/list_icon_ins.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../image/settings_safe_icon.png")}
                style={{ width: 45, height: 45 }}
              />
              <Text style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}>
                Wallet Security
              </Text>
              <View style={{ flex: 1 }} />
              <Image
                source={require("../../image/list_icon_ins.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../image/settings_about_icon.png")}
                style={{ width: 45, height: 45 }}
              />
              <Text style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}>
                About Metalet
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={metaStyles.defaultText}>
                {Constants.expoConfig?.version}
              </Text>
              <Image
                source={require("../../image/list_icon_ins.png")}
                style={{ width: 20, height: 20, marginLeft: 5 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
}
