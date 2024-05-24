export interface MvcNftData {
  code: number;
  message: string;
  processingTime: number;
  data: MvcNftListData;
}

export interface MvcNftListData {
  list: MvcNft[];
  seriesName: string;
  tokenSupply: number;
}

export interface MvcNft {
  address: string;
  txId: string;
  txIndex: number;
  codeHash: string;
  genesis: string;
  sensibleId: string;
  height: number;
  metaTxId: string;
  metaOutputIndex: number;
  tokenSupply: number;
  tokenIndex: number;
  satoshi: number;
  satoshiString: string;
  flag: string;
  name: string;
  icon: string;
  imgUrl: string;
  seriesName: string;
  issuerAddress: string;
  issuerName: string;
  issueTime: number;
}