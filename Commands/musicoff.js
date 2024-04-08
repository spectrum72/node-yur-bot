const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("musicoff")
    .setDescription("음악 재생을 종료합니다."),
    async execute(client, interaction) {
        const queue = client.player.node.getQueue(interaction.guild);
        if (!queue) return await interaction.editReply("현재 재생 중인 음악이 없습니다.");

        await queue.destroy();
        await interaction.editReply("음악 재생을 종료합니다.");
    }
}