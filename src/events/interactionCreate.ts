import { Client, Interaction } from "discord.js"
import { readdirSync } from "fs";
import path from "path";

export const execute = async (client: Client, interaction: Interaction) => {
    if (!interaction.isButton()) return;

    for (const file of readdirSync(path.join(__dirname, '../buttons'))) { 
        if (file.split('.')[0] === interaction.customId) {
            require(path.join(__dirname, `../buttons/${file}`)).execute(client, interaction);
        }
    }
}