import { BtcFtBean } from "@/bean/BtcFtBean";
import {
  fetchAssetsPrice,
  fetchBtcBalance,
  fetchMvcFtBalance,
  fetchMvcFtPrice,
  fetchSpaceBalance,
} from "../api/metaletservice";
import { ShowBalance } from "../api/type/Balance";
import { MvcFtData } from "../api/type/MvcFtData";
import { MvcFtPriceData } from "../api/type/Price";
import { formatToDecimal, parseToSpace } from "./WalletUtils";

// FT
export function caculateOneFtValue(
  tokens: MvcFtData[],
  ftPriceData: MvcFtPriceData
) {
  let total = 0;
  // const ftPriceData = await fetchMvcFtPrice();
  const mvcPrices = ftPriceData.data.priceInfo;

  for (let i = 0; i < tokens.length; i++) {
    const tokenSymbol = tokens[i].symbol.toUpperCase();
    const quantity = parseFloat(
      formatToDecimal(tokens[i].confirmed, tokens[i].decimal)
    );
    if (tokenSymbol in mvcPrices) {
      const price = mvcPrices[tokenSymbol];
      const assert = price * quantity;
      total += price * quantity;
    }
  }

  return toFloorNum(total, 2).toFixed(2);
}

export function caculateOneBtcFtValue(
  tokens: BtcFtBean[],
  ftPriceData: MvcFtPriceData
) {
  let total = 0;
  // const ftPriceData = await fetchMvcFtPrice();
  const mvcPrices = ftPriceData.data.priceInfo;

  for (let i = 0; i < tokens.length; i++) {
    const tokenSymbol = tokens[i].ticker.toLocaleLowerCase();
    const quantity = parseFloat(tokens[i].overallBalance);
    if (tokenSymbol in mvcPrices) {
      const price = mvcPrices[tokenSymbol];
      const assert = price * quantity;
      total += price * quantity;
    }
  }

  return total.toFixed(2);
}

//balance
export async function caculateMvcAndBtcAssert(
  mvcAddrss,
  btcAddress
): Promise<ShowBalance> {
  const balance: ShowBalance = new ShowBalance();
  const assertPrice = await fetchAssetsPrice();
  const btcPrice = assertPrice.data.priceInfo.btc;
  const spacePrice = assertPrice.data.priceInfo.space;

  const spaceBalanceData = await fetchSpaceBalance(mvcAddrss);
  const spaceSumBalance = parseToSpace(
    (spaceBalanceData.confirmed + spaceBalanceData.unconfirmed).toString()
  );
  balance.spaceBalance = spaceSumBalance;
  const spaceAssert = toFloorNum(spacePrice * parseFloat(spaceSumBalance), 2);
  balance.spaceAssert = spaceAssert.toFixed(2);

  const btcBalanceData = await fetchBtcBalance(btcAddress);
  const btcBalance = (balance.btcBalance =
    btcBalanceData.data.balance.toString());
  const btcAssert = toFloorNum(btcPrice * parseFloat(btcBalance), 2);
  balance.btcAssert = btcAssert.toString();
  let assertSum = toFloorNum(spaceAssert + btcAssert, 2);
  const ftPriceData = await fetchMvcFtPrice();

  const ftdata = await fetchMvcFtBalance(mvcAddrss);
  if (ftdata) {
    const assertFt = caculateOneFtValue(ftdata, ftPriceData);
    assertSum = toFloorNum(parseFloat(assertFt) + assertSum, 2);
  }

  balance.sumAssert = assertSum.toFixed(2);
  // console.log("assert" + JSON.stringify(balance));
  return balance;
}

//utils b 45 bao 2
export function toFloorNum(value: number, num: number) {
  const factor = Math.pow(10, num);
  const reuslt = Math.floor(value * factor) / factor;
  return reuslt;
}

//btc icon
export const btcBaseIconUrl = "https://www.metalet.space/wallet-api";

export function getBtcBrc20Icon(ftName: string) {
  let iconPic = "";

  switch (ftName.toLocaleLowerCase()) {
    case "bili":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/bili.jpg";
      break;
    case "btcs":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/btcs.jpg";
      break;
    case "cats":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/cats.jpg";
      break;
    case "fish":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/fish.jpg";
      break;
    case "grum":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/grum.png";
      break;
    case "ibtc":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/ibtc.jpg";
      break;
    case "lger":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/lger.jpg";
      break;
    case "ordi":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/ordi.svg";
      break;
    case "orxc":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/orxc.png";
      break;
    case "oxbt":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/oxbt.png";
      break;
    case "rats":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/rats.jpg";
      break;
    case "rdex":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/rdex.png";
      break;
    case "sats":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/sats.jpg";
      break;
    case "sayc":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/sayc.jpg";
      break;
    case "trac":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/trac.png";
      break;
    case "vmpx":
      iconPic = btcBaseIconUrl + "/v3/coin/brc20/icon/vmpx.jpg";
      break;
  }
  return iconPic;
}
