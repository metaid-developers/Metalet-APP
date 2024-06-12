import CloseIcon from "@/components/icons/CloseIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import { useBTCRateQuery } from "@/queries/transaction";

export default ({ visible, close, feeRate }) => {
  const { isLoading, data: rateList } = useBTCRateQuery();

  return (
    <Modal animationType="fade" visible={visible} transparent={true}>
      <SafeAreaView className="flex flex-col w-screen h-screen bg-black/40">
        <View className="flex-1"></View>
        <View className="bg-white rounded-t-xl space-y-2">
          <View className=" relative flex flex-row items-center justify-center py-4">
            <Text className="text-center font-bold">Select Fee Rate</Text>
            <TouchableOpacity onPress={close} className="absolute right-0">
              <CloseIcon className="text-black-primary mr-4 w-3 h-3" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row items-center justify-around gap-x-2 px-4">
            {(rateList || []).map((rate, index) => (
              <View
                key={index}
                className="flex flex-col flex-1 items-center justify-center rounded-md border cursor-pointer aspect-square relative gap-y-1"
                // class={index === selectedIndex ? 'border-blue-primary' : 'border-gary-soft'}
              >
                <Text className="text-xs">{rate.title}</Text>
                <Text className="text-sm">{rate.feeRate} sat/vB</Text>
                <Text className="text-xs text-gray-primary text-center px-2">
                  {rate.desc}
                </Text>
                {/* <SelectIcon class="absolute top-0 right-0" v-if="index === selectedIndex" /> */}
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
