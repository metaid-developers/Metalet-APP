import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { metaStyles } from "../constant/Constants";
import { CustomTabBar, NoMoreDataView } from "../constant/Widget";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BtcFtPage from "./BtcFtPage";
import MvcFtPage from "./MvcFtpage";
import { Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useData } from "../hooks/MyProvider";

const TabsTop = createMaterialTopTabNavigator();

export default function FtPage() {


  return (
    <View style={[metaStyles.varContainer,{backgroundColor:"#fff"}]}>
     <TabsTopNavigator />
    </View>
  );
}



function TabsTopNavigator() {
  return (
    <TabsTop.Navigator
      tabBar={(props) => <CustomTabBar {...props } isShowIndicator={false} isSmallTitle={true} />}
      style={{ flex: 1,  marginTop: 10 }}
      // <TabsTop.Navigator
      // tabBarPosition="top"
      // screenOptions={{
      //   tabBarLabelStyle: { fontSize: 12, fontWeight: "bold",textTransform: 'none', },
      //   tabBarInactiveTintColor: "#666666",
      //   tabBarActiveTintColor: "#333333",
      //   tabBarStyle: { backgroundColor: "#fff",height: 50, elevation: 0 },
      //   //下划线
      //   tabBarIndicatorStyle: {
      //     backgroundColor: "#1F2CFF",
      //     height: 3,
      //     width: 20,
      //     marginLeft: 30,
      //   },
      //   // tabBarItemStyle: {  width: 120,paddingRight:40 ,alignItems:'flex-start'}, //每个item 宽度

      // }}
      // tabBarOptions={{
      //   labelStyle: { fontSize: 16 },
      //   tabStyle: { width: 'auto', justifyContent: 'flex-start' }, // 设置选项卡左对齐
      //   indicatorStyle: { backgroundColor: 'blue' }, // 下划线样式
      // }}
      // style={{ flex: 1,  }}
    >
      <TabsTop.Screen
        name="BtcFtPage"
        options={{ title: "Bitcoin" }}
        component={BtcFtPage}
      />
      <TabsTop.Screen
        name="MvcFtPage"
        options={{ title: "Space" }}
        component={MvcFtPage}
      />
    </TabsTop.Navigator>
  );
}

