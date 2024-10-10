import { FEEB } from "@/lib/config";
import { getNetwork } from "@/lib/network";
import { getApiHost } from "@/queries/hosts";
import { getCurrentWallet } from "@/lib/wallet";
import { Chain } from "@metalet/utxo-wallet-service";
import { API_NET, API_TARGET, Wallet } from "meta-contract";

export async function process() {
  const network: API_NET = (await getNetwork()) as API_NET;
  const chainWallet = await getCurrentWallet(Chain.MVC);
  const purse = chainWallet.getPrivateKey();
  const apiHost = await getApiHost();

  const wallet = new Wallet(purse, network, FEEB, API_TARGET.CYBER3, apiHost);

  type TransferResult = {
    id: number;
    txid: string;
    txHex: string;
    routeCheckTxHex?: string;
  };
  const results: TransferResult[] = [];
  const txids: string[] = [];

  const mergeRes = await wallet.merge();
  results.push({
    id: 1,
    txid: mergeRes.txId,
    txHex: mergeRes.txHex,
  });
  txids.push(mergeRes.txId);

  return { res: results, txids, broadcasted: true };
}
