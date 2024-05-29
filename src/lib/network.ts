// FIXME: Remove bitcoinjs-lib
import { networks } from "bitcoinjs-lib";
import useNetworkStore from "@/stores/useNetworkStore";
import { Net } from "@metalet/utxo-wallet-service";

export function getNetwork() {
  if (!useNetworkStore.getState().network) {
    throw new Error("Network is not initialized.");
  }
  return useNetworkStore.getState().network;
}

export function getBtcNetwork() {
  const network = getNetwork();
  switch (network) {
    case "mainnet":
      return networks.bitcoin;
    case "testnet":
      return networks.testnet;
    case "regtest":
      return networks.regtest;
    default:
      throw new Error("Unknown network");
  }
}

export function setNetwork(network: Net) {
  useNetworkStore.getState().switchNetwork(network);
}
