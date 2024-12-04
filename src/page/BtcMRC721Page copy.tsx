
// export default function BtcMRC721Page() {
//   // let [nftList, setNftList] = useState<PINsBean[]>([]);
//   let [nftList, setNftList] = useState([]);

//   const { accountIndex, updateAccountIndex } = useData();
//   const { metaletWallet, updateMetaletWallet } = useData();
//   const { btcAddress, updateBtcAddress } = useData();

//   const [ismany, setIsmany] = useState(0);

//   useEffect(() => {
//     refresh();
//   }, []);

//   useEffect(() => {
//     refresh();
//   }, [btcAddress]);

//   useFocusEffect(
//     useCallback(() => {
//       refresh();
//     }, [])
//   );

//   async function refresh() {
//     if (btcAddress) {
//       getBtcNftData(btcAddress);
//     } else {
//       const isCold = await isObserverWalletMode();
//       if (isCold) {
//         const wallet = await getStorageCurrentWallet();
//         getBtcNftData(wallet.coldAddress);
//       } else {
//         const btcWallet = await getCurrentBtcWallet();
//         getBtcNftData(btcWallet.getAddress());
//       }
//     }
//   }

//   const getBtcNftData = async (address: string) => {

//     const resultList: PINsBean[] = await fetchPINsList(address);
//     if (resultList.length > 0) {
//       let list = [];
//       for (let i = 0; i < resultList.length; i++) {
//         let nftData: PINsBean = resultList[i];
//         if (
//           nftData.path.startsWith("/nft/mrc721") &&
//           !nftData.path.includes("/collection_desc")
//         ) {
//           const imageUrl = await getImageUrl(nftData.content);
//           // console.log("imageUrl", imageUrl);
//           nftData.showImage = imageUrl;
//           list.push(nftData);
//         }
//       }
//       const groupedMetaPins = list.reduce((acc, pin) => {
//         (acc[pin.path] ||= []).push(pin);
//         return acc;
//       }, {});


//       // 转换为 SectionList 格式
//       const sections = Object.entries(groupedMetaPins).map(([key, value]) => ({
//         title: key.split("/").pop(), // 提取最后部分
//         data: value, // 分组数据
//       }));

//       setNftList([...sections]);
//       console.log("nftList", nftList);

   
//     } else {
//       setNftList([]);
//     }
//   };

//   function ItemList({  item }) {
//     return (
//       <TouchableWithoutFeedback
//         style={styles.itemContainer}
//         onPress={() => {
//           navigate("BtcNftMRC721DetailPage", { nftDetail: item });
//         }}
//       >
//         <View
//           style={{
//             // backgroundColor: item.contentTypeDetect.includes("image")
//             //   ? "#fff"
//             //   : "#171AFF",
//             backgroundColor: "#fff",
//             borderRadius: 8,
//             height: width / 4,
//             width: width / 4,
//             marginTop: 10,
//             marginRight: 10,
//             // paddingHorizontal: 5,
//             // paddingVertical: 5,
//             // borderBlockColor: "#171AFF",
//             borderWidth: 1,
//             borderColor: inputNormalBgColor,
//           }}
//         >
//           <ImageBackground
//             source={{ uri: item.showImage }} // 替换为你的图片路径
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: 5,
//               overflow: "hidden",
//             }}
//           >
//             <View style={{ flex: 1 }}></View>

//             <View style={{ flexDirection: "row", marginBottom: 2 }}>
//               <View style={{ flex: 1 }} />
//               <View
//                 style={{
//                   justifyContent: "center",
//                   flexDirection: "row",
//                   width: 50,
//                   backgroundColor: "#767EFF",
//                   marginTop: 3,
//                   // backgroundColor: 'rgba(23, 26, 255, 0.1)',
//                   borderRadius: 5,
//                   marginRight: 5,
//                   marginBottom: 5,
//                 }}
//               >
//                 <Text
//                   style={{
//                     color: "#fff",
//                     fontSize: 10,
//                     paddingHorizontal: 2,
//                     paddingVertical: 2,
//                   }}
//                 >
//                   546 sat{" "}
//                 </Text>
//               </View>
//             </View>
//           </ImageBackground>
//         </View>
//       </TouchableWithoutFeedback>
//     );
//   }

//   const ListItem = ({ section }) => {
//     return (
//       <FlatList
//         data={section.data}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={ItemList}
//         numColumns={3}
//       />
//     );
//   };


//   return (
//     <View style={[metaStyles.varContainer, { backgroundColor: "#fff" }]}>
//       {nftList == null || (nftList.length == 0 && <NoMoreDataView />)}

//       {nftList != null && (
//         <View>
//           <SectionList
//             sections={nftList}
//             keyExtractor={(item,index) => index.toString()}
//             renderItem={ListItem}
//             renderSectionHeader={({ section }) => (
//               <View>
//                 <Text>
//                   {section.title}
//                   {section.data.length}
//                 </Text>
//               </View>
//             )}
//           />
//         </View>
//       )}
//     </View>
//   );
// }

