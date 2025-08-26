import express from "express";
import { createBot } from "mineflayer";

const { MINECRAFT_HOST, MINECRAFT_PORT, MINECRAFT_USERNAME, MC_VERSION, PORT } = process.env;

const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(PORT, "0.0.0.0", () => console.log(`Health server on ${PORT}`));

let bot;
let disconnectTimer;
let rejoinTimeout;

function startBot() {
  if (rejoinTimeout) clearTimeout(rejoinTimeout);

  bot = createBot({
    host: MINECRAFT_HOST,
    port: MINECRAFT_PORT ? Number(MINECRAFT_PORT) : 25565,
    username: MINECRAFT_USERNAME,   // cracked mode → username only
    version: MC_VERSION || false,
  });

  bot.on("login", () => {
    console.log("Bot logged in:", bot.username);

    // start moving
    randomMoveLoop();

    // schedule disconnect 8–9 minutes
    const delay = (8 * 60 + Math.floor(Math.random() * 60)) * 1000;
    disconnectTimer = setTimeout(() => {
      console.log("Bot taking a nap...");
      bot.quit("Nap time!");
      // rejoin after 60–90 sec
      rejoinTimeout = setTimeout(startBot, (60 + Math.random() * 30) * 1000);
    }, delay);
  });

  bot.on("end", (reason) => {
    console.log("Bot disconnected:", reason);
    if (disconnectTimer) clearTimeout(disconnectTimer);
    rejoinTimeout = setTimeout(startBot, 30000); // retry after 30s
  });

  bot.on("error", (err) => {
    console.error("Bot error:", err);
    if (disconnectTimer) clearTimeout(disconnectTimer);
    rejoinTimeout = setTimeout(startBot, 30000); // retry after 30s
  });
}

function randomMoveLoop() {
  if (!bot || !bot.entity) return;

  const yaw = Math.random() * Math.PI * 2;
  const pitch = (Math.random() - 0.5) * 0.5;
  bot.look(yaw, pitch, true);

  if (Math.random() < 0.5) {
    bot.setControlState("forward", true);
    setTimeout(() => bot.setControlState("forward", false), 1000 + Math.random() * 2000);
  }

  setTimeout(randomMoveLoop, 2000 + Math.random() * 5000);
}

startBot();
