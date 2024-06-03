import { actionType } from "./actions/types";
import React, { useRef, useState } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import actionDispatcher from "./actions/action-dispatcher";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView } from "react-native";
import { METALET_WALLET_PREFIX } from "@/queries/hosts";
import { useDiscoverDataQuery } from "@/queries/discover";

const WebMap = {
  "Orders.Exchange": "",
};

export default function DiscoverPage() {
  // const { isLoading, data: discoverData } = useDiscoverDataQuery();

  const [num, setNum] = useState(2);

  return (
    <SafeAreaView className="w-screen h-screen pb-12 relative px-3.5 py-3 bg-white gap-y-5 overflow-hidden">
      <Text className="px-2.5 text-lg font-bold text-[#333333]">DApp</Text>
      <View className="flex flex-row items-center gap-x-2 h-10 leading-10 px-[18px] bg-[#F5F7F9] rounded-[60px] hidden">
        <SearchIcon className="text-[#BFC2CC]" />
        <Text className="text-[#BFC2CC]">app.orders.exchange</Text>
      </View>
      <View className="space-y-4 w-full">
        <Text>Recommended</Text>

        <ScrollView
          horizontal={true}
          className="flex flex-row gap-x-2 w-full m-0"
        >
          <View className="w-[180px]">
            <Image
              source={{
                uri: "https://www.metalet.space/wallet-api/v3/dapp/recover/recover-orders-exchange.png",
              }}
              className="w-full aspect-square rounded-2xl"
            />
            <View className="h-[50px] w-full absolute bottom-0 backdrop-blur-md flex flex-row items-center justify-between px-2">
              <View className="grow">
                <Text className="text-white text-xs font-bold w-[100px]">
                  Orders.Exchange
                </Text>
                <Text className="text-white/80 text-xs">Dex</Text>
              </View>
              <Image
                className="w-12 aspect-square rounded-xl -mt-6"
                source={{
                  uri: "https://www.metalet.space/wallet-api/v3/dapp/recover/recover-orders-exchange.png",
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
