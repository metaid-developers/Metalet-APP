import WebView from "react-native-webview";
import { injectedJavaScript } from "./inject";
import React, { useRef, useState } from "react";
import { View, Text, SafeAreaView, Platform } from "react-native";

export default function WebsPage() {
  //   const [webViewRef, setWebViewRef] = useState(null);
  const webViewRef = useRef(null);

  const onError = ({ nativeEvent }) => {
    console.log("onError", nativeEvent);
  };

  const postRNMessage = async (e: unknown) => {
    console.log("点击");
    // console.log(webViewRef.postMessage);
    //给web发送消息
    webViewRef.current.postMessage(await getAddress());
  };

  async function getAddress() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const address = "123456";
        resolve(address);
      }, 500); // 模拟2秒的异步获取时间
    });
  }

  const GetWebView = () => {
    return (
      <WebView
        style={{ marginTop: 20 }}
        source={{ uri: "https://metalet-tester.vercel.app/" }}
        ref={webViewRef}
        javaScriptEnabled={true}
        allowFileAccess={true}
        onError={onError}
        javaScriptCanOpenWindowsAutomatically={true}
        useWebKit={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={(e) => {
          // 接受来自web的消息
          console.log(e.nativeEvent.data);
          postRNMessage(e);
          // handleMessage2(e)
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === "web" ? (
        <View>GetWebView does not support on web</View>
      ) : (
        <GetWebView />
      )}
    </SafeAreaView>
  );
}
