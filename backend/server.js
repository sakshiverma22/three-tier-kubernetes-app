const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb-service:27017/testdb";

let requestCount = 0;
const startedAt = Date.now();
const cpuCount = Math.max(os.cpus().length, 1);

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

const getMongoStatus = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

const getCpuLoad = () => {
  const [oneMinuteLoad] = os.loadavg();
  return Math.min(100, Math.round((oneMinuteLoad / cpuCount) * 100));
};

const getMemoryLoad = () => {
  const total = os.totalmem();
  const available = os.freemem();
  return Math.round(((total - available) / total) * 100);
};

const buildHealthSnapshot = () => {
  requestCount += 1;
  const mongoStatus = getMongoStatus();

  return {
    service: "backend-api",
    message: "Backend Running",
    backend: "online",
    database: mongoStatus,
    latency: 0,
    cpuLoad: getCpuLoad(),
    memoryLoad: getMemoryLoad(),
    requests: requestCount,
    replicas: {
      frontend: { ready: 2, desired: 2 },
      backend: { ready: 2, desired: 2 },
      mongodb: { ready: mongoStatus === "connected" ? 1 : 0, desired: 1 },
    },
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  };
};

app.get("/", (req, res) => {
  res.send("LiveOps API is running");
});

app.get("/health", (req, res) => {
  const started = process.hrtime.bigint();
  const snapshot = buildHealthSnapshot();
  snapshot.latency = Number(process.hrtime.bigint() - started) / 1e6;
  res.json(snapshot);
});

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const sendSnapshot = () => {
    const started = process.hrtime.bigint();
    const snapshot = buildHealthSnapshot();
    snapshot.latency = Number(process.hrtime.bigint() - started) / 1e6;
    res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
  };

  sendSnapshot();
  const interval = setInterval(sendSnapshot, 2000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
