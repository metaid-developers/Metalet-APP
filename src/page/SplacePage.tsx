import { View, Text, Image,TextInput } from "react-native";
import React from "react";
import { metaStyles } from "../constant/Constants";

export default function SplacePage(props) {
  function goToHome() {
    setTimeout(() => {
      props.navigation.navigate("SetPasswordPage");
      // props.navigation.navigate("Tabs");
    }, 200);
  }

  goToHome();

  return (
    <View style={metaStyles.container}>
      <Image
        source={require("../../image/me_app_icon.png")}
        style={metaStyles.splaceImage}
      />
      <Text
        style={[{ marginTop: 10 }, { fontWeight: "bold" }, { fontSize: 22 }]}
      >
        METALET
      </Text>
      <TextInput
        placeholder="请输入用户名"
        onChangeText={(val) => {
        
        }}/>
    </View>
  );
}
