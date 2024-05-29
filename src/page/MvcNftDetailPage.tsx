import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RoundSimButton, TitleBar } from "../constant/Widget";
import { formatTime, getShowImageUrl } from "../utils/MetaFunUiils";
import { metaStyles } from "../constant/Constants";
import { navigate } from "../base/NavigationService";

export default function MvcNftDetailPage({ route }) {
  const { myObject } = route.params;

  let imgNftUrl = getShowImageUrl(myObject.nftIcon!);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TitleBar />
      <View style={[metaStyles.verMarginContainer, { marginBottom: 20 }]}>
        <View style={{ alignItems: "center", alignContent: "center" }}>
          <Image
            source={{ uri: imgNftUrl }}
            style={{ width: 200, height: 200 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            {myObject.nftName}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                backgroundColor: "rgba(23, 26, 255, 0.8)",
                padding: 3,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                MVC
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                backgroundColor: "rgba(23, 26, 255, 0.3)",
                padding: 3,
                width: 85,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  color: "#171AFF",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                MetaContract
              </Text>
            </View>
          </View>
        </View>

        {/* 横线 */}
        <View
          style={{ height: 0.2, backgroundColor: "#666666", marginTop: 20 }}
        />
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#666666", fontSize: 15 }}>Cteator: </Text>
          <Text style={{ color: "#333333", fontSize: 15 }}>
            {myObject.nftIssuer!}{" "}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#666666", fontSize: 15 }}>Token Index: </Text>
          <Text style={{ color: "#333333", fontSize: 15 }}>
            {myObject.nftTokenIndex!}{" "}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#666666", fontSize: 15 }}>
            Seriers Genesis:{" "}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="middle"
            style={{
              color: "#333333",
              fontSize: 15,
              marginHorizontal: 30,
              paddingRight: 60,
            }}
          >
            {myObject.nftGenesis!}{" "}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#666666", fontSize: 15 }}>
            Last Activity At:{" "}
          </Text>
          <Text style={{ color: "#333333", fontSize: 15 }}>
            {formatTime(myObject.nftTimestamp!)}{" "}
          </Text>
        </View>

        <View style={{ flex: 1 }} />
        <RoundSimButton
          title="Transfers"
          event={() => {
            navigate("TransferMvcNftPage", { myObject: myObject });
          }}
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
}
