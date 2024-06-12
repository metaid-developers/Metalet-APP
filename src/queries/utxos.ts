import { Chain } from "@metalet/utxo-wallet-service";
// import { getNet } from "@/lib/network";
import { fetchBtcTxHex } from "./transaction";
import { mvcApi, mempoolApi, metaletApiV3, unisatApi } from "./request";
import { getNetwork } from "@/lib/network";
import { getWalletNetwork } from "@/utils/WalletUtils";

export interface UTXO {
  txId: string;
  outputIndex: number;
  satoshis: number;
  confirmed: boolean;
  rawTx?: string;
  inscriptions:
    | {
        id: string;
        num: number;
      }[]
    | null;
}

export type MvcUtxo = {
  flag: string;
  address: string;
  txid: string;
  outIndex: number;
  value: number;
  height: number;
};

// TODO: fix network switch
const fetchMVCUtxos = async (address: string): Promise<MvcUtxo[]> => {
  return (await mvcApi<MvcUtxo[]>(`/address/${address}/utxo`)).get();
};

export type Utxo = {
  addressType: number;
  outputIndex: number;
  satoshis: number;
  satoshi: number;
  txid: string;
  txId: string;
  vout: number;
};

export const fetchUtxos = async (
  chain: Chain,
  address: string
): Promise<any[]> => {
  if (chain === Chain.MVC) {
    return (await fetchMVCUtxos(address)) || [];
  } else {
    return (await getBtcUtxos(address)) || [];
  }
};

export enum AddressType {
  P2PKH,
  P2WPKH,
  P2TR,
  P2SH_P2WPKH,
  M44_P2WPKH,
  M44_P2TR,
}

export interface UnisatUTXO {
  txid: string;
  vout: number;
  satoshis: number;
  scriptPk: string;
  addressType: AddressType;
  inscriptions: {
    inscriptionId: string;
    inscriptionNumber?: number;
    offset: number;
  }[];
  atomicals: {
    atomicalId: string;
    atomicalNumber: number;
    type: "NFT" | "FT";
    ticker?: string;
  }[];

  runes: {
    runeid: string;
    rune: string;
    amount: string;
  }[];
}

export async function getBtcUtxos(
  address: string,
  needRawTx = false,
  // useUnconfirmed = false
  useUnconfirmed = true
): Promise<UTXO[]> {
  // const net = getNet();
  // if (UNISAT_ENABLED) {
  //   const unisatUtxos = await unisatApi<UnisatUTXO[]>(`/address/btc-utxo`).get({ net, address })
  //   const utxos = unisatUtxos.map((utxo) => formatUnisatUTXO(utxo))
  //   utxos.sort((a, b) => {
  //     if (a.confirmed !== b.confirmed) {
  //       return b.confirmed ? 1 : -1
  //     }
  //     return a.satoshis - b.satoshis
  //   })

  //   return utxos.filter((utxo) => utxo.confirmed)
  // }
  const network = await getWalletNetwork(Chain.BTC);
  console.log("network,", network);

  let utxos =
    (await metaletApiV3<UTXO[]>("/address/btc-utxo").get({
      net: network,
      address,
      unconfirmed: "1",
    })) || [];

  if (!useUnconfirmed) {
    utxos = utxos.filter((utxo) => utxo.confirmed);
  }
  if (needRawTx) {
    for (let utxo of utxos) {
      utxo.rawTx = await fetchBtcTxHex(utxo.txId);
    }
  }
  return utxos.sort((a, b) => {
    if (a.confirmed !== b.confirmed) {
      return b.confirmed ? 1 : -1;
    }
    return a.satoshis - b.satoshis;
  });
}

export async function getRuneUtxos(
  address: string,
  runeId: string,
  needRawTx = false
): Promise<UTXO[]> {
  // const net = getNet();
  const res = await metaletApiV3<{
    total: number;
    cursor: number;
    list: UTXO[];
  }>("/runes/address/utxo").get({
    net: getNetwork(Chain.BTC),
    address,
    runeId,
  });
  if (needRawTx) {
    for (let utxo of res.list) {
      utxo.rawTx = await fetchBtcTxHex(utxo.txId);
      utxo.rawTx;
    }
  }

  return res.list;
}

// export async function getInscriptionUtxos(inscriptions: Inscription[]): Promise<UTXO[]> {
//   const unisatUtxos = await unisatApi<UnisatUTXO[]>('/inscription/utxos').post({
//     inscriptionIds: inscriptions.map((inscription) => inscription.inscriptionId),
//   })
//   const utxos = unisatUtxos.map((utxo) => {
//     const inscriptionIds = utxo.inscriptions.map((inscription) => inscription.id)
//     const inscription = inscriptions.find((inscription) => inscriptionIds.includes(inscription.inscriptionId))!
//     return { ...utxo, confirmed: !!inscription.utxoConfirmation }
//   })
//   return utxos.map((utxo) => formatUnisatUTXO(utxo))
// }

export async function getInscriptionUtxo(
  inscriptionId: string,
  needRawTx: boolean = false
): Promise<UTXO> {
  const net = getNetwork(Chain.BTC);
  const utxo = await metaletApiV3<UTXO>("/inscription/utxo").get({
    net,
    inscriptionId,
  });
  if (needRawTx) {
    utxo.rawTx = await fetchBtcTxHex(utxo.txId);
  }
  return utxo;
}

export interface MempoolUtxo {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  value: number;
}

function formatMempoolUTXO(utxo: MempoolUtxo): UTXO {
  return {
    txId: utxo.txid,
    outputIndex: utxo.vout,
    satoshis: utxo.value,
    confirmed: utxo.status.confirmed,
    inscriptions: [],
  };
}

function formatUnisatUTXO(utxo: UnisatUTXO): UTXO {
  return {
    txId: utxo.txid,
    outputIndex: utxo.vout,
    satoshis: utxo.satoshis,
    confirmed: true,
    inscriptions: [],
  };
}

export async function getUtxos(address: string): Promise<UTXO[]> {
  const utxos = await mempoolApi<MempoolUtxo[]>(
    `/address/${address}/utxo`
  ).get();
  return utxos.map((utxo) => formatMempoolUTXO(utxo));
}
