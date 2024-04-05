import {
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { navigate } from "../base/NavigationService";
import { metaStyles } from "../constant/Constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientAvatar } from "../constant/Widget";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SplacePage from "./SplacePage";
import WelcomeWalletPage from "./WelcomeWalletPage";
import { NavigationContainer } from "@react-navigation/native";
import AssetsPage from "./AssetsPage";
import FtPage from "./FtPage";
import NftPage from "./NftPage";


const TabsTop = createMaterialTopTabNavigator();
let defaultAvatarColor = "";

export default function HomePage(props: any) {
  return (
    <SafeAreaView style={metaStyles.parentContainer}>
      <View
        style={[
          metaStyles.rowMarginContainer,
          { height: 45, alignItems: "center" },
        ]}
      >
        {/* <Image source={require('../assets/images/logo.png')} style={metaStyles.logo}/> */}
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 44, height: 44 }}
        />
        <View style={{ flex: 1 }} />
        <Image
          source={require("../../image/meta_btc_icon.png")}
          style={{ width: 24, height: 24 }}
        />
        <Image
          source={require("../../image/meta_last_icon.png")}
          style={{ width: 8, height: 6, marginLeft: 5 }}
        />
      </View>

      <View style={[metaStyles.varContainer, { marginHorizontal: 30 }]}>
        <View style={[metaStyles.rowContainer, { alignItems: "center" }]}>
          <GradientAvatar />
          <View style={{ marginLeft: 10 }}>
            <View style={[metaStyles.rowCenterContainer, { height: 20 }]}>
              <Text style={metaStyles.grayTextdefault66}>Wallet A-</Text>
              <Text style={metaStyles.defaultText}>Account 01</Text>
              <Image
                source={require("../../image/meta_last_icon.png")}
                style={{ width: 8, height: 6, marginLeft: 5 }}
              />
              <Image
                source={require("../../image/meta_copy_icon.png")}
                style={{ width: 14, height: 14, marginLeft: 10 }}
              />
            </View>
            <Text style={[metaStyles.bigLargeDefaultText, { marginTop: 3 }]}>
              $82,352.31
            </Text>
          </View>
        </View>

        <View
          style={[
            metaStyles.rowContainer,
            { justifyContent: "space-between", marginTop: 10 },
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_send_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Send
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_receive_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Receive
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_record_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Record
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_swap_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Swap
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("click");
            }}
          >
            <View style={{ marginTop: 20 }}>
              <Image
                source={require("../../image/meta_home_bridge_icon.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text style={[{ marginTop: 10 }, metaStyles.smallDefaultText]}>
                Bridge
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <MyTabs />
      </View>
    </SafeAreaView>
  );
}


function MyTabs() {
  return (
    <TabsTop.Navigator
      tabBarPosition="top"
      // screenOptions={({ route }) => ({
      //   tabBarStyle:{backgroundColor:'#fff',height:50,elevation: 0 },
      //   tabBarIndicatorStyle:{backgroundColor:'#1F2CFF',height:3,width:20,marginLeft:40},
      //   tabBarItemStyle:{height:50,width:100,},//每个item 宽度
      //   tabBarLabel: ({ focused }) => {
      //     const fontSize = focused ? 14 : 12; // 控制选中和非选中状态的文字大小
      //     return <Text style={{fontWeight:focused?'bold':'normal',color:focused?'#333333':'#666666',fontSize:fontSize,textTransform: 'none',}}> {route.name}</Text>
      //   },
      // })}
      screenOptions={{
        tabBarLabelStyle:{fontSize:15,fontWeight:'bold',textTransform: 'none',},
        tabBarInactiveTintColor:'#666666',
        tabBarActiveTintColor:'#000000',
        tabBarStyle:{backgroundColor:'#fff',height:50,elevation: 0 },
        tabBarIndicatorStyle:{backgroundColor:'#1F2CFF',height:3,width:20,marginLeft:40},
        tabBarItemStyle:{height:50,width:100,},//每个item 宽度
      }}
      style={{ flex: 1, marginBottom: 20,marginTop: 10 }}
    >
      <TabsTop.Screen name="Assets" options={{ title: "Assets"}} component={AssetsPage} />
      <TabsTop.Screen name="FT" options={{ title: "FT" }} component={FtPage} />
      <TabsTop.Screen name="NFT" options={{ title: "NFT" } }component={NftPage} />
    </TabsTop.Navigator>
  );
}
