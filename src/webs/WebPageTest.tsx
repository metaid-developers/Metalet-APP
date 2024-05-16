import { Text, View, SafeAreaView } from "react-native";
import React, { Component } from "react";
import WebView from "react-native-webview";
import { useData } from "../hooks/MyProvider";

export default class WebPageTest extends Component {
  
  render() {


    const webview =  getWebView();
    // inject();

    return webview;
  }

  onError = ({ nativeEvent }) => {
    console.log("onError", nativeEvent);
  };
}

function inject() {
  // alert('injecting')
  // this.webViewRef.metaidwallet = {
  //   ping: () => {
  //     alert('ping')
  //     return 'pong'
  //   }
  // }
}

function getWebView() {
  // const injected = function() {
  //   // @ts-ignore
  //   window.metaidwallet = {
  //     getAddress: function() {
  //       // Your logic to get address here
  //       return 'Your address';
  //     },
  //     getPublick: function() {
  //       // Your logic to get public key here
  //       return 'Your public key';
  //     }
  //   };
  // }

  // turn injected into iife string
  // const injectMetaIdWallet = `(${injected.toString()})()`;
  // const injectMetaIdWallet2 = `(function() {
  //   // @ts-ignore
  //   window.metaidwallet = {
  //     getAddress: function() {
  //       // Your logic to get address here
  //       return 'Your address';
  //     },
  //     getPublick: function() {
  //       // Your logic to get public key here
  //       return 'Your public key';
  //     }
  //   };
  // })()`;
  // alert(injectMetaIdWallet)
  // alert(injectMetaIdWallet2)


  const injectMetaIdWallet = `
    (function() {
      window.metaidwallet = {
        getAddress: function() {
          window.postMessage('getAddress','*')
        },
        getPublick: function() {
          // Your logic to get public key here
          window.postMessage('getPublick','*')
        }
      };
    })();
  `;


  const injectedJavaScript = `
  // 第三个 JavaScript 代码片段
  const postMessage = async function (data) {
    window.ReactNativeWebView.postMessage(data);

    const subscribe = (callback) => {
      const eventListener = (nativeEvent) => {
        // const {actionType, extra} = nativeEvent.data && JSON.parse(nativeEvent.data) || {}
        // console.log("接受到RN信息：",nativeEvent.data)

        // alert("webView收到信息" + nativeEvent.data);
        callback(nativeEvent.data);
      };

      //安卓用document，ios用window
      window.addEventListener("message", eventListener);
      document.addEventListener("message", eventListener);
    };

    return await new Promise((resolve, reject) => {
      subscribe((data) => {
        resolve(data);
      });
    });
  };

  // 第一个 JavaScript 代码片段
  window.metaidwallet = {
    getAddress: async function () {
      return await postMessage("getAddress", "*");
    },
    getPublick: function () {
      postMessage("getPublick", "*");
    },
  };
  
  // 第二个 JavaScript 代码片段
  function getUserAddress() {
    postMessage("get", "*");
  }
  
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text
          style={[{ marginTop: 100 }, { color: "red" }]}
          onPress={postRNMessage}
        >
          给WebView 发送数据
        </Text>
      </View>

      <WebView
        style={[{ marginTop: 20 }]}
        source={require("../../assets/metatest.html")}
        ref={(ref) => (this.webViewRef = ref)}
        javaScriptEnabled
        allowFileAccess
        onError={this.onError}
        javaScriptCanOpenWindowsAutomatically
        useWebKit={true}
        // injectedJavaScript={"javascript:function deliverCode(data) { window.ReactNativeWebView.postMessage(data) };"}
        injectedJavaScript={
          // "(function() {window.postMessage = function(data) {window.ReactNativeWebView.postMessage(data)}})();"
          // `function getUserAddress(){
          //   window.postMessage('get','*')}
          //  `
          injectedJavaScript
         
        }
         // injectMetaIdWallet
        onMessage={(e) => {
          // 接受来自web的消息
          // console.log(e.nativeEvent.data);
          postRNMessage(e)
        }}
       
      />
    </SafeAreaView>
  );
}

async function postRNMessage(e) {
  // console.log("");
  // console.log(this.webViewRef.postMessage);
  //给web发送消息
  const message=e.nativeEvent.data;
  console.log('收到 getAddress 请求'+message);
  if(message==='getAddress'){
    console.log('收到 getAddress 请求');
    
    this.webViewRef.postMessage( await getAddress());
  }
 
}



async function getAddress(){
  return new Promise(resolve => {
    setTimeout(() => {
      const address = '123456';
      resolve(address);
    }, 500); // 模拟2秒的异步获取时间
  });
}





//函数组件式
// import { View, Text, SafeAreaView } from "react-native";
// import React, { useRef, useState } from "react";
// import WebView from "react-native-webview";

// export default function WebsPage() {
// //   const [webViewRef, setWebViewRef] = useState(null);
//   const webViewRef = useRef(null);

//   const onError = ({ nativeEvent }) => {
//     console.log("onError", nativeEvent);
//   };

//   const postRNMessage = () => {
//     console.log("点击");
//     // console.log(webViewRef.postMessage);
//     //给web发送消息
//     webViewRef.current.postMessage("i rn data");
//   };

//   const GetWebView = () => {
//     return (
//       <WebView
//         style={{ marginTop: 20 }}
//         source={require("../../assets/test.html")}
//         ref={webViewRef}
//         javaScriptEnabled={true}
//         allowFileAccess={true}
//         onError={onError}
//         javaScriptCanOpenWindowsAutomatically={true}
//         useWebKit={true}
//         // injectedJavaScript={"javascript:function deliverCode(data) { window.ReactNativeWebView.postMessage(data) };"}
//         injectedJavaScript={
//           "(function() {window.postMessage = function(data) {window.ReactNativeWebView.postMessage(data)}})();"
//         }
//         onMessage={(e) => {
//           // 接受来自web的消息
//           console.log(e.nativeEvent.data);
//           // handleMessage2(e)
//         }}
//       />
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={{ flex: 1 }}>
//       <Text
//           style={[{ marginTop: 100 }, { color: "red" }]}
//           onPress={postRNMessage}
//         >
//           给WebView 发送数据
//         </Text>

//         <GetWebView />
//       </View>
//     </SafeAreaView>
//   );
// }
