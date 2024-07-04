import { navigate } from "@/base/NavigationService";
import SearchIcon from "@/components/icons/SearchIcon";
import useNetworkStore from "@/stores/useNetworkStore";
import { METALET_WALLET_PREFIX } from "@/queries/hosts";
import { useDiscoverDataQuery } from "@/queries/discover";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { metaStyles } from "@/constant/Constants";

export default function DiscoverPage() {
  const { width } = Dimensions.get("window");

  const { network } = useNetworkStore();
  const { isLoading, data: discoverData } = useDiscoverDataQuery(network, {
    enabled: !!network,
  });

  // console.log("discoverData", discoverData);
  

  return (
    // className="w-screen h-screen pb-12 relative px-3.5 py-3 bg-white gap-y-5 overflow-hidden"
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          marginTop: 20,
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        {/* <Text className="px-2.5 text-lg font-bold text-[#333333]">DApp</Text>
         */}
        <Text style={[{ textAlign: "left" }, metaStyles.titleText]}>DApp</Text>
        <View className="flex flex-row items-center gap-x-2 h-10 leading-10 px-[18px] bg-[#F5F7F9] rounded-[60px] hidden">
          <SearchIcon className="text-[#BFC2CC]" />
          <Text className="text-[#BFC2CC]">app.orders.exchange</Text>
        </View>

        {isLoading ? (
          <Text className="w-full py-12 text-center">Loading...</Text>
        ) : null}

        {discoverData && discoverData.recommend ? (
          <View className="space-y-4 w-full" style={{marginTop:20}}>
            <Text className="font-bold">Recommended</Text>
            <ScrollView
              horizontal={true}
              // className="flex flex-row gap-x-2.5 w-full pb-2 m-0 "
              style={{marginVertical:20}}
              scrollEnabled={false}
            >
              {discoverData.recommend.length === -1
                ? discoverData.recommend.map((recommend) => (
                    <View className="flex-1" key={recommend.url}>
                      <Image
                        className="w-full aspect-square rounded-2xl"
                        source={{
                          uri: `${METALET_WALLET_PREFIX}${recommend.recover}`,
                        }}
                      />
                      <View
                        style={{ backgroundColor: recommend.themeColor }}
                        className="h-[50px] w-full absolute bottom-0 flex flex-row gap-1 items-center justify-between px-2 rounded-b-2xl"
                      >
                        <View className="flex-1 space-y-2">
                          <Text className="text-white text-xs font-bold">
                            {recommend.name}
                          </Text>
                          <Text className="text-white/80 text-xs">
                            {recommend.desc}
                          </Text>
                        </View>
                        <Image
                          className="w-12 aspect-square rounded-xl -mt-6"
                          source={{
                            uri: `${METALET_WALLET_PREFIX}${recommend.icon}`,
                          }}
                        />
                      </View>
                    </View>
                  ))
                : discoverData.recommend.map((recommend) => (
                    <TouchableOpacity
                      className="w-40"
                      style={{marginLeft:recommend.name=="Orders.Exchange"? 0:20}}
                      key={recommend.url}
                      onPress={() => {
                        console.log('url',recommend.url);
                        
                        navigate("WebsPage", {
                          url: recommend.url,
                        });
                      }}
                    >
                      <Image
                        className="w-full aspect-square rounded-2xl"
                        // style={{
                        //   width: 40,
                        //   height: 40,
                        //   borderRadius: 20,
                        // }}
                        source={{
                          uri: `${METALET_WALLET_PREFIX}${recommend.recover}`,
                        }}
                      />
                      <View
                        style={{ backgroundColor: recommend.themeColor }}
                        className="h-12 w-full absolute bottom-0 flex flex-row items-center justify-between px-2 rounded-b-2xl"
                      >
                        <View className="flex-1 pr-2">
                          <Text
                            numberOfLines={1}
                            className="text-white text-xs font-bold"
                          >
                            {recommend.name}
                          </Text>
                          <Text className="text-white/80 text-xs">
                            {recommend.desc}
                          </Text>
                        </View>
                        <Image
                          className="w-12 h-12 rounded-xl -mt-6"
                          source={{
                            uri: `${METALET_WALLET_PREFIX}${recommend.icon}`,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
            </ScrollView>
          </View>
        ) : null}

        {discoverData && discoverData.tops ? (
          <View className="space-y-2 w-full flex-1">
            <Text className="font-bold">TOP</Text>
            <ScrollView className="flex flex-col gap-y-4 w-full">
              {discoverData.tops.map((top) => (
                <TouchableOpacity
                  key={top.url}
                  className="w-full flex flex-row items-center gap-x-2"
                  onPress={() => {
                    navigate("WebsPage", {
                      url: top.url,
                      icon: `${METALET_WALLET_PREFIX}${top.icon}`,
                    });
                  }}
                >
                  <Image
                    className="w-12 h-12 rounded-2xl"
                    source={{
                      uri: `${METALET_WALLET_PREFIX}${top.icon}`,
                    }}
                  />
                  <View className="flex-1 flex flex-col gap-y-1">
                    <Text className="text-sm font-medium">{top.name}</Text>
                    <Text
                      numberOfLines={2}
                      className="text-[#666666] text-xs w-full"
                    >
                      {top.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
