import FeeRateSelector from "../../commons/FeeRateSelector";
import { Text, View, TouchableOpacity } from "react-native";
import { MetaidData } from "../../actions/lib/authorize/btc/inscribe";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

interface Params {
  data: {
    feeRate: number;
    metaidDataList: MetaidData[];
  };
}

interface MetaidComponentProps {
  children?: React.ReactNode;
  params: Params;
}

const Estimator = forwardRef(
  (
    {
      children,
      params: {
        data: { feeRate: initFeeRate, metaidDataList: initMetaidDataList },
      },
    }: MetaidComponentProps,
    ref
  ) => {
    const [feeRate, setFeeRate] = useState(initFeeRate);
    const [metaidDataList, setMetaidDataList] = useState<
      Record<string, MetaidData[]>
    >({});

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

    useImperativeHandle(ref, () => ({
      getEstimatedData: () => ({
        feeRate,
      }),
    }));

    const handleFeeRateChange = (newFeeRate) => {
      setFeeRate(newFeeRate);
    };

    return (
      <View className="space-y-2">
        {children ? children : null}
        <FeeRateSelector feeRate={feeRate} onChange={handleFeeRateChange} />
        <TouchableOpacity>
          <Text className="underline decoration-primary-blue text-gray-700 px-4 py-2 mx-auto decoration underline-offset-4 hover:underline-offset-2 transition-all duration-300">
            View Transaction Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

export default Estimator;
