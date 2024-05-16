import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  RoundSimButton,
  TitleBar,
  useEasyToast,
  LoadingModal,
  // GradientAvatar,
} from "../constant/Widget";
import { SafeAreaView } from "react-native-safe-area-context";
import { metaStyles } from "../constant/Constants";
import EasyToast from "react-native-easy-toast";
import { ActivityIndicator } from "react-native-paper";

import { LinearGradient } from "expo-linear-gradient";
import {AsyncStorageUtil, wallets_key, walllet_address_type_key} from "../utils/AsyncStorageUtil";

import { useData } from "../hooks/MyProvider";
import { AccountsOptions, WalletBean } from "../bean/WalletBean";
import { MetaletWalletManager } from "../wallet/MetaletWalletManager";
import { AddressType } from "@metalet/utxo-wallet-service";
import { getRandomColorList } from "../utils/MetaFunUiils";

export default function SetPasswordPage(props) {
  const toastRef = useEasyToast("center");
  const [mnemonic, setMneMonic] = useState("");
  const { walletManager, updateWalletManager } = useData();

  // const showToast = useCallback(() => {
  //   toastRef.current?.show('Hello World!', 2000, () => console.log('Toast dismissed'));
  // }, [toastRef]);
  const closeModal = () => {
    setObj({ ...obj, isShow: false });
    setTimeout(() => {
      setObj({ ...obj, isShow: true });
    }, 2000);
  };
  const OpenModal = () => {
    setObj({ ...obj, isShow: true });

    AsyncStorageUtil.getItem(wallets_key).then(async (value) => {

      console.log(value);
      //wallet
      let walletName;
      let walletID = Math.random().toString(36).substr(2, 8);
      let wallet_addressType=AddressType.Legacy;
      let mvcTypes = 236;

      //account
      let accountName = "Account 1";
      let accountID = Math.random().toString(36).substr(2, 8);
      let accountAddressIndex = 0;

      if (value != null && value.length > 0) {

        //插入Wallet 写法
        walletName = "Wallet " + (value.length + 1);
        let walletBean: WalletBean = {
          id: walletID,
          name: walletName,
          mnemonic,
          mvcTypes,
          isOpen: true,
          addressTpye:wallet_addressType,
          isBackUp:false,
          isCurrentPathIndex:0,
          accountsOptions: [
            {
              id: accountID,
              name: accountName,
              addressIndex: accountAddressIndex,
              isSelect: true,
              defaultAvatarColor:getRandomColorList()
            },
          ],
        };

        // const updataWallets=[...value,walletBean]
        const updataWallets=addWallet(value,walletBean)
        await AsyncStorageUtil.updateItem(wallets_key, updataWallets);
        await AsyncStorageUtil.setItem(walllet_address_type_key,wallet_addressType)
  
        // const myWalletManager = new MetaletWalletManager({
        //   network: "mainnet",
        //   walletsOptions: [
        //     {
        //       id: walletID,
        //       mnemonic: mnemonic,
        //       name: walletName,
        //       mvcTypes: [mvcTypes],
        //       accountsOptions: [
        //         {
        //           id: accountID,
        //           name: accountName,
        //           addressIndex: accountAddressIndex,
        //         },
        //       ],
        //     },
        //   ],
        // });
  
        // updateWalletManager(myWalletManager);


      } else {
        walletName = "Wallet 1";
        //新增的写法
        let walletBean: WalletBean = {
          id: walletID,
          name: walletName,
          mnemonic,
          mvcTypes,
          isOpen: true,
          addressTpye:wallet_addressType,
          isBackUp:false,
          isCurrentPathIndex:0,
          accountsOptions: [
            {
              id: accountID,
              name: accountName,
              addressIndex: accountAddressIndex,
              isSelect: true,
              defaultAvatarColor:getRandomColorList()

            },
          ],
        };
        let initWallets = [walletBean];
        await AsyncStorageUtil.updateItem(wallets_key, initWallets);
        await AsyncStorageUtil.setItem(walllet_address_type_key,wallet_addressType)
        
        // const myWalletManager = new MetaletWalletManager({
        //   network: "mainnet",
        //   walletsOptions: [
        //     {
        //       id: walletID,
        //       mnemonic: mnemonic,
        //       name: walletName,
        //       mvcTypes: [mvcTypes],
        //       accountsOptions: [
        //         {
        //           id: accountID,
        //           name: accountName,
        //           addressIndex: accountAddressIndex,
        //         },
        //       ],
        //     },
        //   ],
        // });
  
        // updateWalletManager(myWalletManager);

      }

     

    });

    setTimeout(() => {
      setObj({ ...obj, isShow: false });
      // props.navigation.navigate('HomePage')

      props.navigation.navigate("CongratulationsPage", {
        type: "Imported Successfully",
        type3: ":sldkfj",
      });
    }, 4000);
  };


  const addWallet=(wallets, newWallet)=>{
    wallets.forEach(wallet => {
      wallet.accountsOptions.forEach(account => {
        account.isSelect = false;
      });
    });

    return [...wallets,newWallet];
  }


  const [obj, setObj] = useState({ title: "", isShow: false, isCancel: false });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EasyToast ref={toastRef} position="center" />
      <TitleBar />

      <View style={[metaStyles.verMarginContainer, { marginBottom: 50 }]}>
        <LoadingModal
          isCancel={obj.isCancel}
          isShow={obj.isShow}
          title={obj.title}
          event={closeModal}
        />

        <Text style={metaStyles.largeDefaultText}>
          Enter your mnemonic phrase
        </Text>
        <Text style={[metaStyles.smallDefaultText, { marginTop: 20 }]}>
          Separate mnemonic words with spaces. Supports the import of 12-digit,
          18-digit, and 24-digit mnemonic phrases from any wallet.
        </Text>
        <Text style={[metaStyles.defaultText, { marginTop: 30 }]}>
          Please Enter
        </Text>

        <View>
          <TextInput
            placeholder="Enter your mnemonic phrase"
            multiline={true}
            numberOfLines={6}
            style={[
              metaStyles.textInputDefault,
              { paddingVertical: 30, height: 135 },
            ]}
            onChangeText={(text) => {
              setMneMonic(text);
            }}
          />
        </View>

        <View style={metaStyles.noticeRed}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../image/meta_waring_icon.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#FA5151",
                fontWeight: "bold",
                marginLeft: 5,
              }}
            >
              Warning!{" "}
            </Text>
          </View>
          <Text style={{ color: "#FA5151", marginTop: 5 }}>
            Metalet will not record your mnemonic words and private keys. Users
            manage their own permissions and your assets are under your control.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* <GradientAvatar/> */}
        <RoundSimButton
          title="Confirm"
          textColor="white"
          event={() => {
            // console.log("hello");
            //   toastRef.current?.show('Hello World!', 2000, () => console.log('Toast dismissed'));
            // }, [toastRef]);
            // toastRef.current?.show("Hello", 1500);
            // toastRef.current?.show('Hello World!', 2000, () => console.log('Toast dismissed'));

            // showToast()
            OpenModal();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

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
    padding: 20,
    alignItems: "center",
    // elevation: 5,
  },
});
