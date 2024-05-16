export interface RootBtcBalanceObject {
  code: number;
  message: string;
  processingTime: number;
  data: Data;
}

interface Data {
  balance: number;
  block: Block;
  mempool: Block;
}

interface Block {
  incomeFee: number;
  spendFee: number;
}
