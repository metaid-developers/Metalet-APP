export interface RootBtcFtObject {
  code: number;
  message: string;
  processingTime: number;
  data: Data;
}

interface Data {
  list: BtcFtBean[];
  total: number;
}

export interface BtcFtBean {
  ticker: string;
  overallBalance: string;
  transferableBalance: string;
  availableBalance: string;
  availableBalanceSafe: string;
  availableBalanceUnSafe: string;
  decimal: number;
}