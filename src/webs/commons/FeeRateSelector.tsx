import { useEffect, useState } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import { useBTCRateQuery } from "@/queries/transaction";
import { SafeAreaView } from "react-native-safe-area-context";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import SelectActiveIcon from "@/components/icons/SelectActiveIcon";
import { Text, View, TouchableOpacity, Modal, TextInput } from "react-native";

export default ({
  onChange,
  feeRate: initFeeRate,
}: {
  feeRate?: number;
  onChange: Function;
}) => {
  const [visible, setVisible] = useState(false);
  const [feeRate, setFeeRate] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const { isLoading, data: rateList } = useBTCRateQuery({ enabled: true });

  useEffect(() => {
    if (initFeeRate) {
      setSelectedIndex(-1);
      setFeeRate(initFeeRate);
    } else {
      setSelectedIndex(1);
    }
  }, []);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="flex flex-row items-center justify-between"
      >
        <Text>{feeRate} sat/vB</Text>
        <ChevronRightIcon className="text-black-primary w-3.5 h-3.5" />
      </TouchableOpacity>
      <Modal animationType="fade" visible={visible} transparent={true}>
        <SafeAreaView className="flex flex-col w-screen h-screen bg-black/40">
          <View className="flex-1"></View>
          <View className="bg-white rounded-t-xl space-y-2">
            <View className=" relative flex flex-row items-center justify-center py-4">
              <Text className="text-center font-bold">Select Fee Rate</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="absolute right-0"
              >
                <CloseIcon className="text-black-primary mr-4 w-3 h-3" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <Text className="text-center py-12">Fee Rate Loading...</Text>
            ) : rateList && rateList.length ? (
              <View className="space-y-4 px-4 py-4">
                <View className="flex flex-row items-center justify-around gap-x-2">
                  {rateList.map((rate, index) => (
                    <TouchableOpacity
                      key={rate.title}
                      onPress={() => {
                        onChange(rate.feeRate);
                        setSelectedIndex(index);
                        setFeeRate(rate.feeRate);
                      }}
                      className={[
                        index === selectedIndex
                          ? "border-blue-primary"
                          : "border-gray-soft",
                        "flex flex-col flex-1 items-center justify-center rounded-md border cursor-pointer aspect-square relative gap-y-1",
                      ].join(" ")}
                    >
                      <Text className="text-xs">{rate.title}</Text>
                      <Text className="text-sm">{rate.feeRate} sat/vB</Text>
                      <Text className="text-xs text-gray-primary text-center px-2">
                        {rate.desc}
                      </Text>
                      {index === selectedIndex && (
                        <SelectActiveIcon className="absolute -top-1 right-0 w-4 h-4" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedIndex(-1)}
                  className={[
                    -1 === selectedIndex
                      ? "border-blue-primary"
                      : "border-gray-soft",
                    "flex flex-col items-start w-full h-16 justify-center rounded-md border cursor-pointer relative gap-y-1 px-4",
                  ].join(" ")}
                >
                  <Text className="text-xs">Custom Fee Rate</Text>
                  <TextInput
                    className="text-sm"
                    placeholder={"sat/vB"}
                    inputAccessoryViewID={"FeeRate"}
                    value={selectedIndex == -1 ? feeRate.toString() : ""}
                    onChangeText={(feeRate) => {
                      onChange(Number(feeRate));
                      setFeeRate(Number(feeRate));
                    }}
                  />
                  {-1 === selectedIndex && (
                    <SelectActiveIcon className="absolute -top-1 right-0 w-4 h-4" />
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="bg-blue-primary w-[246px] h-12 my-4 rounded-full mx-auto flex items-center justify-center"
            >
              <Text className="text-white">Confirm</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};
