import { Client, Intents } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

import { IConfig, } from './global';
const config: IConfig = require('../config.json');
let BOT: Client;

export default () => {
    BOT = new Client({ intents: new Intents(32767) });
    BOT.login(config.token);

    for (const file of readdirSync(path.join(__dirname, './events'))) { 
        console.log("[LOADED EVENT] > " + file.split(".")[0]);
        BOT.on(file.split('.')[0], (...args) => require(path.join(__dirname, `./events/${file}`)).execute(BOT, ...args)); 
    }
    
    return BOT;
};