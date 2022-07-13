import { Client, GuildEmoji } from "discord.js"
import { IEmojis } from './emojis.d';

import { IConfig } from "../global";
const config: IConfig = require("../../config.json");

const EMOJI_SERVER_ID = config.guildEmoji;

export const GetEmojis = (client: Client): IEmojis => {
    const verifyEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.verification)) as GuildEmoji; 
    const rightArrow = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.rightSort)) as GuildEmoji; 
    const bellEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.alarm)) as GuildEmoji; 
    const loadingEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.loading)) as GuildEmoji; 
    const cancelEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.cancel)) as GuildEmoji;
    const blankEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.space)) as GuildEmoji; 
    const mailEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.mail)) as GuildEmoji; 
    const tickEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.tick)) as GuildEmoji;
    const successEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get(config.emojis.success)) as GuildEmoji;

    return { 
        verifyEmoji, 
        blankEmoji, 
        bellEmoji, 
        rightArrow, 
        loadingEmoji, 
        cancelEmoji,
        successEmoji,
        mailEmoji, 
        tickEmoji 
    };
}
