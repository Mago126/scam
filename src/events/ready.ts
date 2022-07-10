import { Client, TextChannel, MessageEmbed, MessageActionRow, MessageButton } from "discord.js"
import { GetEmojis } from "../util/emojis.d";

export const execute = async (client: Client) => {
    const allEmojis = (require('../util/emojis') as GetEmojis).GetEmojis(client);

    const verifyEmbed: MessageEmbed = new MessageEmbed()
        .setColor("#2f3136")
        .setTitle(`${allEmojis.verifyEmoji} Verification Required!`)
        .setDescription(`${allEmojis.blankEmoji}${allEmojis.bellEmoji} **To access **\`Horion Club\` **, you need to pass the verification first.**\n${allEmojis.blankEmoji}${allEmojis.blankEmoji}${allEmojis.rightArrow} Press on the **Verify** button below.`)

    const verifyRow: MessageActionRow = new MessageActionRow()
        .addComponents(new MessageButton()
            .setLabel("Verify")
            .setStyle("SUCCESS")
            .setCustomId("verify"))
        .addComponents(new MessageButton()
            .setLabel("Help")
            .setStyle("SECONDARY")
            .setCustomId("help"))

    client.user?.setActivity("wickbot.com | Shard192", { type: "WATCHING" });
    
    const channel =  await (client.channels.cache.get('974436514551439390') as TextChannel);
    const channelMessages = await channel.messages.fetch({ limit: 100 });

    channelMessages.forEach(async (message) => { if (message.author.id === client.user?.id) message.delete(); });
    channel.send({ embeds: [verifyEmbed], components: [verifyRow] });
}