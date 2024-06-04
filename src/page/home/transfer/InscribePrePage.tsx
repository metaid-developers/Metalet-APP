import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CircleAvatar,
  CircleAvatarLetter,
  Line,
  RoundSimButton,
  TitleBar,
} from "@/constant/Widget";
import { getBtcBrc20Icon } from "@/utils/AssertUtils";
import { litterWhittleBgColor, metaStyles } from "@/constant/Constants";
import { parseToSpace } from "@/utils/WalletUtils";
import { getCurrentBtcWallet, sendBtcTransaction } from "@/wallet/wallet";
import { navigate } from "@/base/NavigationService";
import { BtcTransferBean } from "@/api/type/BtcTransferBean";

export default function InscribePrePage({ route }) {
  const { inscribePre, brc20, amount, fileName } = route.params;
  const [isErrorIcon, setisErrorIcon] = useState(false);

  const [netFee, setNetFee] = useState("0");
  const [total, setTotal] = useState("0");
  const [rawTx, setRawTx] = useState<string>();
  const [transferRes, setTransferRes] = useState<BtcTransferBean>();

    console.log("inscribePre", inscribePre);
  //   console.log("brc20", brc20);

  let ImageUrl = getBtcBrc20Icon(brc20.ticker);

  useEffect(() => {
    sendTransactionPre();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TitleBar title="Inscribe Transfer" />
        <View
          style={{
            marginTop: 40,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {isErrorIcon ? (
            <CircleAvatarLetter
              widthC={60}
              heightC={60}
              letterStr={brc20.ticker.substring(0, 1)}
            />
          ) : (
            <CircleAvatar
              imageUrl={ImageUrl}
              event={() => {
                setisErrorIcon(true);
                // refreshData(brc20.txid);
              }}
            />
          )}

          <Text
            style={{
              color: "#333",
              textAlign: "center",
              marginTop: 20,
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            {/* {formatToDecimal(brc20.confirmed, brc20.decimal)}{" "}
          {brc20.symbol.toUpperCase()} */}
            {amount} {brc20.ticker.toUpperCase()}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            margin: 20,
            padding: 20,
          }}
        >
          <Text style={metaStyles.grayTextdefault66}> Preview</Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              backgroundColor: litterWhittleBgColor,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={metaStyles.smallDefaultText}>{fileName} </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>Network Fee</Text>
            <Text style={{ color: "#999", fontSize: 14 }}>{netFee} BTC</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>Need Amount</Text>
            <Text style={{ color: "#999", fontSize: 14 }}>
              {parseToSpace(inscribePre.needAmount)} BTC
            </Text>
          </View>

          <Line />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>Total</Text>
            <Text style={{ color: "#999", fontSize: 14 }}>{total} BTC</Text>
          </View>
        </View>

        <View style={{ margin: 20 }}>
          <RoundSimButton
            title={"Next"}
            textColor="#fff"
            event={() => {
              if (transferRes) {
                navigate("InscribeTransferPage", { transRes: transferRes,amount:amount,ticker:brc20.ticker ,fileName:fileName,orderID:inscribePre.orderId});
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );

  async function sendTransactionPre() {
    const address = (await getCurrentBtcWallet()).getAddress();
    const sendAmount = parseToSpace(inscribePre.needAmount);
    const feedRate = inscribePre.networkFeeRate;
    const payAddress = inscribePre.payAddress;

    console.log("sendAmount", sendAmount);
    console.log("feedRate", feedRate);
    console.log("address", address);
    console.log("payAddress", payAddress);

    const result = await sendBtcTransaction(
      address,
      payAddress,
      sendAmount,
      feedRate
    )

    const transfer: BtcTransferBean = {
      psbt: "",
      fee: result.fee,
      txInputs: result.txInputs,
      txOutputs: result.txOutputs,
      rawTx: result.rawTx,
      cost: result.cost,
    };

    const fee = parseFloat(result.cost) - inscribePre.needAmount;
    setNetFee(parseToSpace(fee.toString()));
    setTotal(parseToSpace(result.cost));

    if (result.rawTx) {
      setTransferRes(transfer);
      // setRawTx(result.rawTx)
      // navigate('InscribeTransferPage',{transRes: result})
    }

    // console.log("result", JSON.stringify(result));
  }
}
