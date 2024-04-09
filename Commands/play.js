const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("노래를 재생합니다.")
        .addUserOption((option) => option.setName("music").description("url 또는 곡명")),
    async execute(client, interaction) {
        
        const response = new EmbedBuilder();

        const voiceChannel = client.member.voice.channel;
        if (!voiceChannel) return await interaction.editReply("음성 채널에 들어가셔야 합니다.");

        const queue = await client.player.queue.create(interaction.guild);
        if (!queue.connection) await queue.connect();

        const require = interaction.options.getString("music");
        const isUrl = require.startsWith("http://") || require.startsWith("https://");
        const queryType = (isUrl) ? QueryType.YOUTUBE_VIDEO : QueryType.YOUTUBE_SEARCH;

        const tracklist = await client.player.search(require, {
            requestedBy: interaction.user,
            searchEngine: queryType
        })
        .catch((err) => console.log(err));

        return await interaction.editReply(tracklist.tracks.length);
    }
}