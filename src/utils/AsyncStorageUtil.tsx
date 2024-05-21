import AsyncStorage from "@react-native-async-storage/async-storage"

//创建数据
export const AsyncStorageUtil={
    //set
    async setItem(key,value){
      try{
        return await AsyncStorage.setItem(key,JSON.stringify(value))
      }catch(e){
      }
    },
    

     async getItem(key) {
      try {
        const value = await AsyncStorage.getItem(key);
        const result=value != null ? JSON.parse(value) : null;
        return result
      } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
      }
    },


    //remove
    async removeItem(key){
      try{
        return await AsyncStorage.removeItem(key)
      }catch(e){
      }
    },

    
   async updateItem(key,newValue){
      try{
        return  await AsyncStorage.setItem(key,JSON.stringify(newValue))
      }catch(e){
      }
    },

    updateItem2: async (key, newValue) => {
      try {
        // 先获取原来的值并转换成对象
        const oldValueStr = await AsyncStorage.getItem(key);
        const oldValue = JSON.parse(oldValueStr) || {}; // 如果没有值，则初始化为空对象
        // 将原来的值与新值合并
        const mergedValue = { ...oldValue, ...newValue };
        // 更新值
        await AsyncStorage.setItem(key, JSON.stringify(mergedValue));
      } catch (error) {
        console.error('Error updating data:', error);
      }
    },

    async clear(){
      try {
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }

}


//所有钱包
export const wallets_key="wallets"
export const account_select_key="account_select"
export const network_key="network"
export const network_btc='network_btc'
export const network_mvc='network_mvc'
export const network_all='network_all'


export const walllet_address_type_key="walllet_address_type";
export const walllet_seed_key="walllet_seed";
