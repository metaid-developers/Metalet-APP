interface Account {
  id: string;
  name: string;
  addressIndex: number;
}

export interface Wallet {
  id: string;
  name: string;
  mnemonic: string;
  mvcTypes: number; // FIXME: should be mvcType
  addressType: string;
  isBackUp: boolean;
  seed: string;
  accountsOptions: Account[];
}
