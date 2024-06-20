import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LoadingModal,
  LoadingNoticeModal,
  QRScanner,
  RoundSimButton,
  RoundSimButtonFlee,
  TitleBar,
  ToastView,
  VerifyModal,
  styles,
} from "../../constant/Widget";
import { grayNormalColor, themeColor } from "../../constant/Constants";
import { navigate } from "../../base/NavigationService";
import { useData } from "../../hooks/MyProvider";
import { Wallet, API_TARGET, API_NET } from "meta-contract";
import { Transaction } from "bitcoinjs-lib";
import { broadcastSpace } from "../../api/metaletservice";
import { getRandomID, getWalletNetwork } from "../../utils/WalletUtils";

export default function SendSpacePage() {
  const [nextBtnColor, setNextBtnColor] = useState("rgba(23, 26, 255, 0.5)");
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [isInputAddressFcous, setIsInputAddressFcous] = useState(false);
  const [isInputAmountFcous, setIsInputAmountFcous] = useState(false);

  // 扫描
  const [isScan, setIsScan] = useState(false);

  //提示
  const [isShowNotice, setIsShowNotice] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [noticeContent, setNoticeContent] = useState("Successful");
  const [confirmDailogState, setConfirmDailogState] = useState(false);

  // verfiy
  const [isShowVerify, setIsShowVerify] = useState(false);

  const { metaletWallet, updateMetaletWallet } = useData();

  // commfirn
  const [fee, setfee] = useState("");
  const [total, settotal] = useState("");
  const [rawTx, setrawTx] = useState("");
  const { needRefreshHome, updateNeedRefreshHome } = useData();

  const sendSpace = async () => {
    if (inputAddress == "" || inputAmount == "") {
      return;
    }
    let amount = Math.floor(parseFloat(inputAmount) * 100000000);

    if (amount < 1000) {
      return;
    }

    const priviteKey: string = metaletWallet.currentMvcWallet.getPrivateKey();
    const network = await getWalletNetwork();
    const wallet = new Wallet(priviteKey,network === "mainnet" ? API_NET.MAIN :API_NET.TEST, 1, API_TARGET.MVC);


    
    //
    console.log(wallet.address.toString());
    console.log(inputAddress);
    console.log(inputAmount);
    console.log(amount);

    const sentRes = await wallet
      .send(inputAddress, amount, { noBroadcast: true })
      .catch((err) => {
        console.log(err);
        ToastView({ text: err.toString() ,type: "error" });
      });

      console.log(sentRes);
      
    if (sentRes) {
      setConfirmDailogState(true);
      const fee = Transaction.fromHex(sentRes.txHex).virtualSize();
      const total = amount + fee;
      setrawTx(sentRes.txHex);

      setfee((parseFloat(fee.toString()) / 100000000).toFixed(8));
      settotal((parseFloat(total.toString()) / 100000000).toFixed(8));
      console.log("fee" + fee);
      console.log("total" + total);
    }

    // wallet
    //   .send(inputAddress, amount, { noBroadcast: true })
    //   .then((res) => {
    //     console.log(res);
    //     setIsShowLoading(false);
    //     // navigate("SendSpaceSuccessPage");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoadingModal
        isShow={isShowLoading}
        isCancel={true}
        event={() => {
          setIsShowLoading(false);
        }}
      />

      <LoadingNoticeModal title={noticeContent} isShow={isShowNotice} />

      <Modal visible={confirmDailogState} transparent={true}>
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
            }}
          >
            {/* <Text style={{ textAlign: "center", fontSize: 16 }}>
              Confirm Transaction
            </Text> */}

            {/* 头部 */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../image/receive_mvc_icon.png")}
                style={{ width: 50, height: 50 }}
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
                {inputAmount} SPACE
              </Text>
            </View>

            <View>
              <Text style={{ marginTop: 15, color: grayNormalColor, fontSize: 14 }}>
                From
              </Text>
              <Text style={{ marginTop: 5, color: "#333", fontSize: 14 }}>
                {metaletWallet.currentMvcWallet.getAddress()}
              </Text>
            </View>

            <View>
              <Text style={{ marginTop: 10, color:grayNormalColor, fontSize: 14 }}>
                To
              </Text>
              <Text style={{ marginTop: 5, color: "#333", fontSize: 14 }}>
                {inputAddress}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: grayNormalColor, fontSize: 14 }}>Amount</Text>
              <Text style={{ marginTop: 5, color: "#333", fontSize: 14 }}>
                {inputAmount} SPACE
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: grayNormalColor, fontSize: 14 }}>
                Fees(Estimated)
              </Text>
              <Text style={{ color: "#333", fontSize: 14 }}>{fee} SPACE</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: grayNormalColor, fontSize: 14 }}>Total</Text>
              <Text style={{ color: "#333", fontSize: 14 }}>{total} SPACE</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <RoundSimButtonFlee
                title={"Cancel"}
                style={{
                  borderRadius: 10,
                  height: 40,
                  width: "45%",
                  borderWidth: 1,
                  borderColor: themeColor,
                }}
                color="#fff"
                textColor="#171AFF"
                event={() => {
                  setConfirmDailogState(false);
                }}
              />

              <RoundSimButtonFlee
                title={"Confirm"}
                style={{ borderRadius: 10, height: 40, width: "45%" }}
                textColor="#fff"
                event={() => {
                  setConfirmDailogState(false);
                  setIsShowVerify(true);
                  // OpenModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* pay verify modal */}
      <VerifyModal
        isShow={isShowVerify}
        eventCancel={() => {
          setIsShowVerify(false);
        }}
        event={async () => {
          setIsShowVerify(false);
        
          const { txid, message } = await broadcastSpace(rawTx);
          if (txid != null) {
            updateNeedRefreshHome(getRandomID());

            navigate("SendSpaceSuccessPage", {
              result: {
                txid: txid,
                chain: "mvc",
                amount: inputAmount,
                address: inputAddress,
              },
            });
          }
        }}
      />

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
              Transfer Amount
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
                placeholder={
                  metaletWallet.currentMvcBalance  + " SPACE"
                }
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
                  paddingRight: 10,
                }}
              />

              <Text style={{ marginRight: 10, fontSize: 14, color: "#333" }}>
                SPACE
              </Text>
            </View>

            <RoundSimButton
              title={"Next"}
              event={() => {
                sendSpace();
              }}
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
