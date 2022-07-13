import { Client, MessageEmbed, Interaction } from "discord.js"
import { GetEmojis } from "../util/emojis.d";
import sendMessage from "../util/sendMessage";
const config: IConfig = require("../../config.json");

export const execute = async (client: Client, interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const allEmojis = (require('../util/emojis') as GetEmojis).GetEmojis(client);
    const replyEmbed: MessageEmbed = new MessageEmbed()
    .setColor("#f3b822")
    .setDescription(`${allEmojis.loadingEmoji} Starting verification... [Check your dms!](https://discord.com/channels/@me/${config.botChannelId})`)

    const failedEmbed: MessageEmbed = new MessageEmbed()
    .setColor("#fc2323")
    .setDescription(`${allEmojis.cancelEmoji} **I wasn't able to DM you.. Open your DMs and try to reverify.**`)

    const sendDMEmbed: MessageEmbed = new MessageEmbed()
    .setColor("#f3b822")
    .setDescription(`${allEmojis.loadingEmoji} **Preparing verification..**`)

    try {
        await interaction.user.send({ embeds: [sendDMEmbed] });
        await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        sendMessage(client, await client.users.fetch(interaction.user.id));
    } catch (e) {
        await interaction.reply({ embeds: [failedEmbed], ephemeral: true }).catch(e => {});
    }
}
