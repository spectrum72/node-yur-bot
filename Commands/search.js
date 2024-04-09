const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("재생 가능한 음악을 검색합니다.")
        .addStringOption((option) => option.setName("query").setDescription("search")),
    async execute(client, interaction) {

        const response = new EmbedBuilder();

        const query = interaction.options.getString("query");
        const tracklist = await client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_SEARCH
        });

        return await interaction.editReply(`${tracklist.tracks.length}`);
    }
}