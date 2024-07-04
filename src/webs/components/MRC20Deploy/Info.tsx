import { Text, View, Image } from "react-native";
import FeeRateSelector from "../../commons/FeeRateSelector";
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
  ({ params, children }: MetaidComponentProps, ref) => {
    const [feeRate, setFeeRate] = useState(params.data.feeRate);

    const [metaidDataObj, setMetaidDataObj] = useState<
      Record<string, MetaidData[]>
    >({});

    useEffect(() => {
      const metaidDataObj = params.data.metaidDataList
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

      setMetaidDataObj(metaidDataObj);
    }, [params.data.metaidDataList]);

    useImperativeHandle(ref, () => ({
      getEstimatedData: () => {
        params.data.feeRate = feeRate;
        return params;
      },
    }));

    const handleFeeRateChange = (newFeeRate) => {
      setFeeRate(newFeeRate);
    };

    return (
      <View className="space-y-2">
        {children ? children : null}
        {Object.values(metaidDataObj).map((metaidDataList, index) => (
          <View key={index} className="flex flex-col items-center gap-y-2">
            <Text className="w-full">
              operation: {metaidDataList[0].operation}
            </Text>
            <View className="flex flex-row flex-wrap items-start w-full">
              {metaidDataList.map((metaidData, index) =>
                metaidData.body ? (
                  metaidData.contentType?.includes("image") ? (
                    <View className="w-1/3 p-1" key={index}>
                      <Image
                        className="w-full aspect-square object-cover rounded-md"
                        source={{
                          uri: `data:image/jpeg;base64,${metaidData.body}`,
                        }}
                      />
                    </View>
                  ) : (
                    <Text key={index} className="text-sm break-all w-full">
                      {metaidData.body}
                    </Text>
                  )
                ) : null
              )}
            </View>
          </View>
        ))}
        <View>
          <FeeRateSelector feeRate={feeRate} onChange={handleFeeRateChange} />
        </View>
      </View>
    );
  }
);

export default Estimator;
