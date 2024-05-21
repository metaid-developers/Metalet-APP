import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  QRScanner,
  RoundSimButton,
  TitleBar,
  styles,
} from "../../constant/Widget";
import { themeColor } from "../../constant/Constants";

export default function SendSpacePage() {
  const [nextBtnColor, setNextBtnColor] = useState("rgba(23, 26, 255, 0.5)");
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [isInputAddressFcous, setIsInputAddressFcous] = useState(false);
  const [isInputAmountFcous, setIsInputAmountFcous] = useState(false);

  // 扫描
  const [isScan, setIsScan] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isScan ? (
        <QRScanner
          handleScan={(data) => {
            setInputAddress("");
            setInputAddress(data);
            setIsScan(false);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <TitleBar title="Send" />

          <View
            style={{
              justifyContent: "center",
              // backgroundColor: "#fff",
              margin: 20,
              // borderRadius: 10,
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              source={require("../../../image/receive_mvc_icon.png")}
              style={{ width: 70, height: 70 }}
            />

            <Text
              style={{
                color: "#333",
                textAlign: "center",
                lineHeight: 20,
                marginTop: 20,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              SPACE
            </Text>

            <View
              style={{
                borderColor: isInputAddressFcous
                  ? themeColor
                  : "rgba(191, 194, 204, 0.5)",
                flexDirection: "row",
                borderWidth: 1,
                height: 50,
                borderRadius: 10,
                marginTop: 50,
                alignItems: "center",
              }}
            >
              <TextInput
                placeholder="Recipient's address"
                value={inputAddress}
                onChangeText={(text) => {
                  setInputAddress(text);
                  if (text.length > 0 && inputAmount.length > 0) {
                    setNextBtnColor("rgba(23, 26, 255, 1)");
                  } else {
                    setNextBtnColor("rgba(23, 26, 255, 0.5)");
                  }
                }}
                onFocus={() => {
                  // setIsInputAddressFcous(true);
                  // setIsInputAmountFcous(false);
                }}
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  marginLeft: 10,
                  flex: 1,
                  // textAlignVertical: "left",
                  padding: 10,
                }}
              />

              {/* <View style={{ position: "absolute", right: 0 ,bottom: 10,}}> */}
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (isScan == false) {
                      console.log("scan");
                      setIsScan(true);
                    }
                  }}
                >
                  <Image
                    source={require("../../../image/send_scan_icon.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                </TouchableWithoutFeedback>
              {/* </View> */}
            </View>

            {/* 
       <View style={{flexDirection: "row", marginTop: 20,}}>
       <Text style={{ marginTop: 20, color: "#666", fontSize: 14 ,width:'100%',textAlign:'right'}}> Balance: 0.003234 SPACE</Text>
       </View> */}

            <Text
              style={{
                marginTop: 40,
                color: "#333",
                fontSize: 16,
                width: "100%",
              }}
            >
              Transfer Address
            </Text>

            <View
              style={{
                alignItems: "center",
                borderColor: isInputAmountFcous
                  ? themeColor
                  : "rgba(191, 194, 204, 0.5)",
                flexDirection: "row",
                borderWidth: 1,
                height: 50,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <TextInput
                placeholder="0.433 SPACE"
                onChangeText={(text) => {
                  setInputAmount(text);
                  if (text.length > 0 && inputAddress.length > 0) {
                    setNextBtnColor("rgba(23, 26, 255, 1)");
                  } else {
                    setNextBtnColor("rgba(23, 26, 255, 0.5)");
                  }
                }}
                onFocus={() => {
                  // setIsInputAddressFcous(false);
                  // setIsInputAmountFcous(true);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  marginLeft: 10,
                  paddingRight:10
                }}
              />

              <Text style={{ marginRight: 10, fontSize: 14, color: "#333"  }}>
                SPACE
              </Text>
            </View>

            <RoundSimButton
              title={"Next"}
              event={() => {}}
              roundStytle={{ marginTop: 50 }}
              textColor="#fff"
              color={nextBtnColor}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
