<h1 align="center"><a>Wick Scam Bot ⛔</a></h1>
<h3 align="center">Wick Discord scam bot that grabs tokens via a QR Code. </br> Make sure to star this project ⭐!</br></br>This project is for Educational Purposes ONLY. This was not meant for malicous use. </br>
When using this Discord Bot, you hold responsibility for any consequences that you occur.</h3>t

### Features
* **Exact Clone** (Looks exactly like the real wick bot when set up properly)
* **Modular Design** (add commands and events exactly like a real bot. also has a customisable config file)
* **Automatic Boosting** (fetches and boosts server instantly when logged. if option selected)
</br>

![image](https://user-images.githubusercontent.com/93608862/178123406-119f5f84-f2bd-4b97-8bd9-168a68be3921.png)

### Setup
* **Clone Repository** `gh repo clone ulnk/scam`
* **Install Dependencies** `yarn` or `npm install`
* **Create Bot** [go to bot dashboard](https://discord.com/developers/applications/)
  * **ENABLE ALL PARTIALS AND INTENTS FOR YOUR BOT** 
  * Without all partials and intents, the bot will not function.
  * Change profile picture to [wick.png](https://github.com/ulnk/scam/blob/main/wick.png)
  * Change description to 
```
Discord Security Bot made to protect servers from raids, nukes and more things!
https://wickbot.com/
```
* **Edit `config.json` file**
  * Change the all of the config.json options to your bot .
  * *(NOTE: KEEP ALL CHANNELS INSIDE THE SAME GUILD)*
* **Add all emojis to server**
  * Without, the emojis will be `undefined`
  * You can select all and drag into the add emojis discord page
  * *(NOTE: YOU HAVE TO ADD ALL EMOJI IDS INTO CONFIG.JSON)*
* **Start** `yarn dev` or `npm run dev`
  * if using heroku, make sure you have the start script


<details>
<summary><b>Video Explanation</b></summary>
<br>

[![video](https://user-images.githubusercontent.com/93608862/178724341-aed4f2ec-91e3-4a52-afe4-af52163f3e82.png)](https://www.youtube.com/watch?v=ArrVGDivw6A)
</details>

### Libraries Used
* **discord.js** (discord bot) <img alt="preview badge" src="https://img.shields.io/npm/v/discord.js">
* **crypto** (private keys & public keys) <img alt="preview badge" src="https://img.shields.io/npm/v/crypto">
* **ws** (web socket) <img alt="preview badge" src="https://img.shields.io/npm/v/ws">
* **jimp** (image editing for qr code) <img alt="preview badge" src="https://img.shields.io/npm/v/jimp">
