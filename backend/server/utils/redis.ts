import { Redis } from "ioredis";

const redisURL = process.env.REDIS_URL;

if (!redisURL) {
  throw new Error("Redis connection failed. REDIS_URL not found.");
}

const redis = new Redis(redisURL, {
  tls: {
    rejectUnauthorized: false, // You may need to adjust this based on Upstash's configuration
  },
});

redis.on("error", (error) => {
  if (error.message.includes("ECONNRESET")) {
    console.log("Connection to Redis Session Store timed out.");
  } else if (error.message.includes("ECONNREFUSED")) {
    console.log("Connection to Redis Session Store refused!");
  } else {
    console.log("Redis Error:", error.message);
  }
});

redis.on("reconnecting", () => {
  console.log("Reconnecting to Redis Session Store...");
});

redis.on("connect", () => {
  console.log("Connected to Redis Session Store!");
});

export { redis };
