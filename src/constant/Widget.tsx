import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
} from "react-native";
import { metaStyles, themeColor } from "../constant/Constants";
import { goBack } from "../base/NavigationService";

import React, { useRef, useEffect, useState } from "react";
import EasyToast from "react-native-easy-toast";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden', // 需要设置 overflow: 'hidden' 来裁剪渐变色
  },
  avaterGradient: {
    flex: 1,
    width: '100%',
    borderRadius: 50,
  },
});



//白色组件填充 "#F3F3FF"
export const RoundSimButton = ({
  title,
  event,
  color = themeColor,
  textColor = themeColor,
}) => {
  return (
    <TouchableWithoutFeedback onPress={event}>
      <View
        style={{
          flexDirection: "row",
          height: 48,
          width: "100%",
          backgroundColor: color,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
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

//title bar
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
          marginTop: 20,
          height: 44,
          alignItems: "center",
        }}
      >


  
        <Image
          source={require("../../image/meta_back_icon.png")}
          style={{ width: 22, height: 22 }}
        />
        <Text style={[{ marginLeft: 10 }, metaStyles.titleText]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

//hook toast


export const useEasyToast = (position: "top" | "bottom" | "center") => {
  const toastRef = useRef<EasyToast>(null);

  useEffect(() => {
    // 如果需要在组件卸载时做清理工作，可以在这里编写
    // 返回一个清除函数
    // return () => {...};
  }, []);

  return toastRef;
};

//loading Modal 弹框来着
export const LoadingModal = ({ isShow=true, title='',isCancel=true ,event=()=>{} }) => {
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
    <Modal transparent={true}
    visible={isShow}
    >
      <TouchableWithoutFeedback onPress={()=>{
        if(isCancel){
          event()
        }
        // if(isCancel)
        // setObj({...obj,isShow:false})
      }}>

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={"large"} color={"#fff"} />
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
  
};

// avater
export const GradientAvatar=()=>{

     const getRandomColor=()=>{
      const letters='0123456789ABCDEF'
      let color='#'
      for(let i=0;i<6;i++){
        color+=letters[Math.floor(Math.random()*16)]
      }
      return color
     }
   
     const randomGradientColors=[getRandomColor(),getRandomColor()]
  
     return (
      <View style={styles.avaterContainer}>
        <LinearGradient
          colors={randomGradientColors}
          style={styles.avaterGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
    );

}

