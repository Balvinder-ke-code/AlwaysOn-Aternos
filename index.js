import mineflayer from "mineflayer";
import fetch from "node-fetch";
import express from "express";

/**
 * ---- Config via ENV (recommended in Render/Railway) ----
 */
const SERVER_HOST = process.env.SERVER_HOST ?? "haklakasmp.aternos.me";
const SERVER_PORT = Number(process.env.SERVER_PORT ?? "53310");
const BOT_NAME = process.env.BOT_NAME ?? "HaklaTheBot";
const SERVER_VERSION = process.env.SERVER_VERSION ?? "1.21.1";

const RECONNECT_DELAY = Number(process.env.RECONNECT_DELAY ?? "60000"); // ms

// Optional Aternos auto-start
const ATERNOS_START_URL = process.env.ATERNOS_START_URL || "";
const ATERNOS_COOKIE = process.env.ATERNOS_COOKIE || "";

function aternosConfigured() {
  return Boolean(ATERNOS_START_URL && ATERNOS_COOKIE);
}

async function startAternosIfConfigured() {
  if (!aternosConfigured()) {
    console.log("ℹ️ Aternos auto-start not configured. Skipping...");
    return;
  }

  try {
    console.log("🌐 Attempting to start Aternos server...");
    const res = await fetch(ATERNOS_START_URL, {
      method: "GET",
      headers: {
        Cookie: ATERNOS_COOKIE,
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json"
      }
    });

    let data = null;
    try { data = await res.json(); } catch { data = await res.text(); }
    console.log("🌍 Aternos start response:", data);
  } catch (err) {
    console.error("❌ Failed to start Aternos:", err.message);
  }
}

function startBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: SERVER_VERSION
  });

  bot.once("spawn", () => {
    console.log("✅ Bot has spawned!");

    // Start doing random actions
    function randomActionLoop() {
      const actions = [jump, lookAround, walkRandom];
      const action = actions[Math.floor(Math.random() * actions.length)];
      action();

      // schedule next action after 5–10s
      const delay = 5000 + Math.random() * 5000;
      setTimeout(randomActionLoop, delay);
    }
    randomActionLoop();
  });

  function jump() {
    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 500);
    console.log("🤸 Bot jumped");
  }

  function lookAround() {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = ((Math.random() - 0.5) * Math.PI) / 2;
    bot.look(yaw, pitch, true);
    console.log("👀 Bot looked around");
  }

  function walkRandom() {
    const dirs = ["forward", "back", "left", "right"];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    bot.setControlState(dir, true);
    console.log("🚶 Bot walking " + dir);
    setTimeout(() => bot.setControlState(dir, false), 2000);
  }

  // Chat logging
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    console.log(`💬 [${username}]: ${message}`);
  });

  // Reconnect handling
  let reconnecting = false;
  function scheduleReconnect(reason) {
    if (reconnecting) return;
    reconnecting = true;
    const delay = RECONNECT_DELAY + Math.floor(Math.random() * 20000);
    console.log(`🔄 Reconnecting in ${Math.round(delay / 1000)}s... (${reason})`);

    setTimeout(async () => {
      reconnecting = false;
      await startAternosIfConfigured();
      startBot();
    }, delay);
  }

  bot.on("kicked", (reason) => {
    const msg = typeof reason === "string" ? reason : JSON.stringify(reason);
    console.log(`❌ Kicked: ${msg}`);
    scheduleReconnect("kicked");
  });

  bot.on("error", (err) => {
    console.log("❌ Error:", err.message);
    scheduleReconnect("error");
  });

  bot.on("end", () => {
    console.log("🔴 Bot disconnected");
    scheduleReconnect("end");
  });
}

// —— Start flow ——
const init = async () => {
  await startAternosIfConfigured();
  startBot();
};
init();

// —— Keep-alive server (important for Render/Railway) ——
const app = express();
app.get("/", (_, res) => res.send("✅ Bot is running!"));
app.listen(process.env.PORT || 3000, () => {
  console.log("🌍 Web server running on port", process.env.PORT || 3000);
});
