import { GuildEmoji } from "discord.js";

export interface GetEmojis {
    GetEmojis: (client: Client) => IEmojis;
}

export interface IEmojis {
    verifyEmoji: GuildEmoji;
    blankEmoji: GuildEmoji;
    bellEmoji: GuildEmoji;
    loadingEmoji: GuildEmoji;
    cancelEmoji: GuildEmoji;
    successEmoji: GuildEmoji;
    mailEmoji: GuildEmoji;
    tickEmoji: GuildEmoji;
    rightArrow: GuildEmoji;
}