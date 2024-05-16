import { View, Text, SafeAreaView } from "react-native";
import React, { useRef, useState } from "react";
import WebView from "react-native-webview";
import { injectedJavaScript } from "./actions";

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


async function getAddress(){
  return new Promise(resolve => {
    setTimeout(() => {
      const address = '123456';
      resolve(address);
    }, 500); // 模拟2秒的异步获取时间
  });
}

  const GetWebView = () => {
    return (
      <WebView
        style={{ marginTop: 20 }}
        source={require("../../assets/metatest.html")}
        ref={webViewRef}
        javaScriptEnabled={true}
        allowFileAccess={true}
        onError={onError}
        javaScriptCanOpenWindowsAutomatically={true}
        useWebKit={true}
        // injectedJavaScript={"javascript:function deliverCode(data) { window.ReactNativeWebView.postMessage(data) };"}
        injectedJavaScript={
          // "(function() {window.postMessage = function(data) {window.ReactNativeWebView.postMessage(data)}})();"
          injectedJavaScript
        }
        onMessage={(e) => {
          // 接受来自web的消息
          console.log(e.nativeEvent.data);
          postRNMessage(e)
          // handleMessage2(e)
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
      <Text
          style={[{ marginTop: 100 }, { color: "red" }]}
          onPress={postRNMessage}
        >
          给WebView 发送数据
        </Text>

        <GetWebView />
      </View>
    </SafeAreaView>
  );
}
