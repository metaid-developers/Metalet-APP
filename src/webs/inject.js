export const injectedJavaScript = `
const generateRandomString = (len) => {
  let randomString = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < len; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return randomString;
};

const postMessage = async function (actionName, actionType, params) {
  const nonce = generateRandomString(16);

  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      nonce,
      params: params || {},
      channel: "to-metaidwallet",
      host: window.location.host,
      action: actionName + "-" + actionType,
      icon:
        document.querySelector("link[rel='icon']")?.href ||
        document.querySelector("link[rel='shortcut icon']")?.href ||
        "",
    })
  );

  const subscribe = (callback) => {
    const eventListener = (nativeEvent) => {
      try {
        const res = JSON.parse(nativeEvent.data);
        if (typeof res === "object" && res.nonce === nonce) {
          callback(res.data);
        }
      } catch (e) {
        console.error("listen error:", e);
      }
    };

    // Android
    window.addEventListener("message", eventListener);
    // IOS
    document.addEventListener("message", eventListener);
  };

  return await new Promise((resolve, reject) => {
    subscribe((data) => {
      if (data.error) {
        reject(data.error)
      }
      resolve(data);
    });
  });
};

const actions = {
  connect: { action: "Connect", type: "authorize" },
  disconnect: { action: "Disconnect", type: "authorize" },
  isConnected: { action: "IsConnected", type: "query" },
  getNetwork: { action: "GetNetwork", type: "query" },
  switchNetwork: { action: "SwitchNetwork", type: "authorize" },
  getAddress: { action: "GetAddress", type: "query" },
  getUtxos: { action: "GetUtxos", type: "query" },
  getPublicKey: { action: "GetPublicKey", type: "query" },
  getXPublicKey: { action: "GetXPublicKey", type: "query" },
  getBalance: { action: "GetBalance", type: "query" },
  getTokenBalance: { action: "GetTokenBalance", type: "query" },
  verifySignature: { action: "VerifySignature", type: "query" },
  previewTransaction: { action: "PreviewTransaction", type: "query" },
};

const metalet = { btc: {} };

Object.keys(actions).forEach((key) => {
  metalet[key] = async function (params) {
    const { action, type } = actions[key];
    return await postMessage(action, type, params);
  };
});

const btcKeys = {
  query: [
    { name: "getBalance", action: "GetBTCBalance" },
    { name: "getAddress", action: "GetBTCAddress" },
    { name: "getAddresType", action: "GetBTCAddressType" },
    { name: "getPublicKey", action: "GetBTCPublicKey" },
    { name: "getUtxos", action: "GetBTCUtxos" },
    { name: "pushPsbt", action: "PushPsbt" },
    { name: "verifyMessage", action: "BTCVerifyMessage" },
  ],
  authorize: [
    { name: "connect", action: "ConnectBTC" },
    { name: "signPsbt", action: "SignBTCPsbt" },
    { name: "signMessage", action: "SignBTCMessage" },
    { name: "inscribe", action: "Inscribe" },
    { name: "transfer", action: "BTCTransfer" },
  ],
  inscribe: [{ name: "inscribeTransfer", action: "InscribeTransfer" }],
};

Object.keys(btcKeys).forEach((type) => {
  btcKeys[type].forEach((item) => {
    metalet.btc[item.name] = async function (params) {
      return await postMessage(item.action, type, params);
    };
  });
});

window.metaidwallet = metalet;
`;
