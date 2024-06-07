import * as Pay from "./lib/authorize/pay";
import * as Merge from "./lib/authorize/merge";
import * as Connect from "./lib/authorize/connect";
import * as Transfer from "./lib/authorize/transfer";
import * as Disconnect from "./lib/authorize/disconnect";
import * as SignMessage from "./lib/authorize/sign-message";
import * as EciesDecrypt from "./lib/authorize/ecies-decrypt";
import * as EciesEncrypt from "./lib/authorize/ecies-encrypt";
import * as TransferToken from "./lib/authorize/transfer-token";
import * as SwitchNetwork from "./lib/authorize/switch-network";
import * as SignTransaction from "./lib/authorize/sign-transaction";
import * as SignTransactions from "./lib/authorize/sign-transactions";

// // BTC
import * as Inscribe from "./lib/authorize/btc/inscribe";
import * as ConnectBTC from "./lib/authorize/btc/connect";
import * as BTCTransfer from "./lib/authorize/btc/transfer";
import * as SignBTCPsbt from "./lib/authorize/btc/sign-psbt";
import * as SignBTCMessage from "./lib/authorize/btc/sign-message";

function doNothing() {}

type AuthorizeAction = {
  name: string;
  title: string;
  description: string | string[];
  process: Function;
  estimate: Function;
  closeAfterProcess: boolean;
};

export default {
  Connect: {
    name: "Connect",
    title: "Connect",
    description: "Connect",
    process: Connect.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  Disconnect: {
    name: "Disconnect",
    title: "Disconnect",
    description: "Disconnect",
    process: Disconnect.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  SwitchNetwork: {
    name: "SwitchNetwork",
    title: "SwitchNetwork",
    description: "SwitchNetwork",
    process: SwitchNetwork.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  TokenTransfer: {
    name: "TokenTransfer",
    title: "Token Transfer",
    description: "Transfer tokens from my wallet to another",
    process: TransferToken.process,
    estimate: TransferToken.estimate,
    closeAfterProcess: false,
  },
  Transfer: {
    name: "Transfer",
    title: "Transfer",
    description: "Transfer tokens from my wallet to another",
    process: Transfer.process,
    estimate: doNothing,
    closeAfterProcess: false,
  },
  Merge: {
    name: "Merge",
    title: "Merge",
    description: "Merge all the UTXOs into one in my wallet",
    process: Merge.process,
    estimate: doNothing,
    closeAfterProcess: false,
  },
  SignTransaction: {
    name: "Sign a Transaction",
    title: "Sign a Transaction",
    description: ["Sign a transaction with my wallet"],
    process: SignTransaction.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  SignTransactions: {
    name: "Sign Transactions",
    title: "Sign Multiple Transactions",
    description: ["Sign multiple transactions with my wallet as once"],
    process: SignTransactions.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  Pay: {
    name: "Pay",
    title: "Pay for transactions",
    description: [
      "Third party apps create functional transaction(s), and ask Metalet to pay for them.",
    ],
    process: Pay.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  EciesEncrypt: {
    name: "ECIES Encrypt",
    title: "ECIES Encrypt",
    description: "Encrypt a message with ECIES algorithm",
    process: EciesEncrypt.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  EciesDecrypt: {
    name: "ECIES Decrypt",
    title: "ECIES Decrypt",
    description: ["Decrypt an encrypted message with ECIES algorithm"],
    process: EciesDecrypt.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  SignMessage: {
    name: "Sign Message",
    title: "Sign Message",
    description: ["Sign a message with ECDSA algorithm"],
    process: SignMessage.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },

  // BTC
  SignBTCPsbt: {
    name: "SignBTCPsbt",
    title: "Sign for Psbt",
    description: [
      "Third party apps requests signing of the PSBT(s), and ask Metalet to sign for them.",
    ],
    process: SignBTCPsbt.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  ConnectBTC: {
    name: "Connect BTC",
    title: "Connect Account",
    description: ["Connect Account"],
    process: ConnectBTC.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  BTCTransfer: {
    name: "",
    title: "",
    description: [""],
    process: BTCTransfer.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  SignBTCMessage: {
    name: "Sign BTC Message",
    title: "Signature request",
    description:
      "Only sign this message if you fully understand the content and trust the requesting site.",
    process: SignBTCMessage.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
  Inscribe: {
    name: "Inscribe",
    title: "Inscribe",
    description: "",
    process: Inscribe.process,
    estimate: doNothing,
    closeAfterProcess: true,
  },
} as { [key: string]: AuthorizeAction };
