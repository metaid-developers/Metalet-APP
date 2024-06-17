import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LoadingNoticeModal,
  NoMoreDataView,
  TitleBar,
} from "../../constant/Widget";
import { goBack, navigate } from "../../base/NavigationService";
import { metaStyles, themeColor } from "../../constant/Constants";
import {
  BtcRootRecord,
  MvcActivityRecord,
  TransactionList,
} from "../../types/mvcrecord";
import {
  fetchBtcActivityRecord,
  fetchMvcActivityComfird,
} from "../../api/metaletservice";
// import useNetworkManager from "@/hooks/useNetworkManager";
import useNetworkStore from "@/stores/useNetworkStore";
import { useData } from "../../hooks/MyProvider";
import * as Clipboard from "expo-clipboard";
import { formatTime } from "../../utils/MetaFunUiils";
import { AddressType, Chain } from "@metalet/utxo-wallet-service";
import { walllet_address_type_key } from "../../utils/AsyncStorageUtil";
import {
  changeCurrentWalletAddressType,
  getStorageCurrentWallet,
} from "../../utils/WalletUtils";
import useWalletStore from "@/stores/useWalletStore";
// import { BtcWallet, MvcWallet } from "@metalet/utxo-wallet-sdk";

export default function AssetsBtcDetailPage({ route }) {
  const { myCoinType } = route.params;
  const [btcActivityList, setBtcActivityList] = useState<TransactionList[]>([]);

  const [noticeContent, setNoticeContent] = useState("Successful");
  const [isShowNotice, setIsShowNotice] = useState(false);
  const { metaletWallet, updateMetaletWallet } = useData();
  const [isShowCopy, setIsShowCopy] = useState(false);
  const [addressType, setAddressType] = useState(AddressType.Legacy);
  const { setCurrentChainWallet } = useWalletStore();

  //当前btc 地址
  const { btcAddress, updateBtcAddress } = useData();
  console.log("myCoinType", myCoinType);

  useEffect(() => {
    getActivityList(btcAddress);
  }, []);

  async function getActivityList(address: string) {
    // let btcActivityListData: BtcRootRecord = await fetchBtcActivityRecord(
    //   "bc1qxwul4ktslh9zumv8nvp2seyukz0jcmdxzq8kx6"
    // );
    let btcActivityListData: BtcRootRecord =
      await fetchBtcActivityRecord(address);
      console.log("btcActivityListData", btcActivityListData);
      
    let datalist = btcActivityListData.data.transactionList;

    if (datalist.length == 0) {
      let record: TransactionList = {
        txId: "1",
        methodId: "",
        blockHash: "00",
        height: "00",
        transactionTime: "00",
        from: "00,00",
        to: "00,00,00",
        amount: "-0.02996359",
        transactionSymbol: "BTC",
        txFee: "0.00003107",
      };
      setBtcActivityList([...datalist, record]);
    } else {
      console.log("datalist", datalist);
      setBtcActivityList([...datalist]);
    }

    const currentWallet = await getStorageCurrentWallet();
    const addressType = currentWallet.addressType;
    setAddressType(addressType);
  }

  function ShowNotice(notice) {
    Clipboard.setString(notice);
    setNoticeContent("Copy Successful");
    setIsShowNotice(true);
    setTimeout(() => {
      setIsShowNotice(false);
    }, 800);
  }

  async function changAddressType(addressTpye) {
    setIsShowCopy(false);
    switch (addressTpye) {
      case AddressType.Legacy:
        metaletWallet.currentBtcWallet = metaletWallet.btcLegacyWallet;
        setAddressType(AddressType.Legacy);
        changeCurrentWalletAddressType(AddressType.Legacy);
        break;
      case AddressType.NestedSegwit:
        metaletWallet.currentBtcWallet = metaletWallet.btcNestedSegwitWallet;
        setAddressType(AddressType.NestedSegwit);
        changeCurrentWalletAddressType(AddressType.NestedSegwit);
        break;
      case AddressType.NativeSegwit:
        metaletWallet.currentBtcWallet = metaletWallet.btcNativeSegwitWallet;
        setAddressType(AddressType.NativeSegwit);
        changeCurrentWalletAddressType(AddressType.NativeSegwit);
        break;
      case AddressType.Taproot:
        metaletWallet.currentBtcWallet = metaletWallet.btcTaprootWallet;
        setAddressType(AddressType.Taproot);
        changeCurrentWalletAddressType(AddressType.Taproot);
        break;
      case AddressType.SameAsMvc:
        metaletWallet.currentBtcWallet = metaletWallet.btcSameAsWallet;
        setAddressType(AddressType.SameAsMvc);
        changeCurrentWalletAddressType(AddressType.SameAsMvc);
        break;
    }

    updateBtcAddress(metaletWallet.currentBtcWallet.getAddress());
    getActivityList(metaletWallet.currentBtcWallet.getAddress());

    setCurrentChainWallet(Chain.BTC, metaletWallet.currentBtcWallet);
    // getActivityList();
  }

  const ListItem = ({ index, item }) => {
    let isIncome;

    let showAmount;
    showAmount = item.amount;

    if (item.amount.startsWith("-")) {
      isIncome = false;
    } else {
      isIncome = true;
    }

    return (
      <View>
        {item?.txId !== "1" ? (
          <View
            style={{
              width: "100%",
              marginTop: 20,
              borderRadius: 10,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            {isIncome ? (
              <Image
                source={require("../../../image/assert_btcrecord_receive_icon.png")}
                style={{ width: 35, height: 35 }}
              />
            ) : (
              <Image
                source={require("../../../image/assert_btcrecord_send_icon.png")}
                style={{ width: 35, height: 35 }}
              />
            )}

            <View style={{ marginLeft: 10 }}>
              <Text
                style={{ fontSize: 16, color: "#000000", marginBottom: 10 }}
              >
                {isIncome ? "Receive" : "Send"}
              </Text>
              <Text style={metaStyles.grayTextSmall66}>
                {formatTime(parseInt(item.transactionTime))}
              </Text>
            </View>

            <View style={{ flex: 1 }} />
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontSize: 16,
                  color: isIncome ? "green" : "red",
                  marginBottom: 10,
                  textAlign: "right",
                }}
              >
                {isIncome ? "+" + showAmount : showAmount}
              </Text>

              <TouchableWithoutFeedback
                onPress={() => {
                  ShowNotice(item.txId);
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={[
                      metaStyles.grayTextSmall66,
                      { textAlign: "right", width: 100 },
                    ]}
                  >
                    {item.txId}
                  </Text>

                  <Image
                    source={require("../../../image/meta_copy_icon.png")}
                    style={{ width: 15, height: 15, marginLeft: 5 }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        ) : (
          <View
            style={{
              // flex:1,
              justifyContent: "center",
              alignItems: "center",
              // width: "100%",
              // height: "100%",
              // opacity: 0,
            }}
          >
            <Image
              source={require("../../../image/assert_record_nodata_icon.png")}
              style={{ width: 38, height: 53, marginTop: 100 }}
            />

            <Text style={[metaStyles.grayTextdefault66, { marginTop: 20 }]}>
              No activities
            </Text>
          </View>
        )}
      </View>
    );
  };

  const ListHeader = () => {
    return (
      <View
        style={{
          marginTop: 40,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Image
          source={require("../../../image/receive_btc_icon.png")}
          style={{ width: 70, height: 70 }}
        />

        <Text
          style={{
            color: "#333",
            textAlign: "center",
            marginTop: 20,
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          {/* {(metaletWallet.currentBtcBalance / 100000000).toFixed(8)} SPACE */}
          {metaletWallet.currentBtcBalance} BTC
        </Text>

        <Text
          style={{
            color: "#666",
            textAlign: "center",
            lineHeight: 20,
            marginTop: 10,
            fontSize: 18,
          }}
        >
          ${metaletWallet.currentBtcAssert}
        </Text>

        <View
          style={{
            marginTop: 40,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              navigate("SendBtcPage");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#F3F3FF",
                borderRadius: 30,
                paddingVertical: 20,
                paddingHorizontal: 30,
                alignItems: "center",
                justifyContent: "center",
                width: "40%",
              }}
            >
              <Image
                source={require("../../../image/assert_send_icon.png")}
                style={{ width: 15, height: 15 }}
              />

              <Text
                style={{
                  color: themeColor,
                  textAlign: "center",
                  marginLeft: 10,
                  lineHeight: 20,
                  fontSize: 18,
                }}
              >
                Send
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              navigate("ReceivePage", { myCoinType: "BTC" });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: themeColor,
                borderRadius: 30,
                paddingVertical: 20,
                paddingHorizontal: 30,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
                width: "40%",
              }}
            >
              <Image
                source={require("../../../image/assert_receive_icon.png")}
                style={{ width: 15, height: 15 }}
              />

              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  marginLeft: 10,
                  lineHeight: 20,
                  fontSize: 18,
                }}
              >
                Receive
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  const listHeaderComponent = <View>{ListHeader()}</View>;

  //   const listHeaderComponent = mvcActivityList.length === 0 ? ListHeader() : null;

  console.log("当前地址类型： " + addressType);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 操作提示 */}
      <LoadingNoticeModal title={noticeContent} isShow={isShowNotice} />

      {/* 切换address */}
      <Modal transparent={true} visible={isShowCopy}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
              paddingBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                Set Default Address
              </Text>

              <TouchableWithoutFeedback
                onPress={() => {
                  setIsShowCopy(false);
                }}
              >
                <Image
                  source={require("../../../image/metalet_close_big_icon.png")}
                  style={{ width: 15, height: 15, padding: 5 }}
                />
              </TouchableWithoutFeedback>
            </View>

            {/* btc Legacy */}
            <TouchableWithoutFeedback
              onPress={() => {
                changAddressType(AddressType.Legacy);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  marginHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../image/logo_btc.png")}
                  style={{ width: 35, height: 35, marginLeft: 20 }}
                />

                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{ fontSize: 15, width: "70%" }}
                    >
                      {metaletWallet.btcLegacyWallet.getAddress()}
                    </Text>
                  </View>
                  <Text
                    style={{ marginTop: 5, fontSize: 13, color: "#999" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Legacy
                  </Text>
                </View>

                {addressType == AddressType.Legacy ? (
                  <Image
                    source={require("../../../image/wallets_select_icon.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>

            {/* btc nested segwit */}
            <TouchableWithoutFeedback
              onPress={() => {
                changAddressType(AddressType.NestedSegwit);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  marginHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../image/logo_btc.png")}
                  style={{ width: 35, height: 35, marginLeft: 20 }}
                />

                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{ fontSize: 15, width: "70%" }}
                    >
                      {metaletWallet.btcNestedSegwitWallet.getAddress()}
                    </Text>
                  </View>
                  <Text
                    style={{ marginTop: 5, fontSize: 13, color: "#999" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Nested Segwit
                  </Text>
                </View>

                {addressType == AddressType.NestedSegwit ? (
                  <Image
                    source={require("../../../image/wallets_select_icon.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>

            {/* native segwit */}
            <TouchableWithoutFeedback
              onPress={() => {
                changAddressType(AddressType.NativeSegwit);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  marginHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../image/logo_btc.png")}
                  style={{ width: 35, height: 35, marginLeft: 20 }}
                />

                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{ fontSize: 15, width: "70%" }}
                    >
                      {metaletWallet.btcNativeSegwitWallet.getAddress()}
                    </Text>
                  </View>
                  <Text
                    style={{ marginTop: 5, fontSize: 13, color: "#999" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Native Segwit
                  </Text>
                </View>

                {addressType == AddressType.NativeSegwit ? (
                  <Image
                    source={require("../../../image/wallets_select_icon.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>

            {/* taproot */}
            <TouchableWithoutFeedback
              onPress={() => {
                changAddressType(AddressType.Taproot);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  marginHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../image/logo_btc.png")}
                  style={{ width: 35, height: 35, marginLeft: 20 }}
                />

                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{ fontSize: 15, width: "70%" }}
                    >
                      {metaletWallet.btcTaprootWallet.getAddress()}
                    </Text>
                  </View>
                  <Text
                    style={{ marginTop: 5, fontSize: 13, color: "#999" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Taproot
                  </Text>
                </View>
                {addressType == AddressType.Taproot ? (
                  <Image
                    source={require("../../../image/wallets_select_icon.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>
            {/* Same as Mvc */}
            <TouchableWithoutFeedback
              onPress={() => {
                changAddressType(AddressType.SameAsMvc);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  marginHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../image/logo_btc.png")}
                  style={{ width: 35, height: 35, marginLeft: 20 }}
                />

                <View style={{ marginLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={{ fontSize: 15, width: "70%" }}
                    >
                      {metaletWallet.btcSameAsWallet.getAddress()}
                    </Text>
                  </View>
                  <Text
                    style={{ marginTop: 5, fontSize: 13, color: "#999" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Same as MVC
                  </Text>
                </View>
                {addressType == AddressType.SameAsMvc ? (
                  <Image
                    source={require("../../../image/wallets_select_icon.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>
            {/* over */}
          </View>
        </View>
      </Modal>

      <View style={{ flex: 1 }}>
        {/* 头部 */}
        <View
          style={{
            flexDirection: "row",
            marginLeft: 20,
            marginTop: 5,
            height: 44,
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              goBack();
            }}
          >
            <Image
              source={require("../../../image/meta_back_icon.png")}
              style={{ width: 22, height: 22 }}
            />
          </TouchableWithoutFeedback>
          <Text
            style={[
              {
                textAlign: "center",
                marginRight: 40,
                marginLeft: 15,
                flex: 1,
                color: "#333333",
                fontSize: 18,
                fontWeight: "bold",
              },
            ]}
          ></Text>

          {myCoinType == "BTC" && (
            <TouchableWithoutFeedback
              onPress={() => {
                setIsShowCopy(true);
              }}
            >
              <Image
                source={require("../../../image/assert_adress_type_icon.png")}
                style={{ width: 22, height: 22 }}
              />
            </TouchableWithoutFeedback>
          )}
          <Text style={{ marginRight: 20, color: "#333", fontSize: 16 }}>
            {""}
          </Text>
        </View>

        {/* <ListHeader /> */}
        {/* 尾部 */}

        <FlatList
          data={btcActivityList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={ListItem}
          ListHeaderComponent={listHeaderComponent}
        />
      </View>
    </SafeAreaView>
  );
}
