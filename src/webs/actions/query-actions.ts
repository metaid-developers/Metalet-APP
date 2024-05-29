import * as GetUtxos from "./lib/query/get-utxos";
import * as GetBalance from "./lib/query/get-balance";
import * as GetNetwork from "./lib/query/get-network";
import * as GetAddress from "./lib/query/get-address";
import * as IsConnected from "./lib/query/is-connected";
import * as GetPublicKey from "./lib/query/get-public-key";
import * as VerifySignature from "./lib/query/verify-signature";
import * as GetTokenBalance from "./lib/query/get-token-balance";
import * as GetXPublicKey from "./lib/query/get-extended-public-key";
import * as PreviewTransaction from "./lib/query/preview-transaction";
// import * as Listen from '../lib/actions/listen'

// // BTC
import * as PushPsbt from './lib/query/btc/push-psbt'
import * as GetBTCUtxos from './lib/query/btc/get-utxos'
import * as GetBTCAddress from './lib/query/btc/get-address'
import * as GetBTCBalance from './lib/query/btc/get-balance'
import * as GetBTCPublicKey from './lib/query/btc/get-public-key'
import * as BTCVerifyMessage from './lib/query/btc/verify-message'
import * as GetBTCAddressType from './lib/query/btc/get-address-type'

type QueryAction = {
  process: Function;
};

export default {
  // Listen,
  GetUtxos,
  GetBalance,
  GetAddress,
  GetNetwork,
  IsConnected,
  GetPublicKey,
  GetXPublicKey,
  GetTokenBalance,
  VerifySignature,
  PreviewTransaction,

  // BTC
  PushPsbt,
  GetBTCUtxos,
  GetBTCBalance,
  GetBTCAddress,
  GetBTCPublicKey,
  BTCVerifyMessage,
  GetBTCAddressType,
} as { [key: string]: QueryAction };
