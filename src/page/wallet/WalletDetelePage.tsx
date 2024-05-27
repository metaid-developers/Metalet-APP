import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import {
  LoadingNoticeModal,
  TitleBar,
  VerifyModal,
} from "../../constant/Widget";
import {  wallets_key } from "../../utils/AsyncStorageUtil";
import { navigate } from "../../base/NavigationService";
import { eventBus, refreshHomeLoadingEvent } from "../../utils/EventBus";
import { getStorageWallets } from "../../utils/WalletUtils";

export default function WalletDetelePage({ route }) {
  const [isAgree, setIsAgree] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const { postion } = route.params;

  async function deleteWallet() {
    await getStorageWallets().then(async (wallets) => {
      // await AsyncStorageUtil.getItem(wallets_key).then(async (wallets) => {
      // const nowWallet = wallets[postion];
      // //    let wallet=res.find(item=>item.id==id)
      // setnowWallet(nowWallet);
      // setAccountsOptionsList(nowWallet.accountsOptions);
      wallets.splice(postion, 1);
      if (wallets.length > 0) {
        wallets[0].accountsOptions[0].isSelect = true;
      }
      setIsDelete(true);
      await storage.set(wallets_key, wallets).then(() => {
        setTimeout(() => {
          setIsDelete(false);
          navigate("WalletsPage");
        }, 1000);
      });
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoadingNoticeModal title="Delete Sucessful" isShow={isDelete} />

      <VerifyModal
        isShow={isShow}
        event={(inputText: string) => {
          setIsShow(false);
          console.log(inputText);
          deleteWallet();
        }}
        eventCancel={() => {
          setIsShow(false);
        }}
      />
      <View style={{ flex: 1 }}>
        <TitleBar />

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Image
            source={require("../../../image/metalet_wallet_details_icon.png")}
            style={{ width: 100, height: 100, marginTop: 20 }}
          />

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                color: "#333",
                marginTop: 20,
              }}
            >
              Confirm To Delete Wallet
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#333",
              margin: 20,
              lineHeight: 22,
              textAlign: "center",
            }}
          >
            Confirming The Deletion Will Remove This Wallet From The
            Application. You Can Re-Import It Using The Mnemonic Generated When
            Backing Up The Wallet Without Affecting Your Assets. Please Be Sure
            To Back Up Your Wallet Before Deleting It, Otherwise You Will
            Permanently Lose This Wallet And Assets Therein
          </Text>
        </View>
        <View style={{ flex: 1 }} />

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isAgree ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setIsAgree(false);
              }}
            >
              <Image
                source={require("../../../image/metalet_wallet_check_select.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setIsAgree(true);
              }}
            >
              <Image
                source={require("../../../image/metalet_wallet_check_normal_icom.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </TouchableWithoutFeedback>
          )}

          <Text
            style={{
              fontSize: 16,
              color: "#333",
              lineHeight: 22,
            }}
          >
            I am aware of the obove risks
          </Text>
        </View>

        <TouchableWithoutFeedback
          onPress={() => {
            if (isAgree) {
              setIsShow(true);
            }
          }}
        >
          <View
            style={{
              marginTop: 20,
              marginBottom: 40,
              height: 20,
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  height: 48,
                  width: 200,
                  backgroundColor: isAgree ? "#FA5151" : "#DBDBDB",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                },
              ]}
            >
              <Text
                style={[
                  { textAlign: "center" },
                  { color: "#fff" },
                  { fontSize: 16 },
                ]}
              >
                Confirm
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}
