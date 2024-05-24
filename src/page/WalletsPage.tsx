import {
  View,
  Text,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GradientAvatar,
  LoadingModal,
  LoadingNoticeModal,
  RoundSimButton,
  TitleBar,
  styles,
} from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { wallets_key, AsyncStorageUtil } from "../utils/AsyncStorageUtil";
import { AccountsOptions, WalletBean } from "../bean/WalletBean";
import { goBack, navigate } from "../base/NavigationService";
import { useData } from "../hooks/MyProvider";
import { useFocusEffect } from "@react-navigation/native";
import { eventBus, refreshHomeLoadingEvent } from "../utils/EventBus";
import {
  getCurrentAccountID,
  getWalletBeans,
  setCurrentAccountID,
  setCurrentWalletID,
} from "../utils/WalletUtils";

export default function WalletsPage() {
  let [walletList, setWalletList] = useState<WalletBean[]>([]);

  const { myWallet, updateMyWallet } = useData();
  let [isEdit, setIsEdit] = useState(false);
  let [editWalletName, setEditWalletName] = useState("");
  const [isShowEditWallet, setIsShowEditWallet] = useState(false);
  const [isCanReName, setIsCanReName] = useState(false);
  const [changeWalletName, setChangeWalletName] = useState("");
  const [changeWallet, setChangeWallet] = useState<WalletBean>();

  //编辑account
  const [isShowEditAccount, setIsShowEditAccount] = useState(false);
  const [isCanReAccountName, setIsCanReAccountName] = useState(false);
  const [changeAccountName, setChangeAccountName] = useState("");
  const [parentIndex, setParentIndex] = useState<number>();
  const [accountIndex, setAccountIndex] = useState<number>();

  //提示
  const [isShowNotice, setIsShowNotice] = useState(false);

  //current
  const [currentAccountID, setcurrentAccountID] = useState("");

  // let changeWallet:WalletBean;

  async function getWalletData() {
    const currentAccountID = await getCurrentAccountID();
    setcurrentAccountID(currentAccountID);

    const wallets = await getWalletBeans();
    setWalletList(wallets);
  }

  useEffect(() => {
    getWalletData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // setTimeout(() => {
      getWalletData();
      // }, 1000)
      // nftList.splice(2,1)
      // setNftList([...nftList])
    }, [])
  );

  async function addAccount(postion: number) {
    console.log("当前位置是 " + postion);

    await AsyncStorageUtil.getItem(wallets_key).then(async (wallets) => {
      //插入Account 的写法
      // TODO 可能不是第一项进行插入
      wallets.forEach((wallet) => {
        wallet.accountsOptions.forEach((account) => {
          account.isSelect = false;
        });
      });
      const nowWallet: WalletBean = wallets[postion];

      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      const defaultAvatarColor: string[] = [];
      defaultAvatarColor[0] = getRandomColor();
      defaultAvatarColor[1] = getRandomColor();

      const newAccount: AccountsOptions = {
        id: Math.random().toString(36).substr(2, 8),
        name: "Account " + (nowWallet.accountsOptions.length + 1),
        addressIndex: nowWallet.accountsOptions.length,
        isSelect: true,
        defaultAvatarColor: defaultAvatarColor,
      };

      nowWallet.accountsOptions.push(newAccount);
      nowWallet.isCurrentPathIndex = nowWallet.accountsOptions.length - 1;

      setcurrentAccountID(newAccount.id);
      await setCurrentAccountID(newAccount.id);
      await setCurrentWalletID(nowWallet.id);

      await AsyncStorageUtil.updateItem(wallets_key, wallets);
      getWalletData();
      eventBus.publish(refreshHomeLoadingEvent, { data: "" });
      navigate("Tabs");
    });
  }

  //是否选中account
  async function updataSelectAccount(
    walletIndex: number,
    accountIndex: number
  ) {
    console.log("updataSelectAccount", walletIndex, accountIndex);

    await AsyncStorageUtil.getItem(wallets_key).then(async (wallets) => {
      // wallets.forEach((wallet) => {
      //   wallet.accountsOptions.forEach((account) => {
      //     account.isSelect = false;
      //   });
      // });

      const nowWallet = wallets[walletIndex];
      nowWallet.isCurrentPathIndex = accountIndex;
      nowWallet.accountsOptions[accountIndex].isSelect = true;
      setcurrentAccountID(nowWallet.accountsOptions[accountIndex].id);
      await setCurrentAccountID(nowWallet.accountsOptions[accountIndex].id);
      await setCurrentWalletID(nowWallet.id);
      updateMyWallet(nowWallet);
      await AsyncStorageUtil.updateItem(wallets_key, wallets);
      getWalletData();
      navigate("Tabs");
      eventBus.publish(refreshHomeLoadingEvent, { data: "" });

      // chooseMyWallet(nowWallet);
    });
  }

  //是否展开钱包
  async function setIsOpenWallet(postion: number, isOpen: boolean) {
    await AsyncStorageUtil.getItem(wallets_key).then(async (wallets) => {
      wallets[postion].isOpen = isOpen;
      await AsyncStorageUtil.updateItem(wallets_key, wallets);
    });
  }

  async function userAddWallet() {
    navigate("AddWalletPage");
  }

  const AccountListItem = ({ data, parentIndex }) => {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            updataSelectAccount(parentIndex, index);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              flex: 1,
              alignItems: "center",
            }}
          >
            <GradientAvatar
              userStyle={{ width: 36, height: 36 }}
              isRand={true}
              defaultAvatarColor={item.defaultAvatarColor}
            />
            <View style={{ marginLeft: 10 }}>
              <Text>{item.name}</Text>
              {/* <Text style={{ marginTop: 10 }}>{}</Text> */}
            </View>

            {isEdit && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setParentIndex(parentIndex);
                  setIsShowEditAccount(true);
                  setAccountIndex(index);
                  setChangeAccountName(item.name);
                  // setEditWalletName(item.name);
                  // setIsShowEditWallet(true);
                }}
              >
                <Image
                  source={require("../../image/metalet_edit_icon.png")}
                  style={{ marginLeft: 10, width: 15, height: 15 }}
                />
              </TouchableWithoutFeedback>
            )}

            <View style={{ flex: 1 }} />

            {/* 暂不显示更多 */}
            {isEdit && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsEdit(false);
                  navigate("WalletDetailPage", { postion: parentIndex });
                }}
              >
                <Image
                  source={require("../../image/metalet_more_icon.png")}
                  style={{ width: 15, height: 15 }}
                />
              </TouchableWithoutFeedback>
            )}

            {/* {item.isSelect && isEdit == false && ( */}
            {item.id == currentAccountID && isEdit == false && (
              <Image
                source={require("../../image/wallets_select_icon.png")}
                style={{ padding: 8, width: 15, height: 15 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    };

    const handlePressFooter = () => {
      addAccount(parentIndex);
    };

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <AccountFoolerView onFoolerPress={handlePressFooter} />
        }
      />
    );
  };

  const AccountFoolerView = ({ onFoolerPress }) => {
    return (
      <TouchableWithoutFeedback
        onPress={
          onFoolerPress
          //     () => {
          //     console.log("index",index);
          //     addAccount( index )
          //   }
        }
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            flex: 1,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("../../image/wallets_add_icon.png")}
            style={{ width: 36, height: 36 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text>Add account</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const ListItem = ({ index, item }) => {
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            {isEdit && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsEdit(false);
                  navigate("WalletDetelePage", { postion: index });
                }}
              >
                <Image
                  source={require("../../image/metalet_delete_icon.png")}
                  style={{ marginRight: 10, width: 15, height: 15 }}
                />
              </TouchableWithoutFeedback>
            )}
            <Text>{item.name}</Text>
            {isEdit && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setChangeWallet(item);
                  setEditWalletName(item.name);
                  setIsShowEditWallet(true);
                }}
              >
                <Image
                  source={require("../../image/metalet_edit_icon.png")}
                  style={{ marginLeft: 10, width: 15, height: 15 }}
                />
              </TouchableWithoutFeedback>
            )}
          </View>

          {item.isOpen ? (
            <TouchableWithoutFeedback
              onPress={() => {
                item.isOpen = false;
                setWalletList([...walletList]);
                setIsOpenWallet(index, false);
              }}
            >
              <View>
                <Image
                  source={require("../../image/wallets_open_icon.png")}
                  style={{ width: 17, height: 17 }}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                item.isOpen = true;
                setWalletList([...walletList]);
                setIsOpenWallet(index, true);
              }}
            >
              <View>
                <Image
                  source={require("../../image/wallets_close_icon.png")}
                  style={{ width: 17, height: 17 }}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>

        {item.isOpen && (
          <AccountListItem data={item.accountsOptions} parentIndex={index} />
        )}

        {/* {item.isOpen && (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={item.accountsOptions}
            renderItem={AccountListItem}
            ListFooterComponent={AccountFoolerView({index,item})}
          />
        )} */}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 20,
          marginTop: 5,
          height: 44,
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            goBack();
          }}
        >
          <Image
            source={require("../../image/meta_back_icon.png")}
            style={{ width: 22, height: 22 }}
          />
        </TouchableWithoutFeedback>
        <View style={{ flexDirection: "row", flex: 1 }}></View>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsEdit(isEdit != true ? true : false);
          }}
        >
          <Text
            style={[
              {
                textAlign: "center",
                marginRight: 20,
                fontSize: 16,
                color: "#333",
              },
            ]}
          >
            Edit
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={metaStyles.verMarginContainer}>
        <Text style={{ textAlign: "center", color: "#666666", fontSize: 16 }}>
          Total Assests
        </Text>

        <Text
          style={[
            metaStyles.bigLargeDefaultText,
            { marginTop: 10, textAlign: "center" },
          ]}
        >
          $82,352.31
        </Text>

        <FlatList
          style={{ marginTop: 20 }}
          keyExtractor={(item, index) => index.toString()}
          data={walletList}
          renderItem={ListItem}
        />

        <TouchableWithoutFeedback
          onPress={() => {
            userAddWallet();
          }}
        >
          <View
            style={{
              flexDirection: "row",
              height: 48,
              width: "100%",
              borderRadius: 23,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  height: 48,
                  width: 200,
                  backgroundColor: "#171AFF",
                  borderRadius: 23,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  marginStart: 20,
                  marginRight: 20,
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
                Add Wallet
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* 修改钱包 */}
        <Modal transparent={true} visible={isShowEditWallet}>
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
                padding: 20,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                paddingBottom: 40,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Edit Name
                </Text>
                <View style={{ flex: 1 }} />

                <TouchableWithoutFeedback
                  onPress={() => {
                    setIsShowEditWallet(false);
                  }}
                >
                  <Image
                    source={require("../../image/metalet_close_big_icon.png")}
                    style={{ width: 15, height: 15 }}
                  />
                </TouchableWithoutFeedback>
              </View>

              <Text style={{ marginTop: 20, color: "#666", fontSize: 14 }}>
                Wallet Name
              </Text>

              <View
                style={{
                  alignItems: "center",
                  borderColor: "#171AFF",
                  flexDirection: "row",
                  borderWidth: 1,
                  height: 50,
                  borderRadius: 30,
                  marginTop: 20,
                }}
              >
                <TextInput
                  multiline={true}
                  placeholder={editWalletName}
                  autoCapitalize={"none"}
                  onChangeText={(text) => {
                    setChangeWalletName(text);
                    if (text.length > 0) {
                      setIsCanReName(true);
                    } else {
                      setIsCanReName(false);
                    }
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    marginLeft: 10,
                    paddingRight: 20,
                  }}
                />
              </View>

              <TouchableWithoutFeedback
                onPress={async () => {
                  changeWallet.name = changeWalletName;
                  setWalletList([...walletList]);
                  await AsyncStorageUtil.updateItem(wallets_key, walletList);
                  setIsShowEditWallet(false);
                  setIsShowNotice(true);
                  setTimeout(() => {
                    setIsShowNotice(false);
                  }, 800);
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
                        backgroundColor: isCanReName
                          ? "rgba(23, 26, 255, 1)"
                          : "rgba(23, 26, 255, 0.5)",
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
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>

        {/* 修改account */}
        <Modal transparent={true} visible={isShowEditAccount}>
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
                padding: 20,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                paddingBottom: 40,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Edit Name
                </Text>
                <View style={{ flex: 1 }} />

                <TouchableWithoutFeedback
                  onPress={() => {
                    setIsShowEditAccount(false);
                  }}
                >
                  <Image
                    source={require("../../image/metalet_close_big_icon.png")}
                    style={{ width: 15, height: 15 }}
                  />
                </TouchableWithoutFeedback>
              </View>

              <Text style={{ marginTop: 20, color: "#666", fontSize: 14 }}>
                Account Name
              </Text>

              <View
                style={{
                  alignItems: "center",
                  borderColor: "#171AFF",
                  flexDirection: "row",
                  borderWidth: 1,
                  height: 50,
                  borderRadius: 30,
                  marginTop: 20,
                }}
              >
                <TextInput
                  multiline={true}
                  // placeholder={changeAccountName}
                  // autoCapitalize={"none"}
                  onChangeText={(text) => {
                    setChangeAccountName(text);
                    if (text.length > 0) {
                      setIsCanReAccountName(true);
                    } else {
                      setIsCanReAccountName(false);
                    }
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    marginLeft: 10,
                    paddingRight: 20,
                  }}
                />
              </View>

              <TouchableWithoutFeedback
                onPress={async () => {
                  await AsyncStorageUtil.getItem(wallets_key).then(
                    async (wallets) => {
                      const nowWallet = wallets[parentIndex];
                      nowWallet.accountsOptions[accountIndex].name =
                        changeAccountName;
                      setWalletList([...wallets]);
                      setIsShowEditAccount(false);
                      setIsEdit(false);
                      await AsyncStorageUtil.updateItem(wallets_key, wallets);
                    }
                  );

                  setIsShowNotice(true);
                  setTimeout(() => {
                    setIsShowNotice(false);
                  }, 800);
                  // changeWallet.name = changeWalletName;
                  // setWalletList([...walletList]);
                  // await AsyncStorageUtil.updateItem(wallets_key, walletList);
                  // setIsShowEditWallet(false);
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
                        backgroundColor: isCanReAccountName
                          ? "rgba(23, 26, 255, 1)"
                          : "rgba(23, 26, 255, 0.5)",
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
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>

        <LoadingNoticeModal title="Successful" isShow={isShowNotice} />

        <View>
          {/* <RoundSimButton title={"Add Wallet"}  textColor="#fff" event={()=>{}}  roundStytle={{marginLeft:20,marginRight:40,marginTop:20}}/> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
