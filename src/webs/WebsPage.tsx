import WebView from "react-native-webview";
import { ActionType } from "./actions/types";
import { injectedJavaScript } from "./inject";
import CloseIcon from "@/components/icons/CloseIcon";
import { createElement, ComponentType } from "react";
import actionDispatcher from "./actions/action-dispatcher";
import React, { useEffect, useRef, useState } from "react";
import { navigate, goBack } from "@/base/NavigationService";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBadgeIcon from "@/components/icons/CheckBadgeIcon";
import {
  View,
  Text,
  Modal,
  Image,
  Button,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CircleAvatarLetter } from "@/constant/Widget";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { inputNormalBgColor, litterWhittleBgColor } from "@/constant/Constants";

interface Message {
  host: string;
  icon: string;
  nonce: string;
  channel: "to-metaidwallet";
  params: Record<string, unknown>;
  action: `${string}-${ActionType}`;
}

export default function WebsPage(props) {
  const webViewRef = useRef(null);
  const [uri, setURI] = useState("");
  const [icon, setIcon] = useState("");
  const [host, setHost] = useState("");
  const [actionName, setActionName] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const [actionMsg, setActionMsg] = useState<Message>();
  const [modalVisible, setModalVisible] = useState(false);
  const [needEstimated, setNeedEstimated] = useState(false);
  const [componentInfo, setComponentInfo] = useState<{
    params: Record<string, unknown>;
    component: ComponentType<{
      params: object;
      ref?: React.MutableRefObject<any>;
    }>;
  }>(null);

  const metaidComponentRef = useRef<{
    getEstimatedData: () => null;
  } | null>(null);

  useEffect(() => {
    if (!props.route.params?.url) {
      navigate("DiscoverPage");
    } else {
      setURI(props.route.params.url);
      setIcon(props.route.params.icon);
    }
  }, []);

  const onError = ({ nativeEvent }) => {
    console.log("onError", nativeEvent);
  };

  const handlerMessage = async (
    message: Message & { type: string; data: unknown }
  ) => {
    // console.log("handlerMessage", message);

    if (message.type === "Console") {
      console.info(`[Console] ${JSON.stringify(message.data)}`);
      return;
    }
    const [actionName, actionType] = message.action.split("-");

    // if (actionName === "Transfer") {
    //   console.log("message", message);
    // }

    if (actionName === "Connect") {
      message.params.icon = message.icon;
    }

    setActionMsg(message);

    if (actionType === ActionType.Authorize) {
      console.log("message", message);

      setModalVisible(true);
      if(message.icon){
        setIcon(message.icon);
      }
      setHost(message.host);
      const { title, descriptions, component, needEstimated } =
        actionDispatcher(actionName, actionType);
      setActionName(title);
      setComponentInfo({ component, params: message.params });
      setDescriptions(descriptions);
      setNeedEstimated(needEstimated);
    } else if (actionType === ActionType.Query) {
      const { process } = actionDispatcher(actionName, ActionType.Query);
      const data = await process(message.params, message.host);
      console.log("data", data);

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
    const [actionName, actionType] = actionMsg.action.split("-");
    if (actionType === ActionType.Authorize && needEstimated) {
      const data = metaidComponentRef.current.getEstimatedData();
      const { nextComponent, estimate } = actionDispatcher(
        actionName,
        ActionType.Authorize
      );
      const params = await estimate(data);
      setNeedEstimated(false);
      setComponentInfo({ component: nextComponent, params });
    } else {
      const { process } = actionDispatcher(
        actionName,
        actionType as ActionType
      );
      // console.log("confirmAction params", componentInfo.params);

      const data = await process(componentInfo.params, actionMsg.host);
      console.log("confirmAction data", data);

      postMessage(
        JSON.stringify({
          data,
          nonce: actionMsg.nonce,
        })
      );
      setModalVisible(false);
    }
  };

  const postMessage = async (message: unknown) => {
    webViewRef.current.postMessage(message);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal animationType="slide" visible={modalVisible}>
        {/* <View className="w-screen h-screen flex flex-col items-center px-4"> */}
      <SafeAreaView style={{ flex: 1 ,margin:Platform.OS === "ios"?30:0 ,}}>
      <View
          style={{
            flex: 1,
            margin: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Text className="text-blue-primary text-2xl tracking-wide py-6">
            AUTHORIZE
          </Text> */}

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <MaskedView
              style={{
                flexDirection: "row",
                height: 60,
              }}
              maskElement={
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  AUTHORIZE
                </Text>
              }
            >
              <LinearGradient
                colors={["#6CE5F7", "#1F2CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
          </View>
          {/* FIXME: color unwork */}
          {/* <Text className="bg-gradient-to-r from-teal-primary to-blue-primary bg-clip-text text-transparent text-lg tracking-wide">
            AUTHORIZE
          </Text> */}
          {icon ? (
            // <Image source={{ uri: icon }} className="w-24 h-24 rounded-lg" />
            <Image source={{ uri: icon }} style={{ width: 80, height: 80 ,borderRadius:10}} />
          ) : (
            <CircleAvatarLetter
              widthC={70}
              heightC={70}
              letterStr={host[0] || ""}
            />
            // <Text className="w-24 h-24 rounded-full bg-blue-primary flex items-center justify-center">
            //   {host[0] || ""}
            // </Text>
          )}

          <Text className="text-sm text-gray-500 py-6">
            {`${host} would like to:`}
          </Text>

          <ScrollView className="overflow-y-auto rounded-lg bg-gray-50 text-sm w-full">
            <View className="p-4 space-y-2">
              {componentInfo
                ? createElement(
                    componentInfo.component,
                    {
                      params: componentInfo.params,
                      ref: needEstimated ? metaidComponentRef : undefined,
                    },
                    <View className="space-y-2">
                      <Text className="text-base">{actionName}</Text>
                      {descriptions.map((description, index) => (
                        <View
                          key={index}
                          className="flex flex-row gap-x-0.5 w-full"
                        >
                          <CheckBadgeIcon className="w-6 h-6 -mt-0.5" />
                          <Text className="flex-1">{description}</Text>
                        </View>
                      ))}
                    </View>
                  )
                : null}
            </View>
          </ScrollView>

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
              <Text className="text-center text-sm text-white">
                {needEstimated ? "Next" : "Confirm"}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
      </Modal>

      {/* className="flex flex-row items-center px-2.5 gap-x-2 h-14 py-2" */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {/* className="bg-[#E5EAEE] px-[18px] h-full leading-10 grow rounded-[60px]" */}
        {/* <Text  style={{backgroundColor:'#E5EAEE',flex:1,padding:10,borderRadius:10, overflow: 'hidden',}}> */}
        <Text
          style={{
            backgroundColor: litterWhittleBgColor,
            flex: 1,
            padding: 10,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {uri}
        </Text>
        <TouchableOpacity
          onPress={() => goBack()}
          className="border border-[#E7E7E7] rounded-full w-10 h-10 flex items-center justify-center"
          style={{ marginLeft: 10 }}
        >
          <CloseIcon className="text-black-primary w-2.5 h-2.5" />
        </TouchableOpacity>
      </View>

      {Platform.OS === "web" ? (
        <View className="w-full h-full flex flex-col items-center justify-center">
          <Text className="mb-4">GetWebView does not support on web</Text>
          <Button onPress={() => setModalVisible(true)} title="Show Modal" />
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri }}
          useWebKit={true}
          onError={onError}
          allowFileAccess={true}
          javaScriptEnabled={true}
          injectedJavaScript={injectedJavaScript}
          javaScriptCanOpenWindowsAutomatically={true}
          onMessage={(e) => {
            handlerMessage(JSON.parse(e.nativeEvent.data));
          }}
        />
      )}
    </SafeAreaView>
  );
}
