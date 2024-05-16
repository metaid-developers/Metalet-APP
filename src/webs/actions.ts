export const injectedJavaScript = `
// 第三个 JavaScript 代码片段
const postMessage = async function (data) {
  window.ReactNativeWebView.postMessage(data);

  const subscribe = (callback) => {
    const eventListener = (nativeEvent) => {
      callback(nativeEvent.data);
    };

    //安卓用document，ios用window
    window.addEventListener("message", eventListener);
    document.addEventListener("message", eventListener);
  };

  return await new Promise((resolve, reject) => {
    subscribe((data) => {
      resolve(data);
    });
  });
};

// 第一个 JavaScript 代码片段   metalet 钱包方法
window.metaidwallet = {
  getAddress: async function () {
    return await postMessage("getAddress", "*");
  },
  getPublick: function () {
    postMessage("getPublick", "*");
  },




};`;
