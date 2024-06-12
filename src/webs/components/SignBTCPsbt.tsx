import { useState } from "react";
import PsbtDetail from "../commons/PsbtDetail";
import { Text, View, TouchableOpacity } from "react-native";

export default ({ children, params: { psbtHex } }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View className="space-y-2">
      {children ? children : null}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text className="underline decoration-primary-blue text-gray-700 px-4 py-2 mx-auto decoration underline-offset-4 hover:underline-offset-2 transition-all duration-300">
          View Transaction Details
        </Text>
      </TouchableOpacity>

      <PsbtDetail
        symbol="BTC"
        psbtHex={psbtHex}
        visible={visible}
        close={() => setVisible(false)}
      />
    </View>
  );
};
