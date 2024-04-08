const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("정지한 트랙을 재생합니다"),
    async execute(client, interaction) {
        const queue = client.player.node.getQueue(interaction.guild);
        if (!queue) return await interaction.editReply("현재 재생 중인 음악이 없습니다.");
        
        queue.setPaused(true);
        const embed = new EmbedBuilder().setDescription("음악을 다시 재생합니다.");
        await interaction.editReply({ embed: [embed.data] });
    }
}