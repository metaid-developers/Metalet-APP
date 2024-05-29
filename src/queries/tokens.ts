import { mvcApi } from "./request";
import { SymbolTicker } from "@/lib/asset-symbol";

export type Token = {
  codeHash: string;
  genesis: string;
  name: string;
  symbol: SymbolTicker;
  decimal: number;
  sensibleId: string;
  utxoCount: number;
  confirmed: number;
  confirmedString: string;
  unconfirmed: number;
  unconfirmedString: string;
};

export const fetchTokens = async (address: string): Promise<Token[]> => {
  const tokens: any = await mvcApi(
    `/contract/ft/address/${address}/balance`
  ).get();

  return tokens.map((token: any) => {
    // 将codeHash改为小写
    token.codehash = token.codeHash;
    delete token.codeHash;
    return token;
  });
};
