import { View, Text, FlatList, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { metaStyles } from "../constant/Constants";
import { NoMoreDataView, useEasyToast } from "../constant/Widget";
import * as FileSystem from "expo-file-system";
import EasyToast from "react-native-easy-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import {AsyncStorageUtil} from "../utils/AsyncStorageUtil";
import { useData } from "../hooks/MyProvider";

export default function AssetsPage() {
  const { myWallet, updateMyWallet } = useData();
  const {accountIndex,updateAccountIndex}=useData();

  const { walletManager, updateWalletManager } = useData();

  const [hasData, setHasData] = useState(false);
  const [myfile, setFolders] = useState<string[]>([]);

  const toastRef = useEasyToast("center");

  const showToast = useCallback(() => {
    toastRef.current?.show("Hello World!", 2000, () =>
      console.log("Toast dismissed")
    );
  }, [toastRef]);

  async function getMVCBalance() {
    // try {

    //   const fileUri = FileSystem.documentDirectory + 'example.txt';
    //   await FileSystem.writeAsStringAsync(fileUri, 'Hello, Expo!');
    //   console.log('File created successfully');

    //   const appDirectory = FileSystem.documentDirectory; // 获取应用的沙盒目录路径
    //   console.log("app 沙盒路径："+appDirectory);
    //   Alert.alert("app 沙盒路径："+appDirectory);
    //   // 读取应用沙盒目录下的文件夹列表
    //   const folders = await FileSystem.readDirectoryAsync(appDirectory);
    //   setFolders(folders); // 使用函数形式的 setState 更新状态

    //   // console.log('Folders in app directory:', folders);
    //   // Alert.alert('Folders in app directory:', folders.join(', '));
    // } catch (error) {
    //   console.error('Error reading app directory:', error);
    //  Alert.alert('Error reading app directory:', error);
    // }

    // const data = walletManager.getWallets();
    // console.log("walletManager AssetsPage 钱包： ", JSON.stringify(data));
    // const mvcAddress = data[0].accounts[accountIndex].mvc[0].address;
    // console.log("mvcAddress", mvcAddress);
  }

  useEffect(() => {
    showToast();
    getMVCBalance();
  }, []);

  AsyncStorageUtil.setItem("test", "test1111");
  AsyncStorageUtil.getItem("test").then((res) => {
    console.log("res:" + res);
  });

  return (
    <View style={metaStyles.verMarginContainer}>
      {/* <NoMoreDataView isShow={!hasData} /> */}

      <FlatList
        data={myfile}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ marginTop: 10 }}>{item}</Text>}
      />
    </View>
  );
}
