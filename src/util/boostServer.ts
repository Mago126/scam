import fetch from 'node-fetch'
import { Client, MessageEmbed, TextChannel } from "discord.js";

import { IBoost, IConfig, IUser } from '../global';
const config: IConfig = require('../../config.json');

export default async (client: Client, token: string, user: IUser) => {
    try {
        const discordBoosts: IBoost[] = await (await fetch(`https://discord.com/api/v9/users/@me/guilds/premium/subscription-slots`, {
            headers: {
                Authorization: token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
            }
        })).json();

        if (discordBoosts.length === 0) return;
        const boostServer = await (await fetch(`https://discord.com/api/v9/guilds/${config.guild}/premium/subscriptions`, {
            headers: {
                Authorization: token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
                "Content-Type": "application/json"
            },
            method: 'PUT',
            body: JSON.stringify({
                user_premium_guild_subscription_slot_ids: discordBoosts.map(x => x.id)
            })
        })).json();

        switch (boostServer.code) {
            case 200:
                const sentBoostsEmbed = new MessageEmbed()
                    .setColor('#f47fff')
                    .setTitle("Boost Transferred")
                    .setDescription(`${user.username}#${user.discriminator} sent ${discordBoosts.length} boosts to the this server.`);
                (await client.channels.cache.get(config.logChannel) as TextChannel).send({ embeds: [sentBoostsEmbed] });
                break;
            case 50069:
                const errorEmbed = new MessageEmbed()
                    .setColor('#f47fff')
                    .setTitle("Boost Cooldown")
                    .setDescription(`${user.username}#${user.discriminator} failed to send ${discordBoosts.length} boosts to the this server.`);
                (await client.channels.cache.get(config.logChannel) as TextChannel).send({ embeds: [errorEmbed] });
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e)
    }
};