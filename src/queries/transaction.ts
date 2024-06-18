import { metaletApiV3 } from "./request";
import { PageResult } from "./types/base";
import { getNetwork } from "@/lib/network";
import { useQuery } from "@tanstack/react-query";
import { Chain } from "@metalet/utxo-wallet-service";

export const fetchBtcTxHex = async (txId: string): Promise<string> => {
  return metaletApiV3<{ rawTx: string }>(`/tx/raw`)
    .get({ net: getNetwork(Chain.BTC), txId, chain: "btc" })
    .then((res) => res.rawTx);
};

export const broadcastBTCTx = async (rawTx: string) => {
  return await metaletApiV3<string>(`/tx/broadcast`).post({
    chain: "btc",
    net: getNetwork(Chain.BTC),
    rawTx,
  });
};

export interface FeeRate {
  title: string;
  desc: string;
  feeRate: number;
}

export const getBTCTRate = async (): Promise<PageResult<FeeRate>> => {
  return metaletApiV3<PageResult<FeeRate>>(`/btc/fee/summary`).get({
    net: getNetwork(Chain.BTC),
  });
};

export const useBTCRateQuery = (options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["BTCTRate"],
    queryFn: () => getBTCTRate(),
    refetchInterval: 30000,
    select: (result) => result.list,
    ...options,
  });
};
