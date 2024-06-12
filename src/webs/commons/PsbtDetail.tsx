import { useState, useEffect } from "react";
import { getBtcNetwork } from "@/lib/network";
import { SafeAreaView } from "react-native-safe-area-context";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import { prettifyAddress, prettifyBalance } from "@/lib/formatters";
import { Psbt, Transaction, address as btcAddress } from "bitcoinjs-lib";
import ChevronDoubleRightIcon from "@/components/icons/ChevronDoubleRightIcon";
import { Text, View, TouchableOpacity, Modal, ScrollView } from "react-native";

export default ({ psbtHex, symbol, visible, close }) => {
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    if (psbtHex) {
      const network = getBtcNetwork();

      const psbt = Psbt.fromHex(psbtHex, { network });
      const inputs = psbt.data.inputs.map((inputData, index) => {
        let value = 0;
        let address = "";
        if (inputData?.witnessUtxo?.script) {
          // TODO: fix this
          address = btcAddress.fromOutputScript(
            inputData.witnessUtxo.script,
            network
          );
        }
        if (inputData?.nonWitnessUtxo) {
          const tx = Transaction.fromBuffer(inputData.nonWitnessUtxo);
          const output = tx.outs[psbt.txInputs[index].index];
          address = btcAddress.fromOutputScript(output.script, network);
          value = output.value;
        }
        return { address, value };
      });
      setInputs(inputs);

      const outputs = psbt.txOutputs.map((out) => ({
        value: out.value,
        address: out.address || "",
      }));
      setOutputs(outputs);
    }
  }, [psbtHex]);

  return (
    <Modal animationType="slide" visible={visible}>
      <SafeAreaView className="p-4 space-y-2">
        <View className="relative h-8 w-full flex flex-row items-center justify-center">
          <TouchableOpacity
            onPress={close}
            className="shadow p-3 rounded-full flex items-center justify-center  absolute left-0"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-primary" />
          </TouchableOpacity>
          <Text className="text-center leading-8">Transaction Details</Text>
        </View>

        <ScrollView>
          <View className="flex flex-row items-center justify-center w-full gap-2 p-2">
            <View className="flex bg-sky-50 border-2 border-sky-300 border-dashed py-2 px-1 rounded-lg flex-1">
              <Text className="text-center text-sm text-sky-900">Inputs</Text>
              <View className="mt-2 space-y-2 text-xs">
                {inputs.map((input, index) => (
                  <View
                    className="border-2 border-sky-300 bg-sky-300 rounded p-1 space-y-2"
                    key={index}
                  >
                    <Text>Address</Text>
                    <Text className="text-xs text-gray-500 break-all">
                      {prettifyAddress(input.address, 4)}
                    </Text>
                    <Text className="mt-2">Amount</Text>
                    <Text className="text-xs text-gray-500 break">
                      {prettifyBalance(input.amount, symbol)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <ChevronDoubleRightIcon className="w-3.5 h-3.5 text-black-primary" />

            <View className="flex bg-sky-50 border-2 border-teal-300 border-dashed py-2 px-1 rounded-lg flex-1">
              <Text className="text-center text-sm text-teal-900">Outputs</Text>
              <View className="mt-2 space-y-2 text-xs">
                {outputs.map((output, index) => (
                  <View
                    className="border-2 border-teal-300 bg-teal-100 rounded p-1 space-y-2"
                    key={index}
                  >
                    <Text>Address</Text>
                    <Text className="text-xs text-gray-500 break-all">
                      {prettifyAddress(output.address, 4)}
                    </Text>
                    <Text className="mt-2">Amount</Text>
                    <Text className="text-xs text-gray-500 break">
                      {prettifyBalance(output.amount, symbol)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
