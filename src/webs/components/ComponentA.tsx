import React from "react";
import { Text, View } from "react-native";

export default ({ children, ...params }) => {
  return (
    <View className="space-y-2">
      {children ? children : null}
      {/* <Text>{JSON.stringify(params)}</Text> */}
    </View>
  );
};
