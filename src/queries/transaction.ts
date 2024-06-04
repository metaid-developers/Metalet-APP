import { PageResult } from "./types/base";
// import { getNet } from "@/lib/network";
import { metaletApiV3 } from "./request";
import { getNetwork } from "@/lib/network";
import { Chain } from "@metalet/utxo-wallet-service";
// import { useQuery } from '@tanstack/vue-query'



// TODO: fix network switch
export const fetchBtcTxHex = async (txId: string): Promise<string> => {
  // const net = getNet();
  return metaletApiV3<{ rawTx: string }>(`/tx/raw`)
    .get({ net: getNetwork(Chain.BTC), txId, chain: "btc" })
    .then((res) => res.rawTx);
};

// TODO: fix network switch
export const broadcastBTCTx = async (rawTx: string) => {
  // const net = getNet();
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

// TODO: fix network switch
export const getBTCTRate = async (): Promise<PageResult<FeeRate>> => {
  // const net = getNet()
  return metaletApiV3<PageResult<FeeRate>>(`/btc/fee/summary`).get({
    net: getNetwork(Chain.BTC),
  });
};

// export const useBTCRateQuery = (options?: { enabled: ComputedRef<boolean> }) => {
//   return useQuery({
//     queryKey: ['BTCTRate'],
//     queryFn: () => getBTCTRate(),
//     select: (result) => result.list.reverse(),
//     ...options,
//   })
// }
