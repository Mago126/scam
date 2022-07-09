import { Client, GuildEmoji } from "discord.js"
import { IEmojis } from './emojis.d';

const EMOJI_SERVER_ID = '971073883623018567';

export const GetEmojis = (client: Client): IEmojis => {
    const verifyEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995088346302910484')) as GuildEmoji; 
    const rightArrow = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995088347418591292')) as GuildEmoji; 
    const bellEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995088344910413825')) as GuildEmoji; 
    const loadingEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995100673320435823')) as GuildEmoji; 
    const cancelEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995107795399606283')) as GuildEmoji;
    const blankEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995095573944356905')) as GuildEmoji; 
    const mailEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995119025929584720')) as GuildEmoji; 
    const tickEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995120428567773285')) as GuildEmoji;
    const successEmoji = (client.guilds.cache.get(EMOJI_SERVER_ID)?.emojis.cache.get('995372093887750194')) as GuildEmoji;

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