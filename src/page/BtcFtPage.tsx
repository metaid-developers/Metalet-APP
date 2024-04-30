import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CircleAvatar,
  CircleAvatarLetter,
  NoMoreDataView,
} from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { BtcFtBean, RootBtcFtObject } from "../bean/BtcFtBean";
import { BTC_FT_URL, get } from "../utils/Api";
import { useData } from "../hooks/MyProvider";

export default function BtcFtPage() {
  let [btcFtList, setBtcFtList] = useState<BtcFtBean[]>([]);
  const { walletManager, updateWalletManager } = useData();
  const {accountIndex,updateAccountIndex}=useData();

  const { metaletWallet, updateMetaletWallet } = useData();
  
  useEffect(() => {
    getBtcFtData();
  }, []);

  const getBtcFtData = async () => {
    let params = {
      net: "mainnet",
      address: metaletWallet.currentBtcWallet.getAddress(),
      ticker: "btc",
      cursor: 0,
      size: 10000,
    };

    let data: RootBtcFtObject = await get(BTC_FT_URL, false, params);
      if(data.data!=null){
        if (data.data.list != null) {
        setBtcFtList(data.data.list);
      }
    }
  };

  const ListItem = ({ index, item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          console.log("点击了" + index);
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
            style={{ fontSize: 16, color: "#000000", textAlign:'right' }}
          >
            {item.overallBalance!}
          </Text>
          <Text style={[metaStyles.grayTextSmall66,{textAlign:'right'}]}>- - - - - - - - - - </Text>
          <Text style={[metaStyles.grayTextSmall66,{textAlign:'right'}]}>Transferable: </Text>
          <Text style={[metaStyles.defaultText,{textAlign:'right'}]}>{item.transferableBalance!} </Text>
          <Text style={[metaStyles.grayTextSmall66,{textAlign:'right'}]}>Available: </Text>
          <Text style={[metaStyles.defaultText,{textAlign:'right'}]}>{item.availableBalance!} </Text>
        </View>

        </View>

    
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={[metaStyles.varContainer, { backgroundColor: "#fff" }]}>
      {btcFtList == null || (btcFtList.length == 0 && <NoMoreDataView />)}

      {btcFtList != null && (
        <View>
          <FlatList
            data={btcFtList}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={ListItem}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flatListStyle: {
    width: "100%",
    height: 'auto',
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
