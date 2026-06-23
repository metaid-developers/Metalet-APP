import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(
  new URL("../src/utils/AssertUtils.ts", import.meta.url),
  "utf8"
);

const match = source.match(
  /export async function caculateMvcAndBtcAssert\([\s\S]*?\n}\n\n\/\/utils b/
);

if (!match) {
  throw new Error("Could not find caculateMvcAndBtcAssert in AssertUtils.ts");
}

const functionSource = match[0]
  .replace(/\n\n\/\/utils b$/, "")
  .replace(
    /export async function caculateMvcAndBtcAssert\(\s*mvcAddrss,\s*btcAddress\s*\): Promise<ShowBalance> \{/,
    "async function caculateMvcAndBtcAssert(mvcAddrss, btcAddress) {"
  )
  .replace(
    "const balance: ShowBalance = new ShowBalance();",
    "const balance = new ShowBalance();"
  );

const context = {
  console,
  ShowBalance: class ShowBalance {
    constructor() {
      this.spaceBalance = "";
      this.spaceAssert = "";
      this.btcBalance = "";
      this.btcAssert = "";
      this.dogeBalance = "";
      this.dogeAssert = "";
      this.sumAssert = "";
      this.btcNa = "";
      this.btcSafeBalance = "";
    }
  },
  fetchAssetsPrice: async () => ({
    data: { priceInfo: { btc: 63762.22, space: 0.0328 } },
  }),
  getWalletNetwork: async () => "mainnet",
  fetchSpaceBalance: async () => ({
    confirmed: 577119228,
    unconfirmed: 0,
  }),
  parseToSpace: (space) => (parseFloat(space) / 100000000).toFixed(8),
  toFloorNum: (value, num) => {
    const factor = Math.pow(10, num);
    return Math.floor(value * factor) / factor;
  },
  getDogeCoinWallet: async () => ({
    getAddress: async () => "DTESTADDRESS",
  }),
  fetchDogeBalance: async () => ({
    confirmed: 0,
    unconfirmed: 0,
  }),
  fetchBtcBalance: async () => ({
    data: {
      balance: 0.00002362,
      safeBalance: 0.00002362,
    },
  }),
  fetchMvcFtPrice: async () => ({ data: { priceInfo: {} } }),
  fetchMvcFtBalance: async () => null,
  fetchMrc20Price: async () => ({ data: { priceInfo: {} } }),
  fetchMrc20List: async () => ({
    code: 1,
    message: "request error",
    processingTime: 8,
    data: null,
  }),
  caculateOneFtValue: () => "0",
  caculateOneBtcFtMrc20Value: () => {
    throw new Error("MRC20 asset calculation should be skipped");
  },
};

vm.runInNewContext(
  `${functionSource}; globalThis.__result = caculateMvcAndBtcAssert("17EtGx2eejs4NW4QSwiCJFR6wrNGBnERLV", "17EtGx2eejs4NW4QSwiCJFR6wrNGBnERLV");`,
  context
);

const result = await context.__result;

assert.equal(result.spaceBalance, "5.77119228");
assert.equal(result.btcBalance, "0.00002362");
assert.equal(result.btcSafeBalance, "0.00002362");
assert.equal(result.btcNa, "0.00000000");
