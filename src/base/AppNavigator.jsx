import * as React from "react";
import { View, Text, Image } from "react-native";
import { NavigationContainerRef } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { setTopLevelNavigator } from "./NavigationService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { metaStyles } from "../constant/Constants";
import EasyToast from "react-native-easy-toast";

// import { ToastContainer } from 'react-native-toastify';
// import 'react-native-toastify';
// import { ToastContainer } from 'react-native-toastify';
// pages
import HomePage from "../page/HomePage";
import SettingsPage from "../page/SettingsPage";
import WelcomeWalletPage from "../page/WelcomeWalletPage";
import Index from "../page/Index";
import SplashPage from "../page/SplashPage";
import ImportWalletPage from "../page/ImportWalletPage";
import CongratulationsPage from "../page/CongratulationsPage";
import MvcNftListPage from "../page/MvcNftListPage";
import MvcNftDetailPage from "../page/MvcNftDetailPage";
import TransferMvcNftPage from "../page/TransferMvcNftPage";
import WalletsPage from "../page/WalletsPage";
import AddWalletPage from "../page/wallet/AddWalletPage";
import WalletDetailPage from "../page/wallet/WalletDetailPage";
import WalletDetelePage from "../page/wallet/WalletDetelePage";
import WalletAccountDetailPage from "../page/wallet/WalletAccountDetailPage";
import AccountAddressPage from "../page/wallet/AccountAddressPage";
import NetWorkPage from "../page/NetWorkPage";
import FtMvcPage from "../page/nft/FtMvcPage";
import FtBtcPage from "../page/nft/FtBtcPage";
import FtParentPage from "../page/nft/FtParentPage";
import SelectReceivePage from "../page/receive/SelectReceivePage";
import ReceivePage from "../page/receive/ReceivePage";
import WebPage from "../webs/WebPage";
import WebPageTest from "../webs/WebPageTest";
import WebsPage from "../webs/WebsPage";
import AssetsMvcDetailPage from "../page/home/AssetsMvcDetailPage";
import AssetsBtcDetailPage from "../page/home/AssetsBtcDetailPage";
import SendSelectAssertPage from "../page/home/SendSelectAssertPage";
import PasswordPage from "../page/home/PasswordPage";
import SendSpacePage from "../page/home/SendSpacePage";
import SendBtcPage from "../page/home/SendBtcPage";
import SendBtcConfirmPage from "../page/home/SendBtcConfirmPage";
import SendBtcSuccessPage from "../page/home/SendBtcSuccessPage";
import SendSpaceSuccessPage from "../page/home/SendSpaceSuccessPage";
import SetPasswordPage from "../page/safe/SetPasswordPage";
import AssetsMvcFtDetailPage from "../page/home/AssetsMvcFtDetailPage";
import SendMvcFtPage from "../page/home/SendMvcFtPage";
import SendSuccessPage from "@/page/home/SendSuccessPage";
import PlazaPage from "@/page/PlazaPage";
import Brc20DetailPage from "@/page/home/Brc20DetailPage";

////////

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 创建一个包裹整个应用的NavigationContainer，并将ref关联起来
const AppNavigator = () => {
  return (
    <NavigationContainer
      ref={(navigatorRef) => {
        // Toast.setRef(navigatorRef)
        setTopLevelNavigator(navigatorRef);
      }}
    >
      {/* initialRouteName="Index" */}
      {/* 这里放置你的StackNavigator、TabNavigator或其他导航组件 */}

      {/* <Stack.Screen name="Home" component={HomePage} /> */}
      {/* <Stack.Screen name="Settings" component={SettingsPages} /> */}
      <StackNavigator />
    </NavigationContainer>
  );
};
export default AppNavigator;

