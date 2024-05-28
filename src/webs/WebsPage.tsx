import WebView from "react-native-webview";
import { injectedJavaScript } from "./inject";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  Button,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";

type actionType = "authorize" | "query";

interface Message {
  params: Record<string, unknown>;
  channel: "to-metaidwallet";
  host: string;
  nonce: string;
  action: `${string}-${actionType}`;
  icon: string;
}

export default function WebsPage() {
  const [icon, setIcon] = useState("");
  const [host, setHost] = useState("");
  const [actionName, setActionName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const webViewRef = useRef(null);

  const onError = ({ nativeEvent }) => {
    console.log("onError", nativeEvent);
  };

  const postRNMessage = async (message: Message) => {
    console.log(message);
    const [actionName, actionType] = message.action.split("-");
    if (actionType === "authorize") {
      setModalVisible(true);
      setIcon(message.icon);
      setHost(message.host);
      setActionName(actionName);
    }
    //给web发送消息
    webViewRef.current.postMessage(await getAddress());
  };

  async function getAddress() {
    return "123456";
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
          postRNMessage(JSON.parse(e.nativeEvent.data));
        }}
      />
    );
  };

  return (
    <SafeAreaView className="w-screen h-screen">
      <Modal animationType="slide" visible={modalVisible}>
        <View className="w-screen h-screen flex flex-col items-center px-4">
          <Text className="text-blue-primary text-2xl tracking-wide py-6">
            AUTHORIZE
          </Text>
          {/* FIXME: color unwork */}
          {/* <Text className="bg-gradient-to-r from-teal-primary to-blue-primary bg-clip-text text-transparent text-lg tracking-wide">
            AUTHORIZE
          </Text> */}
          {icon ? (
            <Image source={{ uri: icon }} className="w-24 h-24" />
          ) : (
            <Text className="w-24 h-24 rounded-full bg-blue-primary flex items-center justify-center">
              {host[0] || ""}
            </Text>
          )}

          <Text className="text-sm text-gray-500 py-6">
            {`${host} would like to:`}
          </Text>

          <View className="grow overflow-y-auto rounded-lg bg-gray-50 px-4 py-6 text-sm w-full">
            <Text>{actionName}</Text>
          </View>

          <View className="flex flex-row items-center justify-center pt-6 pb-12 w-full gap-2">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="w-[120px] rounded-3xl bg-blue-light py-4"
            >
              <Text className="text-center text-sm text-blue-primary">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="w-[120px] rounded-3xl bg-blue-primary py-4"
            >
              <Text className="text-center text-sm text-white">Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {Platform.OS === "web" ? (
        <View className="w-full h-full flex flex-col items-center justify-center">
          <Text className="mb-4">GetWebView does not support on web</Text>
          <Button onPress={() => setModalVisible(true)} title="Show Modal" />
        </View>
      ) : (
        <GetWebView />
      )}
    </SafeAreaView>
  );
}
