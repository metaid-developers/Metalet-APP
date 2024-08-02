import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { metaStyles } from "../constant/Constants";
import { NoMoreDataView, useEasyToast } from "../constant/Widget";
import * as FileSystem from "expo-file-system";
import EasyToast from "react-native-easy-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  network_all,
  network_btc,
  network_mvc,
} from "../utils/AsyncStorageUtil";
import { useData } from "../hooks/MyProvider";
import { navigate } from "../base/NavigationService";
import { useFocusEffect } from "@react-navigation/native";

export default function AssetsPage() {
  const { myWallet, updateMyWallet } = useData();
  const { accountIndex, updateAccountIndex } = useData();
  const { metaletWallet, updateMetaletWallet } = useData();
  const { netWork, updateNetWork } = useData();
  const { spaceBalance, updateSpaceBalance } = useData();
  const { btcBalance, updateSetBtcBalance } = useData();

  const [hasData, setHasData] = useState(false);
  const [myfile, setFolders] = useState<string[]>([]);

  const toastRef = useEasyToast("center");

  const showToast = useCallback(() => {
    toastRef.current?.show("Hello World!", 2000, () =>
      console.log("Toast dismissed")
    );
  }, [toastRef]);

  useFocusEffect(
    React.useCallback(() => {
     console.log("AssetsPage page is focused");
     
    }, [])
  );

  async function getMVCBalance() {
    // try {
    //   const fileUri = FileSystem.documentDirectory + 'example.txt';
    //   await FileSystem.writeAsStringAsync(fileUri, 'Hello, Expo!');
    //   console.log('File created successfully');
    //   const appDirectory = FileSystem.documentDirectory; // 获取应用的沙盒目录路径
    //   console.log("app 沙盒路径："+appDirectory);
    //   Alert.alert("app 沙盒路径："+appDirectory);
    //   // 读取应用沙盒目录下的文件夹列表
    //   const folders = await FileSystem.readDirectoryAsync(appDirectory);
    //   setFolders(folders); // 使用函数形式的 setState 更新状态
    //   // console.log('Folders in app directory:', folders);
    //   // Alert.alert('Folders in app directory:', folders.join(', '));
    // } catch (error) {
    //   console.error('Error reading app directory:', error);
    //  Alert.alert('Error reading app directory:', error);
    // }
    // const data = walletManager.getWallets();
    // console.log("walletManager AssetsPage 钱包： ", JSON.stringify(data));
    // const mvcAddress = data[0].accounts[accountIndex].mvc[0].address;
    // console.log("mvcAddress", mvcAddress);
  }

  useEffect(() => {
    showToast();
    getMVCBalance();
  }, []);


  // AsyncStorageUtil.setItem("test", "test1111");
  // AsyncStorageUtil.getItem("test").then((res) => {
  //   console.log("res:" + res);
  // });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {netWork == network_btc && (
        <TouchableWithoutFeedback
          onPress={() => {
            // navigate("ReceivePage", { myCoinType: "BTC" });
            navigate("AssetsBtcDetailPage", { myCoinType: "BTC" });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../image/logo_btc.png")}
              style={{ width: 45, height: 45 }}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>BTC</Text>
              {/* <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
                sdfewfwsf
              </Text> */}
            </View>

            <View style={{ flex: 1 }} />

            <View>
              <Text style={{ color: "#333", fontSize: 16, textAlign: "right" }}>
                {btcBalance} BTC{" "}
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "right",
                }}
              >
                ${metaletWallet.currentBtcAssert}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {netWork == network_mvc && (
        <TouchableWithoutFeedback
          onPress={() => {
            // navigate("ReceivePage",{myCoinType:'SPACE'});
            navigate("AssetsMvcDetailPage", { myCoinType: "SPACE" });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../image/logo_space.png")}
              style={{ width: 45, height: 45 }}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>SPACE</Text>
              {/* <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
                sdfewfwsf
              </Text> */}
            </View>

            <View style={{ flex: 1 }} />

            <View>
              <Text style={{ color: "#333", fontSize: 16, textAlign: "right" }}>
                {/* {metaletWallet.currentMvcBalance} SPACE{" "} */}
                {spaceBalance} SPACE{" "}
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "right",
                }}
              >
                ${metaletWallet.currentSpaceAssert}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {netWork == network_all && (
        <TouchableWithoutFeedback
          onPress={() => {
            // navigate("ReceivePage",{myCoinType:{type:'BTC'}});
            // navigate("ReceivePage", { myCoinType: "BTC" });
            navigate("AssetsBtcDetailPage", { myCoinType: "BTC" });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../image/logo_btc.png")}
              style={{ width: 45, height: 45 }}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>BTC</Text>
              {/* <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
                sdfewfwsf
              </Text> */}
            </View>

            <View style={{ flex: 1 }} />

            <View>
              <Text style={{ color: "#333", fontSize: 16, textAlign: "right" }}>
                {/* {metaletWallet.currentBtcBalance!} BTC{" "} */}
                {btcBalance!} BTC{" "}
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "right",
                }}
              >
                ${metaletWallet.currentBtcAssert}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {netWork == network_all && (
        <TouchableWithoutFeedback
          onPress={() => {
            // navigate("ReceivePage",{myCoinType:'SPACE'});
            navigate("AssetsMvcDetailPage", { myCoinType: "SPACE" });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../image/logo_space.png")}
              style={{ width: 45, height: 45 }}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>SPACE</Text>
              {/* <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
                sdfewfwsf
              </Text> */}
                 <View style={{ marginLeft: 0 }}>
              <View
                style={{
                  marginTop: 3,
                  backgroundColor: "rgba(247, 147, 26, 0.2)",
                  borderRadius: 10,
                  alignItems: "center",
                  paddingVertical: 2,
                  paddingHorizontal:5
                }}
              >
                <Text style={{ fontSize: 8, color: "#FF981C" }}>
                  Bitcoin sidechain{" "}
                </Text>
              </View>
            </View>
            </View>

            <View style={{ flex: 1 }} />

            <View>
              <Text style={{ color: "#333", fontSize: 16, textAlign: "right" }}>
                {spaceBalance! } SPACE{" "}
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "right",
                }}
              >
                ${metaletWallet.currentSpaceAssert}
               
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
