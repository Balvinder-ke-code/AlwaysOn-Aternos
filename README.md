
# Minecraft Bot for Cracked Servers (Aternos Compatible)

This project is a simple **Minecraft bot** built using [Mineflayer](https://github.com/PrismarineJS/mineflayer).  
It is designed for **cracked Minecraft servers**, especially **Aternos**.


## 🚀 Deployment on Render.com

Follow these steps to host the bot for free on [Render](https://render.com):

### 1. Connect Repository
1. Fork or clone this repository.
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Create a **New Web Service**.
4. In **Public Git Repository**, paste the URL of this repository.
5. Choose a name of your liking.


### 2. Configure Build & Start Commands
- **Language**: Node.js  
- **Branch**: `main`  
- **Build Command**:
  ```bash
  npm install


* **Start Command**:

  ```bash
  node index.js
  ```
* **Plan**: Free tier is enough.



### 3. Set Environment Variables

Add the following **environment variables** in the Render service settings:

| Variable Name        | Example Value        | Description                                                             |
| -------------------- | -------------------- | ----------------------------------------------------------------------- |
| `MC_VERSION`         | `1.21.1`             | Minecraft version (check Mineflayer docs for latest supported version). |
| `MINECRAFT_HOST`     | `example.aternos.me` | Your server IP address (without `:port`).                               |
| `MINECRAFT_PORT`     | `11111`              | Your server port (find it in your Aternos server).                      |
| `MINECRAFT_USERNAME` | `BotName`            | The bot’s username (choose any).                                        |
| `PORT`               | `10000`              | Required for Render, keep as is.                                        |

---

## ▶️ First Run

1. Start your **Aternos server**.  
2. Once the Render service is deployed, the bot will automatically join your server.  

---

## ⚠️ Troubleshooting

🔹 **Bot Banned on Aternos?**  
Aternos sometimes bans bots. If that happens:  
- Go to your Aternos console → **Unban the bot**.  
- Restart your server → The bot will reconnect automatically.  

---

## 🎉 Success!

✅ Congratulations! Your bot is now running **24/7** on your Minecraft server with **Render.com**
