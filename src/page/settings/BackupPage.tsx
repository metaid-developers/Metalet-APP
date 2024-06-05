import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BaseView, Line, RoundSimButton, TitleBar } from "@/constant/Widget";
import { SafeAreaView } from "react-native-safe-area-context";
import { WalletBean } from "@/bean/WalletBean";
import { getCurrentAccountID, getWalletBeans } from "@/utils/WalletUtils";
import { navigate } from "@/base/NavigationService";
import { metaStyles, themeColor } from "@/constant/Constants";

export default function BackupPage() {
  let [walletList, setWalletList] = useState<WalletBean[]>([]);
  const [isShowBackUp, setIsShowBackUp] = useState(true);
  const [walletBackUp, setWalletBackUp] = useState<WalletBean>();

  useEffect(() => {
    getWalletData();
  }, []);

  async function getWalletData() {
    const currentAccountID = await getCurrentAccountID();
    const wallets = await getWalletBeans();
    setWalletList(wallets);
  }

  const ListItem = ({ index, item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
         setIsShowBackUp(true);
         setWalletBackUp(item);
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
          <Text style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}>
            {item.name}
          </Text>
          <View style={{ flex: 1 }} />
          {item.isBackUp == false && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../image/metalet_dot_icon.png")}
                style={{ width: 5, height: 5, marginRight: 7 }}
              />
              <Text style={{ fontSize: 13, color: "red" }}>Not backed up</Text>
            </View>
          )}
          <Image
            source={require("../../../image/list_icon_ins.png")}
            style={{ width: 20, height: 20, marginTop: 5 }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal transparent={true} visible={isShowBackUp}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingTop: 30,
              marginHorizontal: 20,
              paddingBottom: 15,
            }}
          >
            <Text style={[metaStyles.defaultText18, { textAlign: "center" }]}>
              Backup Wallet{" "}
            </Text>

            <Line />

            <Text style={[metaStyles.grayTextdefault66, { marginTop: 20 }]}>
              Mnemonic Phrase
            </Text>
            <Text
              style={[
                metaStyles.defaultText,
                { marginTop: 20, marginBottom: 30 },
              ]}
            >
             {walletBackUp.mnemonic}
            </Text>

            {/* <RoundSimButton textColor="#fff" title={"OK"} event={()=>{
            setIsShowBackUp(false)
           }}/> */}

            <TouchableWithoutFeedback
              onPress={() => {
                setIsShowBackUp(false);
              }}
            >
              <Text
                style={[
                  metaStyles.largeDefaultLittleText,
                  { textAlign: "center", color: themeColor },
                ]}
              >
                OK
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>

      <View style={{ flex: 1 }}>
        <TitleBar title="Backup" />
        <View style={{ padding: 20 }}>
          <FlatList
            // style={{ marginTop: 20 }}
            keyExtractor={(item, index) => index.toString()}
            data={walletList}
            renderItem={ListItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
