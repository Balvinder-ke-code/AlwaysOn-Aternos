import express from "express";
import { createBot } from "mineflayer";

const {
  MINECRAFT_HOST,
  MINECRAFT_PORT,
  MINECRAFT_USERNAME,
  MINECRAFT_PASSWORD,
  MC_VERSION,
  PORT
} = process.env;

// keep Render happy with a web service "door"
const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(PORT || 10000, "0.0.0.0", () => {
  console.log(`Health server running on ${PORT || 10000}`);
});

let bot; // our minecraft bot
let rejoinTimeout;
let disconnectTimer;  // NEW: for disconnect

function startBot() {
  bot = createBot({
    host: MINECRAFT_HOST,
    port: MINECRAFT_PORT ? Number(MINECRAFT_PORT) : 25565,
    username: MINECRAFT_USERNAME,
    password: MINECRAFT_PASSWORD || undefined,
    version: MC_VERSION || false,
  });

  bot.on("login", () => {
    console.log("Bot logged in:", bot.username);

    // start random move loop
    randomMoveLoop();

    // schedule auto-disconnect after 8-9 minutes
    const disconnectDelay = (8 * 60 + Math.floor(Math.random() * 60)) * 1000; 
    setTimeout(() => {
      console.log("Disconnecting bot for nap...");
      bot.quit("Nap time!");
      // rejoin after 60-90 seconds
      const rejoinDelay = (60 + Math.floor(Math.random() * 30)) * 1000;
      rejoinTimeout = setTimeout(startBot, rejoinDelay);
    }, disconnectDelay);
  });

  bot.on("spawn", () => {
    console.log("Bot spawned in the world.");
  });

  bot.on("end", (reason) => {
    console.log("Bot disconnected:", reason);
    if (disconnectTimer) clearTimeout(disconnectTimer);
  });

  bot.on("error", (err) => {
    console.error("Bot error:", err);
  });
}

// --- Random movement & looking ---
function randomMoveLoop() {
  if (!bot || !bot.entity) return;

  // pick random look direction
  const yaw = Math.random() * Math.PI * 2;
  const pitch = (Math.random() - 0.5) * 0.5; // small up/down
  bot.look(yaw, pitch, true);

  // move forward for a short time sometimes
  if (Math.random() < 0.5) {
    bot.setControlState("forward", true);
    setTimeout(() => bot.setControlState("forward", false), 1000 + Math.random() * 2000);
  }

  // schedule next random action
  const delay = 2000 + Math.random() * 5000; // every 2-7 seconds
  setTimeout(randomMoveLoop, delay);
}

// start the bot!
startBot();
