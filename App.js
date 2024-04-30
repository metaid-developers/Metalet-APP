import "./globals.js";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Component, useEffect } from "react";
import SplacePage from "./src/page/SplacePage";
import WelcomeWalletPage from "./src/page/WelcomeWalletPage";
import { NavigationContainer } from "@react-navigation/native";
import { NavigationService } from "./src/base/NavigationService";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./src/base/AppNavigator";
import { UserProvider, useData } from "./src/hooks/MyProvider";
import SettingsPage from "./src/page/SettingsPage";
import AsyncStorageUtil from "./src/utils/AsyncStorageUtil";

// import Index from './src/test.tsx'
// import Wintest from './src/wintest.tsx'
// import Sim from './src/sim.tsx'
// import Simnavi from './src/navi/simnavi.tsx'
// import Bottomnavi from './src/navi/bottomnavima.tsx'
// import Bottomnavi from './test/navi/bottomnavi.js'

// export default function App() {
//     return (
//       <Index/>
//       // <View style={styles.container}>
//       //   <Text>Open up App.js to start working on your app!</Text>
//       //   <StatusBar style="auto" />
//       // </View>
//     );

// }

export default function App() {
   


  // const initDataBase = async () => {
    // await AsyncStorageUtil.setItem("test", "test");
    // const test = await AsyncStorageUtil.getItem("test");
    // console.log("test", test);
  // };


  return (
    // <UserProvider>
    //   <SettingsPage />
    // </UserProvider>

    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}

// export default class App extends Component {
// render() {
// return (
// <Index/>
// <Sim/>
// <Wintest/>
// <Simnavi/>
// <Bottomnavi/>
// <View style={styles.container}>
//   <Text>Open up App.js to start working on your app!</Text>
//   <StatusBar style="auto" />
// </View>
// 测试
// <SplacePage/>
// <WelcomeWalletPage/>
// <UserProvider>
//    <AppNavigator/>
// </UserProvider>

//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
