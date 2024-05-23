import { View, Text, Image, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    LoadingModal,
  RoundSimButton,
  RoundSimButtonFlee,
  TitleBar,
} from "../constant/Widget";
import { getShowImageUrl } from "../utils/MetaFunUiils";
import { metaStyles, themeColor } from "../constant/Constants";
import { navigate } from "../base/NavigationService";
import { useData } from "../hooks/MyProvider";

export default function TransferMvcNftPage({ route }) {
  const { myObject } = route.params;
  let imgNftUrl = getShowImageUrl(myObject.nftIcon!);
  const { loadingModal, setLoadingDailog } = useData();
  const [confirmDailogState, setConfirmDailogState] = useState(false);

  const OpenModal = () => {
    setLoadingDailog({ ...loadingModal, isShow: true });
    setTimeout(() => {
      setLoadingDailog({ ...loadingModal, isShow: false });
      navigate('HomePage')
    }, 2000);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", marginBottom: 20 }}
    >
      <TitleBar title="Transfers NFT" />
      <LoadingModal   isCancel={loadingModal.isCancel} isShow={loadingModal.isShow} title={loadingModal.title} />

      <Modal visible={confirmDailogState} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingTop: 30,
              marginHorizontal: 20,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Confirm Transaction
            </Text>

            <View
              style={{
                marginTop: 20,
                alignItems: "center",
                borderColor: "rgba(191, 194, 204, 0.5)",
                flexDirection: "row",
                borderWidth: 1,
                height: 60,
                borderRadius: 10,
              }}
            >
              <Image
                source={{ uri: imgNftUrl }}
                style={{ width: 40, height: 40 }}
              />
              <View style={{}}>
                <Text style={{ fontSize: 14, marginLeft: 10 }}>
                  {myObject.nftName}
                </Text>
                <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10 }}>
                  # {myObject.nftTokenIndex}
                </Text>
              </View>
            </View>

            <Text style={{ marginTop: 15, color: "#666", fontSize: 14 }}>
              Recipient Address
            </Text>
            <Text
              numberOfLines={1}
              style={{ marginTop: 10, color: "#333", fontSize: 14 }}
            >
              sdfwefef2132fslhfklewhfljskdjflkewjfljewoifjeiwfji1323
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <RoundSimButtonFlee
                title={"Cancel"}
                style={{
                  borderRadius: 10,
                  height: 40,
                  width: "45%",
                  borderWidth: 1,
                  borderColor: themeColor,
                }}
                color="#fff"
                textColor="#171AFF"
                event={() => {
                  setConfirmDailogState(false);
                }}
              />

              <RoundSimButtonFlee
                title={"Confirm"}
                style={{ borderRadius: 10, height: 40, width: "45%" }}
                textColor="#fff"
                event={() => {
                    setConfirmDailogState(false);
                    OpenModal()
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={metaStyles.verMarginContainer}>
        <View
          style={{
            alignItems: "center",
            borderColor: "rgba(191, 194, 204, 0.5)",
            flexDirection: "row",
            borderWidth: 1,
            height: 100,
            borderRadius: 10,
          }}
        >
          <Image
            source={{ uri: imgNftUrl }}
            style={{ width: 80, height: 80 }}
          />
          <View style={{}}>
            <Text style={{ fontSize: 14, marginLeft: 10 }}>
              {myObject.nftName}
            </Text>
            <Text style={{ fontSize: 14, marginLeft: 10, marginTop: 10 }}>
              # {myObject.nftTokenIndex}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            borderColor: "rgba(191, 194, 204, 0.5)",
            flexDirection: "row",
            borderWidth: 1,
            height: 50,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <TextInput
            multiline={true}
            placeholder="Recipient's address"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              marginLeft: 10,
            }}
          />
        </View>

        <View style={{ flex: 1 }} />

        <RoundSimButton
          title="Confirm"
          event={() => {
            //    navigate('HomePage')
            setConfirmDailogState(true);
          }}
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
}
