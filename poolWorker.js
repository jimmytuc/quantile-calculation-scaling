const { parentPort } = require("worker_threads");
const poolUtil = require("./poolUtil");

parentPort.on("message", ({ pool, percentile }) => {
  const calculatedQuantile = poolUtil.quantile(pool, percentile);
  parentPort.postMessage({
    calculatedQuantile,
  });
});
