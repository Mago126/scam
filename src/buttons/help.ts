import { Client, Interaction } from "discord.js"

export const execute = async (client: Client, interaction: Interaction) => {
    if (!interaction.isButton()) return;

    interaction.reply({
        content: `https://i-love.wickbot.us/KUPU9/QiTOKeMA02.mp4`,
        ephemeral: true
    });
}