const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("재생 중인 음악을 스킵합니다."),
    async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.player);
        if (!queue) return await interaction.editReply("현재 재생 중인 음악이 없습니다.");

        const current = queue.current;
        queue.skip();
        await interaction.editReply(`'${current.title}을/를 스킵하였습니다.'`);
    }
};