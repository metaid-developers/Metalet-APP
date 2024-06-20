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
  CircleAvatar,
  CircleAvatarLetter,
  LoadingModal,
  LoadingNoticeModal,
  QRScanner,
  RoundSimButton,
  RoundSimButtonFlee,
  TitleBar,
  VerifyModal,
  styles,
} from "../../constant/Widget";
import { themeColor } from "../../constant/Constants";
import { navigate } from "../../base/NavigationService";
import { useData } from "../../hooks/MyProvider";
import { Wallet, API_TARGET, API_NET, FtManager } from "meta-contract";
import { broadcastSpace } from "../../api/metaletservice";
import {
  caculateToSatDecimal,
  formatToDecimal,
  getRandomID,
} from "../../utils/WalletUtils";
import { getIconUri } from "@mvc-org/mvc-resources";
import { removeTrailingZeros } from "@/utils/StringUtils";

export default function SendMvcFtPage({ route }) {
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

  const { mvcFtData } = route.params;
  let ImageUrl = getIconUri({
    type: "metaContract",
    codehash: mvcFtData.codeHash,
    genesis: mvcFtData.genesis,
  });
  if (!ImageUrl) {
    ImageUrl = "1";
  }

  function ShowNotice(notice: string) {
    setNoticeContent(notice);
    setIsShowNotice(true);
    setTimeout(() => {
      setIsShowNotice(false);
    }, 1500);
  }

  const sendSpace = async () => {
    if (inputAddress == "" || inputAmount == "") {
      return;
    }
    // let amount = Math.floor(parseFloat(inputAmount) * 100000000);
    // let amount = caculateToSatDecimal(
    //   parseFloat(inputAmount),
    //   mvcFtData.decimal
    // );

    // const divisor = Math.pow(10, mvcFtData.decimal);
    // const amount = (parseFloat(inputAmount) * divisor).toFixed(
    //   mvcFtData.decimal
    // );

    const amoutResult=caculateToSatDecimal(parseFloat(inputAmount),mvcFtData.decimal);

    if (parseFloat(amoutResult) <= 0) {
      return;
    }

    const privateKey: string = metaletWallet.currentMvcWallet.getPrivateKey();
    // const wallet = new Wallet(priviteKey, API_NET.MAIN, 1, API_TARGET.MVC);
    setIsShowLoading(true);
    const ftManager = new FtManager({
      network: API_NET.MAIN,
      purse: privateKey,
    });
    // const largestUtxo = await ftManager.api
    //   .getUnspents(metaletWallet.currentMvcWallet.getAddress())
    //   .then((utxos) => {
    //     return utxos.reduce((prev, curr) => {
    //       if (curr.satoshis > prev.satoshis) return curr;
    //       return prev;
    //     });
    //   })
    //   .then((utxo) => {
    //     // add wif to utxo
    //     return {
    //       ...utxo,
    //       wif: privateKey,
    //     };
    //   });

    //
    console.log(inputAddress);
    // console.log(inputAmount);
    console.log(amoutResult);

    const transferRes = await ftManager
      .transfer({
        codehash: mvcFtData.codeHash!,
        genesis: mvcFtData.genesis!,
        senderWif: privateKey,
        receivers: [
          {
            address: inputAddress,
            amount: amoutResult,
          },
        ],
        // utxos: [largestUtxo],
      })
      .catch((err) => {
        setIsShowLoading(false);
        console.log("报错 ： " + err.message);
        ShowNotice(err.message);
      });
    if (transferRes) {
      setIsShowLoading(false);
      // console.log("result ： " + JSON.stringify(transferRes));
      setrawTx(transferRes.txHex);
      setConfirmDailogState(true);
    }
    // if (sentRes) {
    //   const fee = Transaction.fromHex(sentRes.txHex).virtualSize();
    //   const total = amount + fee;
    //   setrawTx(sentRes.txHex);
    //   setConfirmDailogState(true);
    //   setfee((parseFloat(fee.toString()) / 100000000).toFixed(8));
    //   settotal((parseFloat(total.toString()) / 100000000).toFixed(8));
    //   console.log("fee" + fee);
    //   console.log("total" + total);
    // }

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
              {/* <Image
                source={require("../../../image/receive_mvc_icon.png")}
                style={{ width: 50, height: 50 }}
              /> */}

              {mvcFtData.imageError ? (
                <CircleAvatarLetter
                  letterStr={mvcFtData.name.substring(0, 1)}
                />
              ) : (
                <CircleAvatar
                  imageUrl={ImageUrl}
                  event={() => {
                    // refreshData(mvcFtData.txid);
                  }}
                />
              )}

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
                {inputAmount} {mvcFtData.symbol.toUpperCase()}
              </Text>
            </View>

            <View>
              <Text style={{ marginTop: 15, color: "#666", fontSize: 14 }}>
                From
              </Text>
              <Text style={{ marginTop: 5, color: "#333", fontSize: 14 }}>
                {metaletWallet.currentMvcWallet.getAddress()}
              </Text>
            </View>

            <View>
              <Text style={{ marginTop: 10, color: "#666", fontSize: 14 }}>
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
              <Text style={{ color: "#666", fontSize: 14 }}>Amount</Text>
              <Text style={{ marginTop: 5, color: "#333", fontSize: 14 }}>
                {inputAmount} {mvcFtData.symbol.toUpperCase()}
              </Text>
            </View>
            {/* 
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#666", fontSize: 14 }}>
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
              <Text style={{ color: "#666", fontSize: 14 }}>Total</Text>
              <Text style={{ color: "#333", fontSize: 14 }}>{total} SPACE</Text>
            </View> */}

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

            navigate("SendSuccessPage", {
              result: {
                chain:"mvc",
                symbol:mvcFtData.symbol.toUpperCase(),
                txid: txid,
                amount: inputAmount,
                address: inputAddress,
              },
            });
          }

          // navigate("SendSuccessPage", {
          //   result: {
          //     chain:"mvc",
          //     symbol:mvcFtData.symbol.toUpperCase(),
          //     txid: "txid",
          //     amount: inputAmount,
          //     address: inputAddress,
          //   },
          // });
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
            {/* <Image
              source={require("../../../image/receive_mvc_icon.png")}
              style={{ width: 70, height: 70 }}
            /> */}

            {mvcFtData.imageError ? (
              <CircleAvatarLetter letterStr={mvcFtData.name.substring(0, 1)} />
            ) : (
              <CircleAvatar
                imageUrl={ImageUrl}
                event={() => {
                  // refreshData(mvcFtData.txid);
                }}
              />
            )}
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
              {mvcFtData.name}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                backgroundColor: "rgba(23, 26, 255, 0.2)",
                padding: 5,
                width: 85,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
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
                // value={inputAddress}
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
                  formatToDecimal(mvcFtData.confirmed, mvcFtData.decimal) +
                  " " +
                  mvcFtData.symbol.toUpperCase()
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
                {mvcFtData.symbol.toUpperCase()}
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
