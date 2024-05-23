import { RootBtcBalanceObject } from "../bean/BtcBalanceBean";
import { AssertPrice } from "../types/balance";
import { FeedBtcObject } from "../types/btcfeed";
import { UtxoBean } from "../types/utxoBean";
import { get } from "../utils/Api";
import { net_network } from "../wallet/wallet";

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
export async function fetchBtcUtxo(
  address: string
): Promise<UtxoBean> {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/btc-utxo",
    false,
    { address, net: net_network ,unconfirmed:"1",order:'desc'}
  );
  return data;
}