// =====================
// IMPORTS
// =====================
import mineflayer from "mineflayer";
import fetch from "node-fetch";
import express from "express";

// =====================
// BOT CONFIG + START
// =====================
function startBot() {
  const SERVER_HOST = "haklakasmp.aternos.me";
  const SERVER_PORT = 53310;
  const BOT_NAME = "HaklaTheBot";
  const SERVER_VERSION = false;

  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: SERVER_VERSION,
  });

  // Bot behavior
  bot.once("spawn", () => {
    console.log("✅ Bot has spawned!");
    setInterval(
      () => {
        const actions = [jump, lookAround, walkRandom];
        const action = actions[Math.floor(Math.random() * actions.length)];
        action();
      },
      5000 + Math.random() * 5000,
    );
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

  // =====================
  // NEW FEATURES
  // =====================

  // 1. Auto Respawn
  bot.on("death", () => {
    console.log("☠️ Bot died. Respawning in 3s...");
    setTimeout(() => bot.emit("respawn"), 3000);
  });

  // 2. Chat Logging
  bot.on("chat", (username, message) => {
    if (username === bot.username) return; // ignore own messages
    console.log(`💬 [${username}]: ${message}`);
  });

  // Error & reconnect handling
  bot.on("kicked", (reason) => {
    let msg = typeof reason === "string" ? reason : JSON.stringify(reason);
    console.log("❌ Kicked:", msg);
    const delay = 30000 + Math.random() * 60000;
    console.log(`🔄 Reconnecting in ${Math.round(delay / 1000)}s...`);
    setTimeout(startBot, delay);
  });

  bot.on("error", (err) => console.error("❌ Error:", err));
  bot.on("end", () => {
    console.log("🔴 Bot disconnected. Reconnecting in 60s...");
    setTimeout(startBot, 60000);
  });

  return bot;
}

const bot = startBot();

// =====================
// ATERNOS KEEP ALIVE
// =====================
const START_URL =
  "https://aternos.org/ajax/server/start?access-credits=false&TOKEN=YGvkF58EWm8elgvbKgHI&SEC=MKVNL8TOmFXLAivK%3A4WgBvSK4RJ7DwpNo&SERVER=IGw564qxFTTBO8WQ";
const COOKIE =
  "ATERNOS_SEC_4VnX4dUG16zRMHNy=5zgFzHYfoSCbGgnn; ATERNOS_SEC_rOuIbN5o8EQxCp3u=faLHD8WdScoHWvDj; ATERNOS_SEC_aEEN0zyJfeg2BZig=4PDHikYGrRagUVTE; ATERNOS_SEC_MKVNL8TOmFXLAivK=4WgBvSK4RJ7DwpNo; ATERNOS_LANGUAGE=en; _ga=GA1.1.522706137.1741707788; _sharedid=57d10b74-aedd-4a6d-b8dc-691f990cd52b; _sharedid_cst=zix7LPQsHA%3D%3D; _pubcid=0eae1cc4-8599-40e8-a434-c20fb7c0711e; _cc_id=fdc03507ed76a9fb7bd20e4cf10c32ee; cf_clearance=zQ2aOPOhXU5krIK3aJEVF3gWQCDVvnYx3HtkoyeCbjM-1742451948-1.2.1.1-aXb02Rvm20eB_f.87orrFfUNLZCFel4nxDlHcMjuDF3LXyI9nvjRV7527uSd98Xnl4WzZzu9xu3sv3jnRYhOx0CRd24MruU3.rMNT54jD1M6wiN6hTzEHXDuStjxsfealcvX7.dOhfizU1rSrg_TtznRJ8KbtqYE3mQtyAT92bK8V5A8aI.9oT1_26LDJVfJlMgD.24H48sISixd26HJ_8Nzfu5aKotFlMrPk3kd8w_FOe.Aun3HoDnb_baCaV8KT0XpLS1hCR5QYIjtfnt3OcBuzFbCVfF716fnXO0uNVLCoal1pfuyAn4CtwL.KmPSdnXuhBJUB5iMoWe1fOyBru6NFpGjLij3bOTd7LOK2zE; ATERNOS_SESSION=gOOOmyJTqTZ58P5w2L1UDXSyqiNpL31LglJSPsKkHRda0ZpG6a2FKT2n6r2YdRcvVDceZQOD1sTJq765W5p9eEtqdESmWVB1A1XR; _lr_env_src_ats=false; panoramaId_expiry=1755355402229; panoramaId=8dc4a3cdd9da6d5ce41602e0c331a9fb927a1725031b41a5e59efbf97c798ef9; panoramaIdType=panoDevice; hb_insticator_uid=7bbf04ce-3a8c-498a-a5e4-6eb85e0ff73c; __binsUID=863058c4-d328-4e1b-a0eb-d9eba0a5a969; _pubcid_cst=yyzLLLEsNg%3D%3D; ATERNOS_SERVER=IGw564qxFTTBO8WQ; _lr_retry_request=true; _ga_70M94GH0FD=GS2.1.s1755310282$o8$g1$t1755311796$j56$l0$h0; cto_bidid=jph8S18yeWlrVVhjMWhkSUhwZVNTSTNvR0FENWxIbm1XSEk5R0RKanJHRWtyTThNbWFPRElueU5LbG5rNjhlZnZTQ3gydGpxREhtaEFZOEF2T1p5WERLRUpsaGxidiUyRmxPSlMlMkZ6SmI2UHQlMkJBeTNkVSUzRA; FCNEC=%5B%5B%22AKsRol-dS0R3XQ-0l7JnvDuiWlwFrW-dEA0jVzbTFO7uO2Wn-olpfXJu0R8gyEO-hN4j15IDWfNO_z2fmjVl7Sc8PEeNxCVsY_03zs5n2FIzqnahHqxoEHy7koRUKMic3Dq9m86zH8eMpNavYaBhOZEDANBB8imfeg%3D%3D%22%5D%5D; cto_bundle=hhtWxV84YlAwMHZ2TGlTcVhVOU54bXBJOFcyZnclMkJCanYwJTJGbVNSalBaaEZlOGJUbGYlMkZuVTVMblBWd3lZVlhtdEMzRFAwQXAlMkJNcEw2TFBpSiUyQkVrdkg5Q04wUzQ3UjgwWlJCTWZaTDZ0Y3BTUFlhdFBPN2ZleWo5VkN1cEdWM25JdHFjYSUyQkg3cjhGS2dzRm1RR0RMTjRlSWxRMFElM0QlM0Q; __gads=ID=3c23d6c4b744816a:T=1741707794:RT=1755313569:S=ALNI_MY3PLHPEYq62qhSpcJf6qWsiCyHGQ; __eoi=ID=c901fcf79bce623d:T=1741707794:RT=1755313569:S=AA-AfjbL5a-kF9YnneeKQknXGHsW"; // keep it private

async function keepAlive() {
  try {
    const res = await fetch(START_URL, {
      method: "GET",
      headers: {
        Cookie: COOKIE,
        "User-Agent": "Mozilla/5.0",
      },
    });

    const data = await res.json().catch(() => null);
    console.log("🌐 Aternos keep-alive:", data);
  } catch (err) {
    console.error("❌ Error pinging Aternos:", err.message);
  }
}
setInterval(keepAlive, 5 * 60 * 1000);
keepAlive();

// =====================
// EXPRESS SERVER FOR UPTIMEROBOT + /say COMMAND
// =====================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive 🚀");
});

// Endpoint to send chat messages to Minecraft
app.get("/say/:msg", (req, res) => {
  const msg = req.params.msg;
  if (bot && bot.chat) {
    bot.chat(msg);
    res.send(`✅ Bot said: ${msg}`);
  } else {
    res.send("❌ Bot is not connected");
  }
});

app.listen(3000, () => {
  console.log("🌍 Web server running on port 3000");
});
