import React from "react";
import * as Clipboard from "expo-clipboard";
import CopyIcon from "@/components/icons/CopyIcon";
import { Text, TouchableOpacity, View } from "react-native";

export default ({
  children,
  params: { feeRate, commitTx, revealTxs, totalCost, commitCost, revealCost },
}) => {
  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
  };
  return (
    <View className="space-y-2">
      {children ? children : null}
      <View className="flex flex-row items-center justify-between">
        <Text className="text-gray-primary">Commit Cost</Text>
        <Text>{commitCost / 1e8} BTC</Text>
      </View>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-gray-primary">Reveal Cost</Text>
        <Text>{revealCost / 1e8} BTC</Text>
      </View>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-gray-primary">Total Cost</Text>
        <Text>{totalCost / 1e8} BTC</Text>
      </View>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-gray-primary">Fee Rate</Text>
        <Text>{feeRate} sat/vB</Text>
      </View>
      {/* <View className="flex flex-row items-center justify-between">
        <Text className="text-gray-primary">CommitTx</Text>
        <TouchableOpacity onPress={() => copyToClipboard(commitTx.rawTx)}>
          <CopyIcon className="w-5 h-5 text-gray-primary" />
        </TouchableOpacity>
      </View> */}
      {/* {revealTxs.map((revealTx, i) => (
        <View
          key={revealTx.txId}
          className="flex flex-row items-center justify-between"
        >
          <Text className="text-gray-primary">RevealTx{i + 1}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(revealTx.rawTx)}>
            <CopyIcon className="w-5 h-5 text-gray-primary" />
          </TouchableOpacity>
        </View>
      ))} */}
    </View>
  );
};
