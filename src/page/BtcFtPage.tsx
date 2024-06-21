import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  CircleAvatar,
  CircleAvatarLetter,
  NoMoreDataView,
} from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { BtcFtBean, RootBtcFtObject } from "../bean/BtcFtBean";
import { BTC_FT_URL, get } from "../utils/Api";
import { useData } from "../hooks/MyProvider";
import { useFocusEffect } from "@react-navigation/native";
import { eventBus, refreshBtcFtEvent } from "../utils/EventBus";
import { getCurrentBtcWallet } from "../wallet/wallet";
import { navigate } from "@/base/NavigationService";
import { getStorageCurrentWallet, getWalletNetwork, isColdWalletMode } from "@/utils/WalletUtils";
import { Chain } from "@metalet/utxo-wallet-service";

// now
export default function BtcFtPage() {
  let [btcFtList, setBtcFtList] = useState<BtcFtBean[]>([]);
  const { walletManager, updateWalletManager } = useData();
  const { accountIndex, updateAccountIndex } = useData();

  const { metaletWallet, updateMetaletWallet } = useData();
  const { btcAddress, updateBtcAddress } = useData();
  const { netWork, updateNetWork } = useData();

  // const isFocused = useIsFocused(); // 使用useIsFocused钩子
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    refresh();
  }, [btcAddress]);

  useFocusEffect(
    useCallback(() => {
      console.log("useFocusEffect  BtcFtPage", { btcAddress });
      refresh();
    }, [btcAddress])
  );

  async function refresh() {
    if (btcAddress) {
      getBtcFtData(btcAddress);
    } else {
      const isCold=await isColdWalletMode();
      if(isCold){
        const wallet=await getStorageCurrentWallet();
        getBtcFtData(wallet.coldAddress);
      }else{
        const mvcWallet = await getCurrentBtcWallet();
        getBtcFtData(mvcWallet.getAddress());
      }
    
    }
  }

  const getBtcFtData = async (address: string) => {
    const network = await getWalletNetwork(Chain.BTC);

    let params = {
      net: network,
      // address: metaletWallet.currentBtcWallet.getAddress(),
      address: address,
      ticker: "btc",
      cursor: 0,
      size: 10000,
    };

    let data: RootBtcFtObject = await get(BTC_FT_URL, false, params);

    if (data.data != null) {
      if (data.data.list != null) {
        setBtcFtList([...data.data.list]);
      } else {
        setBtcFtList([]);
      }
    } else {
      setBtcFtList([]);
    }
  };

  const ListItem: React.FC<{ index: number; item: BtcFtBean }> = ({
    index,
    item,
  }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigate("BRC20DetailPage", {
            brc20: item,
          });
        }}
      >
        <View style={styles.flatListStyle}>
          <CircleAvatarLetter letterStr={item.ticker.substring(0, 1)} />

          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, color: "#000000", marginBottom: 10 }}>
              {item.ticker.toUpperCase()}
            </Text>

            <View
              style={{
                backgroundColor: "rgba(247, 147, 26, 0.2)",
                borderRadius: 3,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 10, color: "#FF981C" }}>BRC20</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ fontSize: 16, color: "#000000", textAlign: "right" }}
            >
              {item.overallBalance!}
            </Text>
            <Text style={[metaStyles.grayTextSmall66, { textAlign: "right" }]}>
              - - - - - - - - - -{" "}
            </Text>
            <Text style={[metaStyles.grayTextSmall66, { textAlign: "right" }]}>
              Transferable:{" "}
            </Text>
            <Text style={[metaStyles.defaultText, { textAlign: "right" }]}>
              {item.transferableBalance!}{" "}
            </Text>
            <Text style={[metaStyles.grayTextSmall66, { textAlign: "right" }]}>
              Available:{" "}
            </Text>
            <Text style={[metaStyles.defaultText, { textAlign: "right" }]}>
              {item.availableBalance!}{" "}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // 定义 renderItem 函数
  const renderItem: ListRenderItem<BtcFtBean> = ({ item, index }) => {
    return <ListItem item={item} index={index} />;
  };

  return (
    <View style={[metaStyles.varContainer, { backgroundColor: "#fff" }]}>
      {btcFtList.length == 0 ? (
        <NoMoreDataView />
      ) : (
        <FlatList
          data={btcFtList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flatListStyle: {
    width: "100%",
    height: "auto",
    backgroundColor: "#F5F7F9",
    marginTop: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
