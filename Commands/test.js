const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test the bot"),
    async execute(client, interaction) {
        await interaction.editReply("bot is working prop");
        return "bot working prop";
    }
}