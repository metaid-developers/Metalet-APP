import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { metaStyles } from "../constant/Constants";
import { NoMoreDataView } from "../constant/Widget";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BtcFtPage from "./BtcFtPage";
import MvcFtPage from "./MvcFtpage";
import { Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const TabsTop = createMaterialTopTabNavigator();

export default function FtPage() {
  const [hasData, setHasData] = useState(true);

  return (
    <View style={[metaStyles.varContainer]}>
      {/* {!hasData && <NoMoreDataView/>} */}
      {hasData && <TabsTopNavigator />}
    </View>
  );
}

const CustomTabBarLabel = ({ label, focused, tabWidth }) => (
  <View style={{ width: tabWidth }}>
    <Text style={{ color: focused ? "blue" : "black" }}>{label}</Text>
  </View>
);

function TabsTopNavigator() {
  return (
    <TabsTop.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
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
        options={{ title: "MetaContract" }}
        component={MvcFtPage}
      />
    </TabsTop.Navigator>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: "row", backgroundColor: "white" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View 
          key={route.key}
          style={{alignItems:'center'}}>
            <Text
              key={index}
              style={{
                fontSize: isFocused ? 13 : 13,
                marginHorizontal: 10,
                marginVertical:5,
                fontWeight: isFocused ? "bold" : "normal",
              }}
              onPress={onPress}
            >
              {label}
            </Text>
            {isFocused && (
              <LinearGradient
                colors={["#FFD700", "#FF6347"]}
                style={styles.indicator}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}

            {/* {isFocused && <View style={styles.indicator2} />} */}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  indicator2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "red",
  },
  indicator: {
    width: 30,
    height: 2,
    backgroundColor: "blue",
  },
});
