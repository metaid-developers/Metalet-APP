import { RootBtcBalanceObject } from "../bean/BtcBalanceBean";
import { AssertPrice } from "../types/balance";
import { FeedBtcObject } from "../types/btcfeed";
import { UtxoBean } from "../types/utxoBean";
import { get, post } from "../utils/Api";
import { net_network } from "../wallet/wallet";
import { AddressTokenSummary, Brc20DetailData, SpaceBalance } from "./type/Balance";
import { BtcFtOneRecordData } from "./type/BtcFtOneRecordData";
import { MvcFtData, MvcFtRecordData } from "./type/MvcFtData";
import { MvcNftData } from "./type/MvcNftData";
import { MvcFtPriceData } from "./type/Price";

export const BASE_MVC_API_URL = "https://mainnet.mvcapi.com";
export const BASE_MVC_API_URL_TESTNET = "https://testnet.mvcapi.com";
export const BASE_METALET_URL = "https://www.metalet.space";

//资产价格
export const BALANCE_PRICE_URL = BASE_METALET_URL + "/wallet-api/v3/coin/price";

//1.匿名函数模式封装
export const fetchAssetsPrice = async (): Promise<AssertPrice> => {
  const data = await get(BALANCE_PRICE_URL);
  return data;
};

//2.获取mvc 交易记录
export async function fetchMvcActivityComfird(
  address: string,
  isConfirm: boolean
) {
  const data = await get(
    BASE_MVC_API_URL + "/address/" + address + "/tx",
    false,
    { confirm: isConfirm }
  );
  return data;
}

//3.btc record
export async function fetchBtcActivityRecord(address: string) {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/activities",
    false,
    { address: address, chain: "btc" }
  );
  return data;
}

//4.feed
export async function fetchBtcFeed(): Promise<FeedBtcObject> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/btc/fee/summary",
    false,
    { net: net_network }
  );
  return data;
}

//5.btc balance
export async function fetchBtcBalance(
  address: string
): Promise<RootBtcBalanceObject> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/btc-balance",
    false,
    { address, net: net_network }
  );
  return data;
}

//6.btc utxo
export async function fetchBtcUtxo(address: string): Promise<UtxoBean> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/btc-utxo",
    false,
    { address, net: net_network, unconfirmed: "1", order: "desc" }
  );
  return data;
}

// 7.space broadcast
export async function broadcastSpace(
  hex: string
): Promise<{ txid: string; message: string }> {
  const data = await post(BASE_MVC_API_URL + "/tx/broadcast", { hex: hex });
  return data;
}

// 8.MVC ft data
export async function fetchMvcFtBalance(address: string): Promise<MvcFtData[]> {
  const data = await get(
    BASE_MVC_API_URL + "/contract/ft/address/" + address + "/balance",
    true
  );
  return data;
}

// 9. MVC nft data
export async function fetchMvcNftBalance(address: string): Promise<MvcNftData> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/contract/nft/utxo",
    false,
    { net: "livenet", address: address }
  );
  return data;
}

// 10.btc broadcast
export async function broadcastBtc(hex: string): Promise<{
  code: number;
  message: string;
  processingTime: number;
  data: string;
}> {
  const data = await post(BASE_METALET_URL + "/wallet-api/v3/tx/broadcast", {
    chain: "btc",
    net: net_network,
    rawTx: hex,
  });
  return data;
}

// 11.mvc ft price
export async function fetchMvcFtPrice(): Promise<MvcFtPriceData> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/coin/contract/ft/price",
    true
  );
  return data;
}

// balance
//12.space balance
export async function fetchSpaceBalance(
  address: string
): Promise<SpaceBalance> {
  const dataMvcBalance: SpaceBalance = await get(
    BASE_MVC_API_URL + "/address/" + address + "/balance"
  );
  return dataMvcBalance;
}

// 13.mvc ft record
export async function fetchMvcFtRecord(
  address: string,
  genesis: string,
  codeHash: string
): Promise<MvcFtRecordData[]> {
  const dataMvcBalance: MvcFtRecordData[] = await get(
    BASE_MVC_API_URL +
      "/contract/ft/address/" +
      address +
      "/" +
      codeHash +
      "/" +
      genesis +
      "/tx"
  );
  return dataMvcBalance;
}

// 14. ft btc price
export async function fetchBtcFtPrice(): Promise<MvcFtPriceData> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/coin/brc20/price",
    true
  );
  return data;
}

//15. brc20 one balance
export async function fetchOneBrc20(
  address: string,
  net: string,
  ticker: string
): Promise<Brc20DetailData> {
  const data: Brc20DetailData = await get(
    BASE_METALET_URL + "/wallet-api/v3/brc20/token-summary",
    false,
    { net: net, ticker: ticker, address: address }
  );
  return data;
}

//16. brc20 one record
export async function fetchBrc20Record(
  address: string,
  chain: string,
  ticker: string
): Promise<BtcFtOneRecordData> {
  const data: BtcFtOneRecordData = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/brc20/activities",
    false,
    { chain: chain, tick: ticker, address: address }
  );
  return data;
}
