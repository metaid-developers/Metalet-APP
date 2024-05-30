import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title } from "react-native-paper";
import { Line, RoundSimButton, TitleBar } from "@/constant/Widget";
import { metaStyles } from "@/constant/Constants";
import { navigate } from "@/base/NavigationService";

export default function TransferBrc20FirstPage() {
  const EmptyView = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../../../image/btc_brc20_empty_icon.png")}
          style={{ width: 45, height: 35, marginTop: 45 }}
          resizeMode="contain"
        />

        <Text
          style={[metaStyles.grayText99, { marginTop: 15, marginBottom: 20 }]}
        >
          Empty
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:"#fff"}}>
      <View style={{ flex: 1 }}>
        <TitleBar title={"Transfer"} />
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
          <Text style={metaStyles.defaultText}>Transfer Amount</Text>
          <View style={[metaStyles.lineBgRadius, { padding: 10 }]}>
            <Text style={metaStyles.defaultText}>
              0 <Text> RDEX</Text>
            </Text>

            <Line top={20} />

            <Text style={{ marginTop: 20, color: "#666" }}>
              Transfer Inscriptions
            </Text>

            <View>
              <EmptyView />
            </View>
          </View>

          <Text style={[metaStyles.defaultText, { marginTop: 20 }]}>
            Inscribe Transfer
          </Text>
          <Text style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            You have to inscribe a TRANSFER inscription first.
          </Text>

          <RoundSimButton title={"Available 10 RDEX"} event={() => {
            navigate('InscribeFirstPage')
          }} roundStytle={{marginTop:30}} color="#F5F7F9" textColor="#666"/>
        </View>
      </View>
    </SafeAreaView>
  );
}
