import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  QRScanner,
  RoundSimButton,
  TitleBar,
  styles,
} from "../../constant/Widget";
import { inputNormalBgColor, themeColor } from "../../constant/Constants";
import { FeedBean, FeedBtcObject } from "../../types/btcfeed";
import { fetchBtcFeed } from "../../api/metaletservice";

export default function SendBtcPage() {
  const [nextBtnColor, setNextBtnColor] = useState("rgba(23, 26, 255, 0.5)");
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [isInputAddressFcous, setIsInputAddressFcous] = useState(false);
  const [isInputAmountFcous, setIsInputAmountFcous] = useState(false);

  // 扫描
  const [isScan, setIsScan] = useState(false);
  //feed
  const [isShowFeed, setIsShowFeed] = useState(false);
  const feedModeSlow = "Slow";
  const feedModeAvg = "Avg";
  const feedModeFast = "Fast";
  const feedModeCustom = "Custom";
  const [feedModeType, setFeedModeType] = useState(feedModeAvg);
  const textInputRef = useRef(null);
  const [feed, setFeed]=useState("10");
  const [feedReady, setFeedReady]=useState("10");

  const [userSlowFeed, setSlowFeed] = useState<FeedBean>({
    title: "",
    feeRate: 10,
    desc: "",
  });
  const [userAvgFeed, setAvgFeed] = useState<FeedBean>({
    title: "",
    feeRate: 10,
    desc: "",
  });
  const [userFastFeed, setFastFeed] = useState<FeedBean>({
    title: "",
    feeRate: 10,
    desc: "",
  });

  useEffect(() => {
    getFeed();
  }, []);

  async function getFeed() {
    const feedObj: FeedBtcObject = await fetchBtcFeed();

    if (feedObj) {
      let feedList = feedObj.data.list;
      setSlowFeed(feedList[2]);
      setAvgFeed(feedList[1]);
      setFastFeed(feedList[0]);
      setFeed(feedList[1].feeRate.toString());
      setFeedReady(feedList[1].feeRate.toString());
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal transparent={true} visible={isShowFeed}>
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
              padding: 20,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingBottom: 40,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Select Fee Rate
              </Text>

              <View style={{ flex: 1 }} />

              <TouchableWithoutFeedback
                onPress={() => {
                  setIsShowFeed(false);
                }}
              >
                <Image
                  source={require("../../../image/metalet_close_big_icon.png")}
                  style={{ width: 15, height: 15 }}
                />
              </TouchableWithoutFeedback>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setFeedModeType(feedModeSlow);
                  if (textInputRef.current) {
                    textInputRef.current.blur();
                  }
                  setFeedReady(userSlowFeed.feeRate.toString())
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderColor:
                      feedModeType == feedModeSlow
                        ? themeColor
                        : inputNormalBgColor,
                    borderWidth: 0.8,
                    borderRadius: 5,
                    height: 100,
                  }}
                >
                  {feedModeType == feedModeSlow && (
                    <Image
                      source={require("../../../image/fee_icon_tag.png")}
                      style={{
                        width: 13,
                        height: 13,
                        position: "absolute",
                        right: 0,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333" }}>{userSlowFeed.title}</Text>
                    <Text style={{ marginTop: 3, color: "#000" }}>
                      {userSlowFeed.feeRate} sat/vB
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12, marginTop: 3 }}>
                      {userSlowFeed.desc}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  setFeedModeType(feedModeAvg);
                  if (textInputRef.current) {
                    textInputRef.current.blur();
                  }
                  setFeedReady(userAvgFeed.feeRate.toString())
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderColor:
                      feedModeType == feedModeAvg
                        ? themeColor
                        : inputNormalBgColor,
                    borderWidth: 0.8,
                    borderRadius: 5,
                    height: 100,
                    marginLeft: 10,
                  }}
                >
                  {feedModeType == feedModeAvg && (
                    <Image
                      source={require("../../../image/fee_icon_tag.png")}
                      style={{
                        width: 13,
                        height: 13,
                        position: "absolute",
                        right: 0,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333" }}>{userAvgFeed.title}</Text>
                    <Text style={{ marginTop: 3, color: "#000" }}>
                      {userAvgFeed.feeRate} sat/vB
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12, marginTop: 3 }}>
                      {userAvgFeed.desc}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  setFeedModeType(feedModeFast);
                  if (textInputRef.current) {
                    textInputRef.current.blur();
                  }
                  setFeedReady(userFastFeed.feeRate.toString())
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderColor:
                      feedModeType == feedModeFast
                        ? themeColor
                        : inputNormalBgColor,
                    borderWidth: 0.8,
                    borderRadius: 5,
                    height: 100,
                    marginLeft: 10,
                  }}
                >
                  {feedModeType == feedModeFast && (
                    <Image
                      source={require("../../../image/fee_icon_tag.png")}
                      style={{
                        width: 13,
                        height: 13,
                        position: "absolute",
                        right: 0,
                      }}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333" }}>{userFastFeed.title}</Text>
                    <Text style={{ marginTop: 3, color: "#000" }}>
                      {userFastFeed.feeRate} sat/vB
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12, marginTop: 3 }}>
                      {userFastFeed.desc}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <TouchableWithoutFeedback
              onPress={() => {
                setFeedModeType(feedModeCustom);
              }}
            >
              <View
                style={{
                  borderColor:
                    feedModeType == feedModeCustom
                      ? themeColor
                      : inputNormalBgColor,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginTop: 20,
                  height: "auto",
                }}
              >
                {feedModeType == feedModeCustom && (
                  <Image
                    source={require("../../../image/fee_icon_tag.png")}
                    style={{
                      width: 13,
                      height: 13,
                      position: "absolute",
                      right: 0,
                    }}
                  />
                )}
                <View
                  style={{
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Text>Custom Fee Rate</Text>

                  <TextInput
                    placeholder="sat/vB"
                   
                    ref={textInputRef}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      if(feedModeType == feedModeCustom ){
                        // const numericInput = text.replace(/[^0-9]/g, '');
                        setFeedReady(text);
                        // setFeed(parseInt(numericInput));
                      }
                    }}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                    }}
                    onFocus={() => {
                      // setFeedModeType(feedModeCustom);
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={async () => {
              setFeed(feedReady)
              setIsShowFeed(false)
            }}>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
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
                      width: "70%",
                      backgroundColor: themeColor,
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
        </View>
      </Modal>

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
              source={require("../../../image/receive_btc_icon.png")}
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
              BTC
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
                  paddingRight: 10,
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

            {/* 这个暂时不显示 */}
            {/* <Text
              style={{
                marginTop: 40,
                color: "#999",
                fontSize: 13,
                width: "100%",
                textAlign: "right",
                paddingRight: 5,
              }}
            >
              Max:0.003234 BTC
            </Text> */}

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
                marginTop: 40,
              }}
            >
              <TextInput
                placeholder="Amount"
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
                BTC
              </Text>
            </View>
          </View>

          <View style={{ marginHorizontal: 20, paddingHorizontal: 25 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#666", fontSize: 14 }}>Balance</Text>
              <Text style={{ color: "#999", fontSize: 14 }}>
                0.00000546 TBC
              </Text>
            </View>

            {/* <View style={{ flexDirection: "row" ,justifyContent: "space-between" ,marginTop: 10}}>
              <Text style={{ color: "#999" ,fontSize: 14}}>Pending</Text>
              <Text style={{ color: "#999" ,fontSize: 14}}>0.00000546 TBC</Text>
            </View> */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#666", fontSize: 14 }}>Available</Text>
              <Text style={{ color: "#999", fontSize: 14 }}>
                0.00000546 TBC
              </Text>
            </View>

            <TouchableWithoutFeedback
              onPress={() => {
                setIsShowFeed(true);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 15,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#666", fontSize: 14 }}>Fee Rate</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ color: "#999", fontSize: 14 }}>
                  {feed} sat/vB
                </Text>
                <Image
                  source={require("../../../image/list_icon_ins.png")}
                  style={{ width: 18, height: 18 }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <View style={{ flex: 1 }} /> */}
          <View
            style={{
              marginHorizontal: 20,
              paddingHorizontal: 25,
              marginTop: 90,
            }}
          >
            <RoundSimButton
              title={"Next"}
              event={() => {}}
              roundStytle={{}}
              textColor="#fff"
              color={nextBtnColor}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
