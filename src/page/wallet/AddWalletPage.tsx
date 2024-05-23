import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { metaStyles } from "../../constant/Constants";
import { TitleBar } from "../../constant/Widget";
import { navigate } from "../../base/NavigationService";

export default function AddWalletPage() {
  return (
    <SafeAreaView
      style={[metaStyles.varContainer, { backgroundColor: "#fff" }]}
    >
      <View style={metaStyles.varContainer}>
        <TitleBar />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginLeft: 20,
            }}
          >
            Add Wallet
          </Text>

          <TouchableWithoutFeedback>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginVertical: 20,
                  backgroundColor: "#F5F7F9",
                  borderRadius: 10,
                  padding: 10,
                  height:123
                },
              ]}
            >
              <View>
                <Text
                  style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}
                >
                  Create wallet
                </Text>
                <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
                  create a new mennic wallet
                </Text>
              </View>

              <View style={{ flex: 1 }}></View>
              <Image
                source={require("../../../image/metalet_create_wallet_icon.png")}
                style={{ height: 100, width: 100, resizeMode: "contain" }}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback  onPress={()=>{
            navigate('ImportWalletPage')
          }}>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                  marginVertical: 20,
                  backgroundColor: "#F5F7F9",
                  borderRadius: 10,
                  padding: 10,
                  height:123
                },
              ]}
            >
              <View>
                <Text
                  style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}
                >
                  Import wallet
                </Text>
                <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
                  import using menmonic phrase 
                </Text>
              </View>

              <View style={{ flex: 1 }}></View>
              <Image
                source={require("../../../image/metalet_import_wallet_icon.png")}
                style={{ height: 80, width: 100, resizeMode: "contain" }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
}