const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="WebsPage"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="ImportWalletPage" component={ImportWalletPage} />
    <Stack.Screen name="SplashPage" component={SplashPage} />
    <Stack.Screen name="WelcomeWalletPage" component={WelcomeWalletPage} />
    <Stack.Screen name="CongratulationsPage" component={CongratulationsPage} />
    <Stack.Screen
      name="Tabs"
      component={TabNavigator}
      options={{ unmountOnBlur: false }}
    />
    <Stack.Screen name="MvcNftListPage" component={MvcNftListPage} />
    <Stack.Screen name="MvcNftDetailPage" component={MvcNftDetailPage} />
    <Stack.Screen name="TransferMvcNftPage" component={TransferMvcNftPage} />
    <Stack.Screen name="WalletsPage" component={WalletsPage} />
    <Stack.Screen name="AddWalletPage" component={AddWalletPage} />
    <Stack.Screen name="WalletDetailPage" component={WalletDetailPage} />
    <Stack.Screen name="WalletDetelePage" component={WalletDetelePage} />
    <Stack.Screen
      name="WalletAccountDetailPage"
      component={WalletAccountDetailPage}
    />
    <Stack.Screen name="AccountAddressPage" component={AccountAddressPage} />
    <Stack.Screen name="NetWorkPage" component={NetWorkPage} />
    <Stack.Screen name="SelectReceivePage" component={SelectReceivePage} />
    <Stack.Screen name="ReceivePage" component={ReceivePage} />
    <Stack.Screen name="WebPage" component={WebPage} />
    <Stack.Screen name="WebPageTest" component={WebPageTest} />
    <Stack.Screen name="WebsPage" component={WebsPage} />
    <Stack.Screen name="AssetsMvcDetailPage" component={AssetsMvcDetailPage} />
    <Stack.Screen name="AssetsBtcDetailPage" component={AssetsBtcDetailPage} />
    <Stack.Screen
      name="SendSelectAssertPage"
      component={SendSelectAssertPage}
    />
    <Stack.Screen name="PasswordPage" component={PasswordPage} />
    <Stack.Screen name="SendSpacePage" component={SendSpacePage} />
    <Stack.Screen name="SendBtcPage" component={SendBtcPage} />
    <Stack.Screen name="SendBtcConfirmPage" component={SendBtcConfirmPage} />
    <Stack.Screen name="SendBtcSuccessPage" component={SendBtcSuccessPage} />
    <Stack.Screen
      name="SendSpaceSuccessPage"
      component={SendSpaceSuccessPage}
    />
    <Stack.Screen name="SetPasswordPage" component={SetPasswordPage} />
    <Stack.Screen
      name="AssetsMvcFtDetailPage"
      component={AssetsMvcFtDetailPage}
    />
    <Stack.Screen name="SendMvcFtPage" component={SendMvcFtPage} />
    <Stack.Screen name="SendSuccessPage" component={SendSuccessPage} />
    <Stack.Screen name="Brc20DetailPage" component={Brc20DetailPage} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarShowLabel: false,
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let icon;
        if (route.name === "HomePage") {
          icon = focused ? (
            <Image
              source={require("../../image/me_index_select_tab.png")}
              style={metaStyles.tabImage}
            />
          ) : (
            <Image
              source={require("../../image/me_index_normal_tab.png")}
              style={metaStyles.tabImage}
            />
          );
        } 

        else if (route.name === "WebsPage") {
          icon = focused ? (
            <Image
              source={require("../../image/me_plaza_select_tab.png")}
              style={metaStyles.tabImage}
            />
          ) : (
            <Image
              source={require("../../image/me_plaza_normal_tab.png")}
              style={metaStyles.tabImage}
            />
          );
        
        // else if (route.name === "PlazaPage") {
        //   icon = focused ? (
        //     <Image
        //       source={require("../../image/me_plaza_select_tab.png")}
        //       style={metaStyles.tabImage}
        //     />
        //   ) : (
        //     <Image
        //       source={require("../../image/me_plaza_normal_tab.png")}
        //       style={metaStyles.tabImage}
        //     />
        //   );
        } else {
          icon = focused ? (
            <Image
              source={require("../../image/me_settings_select_tab.png")}
              style={metaStyles.tabImage}
            />
          ) : (
            <Image
              source={require("../../image/me_settings_normal_tab.png")}
              style={metaStyles.tabImage}
            />
          );
        }
        return icon;
      },
    })}
  >
    <Tab.Screen headerShown={false} name="HomePage" component={HomePage} />
    {/* <Tab.Screen name="PlazaPage" component={PlazaPage} /> */}
    <Tab.Screen name="WebsPage" component={WebsPage} />
    <Tab.Screen name="SettingsPage" component={SettingsPage} />
  </Tab.Navigator>
);
