const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("노래를 재생합니다.")
        .addStringOption((option) => option.setName("music").setDescription("url 또는 곡명")),
    async execute(client, interaction) {
        
        const response = new EmbedBuilder();

        const voiceChannel = client.member.voice.channel;
        if (!voiceChannel) return await interaction.editReply("음성 채널에 들어가셔야 합니다.");

        const queue = await client.player.node.create(interaction.guild);
        if (!queue.connection) await queue.connect(voiceChannel);

        const require = interaction.options.getString("music");
        const isUrl = require.startsWith("http://") || require.startsWith("https://");
        const queryType = (isUrl) ? QueryType.YOUTUBE_VIDEO : QueryType.AUTO;

        const tracklist = await client.player.search(require, {
            requestedBy: interaction.user,
            searchEngine: queryType
        })
        .catch((err) => console.log(err));

        return await interaction.editReply(tracklist.tracks.length);
    }
}