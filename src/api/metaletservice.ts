import { AssertPrice } from "../types/balance";
import { get } from "../utils/Api";

export const BASE_MVC_API_URL = "https://mainnet.mvcapi.com";
export const BASE_MVC_API_URL_TESTNET = "https://testnet.mvcapi.com";
export const BASE_METALET_URL = "https://www.metalet.space";

//资产价格
export const BALANCE_PRICE_URL = BASE_METALET_URL + "/wallet-api/v3/coin/price";

//匿名函数模式封装
export const fetchAssetsPrice = async (): Promise<AssertPrice> => {
  const data = await get(BALANCE_PRICE_URL);
  return data;
};

//获取mvc 交易记录
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

//btc record
export async function fetchBtcActivityRecord(address: string) {
  const data = await get(
    BASE_METALET_URL + "/wallet-api/v3/address/activities",
    false,
    { address: address, chain: "btc" }
  );
  return data;
}
