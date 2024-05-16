import { Text, View, SafeAreaView } from "react-native";
import React, { Component } from "react";
import WebView from "react-native-webview";

export default class WebPage extends Component {
  render() {
    return getWebView();
  }

  onError = ({ nativeEvent }) => {
    console.log("onError", nativeEvent);
  };
}

function getWebView() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <WebView
          style={[{ marginTop: 20 }]}
          // source={require("../../assets/test.html")}
          source={{ uri: "https://testnet.orders.exchange/swap " }}
          ref={(ref) => (this.webViewRef = ref)}
          javaScriptEnabled
          allowFileAccess
          onError={this.onError}
          javaScriptCanOpenWindowsAutomatically
          useWebKit={true}
          // injectedJavaScript={"javascript:function deliverCode(data) { window.ReactNativeWebView.postMessage(data) };"}
          injectedJavaScript={
            "(function() {window.postMessage = function(data) {window.ReactNativeWebView.postMessage(data)}})();"
          }
          onMessage={(e) => {
            // 接受来自web的消息
            console.log(e.nativeEvent.data);
            // handleMessage2(e)
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function postRNMessage() {
  console.log("点击");
  // console.log(this.webViewRef.postMessage);
  //给web发送消息
  this.webViewRef.postMessage("i rn data");
}
