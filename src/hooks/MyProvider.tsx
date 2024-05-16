import React, { createContext, useContext, useState } from "react";
import MetaletWallet from "../wallet/MetaletWallet";
import { WalletBean } from "../bean/WalletBean";
import { network_all } from "../utils/AsyncStorageUtil";

// 创建上下文
type GlobalContext = {
  userData: any;
  updateUserData: (newData: any) => void;
  loadingModal: any;
  setLoadingDailog: any;
  myWallet: WalletBean;
  updateMyWallet;
  walletManager;
  updateWalletManager;
  accountIndex;
  updateAccountIndex;
  mvcAddress;
  updateMvcAddress;
  metaletWallet: MetaletWallet;
  updateMetaletWallet;
  currentSumBalance: string;
  updateCurrentSumBalance;
  netWork: string;
  updateNetWork,
  btcAddress:string,
  updateBtcAddress,
};

const UserContext = createContext<GlobalContext>(undefined);

// 提供者组件
export const UserProvider = ({ children }) => {
  ///////////////设置变量/////////////
  //设置了一个全局变量1 test
  const [userData, setUserData] = useState(null);
  // 提供一个更新数据的方法，只允许通过这个方法来修改数据
  const updateUserData = (newData) => {
    setUserData(newData);
  };

  // 2实体 全局加载变量
  const [loadingModal, setLoadingDailog] = useState({
    title: "",
    isShow: false,
    isCancel: false,
  });
  const updateLoadingModal = (newData) => {
    setLoadingDailog(newData);
  };

  //3 本地存储的当前选中钱包  可用这个钱包去创建对应的 btc 和 mvc 钱包
  const [myWallet, setMyWallet] = useState(null);
  const updateMyWallet = (newData) => {
    setMyWallet(newData);
  };

  // 当前显示总余额
  const [currentSumBalance, setCurrentSumBalance] = useState("");
  const updateCurrentSumBalance = (newData) => {
    setCurrentSumBalance(newData);
  };

  //当前选中钱包网络
  const [netWork, setNetWork] = useState(network_all);
  const updateNetWork = (newData) => {
    setNetWork(newData);
  };

  // mvcAddress 当前地址
  const [mvcAddress, setMvcAddress] = useState("");
  const updateMvcAddress = (newData) => {
    setMvcAddress(newData);
  };

  const [btcAddress, setBtcAddress] = useState("");
  const updateBtcAddress = (newData) => {
    setBtcAddress(newData);
  };



  //4.当前的钱包管理类
  const [metaletWallet, setMetaletWallet] = useState<MetaletWallet>(null);
  const updateMetaletWallet = (newData) => {
    setMetaletWallet(newData);
  };

  // 4 加载本地的WalletMannager
  const [walletManager, setWalletManager] = useState(null);
  const updateWalletManager = (newData) => {
    setWalletManager(newData);
  };

  //5 当前选择的Account 的index 是几
  const [accountIndex, setAccountIndex] = useState(0);
  const updateAccountIndex = (newData) => {
    setAccountIndex(newData);
  };

  // 将需要共享的数据和更新方法放在上下文的 value 中
  const contextValue = {
    userData,
    updateUserData,
    loadingModal,
    setLoadingDailog,
    myWallet,
    updateMyWallet,
    walletManager,
    updateWalletManager,
    accountIndex,
    updateAccountIndex,
    mvcAddress,
    updateMvcAddress,
    metaletWallet,
    updateMetaletWallet,
    currentSumBalance,
    updateCurrentSumBalance,
    netWork,
    updateNetWork,
    btcAddress,
    updateBtcAddress
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// 自定义钩子
export const useData = () => {
  // 直接返回上下文的值
  return useContext(UserContext);
};
