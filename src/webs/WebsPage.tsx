import WebView from "react-native-webview";
import { actionType } from "./actions/types";
import { injectedJavaScript } from "./inject";
import React, { useRef, useState } from "react";
import actionDispatcher from "./actions/action-dispatcher";
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

interface Message {
  host: string;
  icon: string;
  nonce: string;
  channel: "to-metaidwallet";
  params: Record<string, unknown>;
  action: `${string}-${actionType}`;
}

export default function WebsPage() {
  const [icon, setIcon] = useState("");
  const [host, setHost] = useState("");
  const [actionMsg, setActionMsg] = useState<Message>();
  const [modalVisible, setModalVisible] = useState(false);

  const webViewRef = useRef(null);

  const onError = ({ nativeEvent }) => {
    console.log("onError", nativeEvent);
  };

  const handlerMessage = async (message: Message) => {
    console.log(message);
    const [actionName, actionType] = message.action.split("-");
    if (actionName === "Connect") {
      message.params.icon = message.icon;
    }
    setActionMsg(message);

    if (actionType === "authorize") {
      setModalVisible(true);
      setIcon(message.icon);
      setHost(message.host);
    } else {
      const { process } = actionDispatcher(message.action);
      const data = await process(message.params, message.host);
      postMessage(
        JSON.stringify({
          data,
          nonce: message.nonce,
        })
      );
    }
  };

  const cancelAction = async () => {
    postMessage(
      JSON.stringify({
        nonce: actionMsg.nonce,
        data: {
          status: "canceled",
        },
      })
    );
    setModalVisible(false);
  };

  const confirmAction = async () => {
    const { process } = actionDispatcher(actionMsg.action);
    const data = await process(actionMsg.params, actionMsg.host);
    postMessage(
      JSON.stringify({
        data,
        nonce: actionMsg.nonce,
      })
    );
    setModalVisible(false);
  };

  const postMessage = async (message: unknown) => {
    webViewRef.current.postMessage(message);
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
            <Text>{JSON.stringify(actionMsg)}</Text>
          </View>

          <View className="flex flex-row items-center justify-center pt-6 pb-12 w-full gap-2">
            <Pressable
              onPress={cancelAction}
              className="w-[120px] rounded-3xl bg-blue-light py-4"
            >
              <Text className="text-center text-sm text-blue-primary">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={confirmAction}
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
        <WebView
          ref={webViewRef}
          useWebKit={true}
          onError={onError}
          allowFileAccess={true}
          javaScriptEnabled={true}
          injectedJavaScript={injectedJavaScript}
          javaScriptCanOpenWindowsAutomatically={true}
          source={{ uri: "https://metalet-tester.vercel.app/" }}
          onMessage={(e) => {
            handlerMessage(JSON.parse(e.nativeEvent.data));
          }}
        />
      )}
    </SafeAreaView>
  );
}
