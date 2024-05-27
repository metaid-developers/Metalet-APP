import { useState } from "react";
import { Net } from "@metalet/utxo-wallet-service";

const useNetworkManager = () => {
  const [network, setNetwork] = useState<Net>("mainnet");

  const switchNetWork = (network: Net) => {
    setNetwork(network);
  };

  return {
    network,
    switchNetWork,
  };
};

export default useNetworkManager;
