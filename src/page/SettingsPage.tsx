import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useData } from "../hooks/MyProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CloseView,
  LoadingModal,
  QRScanner,
  TitleBar,
  VerifyModal,
} from "@/constant/Widget";
import { metaStyles } from "@/constant/Constants";
import Constants from "expo-constants";
import { navigate } from "@/base/NavigationService";
import useNetworkStore from "@/stores/useNetworkStore";
import { getRandomID, setWalletNetwork } from "@/utils/WalletUtils";
import { wallet_mode_cold } from "@/utils/AsyncStorageUtil";

export const BTC_NETWORK = "mainnet";
export const BTC_NETWORK_TEST = "testnet";

export default function SettingsPage(props: any) {
  const [isShowVerify, setIsShowVerify] = useState(false);
  const [isShowNetwork, setShowNetwork] = useState(false);
  const { network, switchNetwork } = useNetworkStore();
  const [isShowLoading, setIsShowLoading] = useState(false);
  // const { needRefreshHome, updateNeedRefreshHome } = useData();
  const { needInitWallet, updateNeedInitWallet } = useData();
  const { walletMode, updateWalletMode } = useData();
  const [isScan, setIsScan] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LoadingModal
        isShow={isShowLoading}
        isCancel={true}
        event={() => {
          setIsShowLoading(false);
        }}
      />

      <Modal visible={isShowNetwork} transparent={true}>
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
              marginHorizontal: 30,
              padding: 30,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={metaStyles.largeDefaultLittleText}>
                Select network
              </Text>

              <View style={{ flex: 1 }} />

              <CloseView
                event={() => {
                  setShowNetwork(false);
                }}
              />
            </View>

            <TouchableWithoutFeedback
              onPress={async () => {
                setShowNetwork(false);
                setIsShowLoading(true);
                await setWalletNetwork(BTC_NETWORK);
                switchNetwork(BTC_NETWORK);
                updateNeedInitWallet(getRandomID());
                setTimeout(() => {
                  setIsShowLoading(false);
                }, 100);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Text style={{ color: "#333333", fontSize: 18 }}>Mainnet</Text>

                <View style={{ flex: 1 }} />

                {network == BTC_NETWORK && (
                  <Image
                    source={require("../../image/wallets_select_icon.png")}
                    style={{ padding: 8, width: 20, height: 20 }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={async () => {
                setShowNetwork(false);
                setIsShowLoading(true);
                await setWalletNetwork(BTC_NETWORK_TEST);
                switchNetwork(BTC_NETWORK_TEST);
                updateNeedInitWallet(getRandomID());
                setTimeout(() => {
                  setIsShowLoading(false);
                }, 100);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Text style={{ color: "#333333", fontSize: 18 }}>Testnet</Text>

                <View style={{ flex: 1 }} />

                {network == BTC_NETWORK_TEST && (
                  <Image
                    source={require("../../image/wallets_select_icon.png")}
                    style={{ padding: 8, width: 20, height: 20 }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>

      <VerifyModal
        isShow={isShowVerify}
        eventCancel={() => {
          setIsShowVerify(false);
        }}
        event={() => {
          setIsShowVerify(false);
          navigate("BackupPage");
        }}
      />

      {isScan ? (
        <QRScanner
          handleScan={(data) => {
            setIsScan(false);
            console.log(data);
          }}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ margin: 20, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <Text style={[{ textAlign: "left" }, metaStyles.titleText]}>
                Setting
              </Text>

              <View style={{ flex: 1 }} />
              {/* <TouchableWithoutFeedback
                onPress={() => {
                  // setIsScan(true);
                  navigate("ScanPage");
                }}
              >
                <Image
                  source={require("../../image/scan_icon.png")}
                  style={{ width: 25, height: 25 }}
                />
              </TouchableWithoutFeedback> */}
            </View>

            <TouchableWithoutFeedback
              onPress={() => {
                navigate("WalletsPage");
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
                <Image
                  source={require("../../image/settings_wallet_icon.png")}
                  style={{ width: 45, height: 45 }}
                />
                <Text
                  style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}
                >
                  Management
                </Text>
                <View style={{ flex: 1 }} />
                <Image
                  source={require("../../image/list_icon_ins.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* {walletMode != wallet_mode_cold && (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigate("ColdWalletPage");
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
                  <Image
                    source={require("../../image/settings_cold_icon.png")}
                    style={{ width: 45, height: 45 }}
                  />
                  <Text
                    style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}
                  >
                    Cold Wallet
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Image
                    source={require("../../image/list_icon_ins.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )} */}

            <TouchableWithoutFeedback
              onPress={() => {
                setIsShowVerify(true);
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
                <Image
                  source={require("../../image/settings_backup_icon.png")}
                  style={{ width: 45, height: 45 }}
                />
                <Text
                  style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}
                >
                  Backup{" "}
                </Text>
                <View style={{ flex: 1 }} />
                <Image
                  source={require("../../image/list_icon_ins.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                navigate("SecurityPage");
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
                <Image
                  source={require("../../image/settings_safe_icon.png")}
                  style={{ width: 45, height: 45 }}
                />
                <Text
                  style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}
                >
                  Wallet Security
                </Text>
                <View style={{ flex: 1 }} />
                <Image
                  source={require("../../image/list_icon_ins.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                setShowNetwork(true);
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
                <Image
                  source={require("../../image/settings_network_icon.png")}
                  style={{ width: 45, height: 45 }}
                />
                <Text
                  style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}
                >
                  Network
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={metaStyles.defaultText}>
                  {network === "mainnet" ? "Mainnet" : "Testnet"}
                </Text>
                <Image
                  source={require("../../image/list_icon_ins.png")}
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                navigate("AboutPage");
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
                <Image
                  source={require("../../image/settings_about_icon.png")}
                  style={{ width: 45, height: 45 }}
                />
                <Text
                  style={{ marginLeft: 10, color: "#303133", fontSize: 16 }}
                >
                  About Metalet
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={metaStyles.defaultText}>
                  {Constants.expoConfig?.version}
                </Text>
                <Image
                  source={require("../../image/list_icon_ins.png")}
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
