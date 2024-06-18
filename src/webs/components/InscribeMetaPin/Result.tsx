import { useEffect, useState } from "react";
import FeeRateSelector from "../../commons/FeeRateSelector";
import { Text, View, TouchableOpacity } from "react-native";
import { MetaidData } from "../../actions/lib/authorize/btc/inscribe";

export default ({
  children,
  params: {
    data: { feeRate, metaidDataList: initMetaidDataList },
  },
}) => {
  const [metaidDataList, setMetaidDataList] = useState<MetaidData[]>([]);

  useEffect(() => {
    const metaidDataList = initMetaidDataList
      .sort((a, b) =>
        a.contentType?.includes("image") && !b.contentType?.includes("image")
          ? -1
          : !a.contentType?.includes("image") &&
              b.contentType?.includes("image")
            ? 1
            : 0
      )
      .reduce((acc, { operation, ...rest }) => {
        (acc[operation] = acc[operation] || []).push({ operation, ...rest });
        return acc;
      }, {});
    setMetaidDataList(metaidDataList);
  }, [initMetaidDataList]);

  return (
    <View className="space-y-2">
      {children ? children : null}
      <FeeRateSelector feeRate={feeRate} />
      <TouchableOpacity >
        <Text className="underline decoration-primary-blue text-gray-700 px-4 py-2 mx-auto decoration underline-offset-4 hover:underline-offset-2 transition-all duration-300">
          View Transaction Details
        </Text>
      </TouchableOpacity>
    </View>
  );
};
