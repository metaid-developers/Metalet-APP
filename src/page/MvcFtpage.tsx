import {
  View,
  Text,
  LogBox,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CircleAvatar,
  CircleAvatarLetter,
  GradientAvatar,
  NoMoreDataView,
} from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { BASE_METALET_URL, get } from "../utils/Api";
import { useData } from "../hooks/MyProvider";
import { MvcFtBeans, RootObject } from "../bean/DataBean";
import { List } from "react-native-paper";
import { removeTrailingZeros } from "../utils/StringUtils";
import { checkImage, getShowImageUrl } from "../utils/MetaFunUiils";

export default function MvcFtPage() {
  const { userData, updateUserData } = useData();
  const { walletManager, updateWalletManager } = useData();
  const {accountIndex,updateAccountIndex}=useData();

  let [ftList, setftList] = useState<MvcFtBeans[]>();
  const { metaletWallet, updateMetaletWallet } = useData();

  let mvcAddress
  

  useEffect(() => {
    mvcAddress=metaletWallet.currentMvcWallet.getAddress()

    getMvcFtData();
  }, []);

  async function getMvcFtData() {
    let param = {
      page: 1,
      pageSize: 30,
      chain: "mvc",
    };
    let data: RootObject = await get(
      BASE_METALET_URL +
        "/aggregation/v2/app/show/ft/"+
        mvcAddress+
        "/summaries",
      false,
      param
    );
    //可以设置任何对象到全局变量
    // updateUserData(data);
    if (data.data.results.items != null) {
      setftList(data.data.results.items);
    }
  }

  const [data, setData] = useState([]);


  const refreshData = (id) => {
    setftList((prevList) =>
      prevList.map((item) =>
        item.name === id ? { ...item, imageError: true } : item
      )
    );
  };

  const ListItem = ({ index, item }) => {
    let ImageUrl = getShowImageUrl(item.icon!);
    //  const resut=await checkImage(ImageUrl)
    //  setICanLoadImage(resut)
    return (
     <TouchableWithoutFeedback onPress={()=>{
      console.log("item.name",item.name)
     }}>
       <View style={styles.flatListStyle}>
        {item.imageError ? (
          <CircleAvatarLetter letterStr={item.name.substring(0, 1)} />
        ) : (
          <CircleAvatar
            imageUrl={ImageUrl}
            event={() => {
              refreshData(item.name);
            }}
          />
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, color: "#000000", marginBottom: 10 }}>
            {item.symbol.toUpperCase()}
          </Text>
          <Text style={metaStyles.grayTextSmall66}>{item.name}</Text>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 16, color: "#000000", marginBottom: 10 ,textAlign:'right' }}
          >
            {removeTrailingZeros(item.balance)}
          </Text>
          <Text style={[metaStyles.grayTextSmall66,{textAlign:'right'}]}>$32983.99</Text>
        </View>
      </View>
     </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={[metaStyles.varContainer, { backgroundColor: "#fff" }]}>
      {ftList == null ||
        (ftList.length == 0 && <NoMoreDataView  />)}
      {/* {hasData && userData!=null &&<Text>名称： {ftList[0]}  年龄：{11}</Text>} */}
      {ftList != null && (
        <View>
          <FlatList
            data={ftList}
            renderItem={ListItem}
            keyExtractor={(item, index) => item.name}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flatListStyle: {
    width: "100%",
    height: 100,
    backgroundColor: "#F5F7F9",
    marginTop: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
