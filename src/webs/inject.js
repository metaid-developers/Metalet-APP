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
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      params: params || {},
      channel: "to-metaidwallet",
      host: window.location.host,
      nonce: generateRandomString(16),
      action: actionName + "-" + actionType,
      icon: document.querySelector("link[rel='icon']")?.href || document.querySelector("link[rel='shortcut icon']")?.href || "",
    })
  );

  const subscribe = (callback) => {
    const eventListener = (nativeEvent) => {
      callback(nativeEvent.data);
    };

    // Android
    window.addEventListener("message", eventListener);
    // IOS
    document.addEventListener("message", eventListener);
  };

  return await new Promise((resolve, reject) => {
    subscribe((data) => {
      resolve(data);
    });
  });
};

window.metaidwallet = {
  connect: async function () {
    return await postMessage("Connect", "authorize");
  },
  disconnect: async function () {
    return await postMessage("Disconnect", "authorize");
  },
  isConnected: async function () {
    return await postMessage("IsConnected", "query");
  },
  getNetwork: async function () {
    return await postMessage("GetNetwork", "query");
  },
  getAddress: async function (data) {
    return await postMessage("GetAddress", "query", data);
  },
  getPublick: function () {
    postMessage("getPublick");
  },
};
;`;
