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
  RoundSimButton,
  TitleBar,
  styles,
} from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import { wallets_key, AsyncStorageUtil } from "../utils/AsyncStorageUtil";
import { AccountsOptions, WalletBean } from "../bean/WalletBean";
import { goBack, navigate } from "../base/NavigationService";
import { useData } from "../hooks/MyProvider";

export default function WalletsPage() {
  let [walletList, setWalletList] = useState<WalletBean[]>([]);

  const { myWallet, updateMyWallet } = useData();
  let [isEdit, setIsEdit] = useState(false);
  let [editWalletName, setEditWalletName] = useState("");
  const [isShowEditWallet, setIsShowEditWallet] = useState(false);
  const [isCanReName,setIsCanReName]=useState(false);
  const [changeWalletName, setChangeWalletName] = useState("");
  const [changeWallet, setChangeWallet] = useState<WalletBean>();

  // let changeWallet:WalletBean;

  async function getWalletData() {
    await AsyncStorageUtil.getItem("wallets").then((res) => {
      console.log(res);
      setWalletList(res);
    });
  }

  useEffect(() => {
    getWalletData();
  }, []);

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
      const nowWallet = wallets[postion];
      //   const newAccountsOptions = nowWallet.accountsOptions.map((account) => {
      //     // 修改账户属性
      //     return { ...account, isSelect: false };
      //   });

      //   nowWallet.accountsOptions = newAccountsOptions;

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

      console.log("newAccount", newAccount);

      nowWallet.accountsOptions.push(newAccount);
      await AsyncStorageUtil.updateItem(wallets_key, wallets);
      getWalletData();
    });
  }

  //是否选中account
  async function updataSelectAccount(
    walletIndex: number,
    accountIndex: number
  ) {
    console.log("updataSelectAccount", walletIndex, accountIndex);

    await AsyncStorageUtil.getItem(wallets_key).then(async (wallets) => {
      wallets.forEach((wallet) => {
        wallet.accountsOptions.forEach((account) => {
          account.isSelect = false;
        });
      });

      const nowWallet = wallets[walletIndex];
      nowWallet.accountsOptions[accountIndex].isSelect = true;
      updateMyWallet(nowWallet);
      await AsyncStorageUtil.updateItem(wallets_key, wallets);
      getWalletData();
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

            <View style={{ flex: 1 }} />

            {isEdit && (
              <Image
                source={require("../../image/metalet_more_icon.png")}
                style={{ width: 15, height: 15 }}
              />
            )}

            {item.isSelect && isEdit == false && (
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
              <TouchableWithoutFeedback onPress={() => {}}>
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
                  console.log("ddd" + item.name);
                  setChangeWallet(item)
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
                borderRadius: 10,
                padding: 20,
                marginBottom: 20,
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
                  onChangeText={(text)=>{
                    setChangeWalletName(text)
                   if(text.length>0){
                    setIsCanReName(true)
                   }else{
                    setIsCanReName(false)
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

              <TouchableWithoutFeedback onPress={async () => {
                changeWallet.name=changeWalletName;
                setWalletList([...walletList])
                await AsyncStorageUtil.updateItem(wallets_key,walletList)
               setIsShowEditWallet(false)
              }}>
                <View style={{marginTop:20, marginBottom:20,  height: 20,width:"100%",alignItems:"center",}}>
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        height: 48,
                        width:200,
                        backgroundColor: isCanReName?'rgba(23, 26, 255, 1)':'rgba(23, 26, 255, 0.5)',
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

        <View>
          {/* <RoundSimButton title={"Add Wallet"}  textColor="#fff" event={()=>{}}  roundStytle={{marginLeft:20,marginRight:40,marginTop:20}}/> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
