import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  LayoutChangeEvent,
  TextInput,
  Button,
} from "react-native";
import { metaStyles, themeColor } from "../constant/Constants";
import { goBack } from "../base/NavigationService";

import React, { useRef, useEffect, useState } from "react";
import EasyToast from "react-native-easy-toast";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import QRCode from "react-native-qrcode-svg";
import PasswordPay from "react-native-password-pay";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  centeredView2: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,

    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    // elevation: 5,
  },
  avaterContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden", // 需要设置 overflow: 'hidden' 来裁剪渐变色
  },
  avaterGradient: {
    flex: 1,
    width: "100%",
    borderRadius: 50,
  },
  indicator: {
    // width: 30,
    height: 3,
    backgroundColor: "blue",
    marginRight: 20,
    alignItems: "center",
  },
});

//1. 白色组件填充 "#F3F3FF"
export const RoundSimButton = ({
  title,
  event,
  color = themeColor,
  textColor = themeColor,
  roundStytle = {},
}) => {
  return (
    <TouchableWithoutFeedback onPress={event}>
      <View
        style={[
          roundStytle,
          {
            flexDirection: "row",
            height: 48,
            width: "100%",
            backgroundColor: color,
            borderRadius: 23,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          },
        ]}
      >
        <Text
          style={[
            { textAlign: "center" },
            { color: textColor },
            { fontSize: 16 },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const RoundSimButtonFlee = ({
  title,
  event,
  color = themeColor,
  textColor = themeColor,
  style = {},
}) => {
  return (
    <TouchableWithoutFeedback onPress={event}>
      <View
        style={[
          {
            flexDirection: "row",
            height: 48,
            width: "100%",
            backgroundColor: color,
            borderRadius: 23,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          },
          style,
        ]}
      >
        <Text
          style={[
            { textAlign: "center" },
            { color: textColor },
            { fontSize: 16 },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

//2.title bar
export const TitleBar = ({
  title = "",
  event = (props) => {
    goBack();
  },
}) => {
  return (
    <TouchableWithoutFeedback onPress={event}>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 20,
          marginTop: 5,
          height: 44,
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../image/meta_back_icon.png")}
          style={{ width: 22, height: 22 }}
        />
        <Text
          style={[
            { textAlign: "center", marginRight: 40, marginLeft: 15 },
            metaStyles.titleText,
          ]}
        >
          {title}
        </Text>

        <Text style={{ marginRight: 20, color: "#333", fontSize: 16 }}> </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

// export const TitleImgBar = ({
//   title = "",
//   rightImg="",
//   event = (props) => {
//     goBack();
//   },
//   rightevent = () => {},

// }) => {
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         marginLeft: 20,
//         marginTop: 5,
//         height: 44,
//         alignItems: "center",
//       }}
//     >
//       <TouchableWithoutFeedback onPress={event}>
//         <Image
//           source={require("../../image/meta_back_icon.png")}
//           style={{ width: 22, height: 22 }}
//         />
//       </TouchableWithoutFeedback>
//       <Text
//         style={[
//           { textAlign: "center", marginRight: 40, marginLeft: 15, flex: 1 },
//           metaStyles.titleText,
//         ]}
//       >
//         {title}
//       </Text>

//       <TouchableWithoutFeedback onPress={rightevent}>
//         <Image
//           source={require(rightImg)}
//           style={{ width: 22, height: 22 }}
//         />
//       </TouchableWithoutFeedback>

//       <Text style={{ marginRight: 20, color: "#333", fontSize: 16 }}> </Text>
//     </View>
//   );
// };

//3.hook toast
export const useEasyToast = (position: "top" | "bottom" | "center") => {
  const toastRef = useRef<EasyToast>(null);

  useEffect(() => {
    // 如果需要在组件卸载时做清理工作，可以在这里编写
    // 返回一个清除函数
    // return () => {...};
  }, []);

  return toastRef;
};

//4.loading Modal 弹框来着
export const LoadingModal = ({
  isShow = true,
  title = "",
  isCancel = true,
  event = () => {},
}) => {
  // const [obj, setObj] = useState({ title: title, isShow: isShow ,isCancel:isCancel});

  // animationType="slide"
  // transparent={true}
  // visible={obj.isShow}
  // onRequestClose={() => {
  // setModalVisible(false);
  // }}

  // const closeModal=()=>{
  //   setObj({...obj,isShow:false})
  // }

  return (
    <Modal transparent={true} visible={isShow}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (isCancel) {
            event();
          }
          // if(isCancel)
          // setObj({...obj,isShow:false})
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size={"large"} color={"#fff"} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

//5.loading Modal 弹框来着
export const LoadingNoticeModal = ({
  isShow = true,
  title = "",
  isCancel = true,
  event = () => {},
}) => {
  return (
    <Modal transparent={true} visible={isShow}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (isCancel) {
            event();
          }
        }}
      >
        <View style={styles.centeredView2}>
          <View style={styles.modalView}>
            <Text style={{ color: "#fff", fontSize: 16 }}>{title}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const defaultAvatarColor = [];
// const defaultAvatarColor2 = [];
//6. avater
// export const GradientAvatar = ({ isRand = false, userStyle = {} }) => {
//  export const GradientAvatar = React.memo(({ userStyle = {}, isRand = false , defaultAvatarColor = []}: { userStyle?: object; isRand?: boolean ;defaultAvatarColor?:string []}) => {
export const GradientAvatar = ({
  userStyle = {},
  isRand = false,
  defaultAvatarColor = [],
}: {
  userStyle?: object;
  isRand?: boolean;
  defaultAvatarColor?: string[];
}) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  if (defaultAvatarColor.length == 0) {
    defaultAvatarColor[0] = getRandomColor();
    defaultAvatarColor[1] = getRandomColor();
  } else {
    // if (isRand) {
    //   defaultAvatarColor2[0] = getRandomColor();
    //   defaultAvatarColor2[1] = getRandomColor();
    // }
  }

  const randomGradientColors = [defaultAvatarColor[0], defaultAvatarColor[1]];
  // let randomGradientColors;
  // if (isRand) {
  //   randomGradientColors = [defaultAvatarColor2[0], defaultAvatarColor2[1]];
  // } else {
  //   randomGradientColors = [defaultAvatarColor[0], defaultAvatarColor[1]];
  // }

  return (
    <View style={[styles.avaterContainer, userStyle]}>
      <LinearGradient
        colors={randomGradientColors}
        style={styles.avaterGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};
// )

// 7. no more data view
export const NoMoreDataView = ({ isShow = false }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        // opacity: isShow?1:0,
      }}
    >
      <Image
        source={require("../../image/meta_no_more_data_icon.png")}
        style={{ width: 38, height: 53 }}
      />

      <Text style={[metaStyles.grayTextdefault66, { marginTop: 20 }]}>
        No more data
      </Text>
    </View>
  );
};

//8.custom tabbar 自定义切换头部
export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  isShowIndicator = true,
  isSmallTitle = false,
}) => {
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

        let fontSize = isSmallTitle ? 12 : 16;
        return (
          <TouchableOpacity activeOpacity={1} key={route.key} onPress={onPress}>
            <View style={{ alignItems: "center" }}>
              <Text
                key={index}
                style={{
                  fontSize: isFocused ? fontSize : fontSize,
                  // marginHorizontal: 10,
                  // paddingRight: 15,
                  marginVertical: 5,
                  fontWeight: isFocused ? "bold" : "normal",
                  color: isFocused ? "#333333" : "#666666",
                  paddingRight: 20,
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
              {isFocused && isShowIndicator && (
                <LinearGradient
                  // colors={["#FFD700", "#FF6347"]}
                  colors={["#6CE5F7", "#1F2CFF"]}
                  style={[styles.indicator, { width: label.length * 4 }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              )}

              {/* {isFocused && <View style={styles.indicator2} />} */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/////////////////////////////////////////////////////////////////////////////////
// 9.圆形头像 组件
export const CircleAvatar = ({
  imageUrl,
  widthC = 50,
  heightC = 50,
  event = () => {},
}) => {
  return (
    <View
      style={{
        width: widthC,
        height: heightC,
        borderRadius: 50,
        overflow: "hidden",
      }}
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: imageUrl }}
        onError={event}
      />
    </View>
  );
};

/////////////////////////////////////////////////////////////////////////////////
// 10.圆形头像 首字母
export const CircleAvatarLetter = ({
  letterStr,
  widthC = 50,
  heightC = 50,
}) => {
  return (
    <View
      style={{
        width: widthC,
        height: heightC,
        borderRadius: 50,
        overflow: "hidden",
        backgroundColor: "#171AFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {letterStr.toUpperCase()}
      </Text>
    </View>
  );
};

//11.loading Modal 弹框来着
export const VerifyModal = ({
  isShow = true,
  title = "",
  isCancel = true,
  event = (inputText: string) => {},
  eventCancel = () => {},
}) => {
  const [inputText, setInputText] = useState("");

  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: 40,
            paddingTop: 30,
            paddingHorizontal:20
            


          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Verify Password
            </Text>
            <View style={{ flex: 1 }} />

            <TouchableWithoutFeedback
              onPress={() => {
                eventCancel();
              }}
            >
              <Image
                source={require("../../image/metalet_close_big_icon.png")}
                style={{ width: 15, height: 15 }}
              />
            </TouchableWithoutFeedback>
          </View>

          <Text style={{ marginTop: 20, color: "#666", fontSize: 14 }}>
            Please enter your wallet password
          </Text>
          {/* 
          <View
            style={{
              alignItems: "center",
              borderColor: "#171AFF",
              // backgroundColor:'#F5F7F9',
              flexDirection: "row",
              borderWidth: 1,
              height: 50,
              borderRadius: 30,
              marginTop: 20,
            }}
          >
          <TextInput
              multiline={true}
              // placeholder={editWalletName}
              autoCapitalize={"none"}
              onChangeText={setInputText}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                marginLeft: 10,
                paddingRight: 20,
              }}
            /> */}

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <PasswordPay
              maxLength={6}
              onChange={(value) => {
                console.log("输入的密码：", value);
                if (value.length == 6) {
                  event(inputText);
                }
              }}
            />
          </View>

          {/* </View> 

           <TouchableWithoutFeedback
            onPress={async () => {
              event(inputText);
            }}
          >
            <View
              style={{
                marginTop: 20,
                marginBottom: 20,
                height: 20,
                width: "100%",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    flexDirection: "row",
                    height: 48,
                    width: 200,
                    backgroundColor: "rgba(23, 26, 255, 1)",
                    // backgroundColor: isCanReName
                    //   ? "rgba(23, 26, 255, 1)"
                    // : "rgba(23, 26, 255, 0.5)",
                    borderRadius: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    { textAlign: "center" },
                    { color: "#fff" },
                    { fontSize: 16 },
                  ]}
                >
                  Confirm
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback> */}
        </View>
      </View>
    </Modal>
  );
};

// 12 显示二维码
export const MyQrCode = ({ qrData, size }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <QRCode value={qrData} size={size} />
    </View>
  );
};
