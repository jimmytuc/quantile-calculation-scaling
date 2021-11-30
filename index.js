const os = require("os");
const uuid = require("uuid").v4;
const express = require("express");
const bodyParser = require("body-parser");
const { StaticPool } = require("node-worker-threads-pool");
const storage = require("./storage");

const threadsPerCore = 4;
const cpuCount = os.cpus().length;
const expectedWorkersCount = parseInt(process.env.WORKER_COUNT) || cpuCount * threadsPerCore;
const storageFilePath = process.env.POOL_STORAGE_FILE || "./pools.json";

let pools = {}; // pools definition

const app = express();

/**
 * scaling out number of workers/instances
 */
const workerPool = new StaticPool({
  size: expectedWorkersCount,
  task: "./poolWorker.js",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

const addToPool = ({ poolId, poolValues }) => {
  const poolExist = pools[poolId] ? true : false;
  if (pools[poolId]) pools[poolId].push(...poolValues);
  else pools[poolId] = poolValues;
  return {
    poolId,
    poolValues: pools[poolId],
    status: poolExist ? "appended" : "inserted",
  };
};

app.post("/pools", async (req, res) => {
  try {
    const { poolId, poolValues } = req.body;
    const result = addToPool({ poolId, poolValues });
    await storage.store(storageFilePath, pools);
    res.status(200).json({
      ...result,
    });
  } catch (error) {
    console.trace(error)
    res.status(500).json({
      status: "internal_server_error",
      message: error.message
    });
  }
});

app.post("/pools/query", async (req, res) => {
  try {
    const { poolId, percentile } = req.body;

    const percentileInFloat = parseFloat(percentile) / 100;
    const pool = pools[poolId] || [];
    const result = await workerPool.exec({
      pool,
      percentile: percentileInFloat,
    });

    res.status(200).json({
      count: pool.length,
      percentile,
      quantile: result.calculatedQuantile,
    });
  } catch (error) {
    console.trace(error)
    res.status(500).json({
      status: "internal_server_error",
      message: error.message
    });
  }
});

(async () => {
  try {
    // store pool data on memory
    pools = await storage.restore(storageFilePath);
    const port = process.env.PORT || 8000;
    console.log(`server is listening on port: ${port}`);
    app.listen(port);
  } catch (error) {
    console.error(error);
  }
})();
