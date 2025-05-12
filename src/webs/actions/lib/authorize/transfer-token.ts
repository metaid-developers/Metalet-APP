import { FEEB } from "@/lib/config";
import { getNetwork } from "@/lib/network";
import { getCurrentWallet } from "@/lib/wallet";
import { Chain } from "@metalet/utxo-wallet-service";
import { API_NET, API_TARGET, FtManager } from "meta-contract";
import { METASV_HOST, METASV_TESTNET_HOST } from "@/queries/hosts";

export async function process({
  codehash,
  genesis,
  receivers,
}: {
  codehash: string;
  genesis: string;
  receivers: {
    address: string;
    amount: string;
  }[];
}) {
  const network: API_NET = (await getNetwork()) as API_NET;
  const wallet = await getCurrentWallet(Chain.MVC);
  const purse = wallet.getPrivateKey();
  const apiHost = network === API_NET.MAIN ? METASV_HOST : METASV_TESTNET_HOST;

  const ftManager = new FtManager({
    network,
    apiTarget: API_TARGET.METALET,
    purse,
    feeb: FEEB,
    apiHost,
  });
  // Pick the largest utxo from wallet to pay the transaction
  const selfAddress = wallet.getAddress();
  const largestUtxo = await ftManager.api
    .getUnspents(selfAddress)
    .then((utxos) => {
      return utxos.reduce((prev, curr) => {
        if (curr.satoshis > prev.satoshis) return curr;
        return prev;
      });
    })
    .then((utxo) => {
      // add wif to utxo
      return {
        ...utxo,
        wif: purse,
      };
    });

  const { txid } = await ftManager.transfer({
    codehash,
    genesis,
    receivers,
    senderWif: purse,
    utxos: [largestUtxo],
  });

  return { txids: [txid] };
}

export async function estimate({
  codehash,
  genesis,
  receivers,
}: {
  codehash: string;
  genesis: string;
  receivers: {
    address: string;
    amount: string;
  }[];
}) {
  const network: API_NET = (await getNetwork()) as API_NET;
  const wallet = await getCurrentWallet(Chain.MVC);
  const purse = wallet.getPrivateKey();
  const apiHost = network === API_NET.MAIN ? METASV_HOST : METASV_TESTNET_HOST;

  const ftManager = new FtManager({
    network,
    apiTarget: API_TARGET.METALET,
    purse,
    feeb: FEEB,
    apiHost,
  });

  return ftManager.getTransferEstimateFee({
    codehash,
    genesis,
    receivers,
    senderWif: purse,
  });
}
