import { View, Text, FlatList ,StyleSheet, Dimensions} from 'react-native'
import React, { useEffect, useState } from "react";
import { NoMoreDataView } from '../constant/Widget';
import { metaStyles } from '../constant/Constants';
import { BtcNftBean, RootBtcNftObject } from '../bean/BtcNftBean';
import { BTC_NFT_URL, get } from '../utils/Api';
import { useData } from '../hooks/MyProvider';
import {MetaletWalletManager} from '../wallet/MetaletWalletManager';



export default function BtcNftPage() {

  let [nftList,setNftList]=useState<BtcNftBean[]>([]);
  const {accountIndex,updateAccountIndex}=useData();
  const { walletManager, updateWalletManager } = useData();
  const { metaletWallet, updateMetaletWallet } = useData();

  useEffect(()=>{
    getBtcNftData();
  },[])

   const getBtcNftData=async ()=>{
    let params={
      net:'mainnet',
      address:metaletWallet.currentBtcWallet.getAddress(),
      cursor:0,
      size:10000
    }

    let data:RootBtcNftObject=await get(BTC_NFT_URL,false,params);
    let list=[]
    if(data.data!=null){
      if(data.data.list!=null){
        for(let i=0;i<data.data.list.length;i++){
         let nftData:BtcNftBean=data.data.list[i]; 
         let reslut=await get(nftData.content,true)
         nftData.nftShowContent=reslut
         list.push(nftData)
        }
        setNftList(list)
      }
    }

   }



 function ItemList({index,item}){
  return (
    <View style={styles.itemStyle}>
     <View>
      <Text style={{color:'#fff',fontSize:10}}>{JSON.stringify(item.nftShowContent)}</Text>
       <View style={{height:10}}/>
       <View style={{justifyContent:'flex-end',flexDirection:"row"}}>
       <View style={{justifyContent:'center',flexDirection:'row',width:50,backgroundColor:'#767EFF',borderRadius:5,}}>
        <Text style={{color:'#fff',fontSize:10,paddingHorizontal:2,paddingVertical:2} }> 546 sat </Text>
      </View>
       </View>
     
     </View>
    </View>
  )
 }


  return (
    <View style={[metaStyles.varContainer,{backgroundColor:"#fff"}]}>
        {nftList==null|| nftList.length==0 && <NoMoreDataView/>}
      
      {nftList!=null && <View>
        <FlatList
        data={nftList}
        keyExtractor={(item,index)=>index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={ItemList}
        numColumns={3}
        contentContainerStyle={{flexGrow:1}}
        />
        
        </View>}
    </View>
    
  );
}

const {width} =Dimensions.get('window');


const styles=StyleSheet.create({
   itemStyle:{
    backgroundColor:'#171AFF',
    borderRadius:8,
    height:'auto',
    width:width/4,
    marginTop:10,
    marginLeft:10,
    paddingHorizontal:10,
    paddingVertical:10,
    alignItems:'center',
  
   }
})