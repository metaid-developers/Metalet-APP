import { View, Text, TextInput, TouchableWithoutFeedback ,Image} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Line, RoundSimButton, TitleBar } from "@/constant/Widget";
import { metaStyles, themeColor } from "@/constant/Constants";

export default function InscribeFirstPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <TitleBar title={"Inscribe Transfer"} />

        <View style={{ padding: 20 }}>
          <View
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                paddingTop: 10,
                width: 130,
                height: 105,
                marginBottom: 20,
                alignItems: "center",
                backgroundColor: "#F5F7F9",
                borderRadius: 10,
              }}
            >
              <Text style={[metaStyles.grayTextSmall66, { marginTop: 10 }]}>
                RDEX
              </Text>

              <Text
                style={[metaStyles.largeDefaultLittleText, { marginTop: 10 }]}
              >
                2132
              </Text>

              <View
                style={{
                  backgroundColor: themeColor,
                  width: "100%",
                  borderBottomEndRadius: 10,
                  borderBottomStartRadius: 10,
                  alignItems: "center",
                  paddingVertical: 8,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#fff" }}>Transfer</Text>
              </View>
            </View>
          </View>

          <Line top={20} />

          <Text style={{ textAlign: "right", marginTop: 20, color: "#999" }}>
            Avaiabe 1000 RDEX
          </Text>

          <View
            style={{
              alignItems: "center",
              borderColor: "rgba(191, 194, 204, 0.5)",
              flexDirection: "row",
              borderWidth: 1,
              height: 50,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <TextInput
              placeholder="Transfer Amount"
              onChangeText={(text) => {
                //   setInputAmount(text);
              }}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                marginLeft: 10,
                paddingRight: 10,
              }}
            />
          </View>

          

          <TouchableWithoutFeedback
              onPress={() => {
                // setIsShowFeed(true);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#333", fontSize: 14 }}>Fee Rate</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ color: "#999", fontSize: 14 }}>
                  33 sat/vB
                </Text>
                <Image
                  source={require("../../../../image/list_icon_ins.png")}
                  style={{ width: 18, height: 18 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <RoundSimButton title={'Next'} color={themeColor} textColor={"#fff"} roundStytle={{marginTop:100}} event={()=>{

            }}/>



        </View>
      </View>
    </SafeAreaView>
  );
}
