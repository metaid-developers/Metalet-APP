import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TitleBar, VerifyModal } from "@/constant/Widget";
import { navigate } from "@/base/NavigationService";

export default function SecurityPage() {
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
          navigate("SetPasswordPage", { type: "change" });
        }}
      />

      <View style={{ flex: 1 }}>
        <TitleBar title="SecurityPage" />
        <View>
          <TouchableWithoutFeedback
            onPress={async () => {
             setIsShowVerify(true);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                marginTop: 10,
              }}
            >
              <Text style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}>
                Change Password
              </Text>
              <View style={{ flex: 1 }} />

              <Image
                source={require("../../../image/list_icon_ins.png")}
                style={{ width: 20, height: 20, marginTop: 5 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
}
