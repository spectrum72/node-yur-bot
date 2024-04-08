const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("음악 재생을 멈춥니다."),
    async execute(client, interaction) {
        const queue = client.player.node.getQueue(interaction.guild);
        if (!queue) return await interaction.editReply("현재 재생 중인 음악이 없습니다.");
        
        queue.setPaused(true);
        const embed = new EmbedBuilder().setDescription("음악 재생을 정지하였습니다.");
        await interaction.editReply({ embed: [embed.data] });
    }
}